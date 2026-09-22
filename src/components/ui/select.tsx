"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui Select (MIT) over Radix Select, adapted for RTL and mobile:
 *  - `position="popper"` with a viewport-bounded max height, so the menu is
 *    never clipped when the mobile keyboard is open
 *  - `dir` is inherited from the document, and the check mark sits on the
 *    inline-end side via logical padding rather than a mirrored class
 *  - trigger clears 44px
 */

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex min-h-11 w-full items-center justify-between gap-2",
        "rounded-[var(--radius-input)] px-4 py-2.5 text-start",
        "bg-ivory/85 text-charcoal border border-sand-deep/55",
        "shadow-[inset_0_1px_2px_rgba(28,33,30,0.05)]",
        "transition-[border-color,box-shadow,background-color] duration-[var(--duration-interact)] ease-[var(--ease-out-soft)]",
        "hover:border-sand-deep/80",
        "focus-visible:outline-none focus-visible:border-verdant",
        "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-verdant)_18%,transparent)]",
        "aria-invalid:border-danger aria-invalid:bg-danger-pale/40",
        "data-[placeholder]:text-muted/75",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "[&>span]:line-clamp-1 [&>span]:text-start",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          aria-hidden
          className="size-4 shrink-0 text-muted transition-transform duration-[var(--duration-interact)]"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={6}
        collisionPadding={12}
        className={cn(
          "relative z-50 min-w-[var(--radix-select-trigger-width)]",
          // Bounded by the *available* height, which Radix recomputes when the
          // mobile keyboard shrinks the viewport.
          "max-h-[min(20rem,var(--radix-select-content-available-height))]",
          "overflow-y-auto overscroll-contain",
          "rounded-[var(--radius-input)] border border-sand-deep/45",
          "bg-ivory/97 backdrop-blur-xl text-charcoal",
          "shadow-[0_20px_44px_-20px_rgba(28,33,30,0.45)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-muted">
          <ChevronUpIcon aria-hidden className="size-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-muted">
          <ChevronDownIcon aria-hidden className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-11 w-full cursor-pointer select-none items-center",
        "rounded-[12px] py-2.5 pe-9 ps-3 text-start leading-6",
        "outline-none transition-colors duration-[var(--duration-tap)]",
        "focus:bg-verdant-pale focus:text-charcoal",
        "data-[state=checked]:bg-verdant-pale data-[state=checked]:font-semibold",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute inset-y-0 end-3 flex items-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon aria-hidden className="size-4 text-verdant" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem };
