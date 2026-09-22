"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui Popover (MIT). The defaults here are tuned for the combobox use
 * case on a phone: the content is capped by Radix's available-height variable
 * so it shrinks instead of being clipped when the software keyboard opens,
 * and collision padding keeps it off the screen edges at 360px.
 */

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

function PopoverContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn(
          "z-50 w-[var(--radix-popover-trigger-width)] min-w-[15rem]",
          "max-h-[min(22rem,var(--radix-popover-content-available-height))]",
          "overflow-hidden rounded-[var(--radius-input)] border border-sand-deep/45",
          "bg-ivory/97 backdrop-blur-xl text-charcoal",
          "shadow-[0_20px_44px_-20px_rgba(28,33,30,0.45)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
