"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeftIcon } from "lucide-react";

import { MbaStage } from "@/components/three/mba-stage";
import { Wordmark } from "@/components/site/wordmark";
import { Button } from "@/components/ui/button";
import { hero, org } from "@/content/site";

/**
 * Hero: brand capsule → headline → MBA focal point → intro → CTA.
 *
 * Arabic animation rule applied throughout: text is animated per *line* — a
 * whole element containing a complete Arabic clause — never per character.
 * Splitting Arabic into per-letter spans breaks the cursive joining and the
 * bidi run, and the word visually falls apart into isolated letterforms. Every
 * staggered element below is a full line or a full block.
 *
 * The stagger is expressed as an explicit per-element `delay` rather than
 * parent/child variant orchestration. Motion v13 removed the `staggerChildren`
 * / `delayChildren` transition props, and a parent variant carrying only those
 * keys silently animates nothing — leaving the whole hero stuck at its
 * `initial` opacity of 0. Explicit delays are version-proof, and the sequence
 * is readable in one place instead of being split across a variant map.
 */

/** 180–250ms is the interaction band; section entrances get 450–700ms. */
const ENTER_DURATION = 0.62;
const STEP = 0.09;
const LEAD_IN = 0.06;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();

  /** Entrance props for the nth line of the hero. */
  const enter = React.useCallback(
    (index: number) =>
      reduced
        ? { initial: false as const }
        : {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: {
              duration: ENTER_DURATION,
              delay: LEAD_IN + index * STEP,
              ease: EASE,
            },
          },
    [reduced],
  );

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-[var(--space-8)] pb-[var(--space-10)] sm:pt-[var(--space-12)] sm:pb-[var(--space-12)]"
    >
      <div className="content-shell">
        <div className="flex flex-col items-center gap-[var(--space-3)] text-center">
          {/* Brand capsule ------------------------------------------------ */}
          <motion.div {...enter(0)}>
            <div className="glass glass-card glass-rim inline-flex max-w-full items-center gap-3 rounded-[var(--radius-capsule)] px-4 py-2 sm:px-6 sm:py-2.5">
              <Wordmark className="text-sm text-charcoal sm:text-base" />
              <span aria-hidden className="h-4 w-px shrink-0 bg-sand-deep/60" />
              <span className="min-w-0 truncate text-[0.8rem] font-medium text-charcoal/80 sm:text-sm">
                {org.capsule}
              </span>
            </div>
          </motion.div>

          {/* Headline ------------------------------------------------------ */}
          <h1
            id="hero-heading"
            className="flex flex-col items-center gap-1 text-balance text-[clamp(1.85rem,6.2vw,3.5rem)] font-bold leading-[1.28] text-charcoal"
          >
            {hero.headlineLines.map((text, index) => (
              <motion.span key={text} {...enter(1 + index)} className="block">
                {text}
              </motion.span>
            ))}

            {/* MBA focal point, with the 3D glass frame behind it. The text
                itself stays real HTML inside the heading — selectable and part
                of the accessible name of the page's h1. */}
            <motion.span
              {...enter(1 + hero.headlineLines.length)}
              className="block w-full pt-2 sm:pt-4"
            >
              <MbaStage>
                <span
                  data-ltr
                  className="block bg-gradient-to-b from-charcoal via-charcoal-soft to-charcoal bg-clip-text py-4 text-[clamp(4.2rem,20vw,11rem)] font-bold leading-[0.92] tracking-[0.04em] text-transparent sm:py-8"
                  style={{
                    // A faint engraved edge: light above, shadow below. Applied
                    // as a filter so it follows the gradient-filled glyphs.
                    filter:
                      "drop-shadow(0 1px 0 rgba(255,255,255,0.85)) drop-shadow(0 12px 28px rgba(28,33,30,0.22))",
                  }}
                >
                  {hero.focal}
                </span>
              </MbaStage>
            </motion.span>
          </h1>

          {/* Intro + supporting copy --------------------------------------- */}
          <motion.p
            {...enter(2 + hero.headlineLines.length)}
            className="max-w-[62ch] text-pretty text-base leading-8 text-charcoal/85 sm:text-lg sm:leading-9"
          >
            {hero.intro}
          </motion.p>

          <motion.p
            {...enter(3 + hero.headlineLines.length)}
            className="max-w-[58ch] text-pretty text-[0.95rem] leading-7 text-muted sm:text-base sm:leading-8"
          >
            {hero.supporting}
          </motion.p>

          {/* CTA ------------------------------------------------------------ */}
          <motion.div
            {...enter(4 + hero.headlineLines.length)}
            className="pt-[var(--space-1)]"
          >
            <Button asChild size="lg" className="group">
              <a href={`#${hero.ctaTargetId}`}>
                {hero.cta}
                <ArrowLeftIcon
                  aria-hidden
                  className="size-5 transition-transform duration-[var(--duration-interact)] motion-safe:group-hover:-translate-x-1"
                />
              </a>
            </Button>
          </motion.div>

          <motion.p
            {...enter(5 + hero.headlineLines.length)}
            className="text-sm font-medium tracking-wide text-verdant"
          >
            {org.tagline}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
