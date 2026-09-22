"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Adapted from shadcn/ui's Button (MIT). Changes for this project:
 *  - every size clears the 44px touch-target floor from the brief
 *  - a `glass` variant that matches the page's translucent surfaces
 *  - press feedback at 180ms and hover at 220ms, the interaction band
 *  - logical properties throughout so the RTL layout needs no overrides
 */
const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--radius-input)] font-semibold",
    "transition-[transform,box-shadow,background-color,color] duration-[var(--duration-interact)] ease-[var(--ease-out-soft)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verdant",
    "disabled:pointer-events-none disabled:opacity-55",
    "active:duration-[var(--duration-tap)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-verdant text-ivory",
          "shadow-[0_1px_0_rgba(255,255,255,0.28)_inset,0_10px_24px_-12px_rgba(28,33,30,0.55)]",
          "hover:bg-verdant-light hover:shadow-[0_1px_0_rgba(255,255,255,0.32)_inset,0_16px_32px_-14px_rgba(28,33,30,0.6)]",
          "motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 active:scale-[0.985]",
        ].join(" "),
        glass: [
          "glass glass-card text-charcoal",
          "hover:[--glass-alpha:68]",
          "motion-safe:hover:-translate-y-0.5 active:scale-[0.985]",
        ].join(" "),
        outline: [
          "border border-sand-deep/60 bg-ivory/70 text-charcoal",
          "hover:bg-ivory hover:border-sand-deep",
          "active:scale-[0.985]",
        ].join(" "),
        ghost: "text-charcoal hover:bg-charcoal/5 active:scale-[0.985]",
        link: "text-verdant underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-6 py-2.5 text-base",
        lg: "min-h-13 px-8 py-3.5 text-lg",
        sm: "min-h-11 px-4 py-2 text-sm",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
