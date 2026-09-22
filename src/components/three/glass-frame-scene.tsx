"use client";

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * The 3D glass accent behind the MBA lettering.
 *
 * Geometry: a single extruded frame — one rounded-rectangle outline with a
 * rounded-rectangle hole — plus two cheap translucent plates for layered
 * depth. Building the frame from four separate bars would look identical and
 * cost four transmission render passes instead of one; `MeshTransmissionMaterial`
 * re-renders the scene per material, so mesh count is the performance budget
 * here, not triangle count.
 *
 * Lighting: `Environment` is driven by inline `Lightformer` children rather
 * than a preset. A preset downloads an HDRI from a third-party CDN at runtime —
 * an external dependency, an extra megabyte, and someone else's asset licence.
 * Four emissive planes give the same soft studio reflection locally.
 */

/**
 * The frame is sized from the canvas viewport rather than from fixed world
 * units, because the MBA lettering it wraps is fluid type
 * (`clamp(4.2rem, 20vw, 11rem)`). A fixed-size frame fits at exactly one
 * breakpoint and is either swallowed by the letters or floating far outside
 * them everywhere else.
 */
const FIT = {
  /** Fraction of the canvas the frame spans. */
  widthRatio: 0.82,
  heightRatio: 0.74,
  /** Border thickness and corner radius, as a fraction of the frame height. */
  thicknessRatio: 0.115,
  radiusRatio: 0.15,
  depth: 0.3,
};

/** Rounded-rectangle path appended to an existing THREE.Shape or Path. */
function roundedRect(
  target: THREE.Shape | THREE.Path,
  width: number,
  height: number,
  radius: number,
) {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  target.moveTo(x + r, y);
  target.lineTo(x + width - r, y);
  target.quadraticCurveTo(x + width, y, x + width, y + r);
  target.lineTo(x + width, y + height - r);
  target.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  target.lineTo(x + r, y + height);
  target.quadraticCurveTo(x, y + height, x, y + height - r);
  target.lineTo(x, y + r);
  target.quadraticCurveTo(x, y, x + r, y);
}

function useFrameGeometry(width: number, height: number) {
  return React.useMemo(() => {
    const thickness = height * FIT.thicknessRatio;
    const radius = height * FIT.radiusRatio;

    const shape = new THREE.Shape();
    roundedRect(shape, width, height, radius);

    const hole = new THREE.Path();
    roundedRect(
      hole,
      Math.max(0.1, width - thickness * 2),
      Math.max(0.1, height - thickness * 2),
      radius * 0.62,
    );
    shape.holes.push(hole);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: FIT.depth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.045,
      bevelSegments: 4,
      curveSegments: 20,
    });
    geometry.center();
    return geometry;
  }, [width, height]);
}

export interface SceneProps {
  /** Disables pointer tracking and the idle float. */
  still: boolean;
  /** Lower sample counts on constrained devices. */
  quality: "high" | "low";
  /**
   * True when the hero has scrolled out of view or the tab is hidden. The
   * canvas stays mounted (remounting would re-upload every buffer and flash)
   * but the render loop stops completely.
   */
  paused: boolean;
}

function GlassFrame({ still, quality }: Pick<SceneProps, "still" | "quality">) {
  const group = React.useRef<THREE.Group>(null);
  const { invalidate, viewport } = useThree();

  // Round to 0.1 world units so a scroll-driven resize does not rebuild the
  // extruded geometry on every frame.
  const fitWidth = Math.round(viewport.width * FIT.widthRatio * 10) / 10;
  const fitHeight = Math.round(viewport.height * FIT.heightRatio * 10) / 10;
  const geometry = useFrameGeometry(fitWidth, fitHeight);

  React.useEffect(() => () => geometry.dispose(), [geometry]);

  // Render one frame when the "still" mode changes so the reduced-motion
  // presentation is not a blank canvas.
  React.useEffect(() => {
    invalidate();
  }, [still, invalidate]);

  useFrame((threeState, delta) => {
    const node = group.current;
    if (!node || still) return;

    // Pointer shift, capped at roughly 3.5° on each axis. `pointer` is
    // normalised to [-1, 1] by R3F; the damping factor makes it feel like the
    // scene has weight rather than being nailed to the cursor.
    const targetY = threeState.pointer.x * 0.06;
    const targetX = -threeState.pointer.y * 0.05;
    const damp = Math.min(1, delta * 2.6);

    node.rotation.y += (targetY - node.rotation.y) * damp;
    node.rotation.x += (targetX - node.rotation.x) * damp;

    // Slow idle float so the glass reads as a physical object at rest.
    const t = threeState.clock.elapsedTime;
    node.position.y = Math.sin(t * 0.55) * 0.045;
    node.rotation.z = Math.sin(t * 0.38) * 0.012;
  });

  return (
    <group ref={group}>
      {/* Back plate — plain physical material, no second transmission pass. */}
      <mesh position={[0.12, -0.08, -0.55]} rotation={[0, -0.1, 0.03]}>
        <planeGeometry args={[fitWidth * 0.78, fitHeight * 0.74]} />
        <meshPhysicalMaterial
          color="#f7f1e6"
          transparent
          opacity={0.16}
          roughness={0.35}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mid plate */}
      <mesh position={[-0.16, 0.06, -0.28]} rotation={[0, 0.08, -0.02]}>
        <planeGeometry args={[fitWidth * 0.87, fitHeight * 0.83]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={0.18}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* The glass frame itself */}
      <mesh key={`${fitWidth}x${fitHeight}`} geometry={geometry} castShadow={false} receiveShadow={false}>
        <MeshTransmissionMaterial
          /* Sample/resolution are the two knobs that actually cost frames. */
          samples={quality === "high" ? 4 : 2}
          resolution={quality === "high" ? 256 : 128}
          transmission={1}
          thickness={0.55}
          roughness={0.06}
          ior={1.45}
          chromaticAberration={0.035}
          anisotropy={0.1}
          distortion={0.12}
          distortionScale={0.25}
          temporalDistortion={0}
          clearcoat={1}
          clearcoatRoughness={0.06}
          attenuationDistance={2.4}
          attenuationColor="#f2e7d5"
          color="#ffffff"
          background={new THREE.Color("#f3ebdd")}
        />
      </mesh>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#fff6e6" />
      <directionalLight position={[-4, -1, 2]} intensity={0.35} color="#d8e4dd" />

      <Environment resolution={128}>
        {/* Key */}
        <Lightformer
          form="rect"
          intensity={2.6}
          position={[2.6, 2.4, 3]}
          scale={[6, 4, 1]}
          color="#ffffff"
        />
        {/* Warm fill from the sun side of the backdrop */}
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[-3.4, 1.2, 2]}
          scale={[5, 3, 1]}
          color="#ffeccd"
        />
        {/* Cool bounce from the sky */}
        <Lightformer
          form="rect"
          intensity={0.9}
          position={[0, 4.2, -2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 4, 1]}
          color="#dfe9ee"
        />
        {/* Ground bounce keeps the lower edge from going dead */}
        <Lightformer
          form="rect"
          intensity={0.7}
          position={[0, -3.4, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[8, 4, 1]}
          color="#e6d8bd"
        />
      </Environment>
    </>
  );
}

export default function GlassFrameScene({ still, quality, paused }: SceneProps) {
  // never  — offscreen or backgrounded: no work at all
  // demand — reduced motion: render once, then sleep
  // always — visible and animating
  const frameloop = paused ? "never" : still ? "demand" : "always";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={quality === "high" ? [1, 1.75] : 1}
      gl={{
        antialias: quality === "high",
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      style={{ pointerEvents: "none" }}
    >
      <Lighting />
      <GlassFrame still={still} quality={quality} />
    </Canvas>
  );
}
