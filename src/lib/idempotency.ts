import "server-only";
import { createHash } from "node:crypto";

import { getStore } from "@/lib/store";

/**
 * Idempotency guard for `/api/register`.
 *
 * The client mints one key per filled-in form and reuses it for every retry of
 * that same submission. The flow is claim → send → commit:
 *
 *   claim()   reserves the key (Redis SET NX) and returns `fresh`
 *   commit()  stores the reference once the provider accepted the mail
 *   release() clears the claim when sending failed, so the user's retry with
 *             the same key is allowed through instead of being told "already
 *             submitted" for an email that was never sent
 *
 * A replayed POST for a key that already committed gets the original reference
 * back and sends nothing — the applicant sees the same confirmation, the owner
 * gets one email.
 */

const CLAIM_TTL_SECONDS = 60 * 2;
const COMMIT_TTL_SECONDS = 60 * 60 * 24;

export type IdempotencyState =
  | { status: "fresh" }
  | { status: "in-flight" }
  | { status: "duplicate"; reference: string };

function keyFor(idempotencyKey: string): string {
  const digest = createHash("sha256").update(idempotencyKey).digest("base64url");
  return `idem:${digest.slice(0, 32)}`;
}

export async function claim(idempotencyKey: string): Promise<IdempotencyState> {
  const store = getStore();
  const key = keyFor(idempotencyKey);

  let created: boolean;
  try {
    created = await store.setIfAbsent(key, "pending", CLAIM_TTL_SECONDS);
  } catch {
    // Store unavailable — allow the submission rather than block registration.
    // Resend's own `idempotencyKey` header still de-duplicates at the provider.
    return { status: "fresh" };
  }

  if (created) return { status: "fresh" };

  const existing = await store.get(key).catch(() => null);
  if (!existing || existing === "pending") return { status: "in-flight" };
  return { status: "duplicate", reference: existing };
}

export async function commit(idempotencyKey: string, reference: string): Promise<void> {
  try {
    await getStore().set(keyFor(idempotencyKey), reference, COMMIT_TTL_SECONDS);
  } catch {
    // Best effort: losing the record only risks a duplicate email on a replay,
    // which Resend's idempotency key catches for the next 24h anyway.
  }
}

export async function release(idempotencyKey: string): Promise<void> {
  try {
    await getStore().del(keyFor(idempotencyKey));
  } catch {
    // The claim expires on its own after CLAIM_TTL_SECONDS.
  }
}
