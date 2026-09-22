/**
 * Regenerates src/lib/countries.ts.
 *
 * Arabic country names come from the ICU/CLDR data that ships with Node
 * (`Intl.DisplayNames`); the country set and dial codes come from
 * libphonenumber-js, so the picker can never offer a country the validator
 * does not recognise.
 *
 *   node .verify/emit-countries.mjs
 */
import fs from "node:fs";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

const ar = new Intl.DisplayNames(["ar"], { type: "region" });
const en = new Intl.DisplayNames(["en"], { type: "region" });

const rows = [];
for (const cc of getCountries()) {
  let nameAr, nameEn, calling;
  try {
    nameAr = ar.of(cc);
    nameEn = en.of(cc);
    calling = getCountryCallingCode(cc);
  } catch {
    continue;
  }
  if (!nameAr || nameAr === cc) continue;
  rows.push({ cc, nameAr, nameEn, calling });
}
rows.sort((a, b) => a.nameAr.localeCompare(b.nameAr, "ar"));

// Countries surfaced first in the phone country selector.
const PRIORITY = ["SA", "EG", "AE", "KW", "QA", "BH", "OM", "JO", "YE", "SD", "IQ", "LB", "SY", "PS", "LY", "DZ", "MA", "TN"];

const byCc = new Map(rows.map((r) => [r.cc, r]));
const ordered = [
  ...PRIORITY.map((cc) => byCc.get(cc)).filter(Boolean),
  ...rows.filter((r) => !PRIORITY.includes(r.cc)),
];

const flag = (cc) =>
  String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

const lines = ordered
  .map(
    (r) =>
      `  { code: ${JSON.stringify(r.cc)}, nameAr: ${JSON.stringify(r.nameAr)}, nameEn: ${JSON.stringify(r.nameEn)}, callingCode: ${JSON.stringify(r.calling)}, flag: ${JSON.stringify(flag(r.cc))} },`,
  )
  .join("\n");

const header = `/**
 * Country reference data for the nationality combobox and the international
 * phone inputs.
 *
 * GENERATED — regenerate with \`node .verify/emit-countries.mjs\` after a
 * libphonenumber-js upgrade. Arabic names come from the ICU CLDR data that
 * ships with Node/V8 (\`Intl.DisplayNames(["ar"], { type: "region" })\`), so
 * they match what Arabic users see elsewhere in their OS. Calling codes come
 * from libphonenumber-js, which is also what validates the numbers, so the
 * picker can never offer a country the validator does not know.
 *
 * The first entries are ordered for this audience (Saudi Arabia first, then
 * Egypt and the rest of the Arab world); everything after that is sorted by
 * Arabic collation.
 */
import type { CountryCode } from "libphonenumber-js";

export interface Country {
  code: CountryCode;
  nameAr: string;
  nameEn: string;
  callingCode: string;
  flag: string;
}

export const DEFAULT_COUNTRY: CountryCode = "SA";

export const countries: readonly Country[] = [
${lines}
] as const;

const byCode = new Map<string, Country>(countries.map((c) => [c.code, c]));

export function findCountry(code: string | undefined | null): Country | undefined {
  return code ? byCode.get(code) : undefined;
}

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === "string" && byCode.has(value);
}

/**
 * Fold Arabic orthographic variants so that a search for "سعوديه" matches
 * "المملكة العربية السعودية". Strips harakat/tatweel, unifies the alef and
 * ya forms, and maps ta marbuta to ha — the standard normalisation set for
 * Arabic search.
 */
export function normalizeArabic(input: string): string {
  return input
    .replace(/[\\u064B-\\u0652\\u0670\\u0640]/g, "")
    .replace(/[\\u0622\\u0623\\u0625\\u0671]/g, "\\u0627")
    .replace(/\\u0629/g, "\\u0647")
    .replace(/[\\u0649\\u064A]/g, "\\u064A")
    .replace(/[\\u0624]/g, "\\u0648")
    .toLowerCase()
    .trim();
}

/** Latin-digit and Arabic-digit tolerant match across name, code and dial code. */
export function matchesCountry(country: Country, rawQuery: string): boolean {
  const query = normalizeArabic(rawQuery);
  if (!query) return true;
  const bare = query.startsWith("\\u0627\\u0644") ? query.slice(2) : query;
  const haystacks = [
    normalizeArabic(country.nameAr),
    country.nameEn.toLowerCase(),
    country.code.toLowerCase(),
    country.callingCode,
    "+" + country.callingCode,
  ];
  return haystacks.some((h) => h.includes(query) || h.includes(bare));
}
`;

fs.writeFileSync("src/lib/countries.ts", header);
console.log("wrote src/lib/countries.ts with", ordered.length, "countries");
