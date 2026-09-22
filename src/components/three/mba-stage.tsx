"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";

import { SceneFallback } from "@/components/three/scene-fallback";
import { useIsPaused, useSceneCapability } from "@/hooks/use-scene-capability";

/**
 * Hosts the 3D glass accent behind the MBA lettering.
 *
 * `ssr: false` plus a dynamic import means three.js, R3F and drei land in
 * their own chunk that is requested only after the capability check passes —
 * they are never part of the bundle the registration form needs, so the form
 * is interactive whether or not the scene ever loads.
 *
 * The children (the actual MBA text) are rendered above the canvas as ordinary
 * HTML: selectable, searchable, translatable, and readable by a screen reader.
 */
const GlassFrameScene = dynamic(() => import("@/components/three/glass-frame-scene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

export function MbaStage({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const capability = useSceneCapability();
  const paused = useIsPaused(containerRef);
  const reduced = useReducedMotion();

  const showCanvas = capability.status === "ready";

  return (
    <div ref={containerRef} className="relative isolate w-full">
      {/* Scene layer — decorative, never in the accessibility tree. */}
      <div
        aria-hidden
        /* `overflow-hidden` is the guard: whatever the scene layer renders —
           canvas or CSS fallback — is clipped to the stage. The stage grows
           sideways and downward but never upward: a negative top margin here
           reaches into the headline line above, and the fallback's
           backdrop-filter then blurs real text through it. */
        className="pointer-events-none absolute inset-0 -z-10 -mx-6 -mb-6 overflow-hidden sm:-mx-10 sm:-mb-10"
      >
        {showCanvas ? (
          <GlassFrameScene
            still={Boolean(reduced)}
            quality={capability.quality}
            paused={paused}
          />
        ) : (
          <SceneFallback />
        )}
      </div>

      {children}
    </div>
  );
}
