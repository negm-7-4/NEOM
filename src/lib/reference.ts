import { randomBytes } from "node:crypto";

/**
 * Human-quotable submission reference, e.g. `NEOM-260922-K7F2QD`.
 *
 * Crockford's base32 alphabet (no I, L, O, U) so an applicant reading the
 * reference down the phone to an advisor cannot confuse it with digits, and no
 * accidental words form. The date segment lets the office find the day's
 * submissions without a lookup table.
 */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function createReference(now: Date = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");

  const bytes = randomBytes(6);
  let suffix = "";
  for (const byte of bytes) {
    suffix += ALPHABET[byte % ALPHABET.length];
  }

  return `NEOM-${yy}${mm}${dd}-${suffix}`;
}
