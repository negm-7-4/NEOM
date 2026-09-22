/**
 * Digit normalisation for Arabic-script input.
 *
 * Arabic keyboards on iOS/Android commonly emit Arabic-Indic digits
 * (٠-٩, U+0660–U+0669) and Persian/Urdu layouts emit the Extended Arabic-Indic
 * set (۰-۹, U+06F0–U+06F9). libphonenumber-js, Zod and `Number()` all expect
 * ASCII digits, so every numeric-ish value is folded here before validation
 * rather than being rejected as "invalid".
 */

const ARABIC_INDIC_START = 0x0660;
const EXTENDED_ARABIC_INDIC_START = 0x06f0;

export function toLatinDigits(input: string): string {
  let out = "";
  for (const char of input) {
    const code = char.codePointAt(0)!;
    if (code >= ARABIC_INDIC_START && code <= ARABIC_INDIC_START + 9) {
      out += String(code - ARABIC_INDIC_START);
    } else if (
      code >= EXTENDED_ARABIC_INDIC_START &&
      code <= EXTENDED_ARABIC_INDIC_START + 9
    ) {
      out += String(code - EXTENDED_ARABIC_INDIC_START);
    } else {
      out += char;
    }
  }
  return out;
}

/**
 * Prepare a raw phone entry for libphonenumber-js: Latin digits only, with
 * a single optional leading "+". Arabic comma/space separators, RTL marks and
 * the assorted dashes people paste from contact cards are dropped.
 */
export function normalizePhoneInput(input: string): string {
  const latin = toLatinDigits(input)
    // Strip bidi control characters that get pasted along with RTL text.
    .replace(/[​-‏‪-‮⁦-⁩]/g, "")
    .trim();
  const hasPlus = latin.startsWith("+") || latin.startsWith("٫");
  const digits = latin.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

/** Collapse runs of whitespace and trim — applied to every free-text field. */
export function collapseWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}
