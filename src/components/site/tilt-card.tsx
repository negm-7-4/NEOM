"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Pointer-reactive tilt for decorative cards.
 *
 * Capped at 3° on each axis, per the brief. Anything more and glass panels
 * start to read as toys; at 3° it registers as the surface catching the light
 * rather than as the card moving.
 *
 * Applied only to decorative content. The registration panel never tilts —
 * a form that shifts while you are aiming at a select is hostile, and on touch
 * it fights the scroll.
 *
 * Touch devices are excluded: there is no hover state to lose, and reading a
 * pointer from a scroll gesture produces a card that lurches as the page moves.
 */
const MAX_TILT_DEGREES = 3;

export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 240, damping: 24, mass: 0.6 };
  const rotateX = useSpring(
    useTransform(py, [-0.5, 0.5], [MAX_TILT_DEGREES, -MAX_TILT_DEGREES]),
    spring,
  );
  const rotateY = useSpring(
    useTransform(px, [-0.5, 0.5], [-MAX_TILT_DEGREES, MAX_TILT_DEGREES]),
    spring,
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "mouse") return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      px.set((event.clientX - rect.left) / rect.width - 0.5);
      py.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [px, py],
  );

  const reset = React.useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
