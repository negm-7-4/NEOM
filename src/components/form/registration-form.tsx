"use client";

import * as React from "react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertTriangleIcon,
  AtSignIcon,
  Loader2Icon,
  MapPinIcon,
  MessageCircleQuestionIcon,
  SendIcon,
  UserIcon,
} from "lucide-react";

import { Field, FieldAdornment, SectionHeader } from "@/components/form/field";
import { CountryCombobox } from "@/components/form/country-combobox";
import { PhoneField } from "@/components/form/phone-field";
import { SuccessPanel } from "@/components/form/success-panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  adSources,
  educationLevels,
  form as formCopy,
  genders,
  purposes,
  specializations,
  studySystems,
} from "@/content/site";
import {
  completionPercent,
  emptyRegistration,
  registrationSchema,
  type RegistrationFormValues,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * The registration form.
 *
 * Structure: one continuous `<form>` split into four numbered `<fieldset>`
 * sections — not a wizard. A wizard would hide the scope of the task and make
 * the "progress from valid required fields" requirement ambiguous.
 *
 * Validation runs `onTouched` (first on blur, then live once a field has been
 * visited). Validating on every keystroke from the first character shouts at
 * someone who has typed one letter of their name; waiting until submit hides
 * problems until the end.
 *
 * Motion: this panel is intentionally *not* tilted or parallaxed. Tilt is
 * reserved for the decorative benefit cards — a form that shifts while you aim
 * at a select is hostile, especially on a phone.
 */

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; reference: string }
  | { kind: "error"; message: string };

interface ApiSuccess {
  ok: true;
  reference: string;
  duplicate?: boolean;
}

interface ApiFailure {
  ok: false;
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

/** URL-safe random id; falls back for browsers without `randomUUID`. */
function createIdempotencyKey(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID().replace(/-/g, "");
  const bytes = new Uint8Array(16);
  cryptoObj?.getRandomValues?.(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function RegistrationForm() {
  const reduced = useReducedMotion();
  const [state, setState] = React.useState<SubmitState>({ kind: "idle" });

  /**
   * One key per filled-in form, reused across every retry of that same
   * submission so a failed send followed by "try again" cannot produce two
   * emails. It is regenerated only after a success, when the applicant starts
   * a new application.
   *
   * State with a lazy initialiser, not a ref: the key is created once for the
   * lifetime of this form instance and replaced deliberately, which is state.
   * A ref would have to be written during render to get the same effect.
   */
  const [idempotencyKey, setIdempotencyKey] = React.useState(createIdempotencyKey);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    // The resolver validates the loose form state against the strict schema;
    // the cast bridges the two deliberately different shapes (see schema.ts).
    resolver: zodResolver(registrationSchema) as unknown as Resolver<RegistrationFormValues>,
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusError: true,
    /*
     * The key has to be part of the form's own values, not merged in at POST
     * time. The resolver validates `defaultValues` against the same schema the
     * server uses, and that schema requires a well-formed `idempotencyKey` —
     * leaving it "" here makes every client-side submit fail on a field with
     * no visible control, so `shouldFocusError` has nothing to focus and the
     * form silently does nothing when the user presses submit.
     */
    defaultValues: { ...emptyRegistration, idempotencyKey },
  });

  /**
   * `useWatch` rather than `watch()`: `watch()` hands back a new object on
   * every render, which defeats memoization here and downstream. `useWatch`
   * subscribes to the form store and re-renders only this component when a
   * watched value actually changes.
   */
  const values = useWatch({ control }) as RegistrationFormValues;
  const progress = completionPercent(values);

  const isOtherPurpose = values.purpose === "other";
  const sameAsPhone = values.whatsappSameAsPhone;

  /**
   * Mirror the phone number into WhatsApp only while the checkbox is on.
   * Copying on the checkbox click alone would leave the two out of sync as
   * soon as the phone number is edited afterwards.
   */
  React.useEffect(() => {
    if (!sameAsPhone) return;
    setValue("whatsappCountry", values.phoneCountry, { shouldValidate: false });
    setValue("whatsappNumber", values.phoneNumber, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [sameAsPhone, values.phoneCountry, values.phoneNumber, setValue]);

  /** Clear the conditional field when the applicant moves away from "أخرى". */
  React.useEffect(() => {
    if (!isOtherPurpose && values.purposeOther) {
      setValue("purposeOther", "", { shouldValidate: false });
    }
  }, [isOtherPurpose, values.purposeOther, setValue]);

  const onSubmit = handleSubmit(async (formValues) => {
    setState({ kind: "submitting" });

    let response: Response;
    try {
      response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
    } catch {
      setState({ kind: "error", message: formCopy.errors.network });
      return;
    }

    let payload: ApiSuccess | ApiFailure;
    try {
      payload = (await response.json()) as ApiSuccess | ApiFailure;
    } catch {
      setState({ kind: "error", message: formCopy.errors.generic });
      return;
    }

    if (response.ok && payload.ok) {
      // A `duplicate` response means the server replayed an earlier accepted
      // submission — same reference, no second email. Same confirmation.
      setState({ kind: "success", reference: payload.reference });
      return;
    }

    const failure = payload as ApiFailure;

    // Server-side validation wins: surface its messages on the fields.
    if (failure.fieldErrors) {
      for (const [path, messages] of Object.entries(failure.fieldErrors)) {
        const message = messages[0];
        if (!message) continue;
        setError(path as keyof RegistrationFormValues, { type: "server", message });
      }
    }

    setState({
      kind: "error",
      message:
        response.status === 429
          ? formCopy.errors.rateLimited
          : (failure.message ?? formCopy.errors.generic),
    });
  });

  const startOver = React.useCallback(() => {
    // A brand new application gets a brand new key, so it is never treated as
    // a replay of the one that just succeeded.
    const nextKey = createIdempotencyKey();
    setIdempotencyKey(nextKey);
    reset({ ...emptyRegistration, idempotencyKey: nextKey });
    setState({ kind: "idle" });
  }, [reset]);

  const pending = isSubmitting || state.kind === "submitting";

  if (state.kind === "success") {
    return <SuccessPanel reference={state.reference} onReset={startOver} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
      {/* Progress ------------------------------------------------------- */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-semibold text-charcoal">
            {formCopy.progressLabel}
          </span>
          <span data-ltr className="text-sm font-bold tabular-nums text-verdant">
            {progress}%
          </span>
        </div>
        <Progress value={progress} label={formCopy.progressLabel} />
      </div>

      {/* Section 1 — program -------------------------------------------- */}
      <fieldset
        className="flex flex-col gap-6 border-0 p-0"
        aria-labelledby="section-program"
      >
        <SectionHeader
          index={formCopy.sections.program.index}
          title={formCopy.sections.program.title}
          id="section-program"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            control={control}
            name="educationLevel"
            render={({ field }) => (
              <Field
                name="educationLevel"
                label={formCopy.fields.educationLevel.label}
                error={errors.educationLevel?.message}
              >
                {({ id, describedBy, invalid }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={id}
                      aria-describedby={describedBy}
                      aria-invalid={invalid || undefined}
                      onBlur={field.onBlur}
                    >
                      <SelectValue placeholder={formCopy.fields.educationLevel.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="specialization"
            render={({ field }) => (
              <Field
                name="specialization"
                label={formCopy.fields.specialization.label}
                error={errors.specialization?.message}
              >
                {({ id, describedBy, invalid }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={id}
                      aria-describedby={describedBy}
                      aria-invalid={invalid || undefined}
                      onBlur={field.onBlur}
                    >
                      <SelectValue placeholder={formCopy.fields.specialization.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          control={control}
          name="studySystem"
          render={({ field }) => (
            <Field
              name="studySystem"
              label={formCopy.fields.studySystem.label}
              error={errors.studySystem?.message}
              optional
              asGroup
            >
              {({ describedBy }) => (
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  aria-labelledby="field-studySystem-label"
                  aria-describedby={describedBy}
                  className="grid-cols-1 md:grid-cols-2"
                >
                  {studySystems.map((option) => (
                    <RadioCard
                      key={option.value}
                      id={`studySystem-${option.value}`}
                      value={option.value}
                      title={option.label}
                      description={
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <bdi>{option.duration}</bdi>
                          <span aria-hidden className="text-muted/50">
                            •
                          </span>
                          <bdi>{option.refund}</bdi>
                        </span>
                      }
                    />
                  ))}
                </RadioGroup>
              )}
            </Field>
          )}
        />
      </fieldset>

      <SectionDivider />

      {/* Section 2 — personal ------------------------------------------- */}
      <fieldset
        className="flex flex-col gap-6 border-0 p-0"
        aria-labelledby="section-personal"
      >
        <SectionHeader
          index={formCopy.sections.personal.index}
          title={formCopy.sections.personal.title}
          id="section-personal"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            control={control}
            name="fullNameAr"
            render={({ field }) => (
              <Field
                name="fullNameAr"
                label={formCopy.fields.fullNameAr.label}
                helper={formCopy.fields.nameGuidance}
                error={errors.fullNameAr?.message}
              >
                {({ id, describedBy, invalid }) => (
                  <FieldAdornment icon={UserIcon}>
                    <Input
                      {...field}
                      id={id}
                      dir="rtl"
                      autoComplete="name"
                      spellCheck={false}
                      placeholder={formCopy.fields.fullNameAr.placeholder}
                      aria-describedby={describedBy}
                      aria-invalid={invalid || undefined}
                      className="pe-11"
                    />
                  </FieldAdornment>
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="fullNameEn"
            render={({ field }) => (
              <Field
                name="fullNameEn"
                label={formCopy.fields.fullNameEn.label}
                helper={formCopy.fields.nameGuidance}
                error={errors.fullNameEn?.message}
              >
                {({ id, describedBy, invalid }) => (
                  <FieldAdornment icon={UserIcon}>
                    <Input
                      {...field}
                      id={id}
                      /* LTR inside the field only — the label stays RTL. */
                      dir="ltr"
                      /* ps- not pe-: for a dir="ltr" input, inline-start is
                         the LEFT edge, which is where the icon sits. */
                      className="ps-11 text-left"
                      autoComplete="name"
                      spellCheck={false}
                      placeholder={formCopy.fields.fullNameEn.placeholder}
                      aria-describedby={describedBy}
                      aria-invalid={invalid || undefined}
                    />
                  </FieldAdornment>
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            control={control}
            name="nationality"
            render={({ field }) => (
              <Field
                name="nationality"
                label={formCopy.fields.nationality.label}
                error={errors.nationality?.message}
              >
                {({ id, describedBy, invalid }) => (
                  <CountryCombobox
                    id={id}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={formCopy.fields.nationality.placeholder}
                    searchPlaceholder={formCopy.fields.nationality.searchPlaceholder}
                    emptyLabel={formCopy.fields.nationality.empty}
                    describedBy={describedBy}
                    invalid={invalid}
                  />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Field
                name="gender"
                label={formCopy.fields.gender.label}
                error={errors.gender?.message}
                asGroup
              >
                {({ describedBy }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-labelledby="field-gender-label"
                    aria-describedby={describedBy}
                    className="grid-cols-2"
                  >
                    {genders.map((option) => (
                      <RadioCard
                        key={option.value}
                        id={`gender-${option.value}`}
                        value={option.value}
                        title={option.label}
                      />
                    ))}
                  </RadioGroup>
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          control={control}
          name="purpose"
          render={({ field }) => (
            <Field
              name="purpose"
              label={formCopy.fields.purpose.label}
              error={errors.purpose?.message}
              asGroup
            >
              {({ describedBy }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-labelledby="field-purpose-label"
                  aria-describedby={describedBy}
                  className="grid-cols-1 sm:grid-cols-3"
                >
                  {purposes.map((option) => (
                    <RadioCard
                      key={option.value}
                      id={`purpose-${option.value}`}
                      value={option.value}
                      title={option.label}
                    />
                  ))}
                </RadioGroup>
              )}
            </Field>
          )}
        />

        {/* Conditional clarification, revealed only for "أخرى". */}
        <AnimatePresence initial={false}>
          {isOtherPurpose ? (
            <motion.div
              key="purpose-other"
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <Controller
                control={control}
                name="purposeOther"
                render={({ field }) => (
                  <Field
                    name="purposeOther"
                    label={formCopy.fields.purposeOther.label}
                    error={errors.purposeOther?.message}
                    className="pt-1"
                  >
                    {({ id, describedBy, invalid }) => (
                      <FieldAdornment icon={MessageCircleQuestionIcon}>
                        <Input
                          {...field}
                          id={id}
                          placeholder={formCopy.fields.purposeOther.placeholder}
                          aria-describedby={describedBy}
                          aria-invalid={invalid || undefined}
                          className="pe-11"
                        />
                      </FieldAdornment>
                    )}
                  </Field>
                )}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      <SectionDivider />

      {/* Section 3 — contact -------------------------------------------- */}
      <fieldset
        className="flex flex-col gap-6 border-0 p-0"
        aria-labelledby="section-contact"
      >
        <SectionHeader
          index={formCopy.sections.contact.index}
          title={formCopy.sections.contact.title}
          id="section-contact"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field
            name="phoneNumber"
            label={formCopy.fields.phone.label}
            helper={formCopy.fields.phone.helper}
            error={errors.phoneNumber?.message ?? errors.phoneCountry?.message}
          >
            {({ id, describedBy, invalid }) => (
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <PhoneField
                    id={id}
                    country={values.phoneCountry}
                    number={field.value}
                    onCountryChange={(code) =>
                      setValue("phoneCountry", code, { shouldValidate: true })
                    }
                    onNumberChange={field.onChange}
                    onBlur={field.onBlur}
                    countryLabel={formCopy.fields.phone.countryLabel}
                    describedBy={describedBy}
                    invalid={invalid}
                    autoComplete="tel"
                  />
                )}
              />
            )}
          </Field>

          <Field
            name="whatsappNumber"
            label={formCopy.fields.whatsapp.label}
            helper={formCopy.fields.whatsapp.helper}
            error={errors.whatsappNumber?.message ?? errors.whatsappCountry?.message}
          >
            {({ id, describedBy, invalid }) => (
              <div className="flex flex-col gap-3">
                <Controller
                  control={control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <PhoneField
                      id={id}
                      country={values.whatsappCountry}
                      number={field.value}
                      onCountryChange={(code) =>
                        setValue("whatsappCountry", code, { shouldValidate: true })
                      }
                      onNumberChange={field.onChange}
                      onBlur={field.onBlur}
                      countryLabel={formCopy.fields.whatsapp.countryLabel}
                      describedBy={describedBy}
                      invalid={invalid}
                      disabled={sameAsPhone}
                      autoComplete="tel"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="whatsappSameAsPhone"
                  render={({ field }) => (
                    <label
                      htmlFor="whatsappSameAsPhone"
                      className="flex min-h-11 cursor-pointer items-center gap-3 text-sm leading-6 text-charcoal"
                    >
                      <Checkbox
                        id="whatsappSameAsPhone"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      <span>{formCopy.fields.whatsapp.sameAsPhone}</span>
                    </label>
                  )}
                />
              </div>
            )}
          </Field>
        </div>

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Field
              name="email"
              label={formCopy.fields.email.label}
              helper={formCopy.fields.email.helper}
              error={errors.email?.message}
              optional
              className="md:max-w-[calc(50%-12px)]"
            >
              {({ id, describedBy, invalid }) => (
                <FieldAdornment icon={AtSignIcon}>
                  <Input
                    {...field}
                    id={id}
                    type="email"
                    inputMode="email"
                    dir="ltr"
                    className="ps-11 text-left"
                    autoComplete="email"
                    spellCheck={false}
                    placeholder={formCopy.fields.email.placeholder}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                  />
                </FieldAdornment>
              )}
            </Field>
          )}
        />
      </fieldset>

      <SectionDivider />

      {/* Section 4 — address and attribution ---------------------------- */}
      <fieldset
        className="flex flex-col gap-6 border-0 p-0"
        aria-labelledby="section-address"
      >
        <SectionHeader
          index={formCopy.sections.address.index}
          title={formCopy.sections.address.title}
          id="section-address"
        />

        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <Field
              name="address"
              label={formCopy.fields.address.label}
              helper={
                <span className="flex flex-col gap-1">
                  <span className="font-medium text-charcoal/80">
                    {formCopy.fields.address.pattern}
                  </span>
                  <span>{formCopy.fields.address.shippingNote}</span>
                </span>
              }
              error={errors.address?.message}
            >
              {({ id, describedBy, invalid }) => (
                <div className="relative">
                  <Textarea
                    {...field}
                    id={id}
                    rows={3}
                    placeholder={formCopy.fields.address.pattern}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    className="pe-11"
                  />
                  <MapPinIcon
                    aria-hidden
                    className="pointer-events-none absolute end-4 top-3.5 size-[18px] text-muted/70"
                  />
                </div>
              )}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="adSource"
          render={({ field }) => (
            <Field
              name="adSource"
              label={formCopy.fields.adSource.label}
              error={errors.adSource?.message}
              className="md:max-w-[calc(50%-12px)]"
            >
              {({ id, describedBy, invalid }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={id}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder={formCopy.fields.adSource.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {adSources.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          )}
        />
      </fieldset>

      {/*
        Honeypot — present in the DOM for naive bots, invisible to people and
        to assistive tech.

        Hidden with the clip technique (`sr-only`) rather than
        `position:absolute; left:-9999px`. In an RTL document the scroll origin
        is on the right, so a -9999px offset does NOT fall outside the
        scrollable area the way it does in LTR — it adds ~10,000px of
        horizontal scroll to every page. Clipping has no layout effect in
        either direction.
      */}
      <Controller
        control={control}
        name="website"
        render={({ field }) => (
          <div aria-hidden className="sr-only">
            <label htmlFor="website">Website</label>
            <input
              {...field}
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        )}
      />

      {/* Consent + submit ------------------------------------------------ */}
      <div className="flex flex-col gap-6">
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="consent"
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[var(--radius-input)] p-3 -m-3",
                  "text-[0.95rem] leading-7 text-charcoal transition-colors duration-[var(--duration-interact)]",
                  "hover:bg-charcoal/4",
                )}
              >
                <Checkbox
                  id="consent"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={Boolean(errors.consent) || undefined}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  className="mt-1"
                />
                <span>{formCopy.fields.consent.label}</span>
              </label>
              {errors.consent?.message ? (
                <p
                  id="consent-error"
                  role="alert"
                  className="flex items-start gap-1.5 text-sm font-medium text-danger"
                >
                  <AlertTriangleIcon aria-hidden className="mt-1 size-4 shrink-0" />
                  <span>{errors.consent.message}</span>
                </p>
              ) : null}
            </div>
          )}
        />

        {/* Submission status, announced politely rather than stealing focus. */}
        <div aria-live="polite" aria-atomic="true" className="contents">
          <AnimatePresence initial={false}>
            {state.kind === "error" ? (
              <motion.div
                key="submit-error"
                initial={reduced ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.22 }}
                className="flex items-start gap-3 rounded-[var(--radius-input)] border border-danger/35 bg-danger-pale/70 px-4 py-3.5"
              >
                <AlertTriangleIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-[0.95rem] font-semibold leading-6 text-danger">
                    {state.message}
                  </p>
                  <p className="text-sm leading-6 text-charcoal/70">
                    {formCopy.errors.generic}
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          aria-busy={pending || undefined}
          className="w-full sm:w-auto sm:self-start sm:min-w-64"
        >
          {pending ? (
            <>
              <Loader2Icon aria-hidden className="size-5 animate-spin" />
              {formCopy.pending}
            </>
          ) : (
            <>
              <SendIcon aria-hidden className="size-5" />
              {state.kind === "error" ? formCopy.errors.retry : formCopy.submit}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function SectionDivider() {
  return (
    <hr
      aria-hidden
      className="border-0 h-px bg-gradient-to-l from-transparent via-sand-deep/45 to-transparent"
    />
  );
}
