# Reused sources, patterns and assets

Every third-party pattern this project draws on, what was taken, and the
licence it came under. Nothing here is copied verbatim without adaptation —
each entry notes what changed for the Arabic RTL context.

---

## Component patterns

### shadcn/ui — MIT
<https://ui.shadcn.com/docs/components>

shadcn/ui is distributed as source you copy into your own project, not as a
runtime dependency, so these files are adaptations rather than imports. The
MIT licence does not require attribution in distributed binaries, but the
provenance is recorded here and in each file's header comment.

| File | Based on | What was changed |
| --- | --- | --- |
| `src/components/ui/button.tsx` | `button` | Added a `glass` variant; every size raised to clear a 44px touch target; press/hover timings pinned to the project's 180/220ms interaction band |
| `src/components/ui/input.tsx` | `input` | 16px font floor (prevents iOS focus-zoom, which breaks the RTL layout); `aria-invalid`-driven error styling; positive ring on a valid field |
| `src/components/ui/textarea.tsx` | `textarea` | Matched to the Input treatment; `field-sizing-content` |
| `src/components/ui/label.tsx` | `label` | Palette only |
| `src/components/ui/select.tsx` | `select` | `position="popper"` with `--radix-select-content-available-height` so the menu shrinks instead of clipping when the mobile keyboard opens; check indicator moved to the inline-end with logical properties instead of a mirrored class |
| `src/components/ui/radio-group.tsx` | `radio-group` | Added the `RadioCard` composite so the whole card is the tap target rather than the 20px dot |
| `src/components/ui/checkbox.tsx` | `checkbox` | Enlarged for touch; palette |
| `src/components/ui/popover.tsx` | `popover` | Viewport-bounded max height and collision padding for the 360px floor |
| `src/components/ui/command.tsx` | `command` | `shouldFilter={false}` — cmdk's scorer does not handle Arabic orthographic variants, so filtering is done by `matchesCountry()` instead |
| `src/components/form/registration-form.tsx` | `form` (React Hook Form + Zod integration) | Replaced shadcn's `FormField`/`FormItem` context stack with the leaner render-prop `Field` in `src/components/form/field.tsx`, which owns the label/`aria-describedby`/`role="alert"` wiring in one place |

Not taken from shadcn/ui:
- `src/components/ui/progress.tsx` is written from scratch. The only behaviour
  needed was the ARIA contract, so `@radix-ui/react-progress` would not have
  earned a dependency.

### Radix UI primitives — MIT
<https://www.radix-ui.com>

Used as runtime dependencies (`@radix-ui/react-select`, `-radio-group`,
`-checkbox`, `-label`, `-slot`, `-popover`). Radix supplies the roving-tabindex
keyboard behaviour, focus management and the hidden native form proxies that
make the custom controls submit like real inputs.

### cmdk — MIT
<https://github.com/pacocoursey/cmdk>

Backs the searchable country/nationality picker. Its built-in filter is
switched off in favour of Arabic-aware matching.

---

## Motion and 3D patterns

### Motion for React — MIT
<https://motion.dev/docs/react>

Patterns used: mount entrances (`initial`/`animate`), `whileInView` with
`once: true` for section reveals, `AnimatePresence` for the conditional field
and the submit-error banner, `useScroll` + `useTransform` for backdrop
parallax, `useMotionValue` + `useSpring` for card tilt, and `useReducedMotion`
throughout.

**Version note that cost real debugging time:** Motion v13 **removed** the
`staggerChildren` and `delayChildren` transition props. A parent variant
carrying only those keys silently animates nothing, so the hero stayed at
`opacity: 0` with no error. The hero therefore expresses its stagger as an
explicit per-element `delay` (`src/components/site/hero.tsx`), which is also
easier to read than a variant map.

### React Three Fiber and Drei — MIT
<https://r3f.docs.pmnd.rs/getting-started/examples> · <https://github.com/pmndrs/drei>

- `MeshTransmissionMaterial` (drei) provides the glass. Adapted: sample count
  and render resolution are tiered by device capability, because the material
  costs a full extra render pass **per material instance** — which is why the
  frame is one extruded mesh with a hole rather than four bars.
- `Environment` + `Lightformer` (drei) supply the reflections. Adapted: driven
  by four inline `Lightformer` planes instead of a `preset`. A preset fetches
  an HDRI from a third-party CDN at runtime — an external dependency, roughly a
  megabyte, and somebody else's asset licence. The inline version is local and
  licence-free.
- Frame geometry is built with `THREE.Shape` + `ExtrudeGeometry` and sized from
  `useThree().viewport`, because the MBA lettering it wraps is fluid type
  (`clamp(4.2rem, 20vw, 11rem)`) — a fixed-size frame fits at one breakpoint
  and nowhere else.

### three.js — MIT
<https://threejs.org>

### Aceternity UI and React Bits — reviewed, not copied
<https://ui.aceternity.com/components> · <https://reactbits.dev/>

Both were reviewed for the glass-card, perspective-tilt and section-reveal
patterns. **No code was taken from either.** Two reasons:

1. Their tilt implementations commonly use 10–25° of rotation. The brief caps
   tilt at 3°, and at that amplitude a spring on a normalised pointer offset is
   a handful of lines — `src/components/site/tilt-card.tsx` — so vendoring a
   component would have added surface area without saving work.
2. Their glass treatments are built for dark backgrounds, where a single
   translucent white fill reads as glass. Over a light cream scene it reads as
   dirty paper. The `glass` utility in `src/app/globals.css` instead layers a
   two-stop gradient, a blur-plus-saturation backdrop filter, a hairline edge, an
   inset top highlight and bottom shade, and a cast shadow — with a
   `--glass-alpha` custom property so the form panel can be more opaque than
   the decorative cards.

Recording them here as *reviewed and rejected* rather than omitting them: the
brief asked for these sources to be researched, and "we looked and did not use
it, for this reason" is the useful answer.

---

## Backend and validation

| Package | Licence | Use |
| --- | --- | --- |
| Next.js | MIT | App Router, route handler, `next/font` |
| React Hook Form | MIT | Form state |
| Zod | MIT | One schema shared by client and server |
| `@hookform/resolvers` | MIT | Bridges the two |
| libphonenumber-js | MIT | Phone validation, E.164 normalisation, `AsYouType` formatting |
| Resend (`resend`) | MIT | Email delivery; its native `idempotencyKey` request option is used alongside the app's own guard |
| React Email (`@react-email/components`) | MIT | Email template primitives |
| Lucide React | ISC | Icons |
| Tailwind CSS | MIT | Styling; v4 CSS-first `@theme` configuration |
| `tw-animate-css` | MIT | Tailwind v4 replacement for `tailwindcss-animate`, used by the shadcn enter/exit classes |
| `class-variance-authority`, `clsx`, `tailwind-merge` | MIT | Variant and class composition |
| `server-only` | MIT | Compile-time guard on modules that must never reach the client |

**Dependency note:** the `@react-email/*` packages currently carry an npm
deprecation notice ("Package no longer supported") applied across the whole
scope, including the latest published release. `@react-email/render` — the part
that actually renders the HTML and the plain-text alternative — is **not**
deprecated, and the project imports `render` from it. The components remain
functional and are the package the brief specified. If the scope is abandoned
upstream, the migration is small: the template is table-and-inline-style markup
already, so the `<Body>`/`<Container>`/`<Section>` wrappers can be replaced with
plain elements and `render` kept as-is.

---

## Assets

**All visual assets in this project are original to it.** Nothing is traced,
downloaded or derived from a third party.

- **Background scene** (`src/components/site/backdrop.tsx`) — sky, distant
  skyline, mid-ground architecture and palm foliage, hand-authored as four
  independent SVG layers.

  Vector rather than a photograph, deliberately: the composition has to crop
  hard for a 360px portrait screen, hold up behind translucent glass at any
  width, and move each layer at its own parallax rate. One raster image gives
  none of that, costs 300–800 KB, and carries a stock licence. The tower
  silhouettes are original forms in the idiom of contemporary Riyadh high-rise
  architecture — a stepped block, a tapered slab, a keyhole-arched tower — not
  tracings of any identifiable building.

- **NEOM wordmark** (`src/components/site/wordmark.tsx`) — wide-tracked
  capitals set in the site's own type family, beside an abstract
  three-rising-arches mark drawn for this project (for *الارتقاء*). No
  third-party logo, glyph or brand asset is reproduced anywhere.

- **Reference image** — the supplied screenshot was used only to read the
  composition and palette. It is not shipped, not used as a background, and
  none of its overlay chrome (watermark, download icon, black border, Google
  Forms account controls) appears in the build. The background scene is
  original and intentionally distinct from the photograph in that screenshot.

- **IBM Plex Sans Arabic** — SIL Open Font License 1.1, served via
  `next/font/google`. <https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic>

- **Country names** — ICU/CLDR data that ships with Node and every browser,
  read through `Intl.DisplayNames(["ar"], { type: "region" })` and generated
  into `src/lib/countries.ts`. CLDR is under the Unicode licence. Dial codes
  come from libphonenumber-js, so the picker can never offer a country the
  validator does not recognise.

---

## Content

The organisation name, tagline, headline, introduction, benefit list,
programme options and the accreditation, refund, Apostille and shipping
statements are **client-supplied copy**, reproduced as given in
`src/content/site.ts`.

No claim of verification, ranking, recognition or affiliation has been added.
The site states in its footer that it does not represent a government body or
the NEOM development project, and it makes no claim of affiliation with the
University of Oxford.
