"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * The Riyadh backdrop: sky, distant skyline, mid-ground architecture and palm
 * foliage, drawn as four independent SVG layers.
 *
 * Why vector rather than a photograph: the composition needs to crop hard for
 * a 360px portrait screen and hold up behind translucent glass at any width,
 * and every layer has to move at its own parallax rate. A single raster image
 * gives none of that, costs 300–800 KB, and drags a stock licence along with
 * it. These paths are original to this project, weigh a few KB inline, stay
 * sharp on any display, and re-tint with the palette tokens.
 *
 * Each layer sets `preserveAspectRatio="xMidYMax slice"` so the horizon stays
 * pinned to the bottom and the sides crop first — which is exactly the right
 * behaviour when the viewport turns portrait.
 */

interface LayerProps {
  className?: string;
}

/* ------------------------------------------------------------------ sky -- */

function SkyLayer({ className }: LayerProps) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="neom-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8c2d2" />
          <stop offset="26%" stopColor="#cdd9dc" />
          <stop offset="52%" stopColor="#e8dfcf" />
          <stop offset="76%" stopColor="#f0dcbc" />
          <stop offset="100%" stopColor="#e8cca0" />
        </linearGradient>
        <radialGradient id="neom-sun" cx="0.72" cy="0.66" r="0.52">
          <stop offset="0%" stopColor="#fff3d4" stopOpacity="1" />
          <stop offset="28%" stopColor="#ffe6b4" stopOpacity="0.72" />
          <stop offset="62%" stopColor="#f6d9a4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f6d9a4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="neom-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e8cf" stopOpacity="0" />
          <stop offset="100%" stopColor="#f6e8cf" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#neom-sky)" />
      <rect width="1440" height="900" fill="url(#neom-sun)" />

      {/* Thin high cloud bands — kept very low contrast so they never compete
          with the headline that sits on top of them. */}
      <g fill="#ffffff" opacity="0.62">
        <ellipse cx="300" cy="190" rx="240" ry="16" />
        <ellipse cx="420" cy="232" rx="170" ry="11" />
        <ellipse cx="1080" cy="150" rx="210" ry="14" />
        <ellipse cx="980" cy="196" rx="130" ry="9" />
      </g>

      <rect y="520" width="1440" height="380" fill="url(#neom-haze)" />
    </svg>
  );
}

/* -------------------------------------------------------- far skyline --- */

function SkylineLayer({ className }: LayerProps) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <g fill="#4a5a68" opacity="0.26">
        <rect x="40" y="610" width="54" height="290" />
        <rect x="104" y="648" width="38" height="252" />
        <rect x="152" y="592" width="66" height="308" />
        <rect x="232" y="660" width="44" height="240" />
        <rect x="292" y="624" width="58" height="276" />
        <rect x="366" y="672" width="40" height="228" />
        <rect x="1040" y="640" width="48" height="260" />
        <rect x="1100" y="598" width="62" height="302" />
        <rect x="1176" y="664" width="40" height="236" />
        <rect x="1228" y="620" width="56" height="280" />
        <rect x="1300" y="668" width="44" height="232" />
        <rect x="1356" y="632" width="60" height="268" />
      </g>
    </svg>
  );
}

/* --------------------------------------------------- mid architecture --- */

function ArchitectureLayer({ className }: LayerProps) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="neom-tower" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3f4c4a" />
          <stop offset="42%" stopColor="#5a6660" />
          <stop offset="72%" stopColor="#4a5550" />
          <stop offset="100%" stopColor="#333d39" />
        </linearGradient>
        <linearGradient id="neom-tower-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Stylised modern towers. These are original silhouettes in the idiom
          of contemporary Riyadh high-rise architecture — a tapered slab, a
          keyhole-arched tower, a stepped block — not tracings of any
          identifiable building. */}
      <g opacity="0.55">
        {/* Stepped block, left */}
        <path d="M150 900 V566 h34 V534 h72 v32 h34 V900 Z" fill="url(#neom-tower)" />
        <rect x="150" y="566" width="140" height="334" fill="url(#neom-tower-fade)" />

        {/* Tapered slab */}
        <path d="M330 900 V470 l24 -34 h56 l24 34 V900 Z" fill="url(#neom-tower)" />

        {/* Keyhole-arch tower — the signature silhouette of the composition */}
        <path
          d="M980 900 V430 h180 V900 Z M1032 900 V612 a38 38 0 0 1 76 0 V900 Z"
          fill="url(#neom-tower)"
          fillRule="evenodd"
        />
        <path d="M980 430 h180 v-22 h-180 Z" fill="#2b3531" />

        {/* Twin slender towers, right */}
        <path d="M1216 900 V506 h44 V900 Z" fill="url(#neom-tower)" />
        <path d="M1272 900 V548 h40 V900 Z" fill="url(#neom-tower)" />

        {/* Low podium tying the group to the ground plane */}
        <rect x="940" y="806" width="420" height="94" fill="#46524d" />
      </g>

      {/* Ground haze so the towers dissolve into the page rather than ending
          in a hard edge behind the glass panels. */}
      <rect
        y="706"
        width="1440"
        height="194"
        fill="#f2e3c8"
        opacity="0.42"
        style={{ filter: "blur(26px)" }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------- palms --- */

/** One palm, drawn once and instanced with different transforms. */
function Palm({ x, scale, opacity }: { x: number; scale: number; opacity: number }) {
  return (
    <g transform={`translate(${x} 900) scale(${scale}) translate(0 -360)`} opacity={opacity}>
      {/* Trunk — slightly curved, thicker at the base */}
      <path
        d="M-7 360 C -5 260 2 190 10 120 L 22 122 C 13 192 7 262 6 360 Z"
        fill="#2e3826"
      />
      {/* Frond crown: eight blades radiating from the head */}
      <g fill="#2e3826">
        <path d="M16 120 C -34 92 -70 96 -96 118 C -60 108 -32 110 14 128 Z" />
        <path d="M16 120 C -24 66 -56 46 -92 42 C -56 60 -30 84 12 126 Z" />
        <path d="M16 118 C 0 58 -12 26 -34 0 C -16 38 -4 72 10 122 Z" />
        <path d="M18 118 C 26 56 26 22 18 -14 C 12 28 10 70 12 120 Z" />
        <path d="M18 120 C 50 70 74 46 106 32 C 70 58 44 84 22 126 Z" />
        <path d="M18 122 C 58 100 92 96 124 104 C 86 106 52 114 20 130 Z" />
        <path d="M18 126 C 52 128 80 140 102 160 C 72 148 44 140 18 134 Z" />
        <path d="M14 126 C -20 130 -48 142 -70 162 C -42 148 -14 138 12 134 Z" />
      </g>
      {/* Date clusters */}
      <g fill="#3a4030" opacity="0.8">
        <ellipse cx="2" cy="140" rx="12" ry="7" />
        <ellipse cx="28" cy="146" rx="9" ry="6" />
      </g>
    </g>
  );
}

function FoliageLayer({ className }: LayerProps) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <Palm x={92} scale={1.2} opacity={0.66} />
      <Palm x={236} scale={0.84} opacity={0.46} />
      <Palm x={352} scale={0.62} opacity={0.3} />
      <Palm x={1348} scale={1.28} opacity={0.68} />
      <Palm x={1206} scale={0.9} opacity={0.46} />
      <Palm x={1090} scale={0.6} opacity={0.28} />
      <Palm x={690} scale={0.5} opacity={0.16} />
    </svg>
  );
}

/* ------------------------------------------------------------ backdrop --- */

/**
 * Composes the four layers with scroll parallax.
 *
 * Movement is intentionally small (8–64px over a full viewport of scroll) and
 * differs per layer, so depth reads as depth rather than as the page sliding
 * apart. `prefers-reduced-motion` pins every layer at rest.
 *
 * `position: fixed` keeps the scene behind the whole document without
 * hijacking the scroll — native scrolling throughout.
 */
export function Backdrop() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const sky = useTransform(scrollYProgress, [0, 1], ["0%", "4%"]);
  const skyline = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const architecture = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const foliage = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);

  const still = reduced ? "0%" : undefined;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cream"
    >
      <motion.div style={{ y: still ?? sky }} className="absolute inset-0">
        <SkyLayer className="absolute inset-0 size-full" />
      </motion.div>

      <motion.div style={{ y: still ?? skyline }} className="absolute inset-0">
        <SkylineLayer className="absolute inset-0 size-full" />
      </motion.div>

      <motion.div style={{ y: still ?? architecture }} className="absolute inset-0">
        <ArchitectureLayer className="absolute inset-0 size-full" />
      </motion.div>

      <motion.div style={{ y: still ?? foliage }} className="absolute inset-0">
        <FoliageLayer className="absolute inset-0 size-full" />
      </motion.div>

      {/* Readability scrim.
          Tuned so the architecture and palms stay legible as a scene while the
          panels below still clear 4.5:1 — the glass surfaces do most of the
          contrast work themselves, so the scrim only needs to lift the lower
          half where the form sits over the densest part of the skyline. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/5 via-cream/25 to-cream/75" />
    </div>
  );
}
