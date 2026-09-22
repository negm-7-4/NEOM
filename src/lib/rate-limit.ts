import "server-only";
import { createHash } from "node:crypto";

import { getStore } from "@/lib/store";

/**
 * Two-tier fixed-window limiter on the registration endpoint.
 *
 * The short window stops a double-click or a script hammering submit; the long
 * window stops someone sitting on the form all afternoon generating mail. Both
 * are keyed on a salted hash of the client address — the raw IP is never
 * stored or logged, which keeps the endpoint inside the data-handling rules in
 * the brief.
 */

const TIERS = [
  { name: "burst", limit: 3, windowSeconds: 60 },
  { name: "sustained", limit: 8, windowSeconds: 60 * 30 },
] as const;

export interface RateLimitResult {
  ok: boolean;
  /** Seconds the caller should wait before retrying, when `ok` is false. */
  retryAfter: number;
}

/**
 * Resolve the client address from proxy headers.
 *
 * Header order matters: platform-specific headers first, because those are set
 * by the edge and cannot be spoofed by the client, then the generic
 * `x-forwarded-for`. Behind an unknown proxy `x-forwarded-for` IS
 * client-controllable, so this is defence-in-depth, not an authentication
 * mechanism — see the README note on putting a real WAF in front for a public
 * campaign.
 */
export function clientAddress(headers: Headers): string {
  const candidates = [
    headers.get("cf-connecting-ip"),
    headers.get("x-vercel-forwarded-for"),
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for")?.split(",")[0],
  ];
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value) return value;
  }
  return "unknown";
}

function keyFor(address: string, tier: string, windowSeconds: number): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "neom-registration";
  const digest = createHash("sha256")
    .update(`${salt}:${address}`)
    .digest("base64url")
    .slice(0, 24);
  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  return `rl:${tier}:${digest}:${window}`;
}

export async function checkRateLimit(address: string): Promise<RateLimitResult> {
  const store = getStore();

  for (const tier of TIERS) {
    let count: number;
    try {
      count = await store.incr(keyFor(address, tier.name, tier.windowSeconds), tier.windowSeconds);
    } catch {
      // A limiter outage must not take the form down: fail open, but only for
      // this tier. The submission still has to pass validation and idempotency.
      continue;
    }
    if (count > tier.limit) {
      return { ok: false, retryAfter: tier.windowSeconds };
    }
  }

  return { ok: true, retryAfter: 0 };
}
