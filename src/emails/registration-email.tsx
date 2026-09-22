import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import type { EmailModel } from "@/lib/submission";

/**
 * Arabic RTL notification sent to the centre for every accepted registration.
 *
 * Escaping: every applicant-supplied string below is interpolated as a JSX
 * child or a plain attribute value, so React escapes it. There is no
 * `dangerouslySetInnerHTML` anywhere in this file and none should be added —
 * that is the single control preventing an applicant from injecting markup
 * into the owner's inbox.
 *
 * Layout: tables and inline styles only. Email clients (Outlook in
 * particular) ignore flexbox, grid, custom properties and backdrop filters, so
 * the glass treatment from the site is translated into flat cream surfaces
 * with a hairline border.
 */

const palette = {
  ivory: "#FBF8F2",
  cream: "#F4EDE1",
  sand: "#E2D4BB",
  charcoal: "#1F2421",
  muted: "#5B635C",
  green: "#2F6B4F",
};

const fontStack =
  "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, 'Noto Sans Arabic', Arial, sans-serif";

export function RegistrationEmail({ model }: { model: EmailModel }) {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>{`طلب تسجيل جديد — ${model.applicantName} — ${model.specializationLabel}`}</Preview>
      <Body
        style={{
          margin: 0,
          padding: "24px 12px",
          backgroundColor: palette.cream,
          fontFamily: fontStack,
          color: palette.charcoal,
          direction: "rtl",
        }}
      >
        <Container
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            backgroundColor: palette.ivory,
            borderRadius: "16px",
            border: `1px solid ${palette.sand}`,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: palette.charcoal,
              padding: "24px",
              textAlign: "right",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: palette.ivory,
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                direction: "ltr",
                textAlign: "right",
              }}
            >
              NEOM
            </Text>
            <Text style={{ margin: "6px 0 0", color: palette.sand, fontSize: "13px" }}>
              {model.orgName}
            </Text>
            <Text style={{ margin: "2px 0 0", color: palette.sand, fontSize: "12px" }}>
              {model.tagline}
            </Text>
          </Section>

          {/* Summary */}
          <Section style={{ padding: "24px 24px 4px" }}>
            <Heading
              as="h1"
              style={{ margin: 0, fontSize: "19px", fontWeight: 700, color: palette.charcoal }}
            >
              طلب تسجيل جديد
            </Heading>

            <Section
              style={{
                marginTop: "14px",
                backgroundColor: palette.cream,
                border: `1px solid ${palette.sand}`,
                borderRadius: "12px",
                padding: "14px 16px",
              }}
            >
              <SummaryLine label="الرقم المرجعي" value={model.reference} ltr />
              <SummaryLine label="اسم المتقدم" value={model.applicantName} />
              <SummaryLine label="التخصص" value={model.specializationLabel} />
              <SummaryLine label="النظام الدراسي" value={model.studySystemLabel} />
              <SummaryLine label="وقت الإرسال" value={model.submittedAtText} />
              <SummaryLine label="المنطقة الزمنية" value={model.timezoneText} ltr />
              <SummaryLine label="الطابع الزمني (ISO)" value={model.submittedAtIso} ltr />
            </Section>

            <Section style={{ marginTop: "16px", textAlign: "right" }}>
              <Link
                href={model.whatsappLink}
                style={{
                  display: "inline-block",
                  backgroundColor: palette.green,
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: 600,
                  textDecoration: "none",
                  padding: "12px 22px",
                  borderRadius: "10px",
                }}
              >
                فتح محادثة واتساب مع المتقدم
              </Link>
            </Section>
          </Section>

          {/* Full submission, grouped by the form's own sections */}
          {model.sections.map((section) => (
            <Section key={section.index} style={{ padding: "12px 24px 0" }}>
              <Hr style={{ borderColor: palette.sand, margin: "16px 0" }} />
              <Text
                style={{
                  margin: "0 0 10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: palette.green,
                  letterSpacing: "0.02em",
                }}
              >
                {`القسم ${section.index} — ${section.title}`}
              </Text>

              {section.rows.map((row) => (
                <Section key={row.label} style={{ marginBottom: "10px" }}>
                  <Text
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: palette.muted,
                      lineHeight: "18px",
                    }}
                  >
                    {row.label}
                  </Text>
                  <Text
                    style={{
                      margin: "2px 0 0",
                      fontSize: "15px",
                      color: palette.charcoal,
                      lineHeight: "24px",
                      fontWeight: 500,
                      direction: row.ltr ? "ltr" : "rtl",
                      textAlign: "right",
                      unicodeBidi: "isolate",
                      wordBreak: "break-word",
                    }}
                  >
                    {row.href ? (
                      <Link href={row.href} style={{ color: palette.green }}>
                        {row.value}
                      </Link>
                    ) : (
                      row.value
                    )}
                  </Text>
                </Section>
              ))}
            </Section>
          ))}

          {/* Footer */}
          <Section style={{ padding: "8px 24px 24px" }}>
            <Hr style={{ borderColor: palette.sand, margin: "16px 0" }} />
            <Text style={{ margin: 0, fontSize: "11px", color: palette.muted, lineHeight: "18px" }}>
              {model.replyTo
                ? "تم ضبط الرد على هذه الرسالة ليصل إلى بريد المتقدم."
                : "لم يزوّدنا المتقدم ببريد إلكتروني؛ التواصل عبر الهاتف أو واتساب."}
            </Text>
            <Text style={{ margin: "6px 0 0", fontSize: "11px", color: palette.muted }}>
              رسالة آلية من استمارة التسجيل على موقع {model.orgName}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function SummaryLine({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <Text style={{ margin: "0 0 6px", fontSize: "14px", lineHeight: "22px" }}>
      <span style={{ color: palette.muted }}>{`${label}: `}</span>
      <span
        style={{
          fontWeight: 600,
          color: palette.charcoal,
          direction: ltr ? "ltr" : "rtl",
          unicodeBidi: "isolate",
          display: "inline-block",
        }}
      >
        {value}
      </span>
    </Text>
  );
}

export default RegistrationEmail;
