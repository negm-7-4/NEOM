/**
 * Single source of truth for every piece of NEOM copy, program option and
 * marketing string on the site.
 *
 * Why one file: the registration form, the Zod schema (client *and* server),
 * the notification email and the landing page all read from here. That makes
 * the server-side allowlists structurally impossible to drift away from the
 * options the user was actually shown, and lets a non-developer edit wording
 * without touching component code.
 *
 * CONTENT POLICY — read before editing:
 * The accreditation, refund, Apostille and shipping statements below are
 * client-supplied copy reproduced verbatim. Do not add claims of ranking,
 * verification, recognition or affiliation that the client has not supplied.
 * This site is not affiliated with the University of Oxford or with the NEOM
 * development project in Saudi Arabia.
 */

export const org = {
  /** Full legal/marketing name, used in the header capsule and the footer. */
  name: "مركز نيوم للتدريب والتعليم المعتمد وتنمية الموارد البشرية",
  /** Latin wordmark — rendered typographically, never as a third-party logo. */
  wordmark: "NEOM",
  tagline: "NEOM .. معك .. للارتقاء",
  /** Shown in the brand capsule above the headline. */
  capsule: "مركز نيوم للتدريب والتعليم المعتمد",
  locale: "ar-SA",
  /** IANA timezone used for the timestamp on the notification email. */
  timezone: "Asia/Riyadh",
} as const;

export const seo = {
  title: "مركز نيوم للتدريب — التسجيل في برنامج ماجستير إدارة الأعمال MBA",
  description:
    "تعلن مؤسسة نيوم للتدريب وتنمية الموارد البشرية عن فتح باب التسجيل في برنامج ماجستير إدارة الأعمال MBA باعتماد من كلية أوكسفورد للتدريب المهني.",
} as const;

export const hero = {
  /**
   * The headline is authored as discrete lines so Motion can stagger it per
   * line. Never split Arabic at the character level — that breaks the cursive
   * letter shaping and the bidi run.
   */
  headlineLines: ["طوّر مسارك المهني", "وابدأ خطوتك القادمة مع"] as const,
  focal: "MBA",
  intro:
    "تعلن مؤسسة نيوم للتدريب وتنمية الموارد البشرية عن فتح باب التسجيل في برنامج ماجستير إدارة الأعمال MBA باعتماد من كلية أوكسفورد للتدريب المهني.",
  supporting:
    "سجّل بياناتك ليتواصل معك أحد المستشارين التعليميين ويشرح لك تفاصيل البرنامج وخطوات الالتحاق.",
  cta: "ابدأ التسجيل الآن",
  ctaTargetId: "registration",
} as const;

export const benefits = {
  heading: "أبرز مزايا البرنامج",
  /**
   * `detail` is supporting explanation and is meant to be edited by the
   * client. Keep it descriptive — do not invent refund eligibility rules,
   * accreditation scopes or guarantees.
   */
  items: [
    {
      id: "refund",
      icon: "wallet",
      title: "استرداد كامل للرسوم للسعوديين فقط",
      detail: "وفق شروط الاسترداد المعتمدة لدى المركز.",
    },
    {
      id: "apostille",
      icon: "stamp",
      title: "اعتماد أبوستيل Apostille",
      detail: "تصديق الشهادة وفق إجراءات الأبوستيل.",
    },
    {
      id: "flexible",
      icon: "globe",
      title: "دراسة مرنة من أي مكان وفي أي وقت",
      detail: "محتوى إلكتروني متاح على مدار الساعة.",
    },
    {
      id: "curriculum",
      icon: "book",
      title: "أحدث المقررات الدراسية الدولية",
      detail: "مقررات محدّثة تواكب متطلبات سوق العمل.",
    },
    {
      id: "workshops",
      icon: "presentation",
      title: "دراسات عليا وورش عمل تدريبية",
      detail: "ورش تطبيقية مرافقة للمسار الدراسي.",
    },
    {
      id: "lecturers",
      icon: "users",
      title: "محاضرون متخصصون",
      detail: "نخبة من المحاضرين في مجالات الإدارة والأعمال.",
    },
    {
      id: "accreditation",
      icon: "award",
      title: "اعتمادات واعترافات بريطانية",
      detail: "وفق الاعتمادات المعلنة من الجهة المانحة.",
    },
    {
      id: "payment",
      icon: "credit-card",
      title: "أنظمة سداد وتقسيط مرنة",
      detail: "خطط سداد تناسب مختلف الحالات.",
    },
  ],
} as const;

/* ------------------------------------------------------------------------ */
/* Registration form — option sets                                          */
/* ------------------------------------------------------------------------ */

/**
 * Every option carries a stable machine `value` and an Arabic `label`.
 * The wire format and the email use the Arabic label, but validation happens
 * against the `value` allowlist so that editing a label never silently
 * widens what the API accepts.
 */

export const educationLevels = [
  { value: "basic", label: "التعليم الأساسي" },
  { value: "secondary", label: "التعليم الثانوي" },
  { value: "university", label: "التعليم الجامعي" },
] as const;

export const specializations = [
  { value: "mba", label: "ماجستير في إدارة الأعمال" },
  { value: "hr", label: "ماجستير في إدارة الموارد البشرية" },
  { value: "governance", label: "ماجستير الحوكمة وإدارة المخاطر" },
  { value: "strategy", label: "ماجستير في الإدارة الاستراتيجية والتخطيط" },
  { value: "logistics", label: "ماجستير في اللوجستيات الحديثة وسلاسل الإمداد" },
  { value: "projects", label: "ماجستير في إدارة المشروعات والتطوير المؤسسي" },
] as const;

export const studySystems = [
  {
    value: "direct",
    label: "النظام المباشر",
    duration: "6 أشهر",
    refund: "مسترد",
  },
  {
    value: "recorded",
    label: "النظام المسجل",
    duration: "3 أشهر",
    refund: "غير مسترد",
  },
] as const;

export const genders = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
] as const;

export const purposes = [
  { value: "job", label: "الحصول على وظيفة" },
  { value: "promotion", label: "ترقية" },
  { value: "other", label: "أخرى" },
] as const;

export const adSources = [
  { value: "x", label: "X — إكس" },
  { value: "tiktok", label: "TikTok — تيك توك" },
  { value: "linkedin", label: "LinkedIn — لينكدإن" },
  { value: "telegram", label: "Telegram — تليجرام" },
  { value: "facebook", label: "Facebook — فيسبوك" },
  { value: "instagram", label: "Instagram — إنستغرام" },
  { value: "snapchat", label: "Snapchat — سناب شات" },
] as const;

/* ------------------------------------------------------------------------ */
/* Registration form — labels and helper text                               */
/* ------------------------------------------------------------------------ */

export const form = {
  heading: "استمارة التسجيل",
  intro: "الخطوة الأولى للالتحاق. تأكد من إدراج بياناتك بدقة.",
  progressLabel: "اكتمال الاستمارة",
  submit: "إرسال طلب التسجيل",
  pending: "جارٍ إرسال طلبك…",
  optionalTag: "اختياري",
  requiredTag: "مطلوب",

  sections: {
    program: { index: 1, title: "بيانات البرنامج" },
    personal: { index: 2, title: "البيانات الشخصية" },
    contact: { index: 3, title: "بيانات التواصل" },
    address: { index: 4, title: "العنوان ومصدر الإعلان" },
  },

  fields: {
    educationLevel: { label: "الدرجة التعليمية الحاصل عليها", placeholder: "اختر الدرجة التعليمية" },
    specialization: { label: "التخصص المطلوب", placeholder: "اختر التخصص" },
    studySystem: { label: "النظام الدراسي الأنسب لك" },
    fullNameAr: { label: "الاسم باللغة العربية", placeholder: "الاسم الثلاثي بالعربية" },
    fullNameEn: { label: "الاسم باللغة الإنجليزية", placeholder: "Full name in English" },
    nameGuidance: "يرجى كتابة الاسم ثلاثيًا كما ترغب في ظهوره على الشهادة.",
    nationality: {
      label: "الجنسية",
      placeholder: "اختر الجنسية",
      searchPlaceholder: "ابحث عن الجنسية…",
      empty: "لا توجد نتائج مطابقة.",
    },
    gender: { label: "الجنس" },
    purpose: { label: "الغرض من الالتحاق" },
    purposeOther: { label: "يرجى التوضيح", placeholder: "اذكر الغرض من الالتحاق" },
    phone: {
      label: "رقم الهاتف",
      helper: "سيتم التواصل معك من خلال هذا الرقم.",
      countryLabel: "مفتاح دولة رقم الهاتف",
    },
    whatsapp: {
      label: "رقم الواتساب",
      helper: "يرجى إدخال رقم الواتساب مع مفتاح الدولة.",
      countryLabel: "مفتاح دولة رقم الواتساب",
      sameAsPhone: "رقم الواتساب هو نفس رقم الهاتف",
    },
    email: {
      label: "عنوان البريد الإلكتروني",
      helper: "يرجى إدخال بريدك لاستلام المادة العلمية وروابط المحاضرات.",
      placeholder: "name@example.com",
    },
    address: {
      label: "العنوان المتاح لتلقي الشهادات",
      pattern: "الدولة - المحافظة - المدينة - الحي أو المنطقة - الشارع - علامة مميزة",
      /** Client-supplied shipping statement — editable, reproduced verbatim. */
      shippingNote: "سيتم شحن الشهادات إلى هذا العنوان دون تكاليف شحن أو رسوم إضافية.",
    },
    adSource: { label: "أين وصلك إعلاننا", placeholder: "اختر مصدر الإعلان" },
    consent: {
      label:
        "أوافق على معالجة بيانات هذا الطلب والتواصل معي بخصوص البرنامج التعليمي.",
    },
  },

  success: {
    title: "تم إرسال طلب التسجيل",
    body: "سيتواصل معك أحد المستشارين التعليميين لاستكمال التفاصيل.",
    referenceLabel: "الرقم المرجعي للطلب",
    note: "احتفظ بالرقم المرجعي للرجوع إليه عند التواصل.",
    again: "إرسال طلب آخر",
  },

  errors: {
    generic: "تعذّر إرسال الطلب. بياناتك محفوظة في الاستمارة، يرجى المحاولة مرة أخرى.",
    network: "تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت ثم أعد المحاولة.",
    rateLimited: "تم استلام عدد كبير من الطلبات من هذا الجهاز. يرجى المحاولة بعد قليل.",
    retry: "إعادة المحاولة",
    invalidSummary: "يرجى مراجعة الحقول المطلوبة قبل الإرسال.",
  },
} as const;

export const footer = {
  name: org.name,
  wordmark: org.wordmark,
  tagline: org.tagline,
  /** Legal clarification required by the content policy above. */
  disclaimer:
    "هذا الموقع خاص بمركز نيوم للتدريب والتعليم المعتمد وتنمية الموارد البشرية، ولا يمثّل جهة حكومية أو مشروع نيوم التطويري.",
  rightsPrefix: "جميع الحقوق محفوظة",
} as const;

export type EducationLevel = (typeof educationLevels)[number]["value"];
export type Specialization = (typeof specializations)[number]["value"];
export type StudySystem = (typeof studySystems)[number]["value"];
export type Gender = (typeof genders)[number]["value"];
export type Purpose = (typeof purposes)[number]["value"];
export type AdSource = (typeof adSources)[number]["value"];
export type BenefitIcon = (typeof benefits.items)[number]["icon"];

/** Resolve an option value back to the Arabic label shown to the applicant. */
export function labelOf<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string | undefined | null,
): string {
  if (!value) return "";
  return options.find((option) => option.value === value)?.label ?? "";
}
