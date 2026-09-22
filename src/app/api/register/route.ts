import { NextResponse } from "next/server";

import { claim, commit, release } from "@/lib/idempotency";
import { isMailConfigured, sendRegistrationEmail } from "@/lib/mailer";
import { checkRateLimit, clientAddress } from "@/lib/rate-limit";
import { createReference } from "@/lib/reference";
import { registrationSchema, toE164 } from "@/lib/schema";
import type { Submission } from "@/lib/submission";

/**
 * POST /api/register — validate a registration and email it to the centre.
 *
 * Node runtime (not edge): the idempotency store, the rate-limiter salt hash
 * and the reference generator all use `node:crypto`, and React Email's
 * renderer targets Node.
 *
 * Privacy: nothing in this file logs an applicant's name, phone number,
 * address or email. The only identifiers that reach the log are the
 * submission reference and an error class.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Generous for this form, small enough that a junk POST cannot cost memory. */
const MAX_BODY_BYTES = 16 * 1024;

type ErrorCode =
  | "bad_request"
  | "validation"
  | "rate_limited"
  | "in_flight"
  | "config"
  | "send_failed";

interface ErrorBody {
  ok: false;
  code: ErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

function fail(
  status: number,
  code: ErrorCode,
  message: string,
  fieldErrors?: Record<string, string[]>,
): NextResponse<ErrorBody> {
  return NextResponse.json(
    { ok: false, code, message, ...(fieldErrors ? { fieldErrors } : {}) },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  /* 1. Body — read as text first so an oversized payload is rejected before
        it is parsed. */
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail(400, "bad_request", "تعذّر قراءة محتوى الطلب.");
  }
  if (raw.length > MAX_BODY_BYTES) {
    return fail(413, "bad_request", "حجم الطلب أكبر من المسموح به.");
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "bad_request", "صيغة الطلب غير صحيحة.");
  }

  /* 2. Honeypot — checked before anything expensive. A filled `website` field
        means an automated submission, so it is rejected as invalid input. No
        email is sent and no success is reported. */
  if (
    typeof body === "object" &&
    body !== null &&
    typeof (body as { website?: unknown }).website === "string" &&
    (body as { website: string }).website.length > 0
  ) {
    return fail(422, "validation", "تعذّر التحقق من الطلب.");
  }

  /* 3. Rate limit, before validation so a flood of malformed bodies is also
        throttled. */
  const rate = await checkRateLimit(clientAddress(request.headers));
  if (!rate.ok) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        message:
          "تم استلام عدد كبير من الطلبات من هذا الجهاز. يرجى المحاولة بعد قليل.",
      } satisfies ErrorBody,
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(rate.retryAfter),
        },
      },
    );
  }

  /* 4. Full re-validation on the server, with the same schema the client used:
        select values are checked against the content-config allowlist, lengths
        are capped, and both phone numbers are re-parsed by libphonenumber-js. */
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".") || "_form";
      (fieldErrors[path] ??= []).push(issue.message);
    }
    return fail(422, "validation", "يرجى مراجعة الحقول المطلوبة قبل الإرسال.", fieldErrors);
  }
  const data = parsed.data;

  /* 5. Idempotency: a replay of a submission that already sent returns the
        original reference without sending a second email. */
  const state = await claim(data.idempotencyKey);
  if (state.status === "duplicate") {
    return NextResponse.json(
      { ok: true, reference: state.reference, duplicate: true },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (state.status === "in-flight") {
    return fail(409, "in_flight", "طلبك قيد الإرسال بالفعل. يرجى الانتظار لحظة.");
  }

  /* 6. Normalise to E.164. The schema already proved both numbers valid, so a
        null here would mean the two disagree — treat it as a validation fault
        rather than sending a half-formed contact to the office. */
  const phoneE164 = toE164(data.phoneNumber, data.phoneCountry);
  const whatsappE164 = toE164(data.whatsappNumber, data.whatsappCountry);
  if (!phoneE164 || !whatsappE164) {
    await release(data.idempotencyKey);
    return fail(422, "validation", "تعذّر التحقق من أرقام التواصل.", {
      ...(phoneE164 ? {} : { phoneNumber: ["رقم الهاتف غير صحيح."] }),
      ...(whatsappE164 ? {} : { whatsappNumber: ["رقم الواتساب غير صحيح."] }),
    });
  }

  const submission: Submission = {
    reference: createReference(),
    submittedAt: new Date(),
    data,
    phoneE164,
    whatsappE164,
  };

  /* 7. Send. Success is reported only once Resend accepts the request. */
  const result = await sendRegistrationEmail(submission, data.idempotencyKey);

  if (result.status === "config") {
    await release(data.idempotencyKey);
    console.error(
      `[register] mail not configured (ref ${submission.reference}): ${result.message}`,
    );
    return fail(503, "config", result.message);
  }

  if (result.status === "failed") {
    // Clear the claim so the applicant's retry with the same key is allowed
    // through — the email was never sent, so this is not a duplicate.
    await release(data.idempotencyKey);
    console.error(
      `[register] provider rejected submission ${submission.reference}: ${result.message}`,
    );
    return fail(
      502,
      "send_failed",
      "تعذّر إرسال الطلب حاليًا. بياناتك محفوظة في الاستمارة، يرجى إعادة المحاولة.",
    );
  }

  await commit(data.idempotencyKey, submission.reference);
  console.info(
    `[register] accepted by provider — ref ${submission.reference}, message ${result.providerId}`,
  );

  return NextResponse.json(
    { ok: true, reference: submission.reference, duplicate: false },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Development-only configuration probe, so a developer can confirm their
 * environment before filling in the form. Disabled in production to avoid
 * advertising the deployment's mail state.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.json({
    mailConfigured: isMailConfigured(),
    hint: "اضبط RESEND_API_KEY و OWNER_EMAIL و EMAIL_FROM في .env.local",
  });
}
