"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui Input (MIT), reworked for this form:
 *  - 44px minimum height and a 16px font floor (iOS focus-zoom guard)
 *  - `aria-invalid` drives the error styling, so the visual state and the
 *    state announced to a screen reader can never disagree
 *  - a green ring on a valid, filled field as positive validation feedback
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex min-h-11 w-full rounded-[var(--radius-input)] px-4 py-2.5",
        "bg-ivory/85 text-charcoal placeholder:text-muted/70",
        "border border-sand-deep/55",
        "shadow-[inset_0_1px_2px_rgba(28,33,30,0.05)]",
        "transition-[border-color,box-shadow,background-color] duration-[var(--duration-interact)] ease-[var(--ease-out-soft)]",
        "hover:border-sand-deep/80",
        "focus-visible:outline-none focus-visible:border-verdant",
        "focus-visible:bg-ivory focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-verdant)_18%,transparent)]",
        "aria-invalid:border-danger aria-invalid:bg-danger-pale/40",
        "aria-invalid:focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-danger)_18%,transparent)]",
        "data-[valid=true]:border-verdant/60",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
