"use client";

import * as React from "react";
import { AsYouType, type CountryCode } from "libphonenumber-js";

import { CountryCombobox } from "@/components/form/country-combobox";
import { form as formCopy } from "@/content/site";
import { toLatinDigits } from "@/lib/digits";
import { cn } from "@/lib/utils";

/**
 * International phone input: a country picker plus a national-number field.
 *
 * Direction: the label and helper text stay RTL with the rest of the form, but
 * the value itself is `dir="ltr"` and bidi-isolated. Without that, a number
 * typed into an RTL context renders with the digits visually reordered, which
 * makes people "correct" a number that was already right.
 *
 * Input handling:
 *  - Arabic-Indic digits are folded to ASCII as the user types, so an Arabic
 *    keyboard is a first-class input method rather than a validation failure
 *  - `AsYouType` formats the national part for readability; the raw value sent
 *    to the server is re-parsed and normalised to E.164 there regardless
 *  - a leading "+" is accepted and preserved, for people who paste a full
 *    international number
 */

interface PhoneFieldProps {
  id: string;
  country: string;
  number: string;
  onCountryChange: (code: string) => void;
  onNumberChange: (value: string) => void;
  onBlur?: () => void;
  countryLabel: string;
  describedBy?: string;
  invalid?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export function PhoneField({
  id,
  country,
  number,
  onCountryChange,
  onNumberChange,
  onBlur,
  countryLabel,
  describedBy,
  invalid = false,
  disabled = false,
  autoComplete,
}: PhoneFieldProps) {
  const format = React.useCallback(
    (raw: string) => {
      const latin = toLatinDigits(raw);
      // Keep only digits, spaces and a leading plus — everything else is noise
      // from autofill or a pasted contact card.
      const cleaned = latin.replace(/[^\d+\s]/g, "");
      if (cleaned.startsWith("+")) {
        return new AsYouType().input(cleaned);
      }
      const digits = cleaned.replace(/\D/g, "");
      if (!digits) return "";
      return new AsYouType(country as CountryCode).input(digits);
    },
    [country],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNumberChange(format(event.target.value));
  };

  return (
    <div
      className={cn(
        "flex w-full items-stretch gap-2",
        // At 360px a side-by-side picker + input is tight but workable; the
        // picker is sized to its content so the number field keeps the space.
        "min-w-0",
      )}
    >
      <CountryCombobox
        mode="dial"
        value={country}
        onChange={onCountryChange}
        ariaLabel={countryLabel}
        placeholder={countryLabel}
        searchPlaceholder={formCopy.fields.nationality.searchPlaceholder}
        emptyLabel={formCopy.fields.nationality.empty}
        invalid={invalid}
        disabled={disabled}
      />

      <input
        id={id}
        type="tel"
        inputMode="tel"
        dir="ltr"
        autoComplete={autoComplete}
        value={number}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        placeholder="5X XXX XXXX"
        className={cn(
          "min-h-11 w-full min-w-0 flex-1 rounded-[var(--radius-input)] px-4 py-2.5",
          "bg-ivory/85 text-charcoal placeholder:text-muted/60",
          "border border-sand-deep/55 tabular-nums tracking-[0.02em]",
          "shadow-[inset_0_1px_2px_rgba(28,33,30,0.05)]",
          "transition-[border-color,box-shadow,background-color] duration-[var(--duration-interact)] ease-[var(--ease-out-soft)]",
          "hover:border-sand-deep/80",
          "focus-visible:outline-none focus-visible:border-verdant",
          "focus-visible:bg-ivory focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-verdant)_18%,transparent)]",
          "aria-invalid:border-danger aria-invalid:bg-danger-pale/40",
          "disabled:cursor-not-allowed disabled:opacity-60",
          // text-align:left inside an RTL page, so the number reads naturally.
          "text-left",
        )}
        style={{ unicodeBidi: "isolate" }}
      />
    </div>
  );
}
