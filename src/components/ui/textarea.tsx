"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** shadcn/ui Textarea (MIT), matched to the Input treatment above. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full rounded-[var(--radius-input)] px-4 py-3",
        "bg-ivory/85 text-charcoal placeholder:text-muted/70",
        "border border-sand-deep/55 leading-7",
        "shadow-[inset_0_1px_2px_rgba(28,33,30,0.05)]",
        "transition-[border-color,box-shadow,background-color] duration-[var(--duration-interact)] ease-[var(--ease-out-soft)]",
        "hover:border-sand-deep/80",
        "focus-visible:outline-none focus-visible:border-verdant",
        "focus-visible:bg-ivory focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-verdant)_18%,transparent)]",
        "aria-invalid:border-danger aria-invalid:bg-danger-pale/40",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "resize-y field-sizing-content",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
