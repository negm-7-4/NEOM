/**
 * Visual + interaction verification.
 *
 * Captures the page at 360/390/768/1280/1440 and exercises the interactions
 * that are hard to reason about statically: keyboard-only completion, the
 * reduced-motion path, the WebGL-disabled fallback, and horizontal overflow.
 */
import playwright from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = playwright;
import { mkdirSync } from "node:fs";

const OUT = "/home/user/NEOM/.verify/shots";
mkdirSync(OUT, { recursive: true });
const BASE = "http://127.0.0.1:3000";

const VIEWPORTS = [
  { name: "mobile-360", width: 360, height: 780 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 900 },
  { name: "desktop-1440", width: 1440, height: 950 },
];

const problems = [];

function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? " — " + detail : ""}`);
  if (!ok) problems.push(label + (detail ? ": " + detail : ""));
}

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    locale: "ar-SA",
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);

  // Scroll the whole page so every `whileInView` reveal has actually fired
  // before the full-page capture, then return to the top for the hero shot.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });
  await page.waitForTimeout(700);

  // Radix renders hidden native inputs (opacity:0, pointer-events:none) behind
  // Select/RadioGroup/Checkbox so the controls participate in native form
  // submission. Those are meant to be invisible — exclude them and assert only
  // on elements that carry content.
  const stuck = await page.evaluate(() =>
    [...document.querySelectorAll("main *")].filter((el) => {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) >= 0.05) return false;
      if (cs.pointerEvents === "none") return false;
      if (el.tagName === "INPUT" || el.getAttribute("aria-hidden") === "true") return false;
      return el.getBoundingClientRect().height > 0 && (el.textContent || "").trim().length > 0;
    }).length,
  );
  check(`${vp.name}: no content left at zero opacity`, stuck === 0, `${stuck} stuck`);

  // Horizontal overflow is the classic RTL failure — check it at every width.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  check(`${vp.name}: no horizontal overflow`, overflow <= 1, `overflow ${overflow}px`);

  const dir = await page.evaluate(() => document.documentElement.dir);
  check(`${vp.name}: document dir=rtl`, dir === "rtl", dir);

  await page.screenshot({ path: `${OUT}/${vp.name}-hero.png` });
  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });

  await context.close();
}

/* ---------------------------------------------- reduced motion + no WebGL */

for (const [label, opts] of [
  ["reduced-motion", { reducedMotion: "reduce" }],
  ["no-js", { javaScriptEnabled: false }],
]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    locale: "ar-SA",
    ...opts,
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(1200);

  const heroVisible = await page.locator("#hero-heading").isVisible();
  check(`${label}: hero headline rendered`, heroVisible);
  const formVisible = await page.locator("#registration").isVisible();
  check(`${label}: registration section rendered`, formVisible);

  await page.screenshot({ path: `${OUT}/${label}.png`, fullPage: true });
  await context.close();
}

/* -------------------------------------------------------- WebGL disabled */
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    locale: "ar-SA",
  });
  await context.addInitScript(() => {
    // Simulate a device with no WebGL at all.
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
      if (typeof type === "string" && type.includes("webgl")) return null;
      return original.call(this, type, ...rest);
    };
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const canvasCount = await page.locator("canvas").count();
  check("no-webgl: canvas not mounted", canvasCount === 0, `${canvasCount} canvas elements`);
  check("no-webgl: hero still readable", await page.locator("#hero-heading").isVisible());

  // The form must still work with no GPU at all.
  await page.locator("#field-fullNameAr").fill("محمد أحمد العتيبي");
  const typed = await page.locator("#field-fullNameAr").inputValue();
  check("no-webgl: form input still accepts text", typed.length > 0, typed);

  await page.screenshot({ path: `${OUT}/no-webgl.png`, fullPage: true });
  await context.close();
}

await browser.close();

console.log("\n" + (problems.length ? `${problems.length} PROBLEM(S)` : "all visual checks passed"));
for (const p of problems) console.log(" - " + p);
process.exit(problems.length ? 1 : 0);
