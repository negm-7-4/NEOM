import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't scaffold AGENTS.md/CLAUDE.md into the repo — this project documents
  // itself in README.md and SOURCES.md.
  agentRules: false,
  poweredByHeader: false,
  // three.js ships untranspiled ESM in places; keeping it in the server-side
  // external list would break the RSC boundary for the lazily loaded scene.
  transpilePackages: ["three"],
  // Next 16 dropped the `eslint` config key and the `next lint` command —
  // linting is a standalone `eslint` run (see package.json scripts).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // The registration endpoint must never be cached by a CDN or proxy.
        source: "/api/register",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
