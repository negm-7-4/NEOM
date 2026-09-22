"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui RadioGroup (MIT) plus a `RadioCard` variant used for the study
 * system and the purpose/gender choices. Radix handles roving-tabindex arrow
 * navigation, which is what makes the whole group reachable with one Tab stop.
 */

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-5 shrink-0 rounded-full border-2 border-sand-deep",
        "bg-ivory transition-[border-color,box-shadow] duration-[var(--duration-interact)]",
        "focus-visible:outline-none focus-visible:border-verdant",
        "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-verdant)_22%,transparent)]",
        "data-[state=checked]:border-verdant",
        "aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex size-full items-center justify-center">
        <span className="block size-2.5 rounded-full bg-verdant motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-150" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

/**
 * A full-width selectable card. The whole card is the label, so the tap target
 * is the card rather than the 20px dot — the difference between a usable and
 * an unusable radio on a phone.
 */
function RadioCard({
  value,
  id,
  title,
  description,
  className,
}: {
  value: string;
  id: string;
  title: string;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex min-h-14 cursor-pointer items-start gap-3 rounded-[var(--radius-input)]",
        "border border-sand-deep/55 bg-ivory/75 px-4 py-3.5",
        "transition-[border-color,background-color,box-shadow,transform] duration-[var(--duration-interact)] ease-[var(--ease-out-soft)]",
        "hover:border-sand-deep hover:bg-ivory/92",
        "has-[[data-state=checked]]:border-verdant has-[[data-state=checked]]:bg-verdant-pale/60",
        "has-[[data-state=checked]]:shadow-[0_0_0_1px_var(--color-verdant)_inset]",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-verdant",
        className,
      )}
    >
      <RadioGroupItem value={value} id={id} className="mt-1" />
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold leading-6 text-charcoal">{title}</span>
        {description ? (
          <span className="text-sm leading-6 text-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

export { RadioGroup, RadioGroupItem, RadioCard };
