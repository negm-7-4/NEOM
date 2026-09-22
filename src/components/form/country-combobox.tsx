"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { countries, findCountry, matchesCountry, type Country } from "@/lib/countries";
import { cn } from "@/lib/utils";

/**
 * Searchable country picker, shared by the nationality field and both phone
 * country selectors.
 *
 * Two modes:
 *  - `name`  — full-width trigger showing the Arabic country name
 *  - `dial`  — compact trigger showing the flag and the +dial code, sized to
 *              sit inside the phone input group
 *
 * Filtering is done here (not by cmdk) so an Arabic query matches regardless
 * of alef/ya/ta-marbuta spelling and so the English name, ISO code and dial
 * code are searchable too — an Egyptian applicant can type "20", "Egypt" or
 * "مصر" and land on the same row.
 */

interface CountryComboboxProps {
  value: string;
  onChange: (code: string) => void;
  mode?: "name" | "dial";
  id?: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
  ariaLabel?: string;
  describedBy?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CountryCombobox({
  value,
  onChange,
  mode = "name",
  id,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  ariaLabel,
  describedBy,
  invalid = false,
  disabled = false,
  className,
}: CountryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const selected = findCountry(value);

  const results = React.useMemo<readonly Country[]>(() => {
    if (!query.trim()) return countries;
    return countries.filter((country) => matchesCountry(country, query));
  }, [query]);

  // Reset the query as the list closes, so reopening starts from the full list
  // rather than the previous search. Done in the open/close handler rather than
  // an effect: this is a consequence of an event, not a synchronisation.
  const handleOpenChange = React.useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  }, []);

  const handleSelect = React.useCallback(
    (code: string) => {
      onChange(code);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        className={cn(
          "flex min-h-11 items-center gap-2 rounded-[var(--radius-input)]",
          "border border-sand-deep/55 bg-ivory/85 px-3.5 py-2.5 text-start text-charcoal",
          "shadow-[inset_0_1px_2px_rgba(28,33,30,0.05)]",
          "transition-[border-color,box-shadow,background-color] duration-[var(--duration-interact)] ease-[var(--ease-out-soft)]",
          "hover:border-sand-deep/80",
          "focus-visible:outline-none focus-visible:border-verdant",
          "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-verdant)_18%,transparent)]",
          "aria-invalid:border-danger aria-invalid:bg-danger-pale/40",
          "disabled:cursor-not-allowed disabled:opacity-60",
          mode === "name" ? "w-full justify-between" : "w-auto shrink-0 justify-center",
          className,
        )}
      >
        {mode === "name" ? (
          <>
            <span className={cn("truncate", !selected && "text-muted/75")}>
              {selected ? (
                <>
                  <span aria-hidden className="me-2">
                    {selected.flag}
                  </span>
                  {selected.nameAr}
                </>
              ) : (
                placeholder
              )}
            </span>
            <ChevronDownIcon aria-hidden className="size-4 shrink-0 text-muted" />
          </>
        ) : (
          <>
            <span aria-hidden className="text-lg leading-none">
              {selected?.flag ?? "🌐"}
            </span>
            <span data-ltr className="text-sm font-semibold tabular-nums">
              {selected ? `+${selected.callingCode}` : "+"}
            </span>
            <ChevronDownIcon aria-hidden className="size-3.5 shrink-0 text-muted" />
          </>
        )}
      </PopoverTrigger>

      <PopoverContent
        className={cn("p-0", mode === "dial" && "w-[min(20rem,calc(100vw-2rem))]")}
        align="start"
      >
        <Command>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={searchPlaceholder}
            /* Latin keyboard hint helps for "20"/"Egypt"; Arabic still works. */
            autoComplete="off"
          />
          <CommandList>
            {results.length === 0 ? (
              <CommandEmpty>{emptyLabel}</CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.code}
                    onSelect={handleSelect}
                  >
                    <span aria-hidden className="text-lg leading-none">
                      {country.flag}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{country.nameAr}</span>
                    <span data-ltr className="shrink-0 text-sm tabular-nums text-muted">
                      +{country.callingCode}
                    </span>
                    {country.code === value ? (
                      <CheckIcon aria-hidden className="size-4 shrink-0 text-verdant" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
