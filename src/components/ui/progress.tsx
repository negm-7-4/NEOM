"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Form-completion meter.
 *
 * Written directly rather than pulled from @radix-ui/react-progress: the only
 * behaviour needed is the ARIA contract below, so a dependency would not have
 * earned its place. `aria-valuetext` carries an Arabic percentage because a
 * bare number is read out ambiguously in RTL by some screen readers.
 */
function Progress({
  value,
  label,
  className,
  ...props
}: React.ComponentProps<"div"> & { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${clamped}٪ ${label}`}
      aria-label={label}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        "bg-charcoal/10 shadow-[inset_0_1px_2px_rgba(28,33,30,0.12)]",
        className,
      )}
      {...props}
    >
      <div
        // The bar grows from the inline-start edge, which flips automatically
        // in RTL because the parent is a flow-relative block.
        className={cn(
          "h-full rounded-full bg-gradient-to-l from-verdant to-verdant-light",
          "transition-[width] duration-[var(--duration-interact)] ease-[var(--ease-out-soft)]",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };
