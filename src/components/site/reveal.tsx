"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Scroll-triggered entrance for a section, card or list item.
 *
 * `whileInView` with `once: true` rather than a scroll-linked transform: the
 * element animates in as it arrives and then stays put, which is what makes
 * long-form content readable. Nothing here touches scroll position, so native
 * scrolling and the browser's own anchor behaviour are untouched.
 *
 * `as` exists so a revealed list item is a real `<li>`. Wrapping list items in
 * an animated `<div>` would silently break the `ul > li` relationship that
 * screen readers use to announce "list, 8 items".
 *
 * Durations sit in the 450–700ms section-entrance band; `prefers-reduced-motion`
 * collapses the animation and renders the final state immediately.
 */

type RevealTag = "div" | "li" | "section";

const MOTION_TAG = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
} as const;

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: RevealTag;
}) {
  const reduced = useReducedMotion();
  const Motion = MOTION_TAG[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      /*
        `amount` is deliberately tiny. It is the fraction of THIS element that
        must be in view — and the registration panel is ~2,500px tall, so a
        25% threshold means 625px of it has to be visible at once. On a 360px
        phone that never happens while scrolling past it, and the whole
        section stays at opacity 0. A small threshold fires as the panel's top
        edge arrives, which is what a section entrance should do anyway.
      */
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion>
  );
}
