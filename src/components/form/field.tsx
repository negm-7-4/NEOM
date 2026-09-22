"use client";

import * as React from "react";
import { AlertCircleIcon, type LucideIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { form as formCopy } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * One field wrapper for the whole registration form.
 *
 * It owns the accessibility wiring that is easy to get subtly wrong when
 * repeated 15 times by hand: a real `<label for>` association, an
 * `aria-describedby` that lists the helper text *and* the error (in that
 * order), `aria-invalid` mirroring the visual error state, and an error node
 * with `role="alert"` so a screen reader announces it the moment it appears.
 *
 * Children are a render prop rather than cloned elements so the control can be
 * an `<input>`, a Radix trigger, a fieldset or a composite (the phone field)
 * without this component having to know which.
 */

export interface FieldRenderProps {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}

interface FieldProps {
  name: string;
  label: string;
  children: (props: FieldRenderProps) => React.ReactNode;
  helper?: React.ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
  /**
   * Set for radio groups and other composites where the label must not be a
   * `<label for>` (there is no single control to point at). Renders the label
   * as the group's `<legend>`-equivalent and links it with aria-labelledby.
   */
  asGroup?: boolean;
}

export function Field({
  name,
  label,
  children,
  helper,
  error,
  optional = false,
  className,
  asGroup = false,
}: FieldProps) {
  const id = `field-${name}`;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(error);

  const labelNode = (
    <span className="flex flex-wrap items-center gap-2">
      <span>{label}</span>
      {optional ? (
        <span className="rounded-full bg-charcoal/6 px-2 py-0.5 text-[0.7rem] font-medium text-muted">
          {formCopy.optionalTag}
        </span>
      ) : (
        <span aria-hidden className="text-danger">
          *
        </span>
      )}
    </span>
  );

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)} data-field={name}>
      {asGroup ? (
        <span id={`${id}-label`} className="text-[0.95rem] font-semibold leading-6 text-charcoal">
          {labelNode}
        </span>
      ) : (
        <Label htmlFor={id}>{labelNode}</Label>
      )}

      {children({ id, describedBy, invalid })}

      {helper ? (
        <p id={helperId} className="text-sm leading-6 text-muted">
          {helper}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-sm font-medium leading-6 text-danger motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 motion-safe:duration-200"
        >
          <AlertCircleIcon aria-hidden className="mt-1 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/** Numbered section header shared by the four form sections. */
export function SectionHeader({
  index,
  title,
  id,
}: {
  index: number;
  title: string;
  id: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-verdant/30 bg-verdant-pale text-base font-bold text-verdant"
      >
        {index}
      </span>
      <h3 id={id} className="text-lg font-bold leading-7 text-charcoal sm:text-xl">
        <span className="sr-only">{`القسم ${index}: `}</span>
        {title}
      </h3>
    </div>
  );
}

/**
 * Overlays a contextual icon on the inline-end of a control, as the reference
 * does. Purely decorative: `aria-hidden`, `pointer-events-none`, and the
 * control itself gets the matching inline-end padding so the icon never sits
 * on top of typed text — including long Arabic values and LTR phone numbers.
 */
export function FieldAdornment({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <Icon
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-4 my-auto size-[18px] text-muted/70"
      />
    </div>
  );
}
