/**
 * Country reference data for the nationality combobox and the international
 * phone inputs.
 *
 * GENERATED — regenerate with `node .verify/emit-countries.mjs` after a
 * libphonenumber-js upgrade. Arabic names come from the ICU CLDR data that
 * ships with Node/V8 (`Intl.DisplayNames(["ar"], { type: "region" })`), so
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
  { code: "SA", nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia", callingCode: "966", flag: "🇸🇦" },
  { code: "EG", nameAr: "مصر", nameEn: "Egypt", callingCode: "20", flag: "🇪🇬" },
  { code: "AE", nameAr: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates", callingCode: "971", flag: "🇦🇪" },
  { code: "KW", nameAr: "الكويت", nameEn: "Kuwait", callingCode: "965", flag: "🇰🇼" },
  { code: "QA", nameAr: "قطر", nameEn: "Qatar", callingCode: "974", flag: "🇶🇦" },
  { code: "BH", nameAr: "البحرين", nameEn: "Bahrain", callingCode: "973", flag: "🇧🇭" },
  { code: "OM", nameAr: "عُمان", nameEn: "Oman", callingCode: "968", flag: "🇴🇲" },
  { code: "JO", nameAr: "الأردن", nameEn: "Jordan", callingCode: "962", flag: "🇯🇴" },
  { code: "YE", nameAr: "اليمن", nameEn: "Yemen", callingCode: "967", flag: "🇾🇪" },
  { code: "SD", nameAr: "السودان", nameEn: "Sudan", callingCode: "249", flag: "🇸🇩" },
  { code: "IQ", nameAr: "العراق", nameEn: "Iraq", callingCode: "964", flag: "🇮🇶" },
  { code: "LB", nameAr: "لبنان", nameEn: "Lebanon", callingCode: "961", flag: "🇱🇧" },
  { code: "SY", nameAr: "سوريا", nameEn: "Syria", callingCode: "963", flag: "🇸🇾" },
  { code: "PS", nameAr: "الأراضي الفلسطينية", nameEn: "Palestinian Territories", callingCode: "970", flag: "🇵🇸" },
  { code: "LY", nameAr: "ليبيا", nameEn: "Libya", callingCode: "218", flag: "🇱🇾" },
  { code: "DZ", nameAr: "الجزائر", nameEn: "Algeria", callingCode: "213", flag: "🇩🇿" },
  { code: "MA", nameAr: "المغرب", nameEn: "Morocco", callingCode: "212", flag: "🇲🇦" },
  { code: "TN", nameAr: "تونس", nameEn: "Tunisia", callingCode: "216", flag: "🇹🇳" },
  { code: "IS", nameAr: "آيسلندا", nameEn: "Iceland", callingCode: "354", flag: "🇮🇸" },
  { code: "ET", nameAr: "إثيوبيا", nameEn: "Ethiopia", callingCode: "251", flag: "🇪🇹" },
  { code: "AZ", nameAr: "أذربيجان", nameEn: "Azerbaijan", callingCode: "994", flag: "🇦🇿" },
  { code: "AM", nameAr: "أرمينيا", nameEn: "Armenia", callingCode: "374", flag: "🇦🇲" },
  { code: "AW", nameAr: "أروبا", nameEn: "Aruba", callingCode: "297", flag: "🇦🇼" },
  { code: "ER", nameAr: "إريتريا", nameEn: "Eritrea", callingCode: "291", flag: "🇪🇷" },
  { code: "ES", nameAr: "إسبانيا", nameEn: "Spain", callingCode: "34", flag: "🇪🇸" },
  { code: "AU", nameAr: "أستراليا", nameEn: "Australia", callingCode: "61", flag: "🇦🇺" },
  { code: "EE", nameAr: "إستونيا", nameEn: "Estonia", callingCode: "372", flag: "🇪🇪" },
  { code: "IL", nameAr: "إسرائيل", nameEn: "Israel", callingCode: "972", flag: "🇮🇱" },
  { code: "SZ", nameAr: "إسواتيني", nameEn: "Eswatini", callingCode: "268", flag: "🇸🇿" },
  { code: "AF", nameAr: "أفغانستان", nameEn: "Afghanistan", callingCode: "93", flag: "🇦🇫" },
  { code: "AR", nameAr: "الأرجنتين", nameEn: "Argentina", callingCode: "54", flag: "🇦🇷" },
  { code: "IO", nameAr: "الإقليم البريطاني في المحيط الهندي", nameEn: "British Indian Ocean Territory", callingCode: "246", flag: "🇮🇴" },
  { code: "EC", nameAr: "الإكوادور", nameEn: "Ecuador", callingCode: "593", flag: "🇪🇨" },
  { code: "AL", nameAr: "ألبانيا", nameEn: "Albania", callingCode: "355", flag: "🇦🇱" },
  { code: "BR", nameAr: "البرازيل", nameEn: "Brazil", callingCode: "55", flag: "🇧🇷" },
  { code: "PT", nameAr: "البرتغال", nameEn: "Portugal", callingCode: "351", flag: "🇵🇹" },
  { code: "BA", nameAr: "البوسنة والهرسك", nameEn: "Bosnia & Herzegovina", callingCode: "387", flag: "🇧🇦" },
  { code: "CZ", nameAr: "التشيك", nameEn: "Czechia", callingCode: "420", flag: "🇨🇿" },
  { code: "ME", nameAr: "الجبل الأسود", nameEn: "Montenegro", callingCode: "382", flag: "🇲🇪" },
  { code: "DK", nameAr: "الدانمرك", nameEn: "Denmark", callingCode: "45", flag: "🇩🇰" },
  { code: "CV", nameAr: "الرأس الأخضر", nameEn: "Cape Verde", callingCode: "238", flag: "🇨🇻" },
  { code: "SV", nameAr: "السلفادور", nameEn: "El Salvador", callingCode: "503", flag: "🇸🇻" },
  { code: "SN", nameAr: "السنغال", nameEn: "Senegal", callingCode: "221", flag: "🇸🇳" },
  { code: "SE", nameAr: "السويد", nameEn: "Sweden", callingCode: "46", flag: "🇸🇪" },
  { code: "EH", nameAr: "الصحراء الغربية", nameEn: "Western Sahara", callingCode: "212", flag: "🇪🇭" },
  { code: "SO", nameAr: "الصومال", nameEn: "Somalia", callingCode: "252", flag: "🇸🇴" },
  { code: "CN", nameAr: "الصين", nameEn: "China", callingCode: "86", flag: "🇨🇳" },
  { code: "GA", nameAr: "الغابون", nameEn: "Gabon", callingCode: "241", flag: "🇬🇦" },
  { code: "VA", nameAr: "الفاتيكان", nameEn: "Vatican City", callingCode: "39", flag: "🇻🇦" },
  { code: "PH", nameAr: "الفلبين", nameEn: "Philippines", callingCode: "63", flag: "🇵🇭" },
  { code: "CM", nameAr: "الكاميرون", nameEn: "Cameroon", callingCode: "237", flag: "🇨🇲" },
  { code: "CG", nameAr: "الكونغو - برازافيل", nameEn: "Congo - Brazzaville", callingCode: "242", flag: "🇨🇬" },
  { code: "CD", nameAr: "الكونغو - كينشاسا", nameEn: "Congo - Kinshasa", callingCode: "243", flag: "🇨🇩" },
  { code: "DE", nameAr: "ألمانيا", nameEn: "Germany", callingCode: "49", flag: "🇩🇪" },
  { code: "MX", nameAr: "المكسيك", nameEn: "Mexico", callingCode: "52", flag: "🇲🇽" },
  { code: "GB", nameAr: "المملكة المتحدة", nameEn: "United Kingdom", callingCode: "44", flag: "🇬🇧" },
  { code: "NO", nameAr: "النرويج", nameEn: "Norway", callingCode: "47", flag: "🇳🇴" },
  { code: "AT", nameAr: "النمسا", nameEn: "Austria", callingCode: "43", flag: "🇦🇹" },
  { code: "NE", nameAr: "النيجر", nameEn: "Niger", callingCode: "227", flag: "🇳🇪" },
  { code: "IN", nameAr: "الهند", nameEn: "India", callingCode: "91", flag: "🇮🇳" },
  { code: "US", nameAr: "الولايات المتحدة", nameEn: "United States", callingCode: "1", flag: "🇺🇸" },
  { code: "JP", nameAr: "اليابان", nameEn: "Japan", callingCode: "81", flag: "🇯🇵" },
  { code: "GR", nameAr: "اليونان", nameEn: "Greece", callingCode: "30", flag: "🇬🇷" },
  { code: "AG", nameAr: "أنتيغوا وبربودا", nameEn: "Antigua & Barbuda", callingCode: "1", flag: "🇦🇬" },
  { code: "AD", nameAr: "أندورا", nameEn: "Andorra", callingCode: "376", flag: "🇦🇩" },
  { code: "ID", nameAr: "إندونيسيا", nameEn: "Indonesia", callingCode: "62", flag: "🇮🇩" },
  { code: "AO", nameAr: "أنغولا", nameEn: "Angola", callingCode: "244", flag: "🇦🇴" },
  { code: "AI", nameAr: "أنغويلا", nameEn: "Anguilla", callingCode: "1", flag: "🇦🇮" },
  { code: "UY", nameAr: "أورغواي", nameEn: "Uruguay", callingCode: "598", flag: "🇺🇾" },
  { code: "UZ", nameAr: "أوزبكستان", nameEn: "Uzbekistan", callingCode: "998", flag: "🇺🇿" },
  { code: "UG", nameAr: "أوغندا", nameEn: "Uganda", callingCode: "256", flag: "🇺🇬" },
  { code: "UA", nameAr: "أوكرانيا", nameEn: "Ukraine", callingCode: "380", flag: "🇺🇦" },
  { code: "IR", nameAr: "إيران", nameEn: "Iran", callingCode: "98", flag: "🇮🇷" },
  { code: "IE", nameAr: "أيرلندا", nameEn: "Ireland", callingCode: "353", flag: "🇮🇪" },
  { code: "IT", nameAr: "إيطاليا", nameEn: "Italy", callingCode: "39", flag: "🇮🇹" },
  { code: "PG", nameAr: "بابوا غينيا الجديدة", nameEn: "Papua New Guinea", callingCode: "675", flag: "🇵🇬" },
  { code: "PY", nameAr: "باراغواي", nameEn: "Paraguay", callingCode: "595", flag: "🇵🇾" },
  { code: "PK", nameAr: "باكستان", nameEn: "Pakistan", callingCode: "92", flag: "🇵🇰" },
  { code: "PW", nameAr: "بالاو", nameEn: "Palau", callingCode: "680", flag: "🇵🇼" },
  { code: "BB", nameAr: "بربادوس", nameEn: "Barbados", callingCode: "1", flag: "🇧🇧" },
  { code: "BM", nameAr: "برمودا", nameEn: "Bermuda", callingCode: "1", flag: "🇧🇲" },
  { code: "BN", nameAr: "بروناي", nameEn: "Brunei", callingCode: "673", flag: "🇧🇳" },
  { code: "BE", nameAr: "بلجيكا", nameEn: "Belgium", callingCode: "32", flag: "🇧🇪" },
  { code: "BG", nameAr: "بلغاريا", nameEn: "Bulgaria", callingCode: "359", flag: "🇧🇬" },
  { code: "BZ", nameAr: "بليز", nameEn: "Belize", callingCode: "501", flag: "🇧🇿" },
  { code: "BD", nameAr: "بنغلاديش", nameEn: "Bangladesh", callingCode: "880", flag: "🇧🇩" },
  { code: "PA", nameAr: "بنما", nameEn: "Panama", callingCode: "507", flag: "🇵🇦" },
  { code: "BJ", nameAr: "بنين", nameEn: "Benin", callingCode: "229", flag: "🇧🇯" },
  { code: "BT", nameAr: "بوتان", nameEn: "Bhutan", callingCode: "975", flag: "🇧🇹" },
  { code: "BW", nameAr: "بوتسوانا", nameEn: "Botswana", callingCode: "267", flag: "🇧🇼" },
  { code: "PR", nameAr: "بورتوريكو", nameEn: "Puerto Rico", callingCode: "1", flag: "🇵🇷" },
  { code: "BF", nameAr: "بوركينا فاسو", nameEn: "Burkina Faso", callingCode: "226", flag: "🇧🇫" },
  { code: "BI", nameAr: "بوروندي", nameEn: "Burundi", callingCode: "257", flag: "🇧🇮" },
  { code: "PL", nameAr: "بولندا", nameEn: "Poland", callingCode: "48", flag: "🇵🇱" },
  { code: "BO", nameAr: "بوليفيا", nameEn: "Bolivia", callingCode: "591", flag: "🇧🇴" },
  { code: "PF", nameAr: "بولينيزيا الفرنسية", nameEn: "French Polynesia", callingCode: "689", flag: "🇵🇫" },
  { code: "PE", nameAr: "بيرو", nameEn: "Peru", callingCode: "51", flag: "🇵🇪" },
  { code: "BY", nameAr: "بيلاروس", nameEn: "Belarus", callingCode: "375", flag: "🇧🇾" },
  { code: "TH", nameAr: "تايلاند", nameEn: "Thailand", callingCode: "66", flag: "🇹🇭" },
  { code: "TW", nameAr: "تايوان", nameEn: "Taiwan", callingCode: "886", flag: "🇹🇼" },
  { code: "TM", nameAr: "تركمانستان", nameEn: "Turkmenistan", callingCode: "993", flag: "🇹🇲" },
  { code: "TR", nameAr: "تركيا", nameEn: "Türkiye", callingCode: "90", flag: "🇹🇷" },
  { code: "TA", nameAr: "تريستان دا كونا", nameEn: "Tristan da Cunha", callingCode: "290", flag: "🇹🇦" },
  { code: "TT", nameAr: "ترينيداد وتوباغو", nameEn: "Trinidad & Tobago", callingCode: "1", flag: "🇹🇹" },
  { code: "TD", nameAr: "تشاد", nameEn: "Chad", callingCode: "235", flag: "🇹🇩" },
  { code: "CL", nameAr: "تشيلي", nameEn: "Chile", callingCode: "56", flag: "🇨🇱" },
  { code: "TZ", nameAr: "تنزانيا", nameEn: "Tanzania", callingCode: "255", flag: "🇹🇿" },
  { code: "TG", nameAr: "توغو", nameEn: "Togo", callingCode: "228", flag: "🇹🇬" },
  { code: "TV", nameAr: "توفالو", nameEn: "Tuvalu", callingCode: "688", flag: "🇹🇻" },
  { code: "TK", nameAr: "توكيلاو", nameEn: "Tokelau", callingCode: "690", flag: "🇹🇰" },
  { code: "TO", nameAr: "تونغا", nameEn: "Tonga", callingCode: "676", flag: "🇹🇴" },
  { code: "TL", nameAr: "تيمور - ليشتي", nameEn: "Timor-Leste", callingCode: "670", flag: "🇹🇱" },
  { code: "JM", nameAr: "جامايكا", nameEn: "Jamaica", callingCode: "1", flag: "🇯🇲" },
  { code: "GI", nameAr: "جبل طارق", nameEn: "Gibraltar", callingCode: "350", flag: "🇬🇮" },
  { code: "AX", nameAr: "جزر آلاند", nameEn: "Åland Islands", callingCode: "358", flag: "🇦🇽" },
  { code: "BS", nameAr: "جزر البهاما", nameEn: "Bahamas", callingCode: "1", flag: "🇧🇸" },
  { code: "KM", nameAr: "جزر القمر", nameEn: "Comoros", callingCode: "269", flag: "🇰🇲" },
  { code: "MQ", nameAr: "جزر المارتينيك", nameEn: "Martinique", callingCode: "596", flag: "🇲🇶" },
  { code: "MV", nameAr: "جزر المالديف", nameEn: "Maldives", callingCode: "960", flag: "🇲🇻" },
  { code: "TC", nameAr: "جزر توركس وكايكوس", nameEn: "Turks & Caicos Islands", callingCode: "1", flag: "🇹🇨" },
  { code: "SB", nameAr: "جزر سليمان", nameEn: "Solomon Islands", callingCode: "677", flag: "🇸🇧" },
  { code: "FO", nameAr: "جزر فارو", nameEn: "Faroe Islands", callingCode: "298", flag: "🇫🇴" },
  { code: "FK", nameAr: "جزر فوكلاند", nameEn: "Falkland Islands", callingCode: "500", flag: "🇫🇰" },
  { code: "VI", nameAr: "جزر فيرجن الأمريكية", nameEn: "U.S. Virgin Islands", callingCode: "1", flag: "🇻🇮" },
  { code: "VG", nameAr: "جزر فيرجن البريطانية", nameEn: "British Virgin Islands", callingCode: "1", flag: "🇻🇬" },
  { code: "KY", nameAr: "جزر كايمان", nameEn: "Cayman Islands", callingCode: "1", flag: "🇰🇾" },
  { code: "CK", nameAr: "جزر كوك", nameEn: "Cook Islands", callingCode: "682", flag: "🇨🇰" },
  { code: "CC", nameAr: "جزر كوكوس (كيلينغ)", nameEn: "Cocos (Keeling) Islands", callingCode: "61", flag: "🇨🇨" },
  { code: "MH", nameAr: "جزر مارشال", nameEn: "Marshall Islands", callingCode: "692", flag: "🇲🇭" },
  { code: "MP", nameAr: "جزر ماريانا الشمالية", nameEn: "Northern Mariana Islands", callingCode: "1", flag: "🇲🇵" },
  { code: "WF", nameAr: "جزر والس وفوتونا", nameEn: "Wallis & Futuna", callingCode: "681", flag: "🇼🇫" },
  { code: "AC", nameAr: "جزيرة أسينشيون", nameEn: "Ascension Island", callingCode: "247", flag: "🇦🇨" },
  { code: "CX", nameAr: "جزيرة كريسماس", nameEn: "Christmas Island", callingCode: "61", flag: "🇨🇽" },
  { code: "IM", nameAr: "جزيرة مان", nameEn: "Isle of Man", callingCode: "44", flag: "🇮🇲" },
  { code: "NF", nameAr: "جزيرة نورفولك", nameEn: "Norfolk Island", callingCode: "672", flag: "🇳🇫" },
  { code: "CF", nameAr: "جمهورية أفريقيا الوسطى", nameEn: "Central African Republic", callingCode: "236", flag: "🇨🇫" },
  { code: "DO", nameAr: "جمهورية الدومينيكان", nameEn: "Dominican Republic", callingCode: "1", flag: "🇩🇴" },
  { code: "ZA", nameAr: "جنوب أفريقيا", nameEn: "South Africa", callingCode: "27", flag: "🇿🇦" },
  { code: "SS", nameAr: "جنوب السودان", nameEn: "South Sudan", callingCode: "211", flag: "🇸🇸" },
  { code: "GE", nameAr: "جورجيا", nameEn: "Georgia", callingCode: "995", flag: "🇬🇪" },
  { code: "DJ", nameAr: "جيبوتي", nameEn: "Djibouti", callingCode: "253", flag: "🇩🇯" },
  { code: "JE", nameAr: "جيرسي", nameEn: "Jersey", callingCode: "44", flag: "🇯🇪" },
  { code: "DM", nameAr: "دومينيكا", nameEn: "Dominica", callingCode: "1", flag: "🇩🇲" },
  { code: "RW", nameAr: "رواندا", nameEn: "Rwanda", callingCode: "250", flag: "🇷🇼" },
  { code: "RU", nameAr: "روسيا", nameEn: "Russia", callingCode: "7", flag: "🇷🇺" },
  { code: "RO", nameAr: "رومانيا", nameEn: "Romania", callingCode: "40", flag: "🇷🇴" },
  { code: "RE", nameAr: "روينيون", nameEn: "Réunion", callingCode: "262", flag: "🇷🇪" },
  { code: "ZM", nameAr: "زامبيا", nameEn: "Zambia", callingCode: "260", flag: "🇿🇲" },
  { code: "ZW", nameAr: "زيمبابوي", nameEn: "Zimbabwe", callingCode: "263", flag: "🇿🇼" },
  { code: "CI", nameAr: "ساحل العاج", nameEn: "Côte d’Ivoire", callingCode: "225", flag: "🇨🇮" },
  { code: "WS", nameAr: "ساموا", nameEn: "Samoa", callingCode: "685", flag: "🇼🇸" },
  { code: "AS", nameAr: "ساموا الأمريكية", nameEn: "American Samoa", callingCode: "1", flag: "🇦🇸" },
  { code: "BL", nameAr: "سان بارتليمي", nameEn: "St. Barthélemy", callingCode: "590", flag: "🇧🇱" },
  { code: "PM", nameAr: "سان بيير ومكويلون", nameEn: "St. Pierre & Miquelon", callingCode: "508", flag: "🇵🇲" },
  { code: "MF", nameAr: "سان مارتن", nameEn: "St. Martin", callingCode: "590", flag: "🇲🇫" },
  { code: "SM", nameAr: "سان مارينو", nameEn: "San Marino", callingCode: "378", flag: "🇸🇲" },
  { code: "VC", nameAr: "سانت فنسنت وجزر غرينادين", nameEn: "St. Vincent & Grenadines", callingCode: "1", flag: "🇻🇨" },
  { code: "KN", nameAr: "سانت كيتس ونيفيس", nameEn: "St. Kitts & Nevis", callingCode: "1", flag: "🇰🇳" },
  { code: "LC", nameAr: "سانت لوسيا", nameEn: "St. Lucia", callingCode: "1", flag: "🇱🇨" },
  { code: "SX", nameAr: "سانت مارتن", nameEn: "Sint Maarten", callingCode: "1", flag: "🇸🇽" },
  { code: "SH", nameAr: "سانت هيلينا", nameEn: "St. Helena", callingCode: "290", flag: "🇸🇭" },
  { code: "ST", nameAr: "ساو تومي وبرينسيبي", nameEn: "São Tomé & Príncipe", callingCode: "239", flag: "🇸🇹" },
  { code: "LK", nameAr: "سريلانكا", nameEn: "Sri Lanka", callingCode: "94", flag: "🇱🇰" },
  { code: "SJ", nameAr: "سفالبارد وجان ماين", nameEn: "Svalbard & Jan Mayen", callingCode: "47", flag: "🇸🇯" },
  { code: "SK", nameAr: "سلوفاكيا", nameEn: "Slovakia", callingCode: "421", flag: "🇸🇰" },
  { code: "SI", nameAr: "سلوفينيا", nameEn: "Slovenia", callingCode: "386", flag: "🇸🇮" },
  { code: "SG", nameAr: "سنغافورة", nameEn: "Singapore", callingCode: "65", flag: "🇸🇬" },
  { code: "SR", nameAr: "سورينام", nameEn: "Suriname", callingCode: "597", flag: "🇸🇷" },
  { code: "CH", nameAr: "سويسرا", nameEn: "Switzerland", callingCode: "41", flag: "🇨🇭" },
  { code: "SL", nameAr: "سيراليون", nameEn: "Sierra Leone", callingCode: "232", flag: "🇸🇱" },
  { code: "SC", nameAr: "سيشل", nameEn: "Seychelles", callingCode: "248", flag: "🇸🇨" },
  { code: "RS", nameAr: "صربيا", nameEn: "Serbia", callingCode: "381", flag: "🇷🇸" },
  { code: "TJ", nameAr: "طاجيكستان", nameEn: "Tajikistan", callingCode: "992", flag: "🇹🇯" },
  { code: "GM", nameAr: "غامبيا", nameEn: "Gambia", callingCode: "220", flag: "🇬🇲" },
  { code: "GH", nameAr: "غانا", nameEn: "Ghana", callingCode: "233", flag: "🇬🇭" },
  { code: "GD", nameAr: "غرينادا", nameEn: "Grenada", callingCode: "1", flag: "🇬🇩" },
  { code: "GL", nameAr: "غرينلاند", nameEn: "Greenland", callingCode: "299", flag: "🇬🇱" },
  { code: "GT", nameAr: "غواتيمالا", nameEn: "Guatemala", callingCode: "502", flag: "🇬🇹" },
  { code: "GP", nameAr: "غوادلوب", nameEn: "Guadeloupe", callingCode: "590", flag: "🇬🇵" },
  { code: "GU", nameAr: "غوام", nameEn: "Guam", callingCode: "1", flag: "🇬🇺" },
  { code: "GF", nameAr: "غويانا الفرنسية", nameEn: "French Guiana", callingCode: "594", flag: "🇬🇫" },
  { code: "GY", nameAr: "غيانا", nameEn: "Guyana", callingCode: "592", flag: "🇬🇾" },
  { code: "GG", nameAr: "غيرنزي", nameEn: "Guernsey", callingCode: "44", flag: "🇬🇬" },
  { code: "GN", nameAr: "غينيا", nameEn: "Guinea", callingCode: "224", flag: "🇬🇳" },
  { code: "GQ", nameAr: "غينيا الاستوائية", nameEn: "Equatorial Guinea", callingCode: "240", flag: "🇬🇶" },
  { code: "GW", nameAr: "غينيا بيساو", nameEn: "Guinea-Bissau", callingCode: "245", flag: "🇬🇼" },
  { code: "VU", nameAr: "فانواتو", nameEn: "Vanuatu", callingCode: "678", flag: "🇻🇺" },
  { code: "FR", nameAr: "فرنسا", nameEn: "France", callingCode: "33", flag: "🇫🇷" },
  { code: "VE", nameAr: "فنزويلا", nameEn: "Venezuela", callingCode: "58", flag: "🇻🇪" },
  { code: "FI", nameAr: "فنلندا", nameEn: "Finland", callingCode: "358", flag: "🇫🇮" },
  { code: "VN", nameAr: "فيتنام", nameEn: "Vietnam", callingCode: "84", flag: "🇻🇳" },
  { code: "FJ", nameAr: "فيجي", nameEn: "Fiji", callingCode: "679", flag: "🇫🇯" },
  { code: "CY", nameAr: "قبرص", nameEn: "Cyprus", callingCode: "357", flag: "🇨🇾" },
  { code: "KG", nameAr: "قيرغيزستان", nameEn: "Kyrgyzstan", callingCode: "996", flag: "🇰🇬" },
  { code: "KZ", nameAr: "كازاخستان", nameEn: "Kazakhstan", callingCode: "7", flag: "🇰🇿" },
  { code: "NC", nameAr: "كاليدونيا الجديدة", nameEn: "New Caledonia", callingCode: "687", flag: "🇳🇨" },
  { code: "HR", nameAr: "كرواتيا", nameEn: "Croatia", callingCode: "385", flag: "🇭🇷" },
  { code: "KH", nameAr: "كمبوديا", nameEn: "Cambodia", callingCode: "855", flag: "🇰🇭" },
  { code: "CA", nameAr: "كندا", nameEn: "Canada", callingCode: "1", flag: "🇨🇦" },
  { code: "CU", nameAr: "كوبا", nameEn: "Cuba", callingCode: "53", flag: "🇨🇺" },
  { code: "CW", nameAr: "كوراساو", nameEn: "Curaçao", callingCode: "599", flag: "🇨🇼" },
  { code: "KR", nameAr: "كوريا الجنوبية", nameEn: "South Korea", callingCode: "82", flag: "🇰🇷" },
  { code: "KP", nameAr: "كوريا الشمالية", nameEn: "North Korea", callingCode: "850", flag: "🇰🇵" },
  { code: "CR", nameAr: "كوستاريكا", nameEn: "Costa Rica", callingCode: "506", flag: "🇨🇷" },
  { code: "XK", nameAr: "كوسوفو", nameEn: "Kosovo", callingCode: "383", flag: "🇽🇰" },
  { code: "CO", nameAr: "كولومبيا", nameEn: "Colombia", callingCode: "57", flag: "🇨🇴" },
  { code: "KI", nameAr: "كيريباتي", nameEn: "Kiribati", callingCode: "686", flag: "🇰🇮" },
  { code: "KE", nameAr: "كينيا", nameEn: "Kenya", callingCode: "254", flag: "🇰🇪" },
  { code: "LV", nameAr: "لاتفيا", nameEn: "Latvia", callingCode: "371", flag: "🇱🇻" },
  { code: "LA", nameAr: "لاوس", nameEn: "Laos", callingCode: "856", flag: "🇱🇦" },
  { code: "LU", nameAr: "لوكسمبورغ", nameEn: "Luxembourg", callingCode: "352", flag: "🇱🇺" },
  { code: "LR", nameAr: "ليبيريا", nameEn: "Liberia", callingCode: "231", flag: "🇱🇷" },
  { code: "LT", nameAr: "ليتوانيا", nameEn: "Lithuania", callingCode: "370", flag: "🇱🇹" },
  { code: "LI", nameAr: "ليختنشتاين", nameEn: "Liechtenstein", callingCode: "423", flag: "🇱🇮" },
  { code: "LS", nameAr: "ليسوتو", nameEn: "Lesotho", callingCode: "266", flag: "🇱🇸" },
  { code: "MT", nameAr: "مالطا", nameEn: "Malta", callingCode: "356", flag: "🇲🇹" },
  { code: "ML", nameAr: "مالي", nameEn: "Mali", callingCode: "223", flag: "🇲🇱" },
  { code: "MY", nameAr: "ماليزيا", nameEn: "Malaysia", callingCode: "60", flag: "🇲🇾" },
  { code: "YT", nameAr: "مايوت", nameEn: "Mayotte", callingCode: "262", flag: "🇾🇹" },
  { code: "MG", nameAr: "مدغشقر", nameEn: "Madagascar", callingCode: "261", flag: "🇲🇬" },
  { code: "MK", nameAr: "مقدونيا الشمالية", nameEn: "North Macedonia", callingCode: "389", flag: "🇲🇰" },
  { code: "MW", nameAr: "ملاوي", nameEn: "Malawi", callingCode: "265", flag: "🇲🇼" },
  { code: "MO", nameAr: "منطقة ماكاو الإدارية الخاصة", nameEn: "Macao SAR China", callingCode: "853", flag: "🇲🇴" },
  { code: "MN", nameAr: "منغوليا", nameEn: "Mongolia", callingCode: "976", flag: "🇲🇳" },
  { code: "MR", nameAr: "موريتانيا", nameEn: "Mauritania", callingCode: "222", flag: "🇲🇷" },
  { code: "MU", nameAr: "موريشيوس", nameEn: "Mauritius", callingCode: "230", flag: "🇲🇺" },
  { code: "MZ", nameAr: "موزمبيق", nameEn: "Mozambique", callingCode: "258", flag: "🇲🇿" },
  { code: "MD", nameAr: "مولدوفا", nameEn: "Moldova", callingCode: "373", flag: "🇲🇩" },
  { code: "MC", nameAr: "موناكو", nameEn: "Monaco", callingCode: "377", flag: "🇲🇨" },
  { code: "MS", nameAr: "مونتسرات", nameEn: "Montserrat", callingCode: "1", flag: "🇲🇸" },
  { code: "MM", nameAr: "ميانمار (بورما)", nameEn: "Myanmar (Burma)", callingCode: "95", flag: "🇲🇲" },
  { code: "FM", nameAr: "ميكرونيزيا", nameEn: "Micronesia", callingCode: "691", flag: "🇫🇲" },
  { code: "NA", nameAr: "ناميبيا", nameEn: "Namibia", callingCode: "264", flag: "🇳🇦" },
  { code: "NR", nameAr: "ناورو", nameEn: "Nauru", callingCode: "674", flag: "🇳🇷" },
  { code: "NP", nameAr: "نيبال", nameEn: "Nepal", callingCode: "977", flag: "🇳🇵" },
  { code: "NG", nameAr: "نيجيريا", nameEn: "Nigeria", callingCode: "234", flag: "🇳🇬" },
  { code: "NI", nameAr: "نيكاراغوا", nameEn: "Nicaragua", callingCode: "505", flag: "🇳🇮" },
  { code: "NZ", nameAr: "نيوزيلندا", nameEn: "New Zealand", callingCode: "64", flag: "🇳🇿" },
  { code: "NU", nameAr: "نيوي", nameEn: "Niue", callingCode: "683", flag: "🇳🇺" },
  { code: "HT", nameAr: "هايتي", nameEn: "Haiti", callingCode: "509", flag: "🇭🇹" },
  { code: "HN", nameAr: "هندوراس", nameEn: "Honduras", callingCode: "504", flag: "🇭🇳" },
  { code: "HU", nameAr: "هنغاريا", nameEn: "Hungary", callingCode: "36", flag: "🇭🇺" },
  { code: "NL", nameAr: "هولندا", nameEn: "Netherlands", callingCode: "31", flag: "🇳🇱" },
  { code: "BQ", nameAr: "هولندا الكاريبية", nameEn: "Caribbean Netherlands", callingCode: "599", flag: "🇧🇶" },
  { code: "HK", nameAr: "هونغ كونغ الصينية (منطقة إدارية خاصة)", nameEn: "Hong Kong SAR China", callingCode: "852", flag: "🇭🇰" },
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
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    .replace(/\u0629/g, "\u0647")
    .replace(/[\u0649\u064A]/g, "\u064A")
    .replace(/[\u0624]/g, "\u0648")
    .toLowerCase()
    .trim();
}

/** Latin-digit and Arabic-digit tolerant match across name, code and dial code. */
export function matchesCountry(country: Country, rawQuery: string): boolean {
  const query = normalizeArabic(rawQuery);
  if (!query) return true;
  const bare = query.startsWith("\u0627\u0644") ? query.slice(2) : query;
  const haystacks = [
    normalizeArabic(country.nameAr),
    country.nameEn.toLowerCase(),
    country.code.toLowerCase(),
    country.callingCode,
    "+" + country.callingCode,
  ];
  return haystacks.some((h) => h.includes(query) || h.includes(bare));
}
