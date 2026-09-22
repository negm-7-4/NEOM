import "server-only";
import { render } from "@react-email/components";
import { Resend } from "resend";

import { RegistrationEmail } from "@/emails/registration-email";
import { buildEmailModel, renderPlainText, type Submission } from "@/lib/submission";

/**
 * Resend delivery for registration notifications.
 *
 * Two rules this module exists to enforce:
 *
 * 1. Missing credentials are never silently swallowed and never faked. The
 *    route returns a `config` failure with an actionable developer message
 *    instead of reporting a send that did not happen.
 * 2. "Sent" means Resend accepted the request and returned an id. That is
 *    provider acceptance, not inbox delivery — the UI copy is worded
 *    accordingly, and so is `MailResult.status`.
 */

export type MailResult =
  | { status: "accepted"; providerId: string }
  | { status: "config"; message: string }
  | { status: "failed"; message: string };

interface MailerConfig {
  apiKey: string;
  ownerEmail: string;
  from: string;
}

const SETUP_HINT =
  "راجع ملف README.md — قسم إعداد البريد الإلكتروني (Resend).";

function readConfig(): { ok: true; config: MailerConfig } | { ok: false; message: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const ownerEmail = process.env.OWNER_EMAIL?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  const missing: string[] = [];
  if (!apiKey) missing.push("RESEND_API_KEY");
  if (!ownerEmail) missing.push("OWNER_EMAIL");
  if (!from) missing.push("EMAIL_FROM");

  if (missing.length > 0) {
    return {
      ok: false,
      message:
        `إعداد البريد غير مكتمل: المتغيرات التالية غير معرّفة على الخادم: ${missing.join(", ")}. ` +
        `انسخ .env.example إلى .env.local واضبط القيم، ثم أعد تشغيل الخادم. ${SETUP_HINT}`,
    };
  }

  // `from` accepts either "user@domain" or "Display Name <user@domain>".
  if (!/@/.test(from!)) {
    return {
      ok: false,
      message: `قيمة EMAIL_FROM غير صالحة ("${from}"). استخدم بريدًا من نطاق موثّق في Resend، مثل: NEOM <no-reply@your-domain.com>. ${SETUP_HINT}`,
    };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ownerEmail!)) {
    return {
      ok: false,
      message: `قيمة OWNER_EMAIL غير صالحة ("${ownerEmail}"). اضبطها على بريد المستلم الذي تصل إليه الطلبات. ${SETUP_HINT}`,
    };
  }

  return { ok: true, config: { apiKey: apiKey!, ownerEmail: ownerEmail!, from: from! } };
}

/** True when the server is configured to send. Used by the health probe only. */
export function isMailConfigured(): boolean {
  return readConfig().ok;
}

export async function sendRegistrationEmail(
  submission: Submission,
  idempotencyKey: string,
): Promise<MailResult> {
  const configResult = readConfig();
  if (!configResult.ok) {
    return { status: "config", message: configResult.message };
  }
  const { apiKey, ownerEmail, from } = configResult.config;

  const model = buildEmailModel(submission);

  let html: string;
  try {
    html = await render(RegistrationEmail({ model }));
  } catch (error) {
    return {
      status: "failed",
      message: `تعذّر تجهيز قالب البريد: ${describe(error)}`,
    };
  }
  const text = renderPlainText(model);

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send(
      {
        from,
        to: ownerEmail,
        subject: model.subject,
        html,
        text,
        // From stays the verified sender; only Reply-To points at the applicant,
        // and only when they supplied an address that passed validation.
        ...(model.replyTo ? { replyTo: model.replyTo } : {}),
        headers: {
          "X-Entity-Ref-ID": submission.reference,
        },
      },
      // Provider-side de-duplication, on top of our own store-backed guard.
      { idempotencyKey },
    );

    if (error) {
      return { status: "failed", message: `${error.name}: ${error.message}` };
    }
    if (!data?.id) {
      return { status: "failed", message: "لم يُرجع مزوّد البريد معرّف رسالة." };
    }

    return { status: "accepted", providerId: data.id };
  } catch (error) {
    return { status: "failed", message: describe(error) };
  }
}

function describe(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
