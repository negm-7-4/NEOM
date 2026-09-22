"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** shadcn/ui Checkbox (MIT), restyled and enlarged for touch. */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-[6px] border-2 border-sand-deep bg-ivory",
        "transition-[background-color,border-color,box-shadow] duration-[var(--duration-interact)]",
        "focus-visible:outline-none focus-visible:border-verdant",
        "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-verdant)_22%,transparent)]",
        "data-[state=checked]:border-verdant data-[state=checked]:bg-verdant",
        "aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-ivory">
        <CheckIcon
          aria-hidden
          className="size-3.5 stroke-[3] motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-150"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
