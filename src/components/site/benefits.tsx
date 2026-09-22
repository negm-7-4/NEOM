"use client";

import {
  AwardIcon,
  BookOpenIcon,
  CreditCardIcon,
  GlobeIcon,
  PresentationIcon,
  StampIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import { TiltCard } from "@/components/site/tilt-card";
import { benefits, type BenefitIcon } from "@/content/site";

/**
 * The eight programme benefits: two columns on desktop, one on mobile.
 *
 * Icon choice lives in the content config as a string key and is resolved to a
 * component here. That keeps `content/site.ts` free of React imports, so a
 * non-developer can edit the copy — and reorder or re-label a benefit — without
 * ever opening a `.tsx` file.
 *
 * The copy is client-supplied. The `detail` lines describe; they do not add
 * refund eligibility rules, accreditation scope or guarantees that were not
 * provided.
 */
const ICONS: Record<BenefitIcon, LucideIcon> = {
  wallet: WalletIcon,
  stamp: StampIcon,
  globe: GlobeIcon,
  book: BookOpenIcon,
  presentation: PresentationIcon,
  users: UsersIcon,
  award: AwardIcon,
  "credit-card": CreditCardIcon,
};

export function Benefits() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="relative py-[var(--space-6)] sm:py-[var(--space-8)]"
    >
      <div className="content-shell">
        <Reveal>
          <div className="glass glass-panel glass-rim rounded-[var(--radius-panel)] p-[var(--space-3)] sm:p-[var(--space-5)] lg:p-[var(--space-6)]">
            <div className="flex flex-col gap-[var(--space-4)]">
              <div className="flex flex-col items-center gap-2 text-center">
                <h2
                  id="benefits-heading"
                  className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight text-charcoal"
                >
                  {benefits.heading}
                </h2>
                <span
                  aria-hidden
                  className="h-px w-20 bg-gradient-to-l from-transparent via-verdant/60 to-transparent"
                />
              </div>

              <ul className="grid grid-cols-1 gap-[var(--space-2)] md:grid-cols-2">
                {benefits.items.map((item, index) => {
                  const Icon = ICONS[item.icon];
                  return (
                    <Reveal
                      key={item.id}
                      as="li"
                      /* Staggered by position, capped so the last card is not
                         still waiting when the user has already scrolled past. */
                      delay={Math.min(index, 5) * 0.06}
                      y={16}
                      className="min-w-0"
                    >
                      <TiltCard className="h-full">
                        {/*
                          The icon sits on the inline-END of the pill (visually
                          left in RTL), matching the reference: the Arabic text
                          starts hard against the right edge where the eye
                          enters, and the icon closes the row.
                        */}
                        <div className="glass glass-card glass-rim flex h-full items-center justify-between gap-3.5 rounded-[var(--radius-card)] px-4 py-3.5 transition-[--glass-alpha] duration-[var(--duration-interact)] hover:[--glass-alpha:50] sm:gap-4 sm:px-5 sm:py-4">
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="text-pretty text-[1.02rem] font-semibold leading-7 text-charcoal">
                              {item.title}
                            </span>
                            <span className="text-pretty text-sm leading-6 text-muted">
                              {item.detail}
                            </span>
                          </span>
                          <span
                            aria-hidden
                            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-verdant/25 bg-verdant-pale/85 text-verdant shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                          >
                            <Icon className="size-5" />
                          </span>
                        </div>
                      </TiltCard>
                    </Reveal>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
