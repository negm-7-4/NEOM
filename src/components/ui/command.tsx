"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui Command (MIT) over cmdk, used for the searchable nationality and
 * phone-country pickers.
 *
 * `shouldFilter={false}` by default: the country list is filtered by our own
 * Arabic-aware matcher (`matchesCountry`), which folds alef/ya/ta-marbuta
 * variants and also matches the English name, ISO code and dial code. cmdk's
 * built-in fuzzy scorer does none of that for Arabic.
 */

function Command({
  className,
  shouldFilter = false,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      shouldFilter={shouldFilter}
      className={cn("flex size-full flex-col overflow-hidden text-charcoal", className)}
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      className="flex items-center gap-2 border-b border-sand-deep/40 px-3"
      data-slot="command-input-wrapper"
    >
      <SearchIcon aria-hidden className="size-4 shrink-0 text-muted" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex min-h-11 w-full bg-transparent py-2.5 text-base outline-none",
          "placeholder:text-muted/70 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[min(16rem,50vh)] overflow-y-auto overscroll-contain p-1.5",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm text-muted"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn("overflow-hidden", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "flex min-h-11 cursor-pointer select-none items-center gap-3",
        "rounded-[12px] px-3 py-2.5 text-start leading-6 outline-none",
        "transition-colors duration-[var(--duration-tap)]",
        "data-[selected=true]:bg-verdant-pale data-[selected=true]:text-charcoal",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem };
