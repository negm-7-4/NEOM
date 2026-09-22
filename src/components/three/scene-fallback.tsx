/**
 * Pure-CSS stand-in for the 3D glass frame.
 *
 * Rendered whenever WebGL is unavailable, the device reports limited
 * resources, or the canvas chunk has not loaded yet. It occupies exactly the
 * same box as the canvas, so the headline above it never reflows when the real
 * scene arrives — and the hero is fully readable with JavaScript disabled.
 */
export function SceneFallback() {
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center">
      {/*
        Sized to the stage, not to a fixed aspect ratio. With `aspect-[16/10]`
        the box could compute taller than the stage that contains it — the
        stage's height comes from fluid MBA type — and the overflow painted
        over the headline line above it, blurring real text through its
        backdrop-filter. Filling the stage and capping the width keeps the
        frame around the lettering instead of on top of its neighbours.
      */}
      <div className="relative h-full max-h-[min(100%,380px)] w-[min(92%,620px)]">
        {/* Back plate */}
        <div className="absolute inset-[14%] rounded-[36px] border border-white/45 bg-gradient-to-br from-white/35 to-cream/20 backdrop-blur-[6px]" />
        {/* Mid plate, offset to suggest depth */}
        <div className="absolute inset-[9%] translate-x-[1.5%] -translate-y-[2%] rounded-[40px] border border-white/55 bg-white/18 backdrop-blur-[3px]" />
        {/* Frame */}
        <div
          className="absolute inset-0 rounded-[48px] border-[10px] border-white/55 bg-transparent"
          style={{
            boxShadow:
              "inset 0 2px 0 rgba(255,255,255,0.85), inset 0 -2px 0 rgba(198,174,134,0.5), 0 30px 60px -30px rgba(28,33,30,0.5)",
          }}
        />
        {/* Specular sweep across the top-left edge */}
        <div
          className="absolute inset-0 rounded-[48px] opacity-70"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 68%, rgba(255,255,255,0.35) 100%)",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "10px",
          }}
        />
      </div>
    </div>
  );
}
