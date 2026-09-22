# NEOM — Arabic RTL landing page and MBA registration form

> مركز نيوم للتدريب والتعليم المعتمد وتنمية الموارد البشرية
> **NEOM .. معك .. للارتقاء**

A single-page, right-to-left Arabic site for the centre's MBA programme: a glass
hero over a layered Riyadh scene, a benefits panel, and a four-section
registration form whose submissions are emailed to the centre.

Built with Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui + Radix · React Hook Form + Zod · Motion · React Three Fiber + Drei ·
Resend + React Email · libphonenumber-js.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in the three email variables
npm run dev                    # http://localhost:3000
```

The page renders and the form validates without any configuration. **Sending
does not.** With the email variables unset, `POST /api/register` returns
`503` with an Arabic message telling you exactly which variables are missing —
it never reports a send that did not happen.

To check your configuration without filling in the form (development only):

```bash
curl http://localhost:3000/api/register
# {"mailConfigured": true|false, "hint": "..."}
```

### Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config) |
| `npm run verify` | typecheck → lint → build |

---

## Deploy in one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnegm-7-4%2FNEOM%2Ftree%2Fclaude%2Fneom-arabic-rtl-landing-x7htqv&project-name=neom-registration&repository-name=neom-registration&env=RESEND_API_KEY,OWNER_EMAIL,EMAIL_FROM&envDescription=Resend%20API%20key%2C%20the%20inbox%20that%20receives%20registrations%2C%20and%20a%20sender%20on%20a%20verified%20domain&envLink=https%3A%2F%2Fgithub.com%2Fnegm-7-4%2FNEOM%2Fblob%2Fclaude%2Fneom-arabic-rtl-landing-x7htqv%2FREADME.md%23email-configuration)

The button clones this branch into your own Vercel account and prompts for the
three email variables before the first build. Nothing else needs configuring —
the `/api/register` route declares its own Node runtime.

Prefer the terminal? From the repository root:

```bash
npx vercel --prod
```

Then add `RESEND_API_KEY`, `OWNER_EMAIL` and `EMAIL_FROM` under
**Settings → Environment Variables** and redeploy.

Either way, read **Email configuration** below first: Resend will not send from
an unverified domain, so the sending domain has to be verified before a single
registration can go out.

---

## Email configuration

### 1. Verify a sending domain in Resend

Resend will not send from an unverified domain, so this step is not optional.

1. Sign in at <https://resend.com> → **Domains** → **Add Domain**.
2. Enter the domain you will send *from* (e.g. `your-domain.com`). This is the
   domain in `EMAIL_FROM`, not where the mail is delivered.
3. Add the DNS records Resend shows you at your DNS host:
   - an **MX** record and a **TXT** (SPF) record on the `send` subdomain,
   - a **TXT** (DKIM) record on `resend._domainkey`,
   - optionally a **TXT** (DMARC) record on `_dmarc`.
4. Wait for propagation and press **Verify**. The domain must read **Verified**.
5. **API Keys** → **Create API Key**. *Sending access* is sufficient — this app
   only sends.

### 2. Set the server environment

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OWNER_EMAIL=registrations@your-domain.com
EMAIL_FROM=NEOM Registration <no-reply@your-domain.com>
```

- `OWNER_EMAIL` is where registrations are delivered. It is configured **here
  and only here** — it is never read from the submitted form, and never
  inferred from any address embedded in the source form content.
- `EMAIL_FROM` must use the domain you verified above. The display-name form
  (`Name <user@domain>`) is supported.
- None of these are `NEXT_PUBLIC_`, so none reach the browser.

Restart the server after editing `.env.local` — Next.js reads environment
variables at boot.

### What the owner receives

An Arabic RTL email containing the submission reference, the submission time in
`Asia/Riyadh` plus an ISO timestamp, every submitted field grouped by the
form's own four sections, the chosen specialization and study system, the
applicant's contact details, a `wa.me` link built from the validated WhatsApp
number, and a plain-text alternative.

- **Subject:** `طلب تسجيل NEOM — {applicant name} — {specialization}`
- **From:** always your configured sender.
- **Reply-To:** the applicant's email, but only when they supplied one and it
  passed validation. Replying in the mail client reaches the applicant directly.

---

## Optional: shared rate-limit and duplicate-submission store

Without configuration, the rate limiter and the duplicate-submission guard use
an **in-process store**. That is correct for a single long-lived Node server
(`npm start`, a container, a VPS).

**It is not correct on serverless.** On Vercel, Netlify or Cloudflare, every
cold start gets a fresh process and concurrent requests land on different
instances, so per-instance counters stop enforcing anything under real traffic.
If you deploy serverless and expect meaningful volume, set:

```bash
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxx
RATE_LIMIT_SALT=any-random-string
```

Create a free database at <https://console.upstash.com/redis>. The app talks to
the REST API with `fetch` — no extra npm dependency.

Resend's own `idempotencyKey` header is sent on every request regardless, so
duplicate protection degrades rather than disappearing.

---

## Deployment

### Vercel

1. Push the repository and import it at <https://vercel.com/new>.
2. **Settings → Environment Variables**: add `RESEND_API_KEY`, `OWNER_EMAIL`,
   `EMAIL_FROM` (and the Upstash pair — see above; on Vercel this matters).
3. Deploy. No build configuration is needed; `/api/register` runs on the Node
   runtime, which it declares itself.

### Any Node host

```bash
npm ci && npm run build && npm start   # listens on $PORT, default 3000
```

Node 20.9+ is required.

### Before going live

- Point `OWNER_EMAIL` at a monitored inbox and send yourself one real test.
- Put a WAF or bot filter in front of the endpoint for a public ad campaign.
  The built-in limiter keys on proxy headers, which are only trustworthy behind
  a proxy that sets them — it is defence in depth, not authentication.
- Review `src/content/site.ts` with the client. It carries the accreditation,
  refund, Apostille and shipping statements verbatim.

---

## Editing the content

**`src/content/site.ts` is the single source of truth** for every string and
option on the site: organisation details, hero copy, the eight benefits and
their explanations, all six specializations, both study systems, the ad-source
list, every field label and helper line, and the confirmation wording.

The Zod schema derives its select allowlists from the same file, so the values
the server accepts cannot drift from the options the applicant was shown.
Adding a specialization is a one-line edit there and nowhere else.

The file opens with a content policy: the accreditation, refund, Apostille and
shipping statements are client-supplied and reproduced verbatim. Do not add
claims of verification, ranking, recognition or affiliation that the client did
not supply.

---

## How it is put together

```
src/
├─ app/
│  ├─ layout.tsx              dir="rtl" lang="ar", font, skip link
│  ├─ page.tsx                server component: backdrop → hero → benefits → form → footer
│  ├─ globals.css             Tailwind v4 @theme: palette, 8px scale, radii, glass utilities
│  └─ api/register/route.ts   validate → rate limit → idempotency → send
├─ content/site.ts            ALL copy and options
├─ lib/
│  ├─ schema.ts               one Zod schema, client and server
│  ├─ countries.ts            245 countries, Arabic names (generated)
│  ├─ digits.ts               Arabic-Indic → ASCII digits
│  ├─ store.ts                KV abstraction (memory | Upstash)
│  ├─ rate-limit.ts           two-tier limiter on hashed client address
│  ├─ idempotency.ts          claim → send → commit
│  ├─ submission.ts           email view model, shared by HTML and text
│  └─ mailer.ts               Resend; config errors are never silent
├─ emails/registration-email.tsx   Arabic RTL template
└─ components/
   ├─ ui/                     shadcn/ui primitives, RTL-adapted
   ├─ form/                   the registration form
   ├─ site/                   backdrop, hero, benefits, footer, wordmark
   └─ three/                  R3F glass scene + CSS fallback
```

### Decisions worth knowing

**One schema, both sides.** `src/lib/schema.ts` is imported by the form and by
the route handler. A crafted POST is held to exactly the rules the UI enforces,
including the select allowlists and both phone numbers.

**The glass is layered, not a tint.** The `glass` utility stacks a two-stop
gradient, a blur-plus-saturation backdrop filter, a hairline edge, an inset top
highlight and bottom shade, and a cast shadow. `--glass-alpha` lets each
surface set only its opacity — the form panel is more opaque than the
decorative cards, so field text stays readable over the moving scene.

**The 3D scene is optional by construction.** three.js, R3F and drei load in a
separate chunk, after a capability check, and never block the form. No WebGL, a
low-core device, or Save-Data on → the CSS fallback renders instead. The canvas
stops rendering entirely when the hero scrolls away or the tab is hidden.

**Arabic is animated per line, never per character.** Splitting Arabic into
per-letter spans breaks the cursive joining and the bidi run — the word falls
apart into isolated letterforms. Every staggered element is a complete clause.

**Phone and email values are LTR inside RTL labels.** Both are bidi-isolated.
Without that, a correct number renders with its digits visually reordered and
people "fix" what was already right.

**Nothing about the applicant is stored or logged.** No browser storage, no
analytics. The server logs only the submission reference and an error class —
never a name, phone number, address or email.

---

## Verification

`.verify/` holds the scripts used to check this build. They are development
tools, not part of the app.

| Script | Checks |
| --- | --- |
| `.verify/shots.mjs` | Renders at 360/390/768/1280/1440; horizontal overflow, `dir=rtl`, nothing stuck at zero opacity, reduced-motion, no-JS, WebGL-disabled |
| `.verify/interaction.mjs` | Progress meter, focus-first-invalid-field, `role="alert"`, conditional field, Arabic-Indic digits, WhatsApp mirroring, keyboard-only selects, Arabic country search, 44px tap targets |
| `.verify/submit-flow.mjs` | Fills and submits the whole form; pending state, confirmation, reference format, empty browser storage |
| `.verify/mock-resend.mjs` | Stands in for the Resend API (`RESEND_BASE_URL`) so the accepted-send path can be exercised without credentials |
| `.verify/emit-countries.mjs` | Regenerates `src/lib/countries.ts` |

```bash
npm run verify                       # typecheck + lint + build
npm start &                          # then, against the running build:
node .verify/shots.mjs
node .verify/interaction.mjs
```

The Playwright scripts expect a Chromium path — edit `executablePath` for your
machine, or install `playwright` locally.

### Results on this build

Typecheck, lint and production build pass. All visual, interaction and
submit-flow checks pass. Against a **mock** Resend endpoint the accepted-send
path was verified end to end: correct subject, `From`/`To`/`Reply-To`,
`Idempotency-Key`, E.164 normalisation of an Arabic-Indic WhatsApp number, both
HTML and plain-text parts, and applicant-supplied markup escaped (zero live
`<script>` or `<img>` tags in the output). Rate limiting (3/min), duplicate
protection (one email for two POSTs of the same key) and the retry path after a
provider failure were all confirmed against the real route handler.

**Not yet verified: delivery through the real Resend API.** No production
credentials were available in this environment. The implementation is complete;
it needs a verified sending domain and an API key before a genuine send can be
observed. Note also that "sent" in this app means the provider *accepted* the
request — that is what the confirmation wording claims, and no more.
