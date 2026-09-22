"use client";

import * as React from "react";

/**
 * Decides whether this device should get the WebGL scene at all, and at what
 * quality.
 *
 * Both hooks below read from browser APIs — the GPU, the network information
 * API, `document.hidden` — which is exactly what `useSyncExternalStore` is
 * for. Using it instead of `useEffect` + `setState` means the value is correct
 * on the very first client render rather than one cascading re-render later,
 * and it gives the server render an explicit snapshot ("checking") instead of
 * a hydration mismatch.
 */

export type SceneCapability =
  | { status: "checking" }
  | { status: "unsupported" }
  | { status: "ready"; quality: "high" | "low" };

const CHECKING: SceneCapability = { status: "checking" };
const UNSUPPORTED: SceneCapability = { status: "unsupported" };

/**
 * Computed once per page load and cached: none of these inputs change while
 * the tab is open, and probing for a WebGL context is not free.
 */
let cached: SceneCapability | undefined;

function detect(): SceneCapability {
  // 1. Is WebGL actually available? The element existing proves nothing —
  //    hardware acceleration can be off, or the context can be blocked.
  let supported = false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    supported = Boolean(gl);
    // Release the probe context immediately — browsers cap live WebGL contexts
    // per page, and this one is not the scene's.
    if (gl && "getExtension" in gl) {
      (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    supported = false;
  }

  if (!supported) return UNSUPPORTED;

  // 2. Would rendering it be unkind to this device? A transmission material is
  //    a full extra render pass per frame — a real cost on a low-core phone,
  //    and simply rude on a metered connection.
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (connection?.saveData) return UNSUPPORTED;
  if (memory !== undefined && memory <= 2) return UNSUPPORTED;
  if (cores <= 2) return UNSUPPORTED;

  const lowPower =
    cores <= 4 ||
    (memory !== undefined && memory <= 4) ||
    /2g|3g/.test(connection?.effectiveType ?? "");

  return { status: "ready", quality: lowPower ? "low" : "high" };
}

/** Capability never changes during a session, so nothing ever notifies. */
const noopSubscribe = () => () => {};

function capabilitySnapshot(): SceneCapability {
  cached ??= detect();
  return cached;
}

export function useSceneCapability(): SceneCapability {
  return React.useSyncExternalStore(
    noopSubscribe,
    capabilitySnapshot,
    () => CHECKING,
  );
}

/* ------------------------------------------------------------ visibility -- */

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function visibilitySnapshot() {
  return document.hidden;
}

function useDocumentHidden(): boolean {
  return React.useSyncExternalStore(
    subscribeVisibility,
    visibilitySnapshot,
    () => false,
  );
}

/**
 * True while the element is off-screen or the tab is in the background.
 *
 * Both conditions matter. `IntersectionObserver` alone keeps the canvas
 * rendering when the user switches tabs with the hero still in view — the
 * single most common way a decorative scene quietly drains a laptop battery.
 */
export function useIsPaused(ref: React.RefObject<Element | null>): boolean {
  const [offscreen, setOffscreen] = React.useState(false);
  const hidden = useDocumentHidden();

  React.useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    // setState here runs from the observer callback, not synchronously in the
    // effect body — this is a subscription, which is what effects are for.
    const observer = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry?.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return offscreen || hidden;
}
