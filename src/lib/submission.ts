import {
  adSources,
  educationLevels,
  form,
  genders,
  labelOf,
  org,
  purposes,
  specializations,
  studySystems,
} from "@/content/site";
import { findCountry } from "@/lib/countries";
import type { RegistrationData } from "@/lib/schema";
import { toWhatsAppDigits } from "@/lib/schema";

/**
 * Turns a validated submission into the exact rows the notification email
 * renders — one view model shared by the HTML and the plain-text version, so
 * the two can never drift or omit a field from one another.
 *
 * All Arabic labels are resolved here from the content config rather than in
 * the template, which keeps the template free of business logic and means a
 * copy edit in `content/site.ts` flows straight through to the email.
 */

export interface Submission {
  reference: string;
  submittedAt: Date;
  data: RegistrationData;
  /** E.164, produced by libphonenumber-js on the server. */
  phoneE164: string;
  whatsappE164: string;
}

export interface EmailRow {
  label: string;
  value: string;
  /** Force LTR on phone numbers and emails so bidi reordering cannot mangle them. */
  ltr?: boolean;
  /** Rendered as a link in the HTML version. */
  href?: string;
}

export interface EmailSection {
  index: number;
  title: string;
  rows: EmailRow[];
}

export interface EmailModel {
  reference: string;
  /** e.g. "الثلاثاء، 22 سبتمبر 2026 في 12:35 م" */
  submittedAtText: string;
  /** e.g. "التوقيت: Asia/Riyadh (غرينتش+03:00)" */
  timezoneText: string;
  /** Machine-readable, for archiving or spreadsheet import. */
  submittedAtIso: string;
  applicantName: string;
  specializationLabel: string;
  studySystemLabel: string;
  whatsappLink: string;
  replyTo?: string;
  sections: EmailSection[];
  subject: string;
  orgName: string;
  tagline: string;
}

const DATE_LOCALE = "ar-SA-u-ca-gregory-nu-latn";

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    timeZone: org.timezone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function formatOffset(date: Date): string {
  const parts = new Intl.DateTimeFormat(DATE_LOCALE, {
    timeZone: org.timezone,
    timeZoneName: "longOffset",
  }).formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? org.timezone;
}

function studySystemText(value: string | undefined): string {
  const system = studySystems.find((option) => option.value === value);
  if (!system) return "لم يتم الاختيار";
  return `${system.label} — ${system.duration} — ${system.refund}`;
}

export function buildEmailModel(submission: Submission): EmailModel {
  const { data, reference, submittedAt, phoneE164, whatsappE164 } = submission;

  const nationality = findCountry(data.nationality);
  const specializationLabel = labelOf(specializations, data.specialization);
  const whatsappLink = `https://wa.me/${toWhatsAppDigits(whatsappE164)}`;

  const purposeLabel = labelOf(purposes, data.purpose);
  const purposeValue =
    data.purpose === "other" && data.purposeOther
      ? `${purposeLabel} — ${data.purposeOther}`
      : purposeLabel;

  const sections: EmailSection[] = [
    {
      index: form.sections.program.index,
      title: form.sections.program.title,
      rows: [
        {
          label: form.fields.educationLevel.label,
          value: labelOf(educationLevels, data.educationLevel),
        },
        { label: form.fields.specialization.label, value: specializationLabel },
        {
          label: form.fields.studySystem.label,
          value: studySystemText(data.studySystem),
        },
      ],
    },
    {
      index: form.sections.personal.index,
      title: form.sections.personal.title,
      rows: [
        { label: form.fields.fullNameAr.label, value: data.fullNameAr },
        { label: form.fields.fullNameEn.label, value: data.fullNameEn, ltr: true },
        {
          label: form.fields.nationality.label,
          value: nationality
            ? `${nationality.nameAr} (${nationality.code})`
            : data.nationality,
        },
        { label: form.fields.gender.label, value: labelOf(genders, data.gender) },
        { label: form.fields.purpose.label, value: purposeValue },
      ],
    },
    {
      index: form.sections.contact.index,
      title: form.sections.contact.title,
      rows: [
        {
          label: form.fields.phone.label,
          value: phoneE164,
          ltr: true,
          href: `tel:${phoneE164}`,
        },
        {
          label: form.fields.whatsapp.label,
          value: whatsappE164,
          ltr: true,
          href: whatsappLink,
        },
        { label: "محادثة واتساب", value: whatsappLink, ltr: true, href: whatsappLink },
        {
          label: form.fields.email.label,
          value: data.email ?? "لم يتم الإدخال",
          ltr: Boolean(data.email),
          href: data.email ? `mailto:${data.email}` : undefined,
        },
      ],
    },
    {
      index: form.sections.address.index,
      title: form.sections.address.title,
      rows: [
        { label: form.fields.address.label, value: data.address },
        { label: form.fields.adSource.label, value: labelOf(adSources, data.adSource) },
        {
          label: "الموافقة على معالجة البيانات",
          value: data.consent ? "نعم" : "لا",
        },
      ],
    },
  ];

  return {
    reference,
    submittedAtText: formatSubmittedAt(submittedAt),
    timezoneText: `${org.timezone} (${formatOffset(submittedAt)})`,
    submittedAtIso: submittedAt.toISOString(),
    applicantName: data.fullNameAr,
    specializationLabel,
    studySystemLabel: studySystemText(data.studySystem),
    whatsappLink,
    replyTo: data.email,
    sections,
    subject: `طلب تسجيل NEOM — ${data.fullNameAr} — ${specializationLabel}`,
    orgName: org.name,
    tagline: org.tagline,
  };
}

/**
 * Plain-text alternative. Built from the same section model as the HTML so
 * every field present in one is present in the other.
 */
export function renderPlainText(model: EmailModel): string {
  const lines: string[] = [
    model.orgName,
    model.tagline,
    "",
    "طلب تسجيل جديد",
    `الرقم المرجعي: ${model.reference}`,
    `وقت الإرسال: ${model.submittedAtText}`,
    `المنطقة الزمنية: ${model.timezoneText}`,
    `الطابع الزمني (ISO): ${model.submittedAtIso}`,
    "",
  ];

  for (const section of model.sections) {
    lines.push(`— القسم ${section.index}: ${section.title} —`);
    for (const row of section.rows) {
      lines.push(`${row.label}: ${row.value}`);
    }
    lines.push("");
  }

  lines.push(`رابط واتساب: ${model.whatsappLink}`);
  if (model.replyTo) lines.push(`للرد على المتقدم: ${model.replyTo}`);

  return lines.join("\n");
}
