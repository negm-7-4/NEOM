import { z } from "zod";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

import {
  adSources,
  educationLevels,
  genders,
  purposes,
  specializations,
  studySystems,
} from "@/content/site";
import { DEFAULT_COUNTRY, isCountryCode } from "@/lib/countries";
import { collapseWhitespace, normalizePhoneInput, toLatinDigits } from "@/lib/digits";

/**
 * One schema, imported by both the client form and `/api/register`.
 *
 * The API re-parses the request body with this exact schema, so a crafted
 * POST is held to the same rules as the UI — including the select allowlists,
 * which are derived from the content config rather than duplicated here.
 */

/** Turn a content option list into the string-literal tuple `z.enum` wants. */
function values<T extends readonly { value: string }[]>(options: T) {
  return options.map((option) => option.value) as [
    T[number]["value"],
    ...T[number]["value"][],
  ];
}

export const LIMITS = {
  name: 120,
  purposeOther: 200,
  address: 400,
  email: 254,
  phone: 24,
  idempotencyKey: 64,
} as const;

const ERR = {
  required: "هذا الحقل مطلوب.",
  selectRequired: "يرجى الاختيار من القائمة.",
  nameAr: "يرجى كتابة الاسم بالحروف العربية.",
  nameEn: "يرجى كتابة الاسم بالحروف الإنجليزية.",
  nameShort: "الاسم قصير جدًا.",
  nameLong: `الحد الأقصى ${LIMITS.name} حرفًا.`,
  nationality: "يرجى اختيار الجنسية من القائمة.",
  phone: "رقم الهاتف غير صحيح. تأكد من المفتاح الدولي والرقم.",
  whatsapp: "رقم الواتساب غير صحيح. تأكد من المفتاح الدولي والرقم.",
  email: "صيغة البريد الإلكتروني غير صحيحة.",
  emailLong: `الحد الأقصى ${LIMITS.email} حرفًا.`,
  addressShort: "يرجى كتابة عنوان أوضح ليصل إليك البريد.",
  addressLong: `الحد الأقصى ${LIMITS.address} حرفًا.`,
  purposeOther: "يرجى توضيح الغرض من الالتحاق.",
  purposeOtherLong: `الحد الأقصى ${LIMITS.purposeOther} حرفًا.`,
  consent: "يجب الموافقة على معالجة البيانات لإكمال التسجيل.",
} as const;

/**
 * Deliberately permissive name rules.
 *
 * We only assert "there is at least one letter of the expected script" and a
 * length band. No word-count rule, no character blocklist: real names contain
 * hyphens (Abdel-Rahman), apostrophes (D'Souza), particles, more than three
 * parts, and diacritics. Rejecting those is a worse failure than accepting a
 * sloppy entry that a human advisor will read anyway.
 */
const ARABIC_LETTER = /\p{Script=Arabic}/u;
const LATIN_LETTER = /\p{Script=Latin}/u;

const trimmed = (max: number, tooLong: string) =>
  z
    .string({ error: ERR.required })
    .transform(collapseWhitespace)
    .pipe(z.string().min(1, { error: ERR.required }).max(max, { error: tooLong }));

const nameAr = trimmed(LIMITS.name, ERR.nameLong).pipe(
  z
    .string()
    .min(3, { error: ERR.nameShort })
    .refine((v) => ARABIC_LETTER.test(v), { error: ERR.nameAr }),
);

const nameEn = trimmed(LIMITS.name, ERR.nameLong).pipe(
  z
    .string()
    .min(3, { error: ERR.nameShort })
    .refine((v) => LATIN_LETTER.test(v), { error: ERR.nameEn }),
);

const countryField = z
  .string({ error: ERR.nationality })
  .refine(isCountryCode, { error: ERR.nationality });

const rawPhone = z
  .string({ error: ERR.required })
  .max(LIMITS.phone * 2, { error: ERR.phone })
  .transform((v) => normalizePhoneInput(v));

/**
 * Optional email that is still validated when present.
 *
 * An empty string from an untouched input must mean "not provided", not
 * "invalid", otherwise the progress meter and the submit button fight the user
 * over a field the client explicitly marked optional.
 */
const optionalEmail = z
  .string()
  .transform((v) => toLatinDigits(v).trim())
  .transform((v) => (v.length === 0 ? undefined : v))
  .optional()
  .refine((v) => v === undefined || v.length <= LIMITS.email, { error: ERR.emailLong })
  .refine((v) => v === undefined || z.email().safeParse(v).success, {
    error: ERR.email,
  });

export const registrationSchema = z
  .object({
    /* Section 1 — program */
    educationLevel: z.enum(values(educationLevels), { error: ERR.selectRequired }),
    specialization: z.enum(values(specializations), { error: ERR.selectRequired }),
    studySystem: z.enum(values(studySystems)).optional(),

    /* Section 2 — personal */
    fullNameAr: nameAr,
    fullNameEn: nameEn,
    nationality: countryField,
    gender: z.enum(values(genders), { error: ERR.selectRequired }),
    purpose: z.enum(values(purposes), { error: ERR.selectRequired }),
    purposeOther: z
      .string()
      .transform(collapseWhitespace)
      .pipe(z.string().max(LIMITS.purposeOther, { error: ERR.purposeOtherLong }))
      .optional(),

    /* Section 3 — contact */
    phoneCountry: countryField,
    phoneNumber: rawPhone,
    whatsappCountry: countryField,
    whatsappNumber: rawPhone,
    whatsappSameAsPhone: z.boolean().default(false),
    email: optionalEmail,

    /* Section 4 — address and attribution */
    address: trimmed(LIMITS.address, ERR.addressLong).pipe(
      z.string().min(10, { error: ERR.addressShort }),
    ),
    adSource: z.enum(values(adSources), { error: ERR.selectRequired }),

    /* Consent + anti-abuse */
    consent: z.literal(true, { error: ERR.consent }),
    /**
     * Honeypot. Rendered off-screen and hidden from assistive tech; a real
     * applicant never fills it, so a non-empty value is a bot.
     */
    website: z.string().max(0).optional().default(""),
    /**
     * Client-generated submission id. Kept stable across retries of the same
     * submission so a repeat POST cannot produce a second email.
     */
    idempotencyKey: z
      .string()
      .min(8)
      .max(LIMITS.idempotencyKey)
      .regex(/^[A-Za-z0-9_-]+$/),
  })
  .superRefine((data, ctx) => {
    if (data.purpose === "other" && !data.purposeOther?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["purposeOther"],
        message: ERR.purposeOther,
      });
    }

    if (!isValidNumber(data.phoneNumber, data.phoneCountry)) {
      ctx.addIssue({ code: "custom", path: ["phoneNumber"], message: ERR.phone });
    }

    if (!isValidNumber(data.whatsappNumber, data.whatsappCountry)) {
      ctx.addIssue({
        code: "custom",
        path: ["whatsappNumber"],
        message: ERR.whatsapp,
      });
    }
  });

export type RegistrationInput = z.input<typeof registrationSchema>;
export type RegistrationData = z.output<typeof registrationSchema>;

export function isValidNumber(raw: string, country: string): boolean {
  if (!raw || !isCountryCode(country)) return false;
  const parsed = parsePhoneNumberFromString(
    normalizePhoneInput(raw),
    country as CountryCode,
  );
  return Boolean(parsed?.isValid());
}

/** E.164 (`+966501234567`) or `null` when the number does not parse. */
export function toE164(raw: string, country: string): string | null {
  if (!isCountryCode(country)) return null;
  const parsed = parsePhoneNumberFromString(
    normalizePhoneInput(raw),
    country as CountryCode,
  );
  return parsed?.isValid() ? parsed.number : null;
}

/** Digits-only form that wa.me links expect (no "+"). */
export function toWhatsAppDigits(e164: string): string {
  return e164.replace(/\D/g, "");
}

/**
 * Fields that count toward the progress meter.
 *
 * Optional fields (study system, email, and the conditional clarification)
 * are deliberately excluded so the meter can actually reach 100%.
 */
export const REQUIRED_FIELDS = [
  "educationLevel",
  "specialization",
  "fullNameAr",
  "fullNameEn",
  "nationality",
  "gender",
  "purpose",
  "phoneNumber",
  "whatsappNumber",
  "address",
  "adSource",
  "consent",
] as const;

export type RequiredField = (typeof REQUIRED_FIELDS)[number];

/**
 * The shape React Hook Form actually holds.
 *
 * It is intentionally looser than `RegistrationInput`: an untouched select is
 * `""`, not `undefined`, and `consent` is a plain boolean rather than the
 * literal `true` the schema demands. Keeping the control state loose and the
 * schema strict is what lets Zod produce a *message* for an unmade choice
 * instead of React Hook Form silently treating the field as absent.
 */
export interface RegistrationFormValues {
  educationLevel: EducationLevelValue | "";
  specialization: SpecializationValue | "";
  studySystem?: StudySystemValue;
  fullNameAr: string;
  fullNameEn: string;
  nationality: string;
  gender: GenderValue | "";
  purpose: PurposeValue | "";
  purposeOther: string;
  phoneCountry: string;
  phoneNumber: string;
  whatsappCountry: string;
  whatsappNumber: string;
  whatsappSameAsPhone: boolean;
  email: string;
  address: string;
  adSource: AdSourceValue | "";
  consent: boolean;
  /** Honeypot — never shown to a real applicant. */
  website: string;
  idempotencyKey: string;
}

type EducationLevelValue = (typeof educationLevels)[number]["value"];
type SpecializationValue = (typeof specializations)[number]["value"];
type StudySystemValue = (typeof studySystems)[number]["value"];
type GenderValue = (typeof genders)[number]["value"];
type PurposeValue = (typeof purposes)[number]["value"];
type AdSourceValue = (typeof adSources)[number]["value"];

export const emptyRegistration: RegistrationFormValues = {
  educationLevel: "",
  specialization: "",
  studySystem: undefined,
  fullNameAr: "",
  fullNameEn: "",
  // Nationality starts blank on purpose: it is a required choice, and
  // pre-selecting a country would let the progress meter count a field the
  // applicant never actually set.
  nationality: "",
  gender: "",
  purpose: "",
  purposeOther: "",
  // The phone country selectors *do* default to Saudi Arabia, as specified.
  phoneCountry: DEFAULT_COUNTRY,
  phoneNumber: "",
  whatsappCountry: DEFAULT_COUNTRY,
  whatsappNumber: "",
  whatsappSameAsPhone: false,
  email: "",
  address: "",
  adSource: "",
  consent: false,
  website: "",
  idempotencyKey: "",
};

/**
 * Per-field completion used by the progress meter.
 *
 * Deliberately explicit rather than derived from `safeParse`: Zod skips
 * object-level refinements (where the phone rules live) as soon as any field
 * in the shape fails, so a schema-derived meter would report an empty phone
 * number as "done" while the rest of the form is still blank. These checks
 * reuse the same primitives the schema uses, so they agree with it field by
 * field.
 */
export function isRequiredFieldComplete(
  field: RequiredField,
  values: Partial<RegistrationFormValues>,
): boolean {
  switch (field) {
    case "educationLevel":
    case "specialization":
    case "gender":
    case "purpose":
    case "adSource":
      return Boolean(values[field]);
    case "nationality":
      return isCountryCode(values.nationality);
    case "fullNameAr": {
      const value = collapseWhitespace(values.fullNameAr ?? "");
      return value.length >= 3 && ARABIC_LETTER.test(value);
    }
    case "fullNameEn": {
      const value = collapseWhitespace(values.fullNameEn ?? "");
      return value.length >= 3 && LATIN_LETTER.test(value);
    }
    case "phoneNumber":
      return isValidNumber(values.phoneNumber ?? "", values.phoneCountry ?? "");
    case "whatsappNumber":
      return isValidNumber(values.whatsappNumber ?? "", values.whatsappCountry ?? "");
    case "address":
      return collapseWhitespace(values.address ?? "").length >= 10;
    case "consent":
      return values.consent === true;
  }
}

/** 0–100, counting only the required fields. */
export function completionPercent(values: Partial<RegistrationFormValues>): number {
  const done = REQUIRED_FIELDS.filter((field) =>
    isRequiredFieldComplete(field, values),
  ).length;
  return Math.round((done / REQUIRED_FIELDS.length) * 100);
}
