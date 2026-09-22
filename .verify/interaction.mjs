import playwright from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = playwright;
const problems = [];
const check = (l, ok, d = "") => { console.log(`${ok?"PASS":"FAIL"}  ${l}${d?" — "+d:""}`); if(!ok) problems.push(l+(d?": "+d:"")); };

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox","--use-gl=swiftshader","--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: "ar-SA" });
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.locator("#registration").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);

/* --- progress starts at 0 and excludes optional fields ------------------ */
const bar = page.locator('[role="progressbar"]');
check("progress starts at 0%", (await bar.getAttribute("aria-valuenow")) === "0");

/* --- submitting an empty form focuses the first invalid field ----------- */
await page.getByRole("button", { name: /إرسال طلب التسجيل/ }).click();
await page.waitForTimeout(900);
const focused = await page.evaluate(() => {
  const el = document.activeElement;
  return { id: el?.id, closestField: el?.closest("[data-field]")?.getAttribute("data-field") };
});
check("first invalid field receives focus", Boolean(focused.closestField), JSON.stringify(focused));
const alerts = await page.locator('[role="alert"]').count();
check("validation errors announced via role=alert", alerts > 0, `${alerts} alerts`);

/* --- conditional field appears only for "أخرى" -------------------------- */
check("clarification hidden before choosing أخرى", (await page.locator("#field-purposeOther").count()) === 0);
await page.locator("#purpose-other").click();
await page.waitForTimeout(500);
check("clarification revealed after choosing أخرى", (await page.locator("#field-purposeOther").count()) === 1);
await page.locator("#purpose-promotion").click();
await page.waitForTimeout(500);
check("clarification hidden again on another choice", (await page.locator("#field-purposeOther").count()) === 0);

/* --- Arabic-Indic digits in the phone field ----------------------------- */
await page.locator("#field-phoneNumber").fill("٠٥٠١٢٣٤٥٦٧");
await page.waitForTimeout(400);
const phoneVal = await page.locator("#field-phoneNumber").inputValue();
check("Arabic-Indic digits folded to Latin", /^[\d\s]+$/.test(phoneVal), phoneVal);

/* --- WhatsApp mirror copies only while the box is ticked ---------------- */
const wa = page.locator("#field-whatsappNumber");
check("whatsapp empty before ticking", (await wa.inputValue()) === "");
await page.locator("#whatsappSameAsPhone").click();
await page.waitForTimeout(500);
check("whatsapp mirrors phone once ticked", (await wa.inputValue()) === phoneVal, await wa.inputValue());
check("whatsapp field disabled while mirroring", await wa.isDisabled());
await page.locator("#whatsappSameAsPhone").click();
await page.waitForTimeout(400);
check("whatsapp editable again when unticked", !(await wa.isDisabled()));

/* --- keyboard: can the selects be operated without a mouse? ------------- */
await page.locator("#field-educationLevel").focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(400);
const optionCount = await page.getByRole("option").count();
check("select opens from the keyboard", optionCount === 3, `${optionCount} options`);
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter");
await page.waitForTimeout(500);
const eduText = (await page.locator("#field-educationLevel").innerText()).trim();
check("select commits an option via keyboard", eduText.length > 0 && !eduText.includes("اختر"), eduText);

/* --- nationality combobox searches in Arabic ---------------------------- */
await page.locator("#field-nationality").click();
await page.waitForTimeout(400);
await page.keyboard.type("مصر");
await page.waitForTimeout(500);
const results = await page.getByRole("option").count();
check("Arabic query filters the country list", results >= 1 && results < 20, `${results} results`);
await page.keyboard.press("Enter");
await page.waitForTimeout(400);
check("nationality committed", (await page.locator("#field-nationality").innerText()).includes("مصر"));

/* --- progress advances as required fields become valid ------------------ */
const after = Number(await bar.getAttribute("aria-valuenow"));
check("progress advanced past 0", after > 0, `${after}%`);

/* --- optional email does not block progress ----------------------------- */
const before = after;
await page.locator("#field-email").fill("someone@example.com");
await page.waitForTimeout(500);
check("optional email does not change progress", Number(await bar.getAttribute("aria-valuenow")) === before, `${before} -> ${await bar.getAttribute("aria-valuenow")}`);

/* --- touch targets ------------------------------------------------------ */
/*
 * Measures the EFFECTIVE tap target, not the control's own box. A 20px radio
 * dot inside a 56px <label> is a 56px target — the whole card activates it.
 * Skips controls that are deliberately not visible targets: the skip link
 * (revealed only on focus) and Radix's hidden native form proxies.
 */
const small = await page.evaluate(() => {
  const SEL = "button, input:not([type=hidden]), select, textarea, [role=combobox], a[href]";
  return [...document.querySelectorAll(SEL)]
    .filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.pointerEvents === "none" || cs.visibility === "hidden") return false;
      if (el.closest(".sr-only, .sr-only-focusable")) return false;
      // Radix mirrors Select/RadioGroup/Checkbox into a 1px aria-hidden native
      // control so the widget participates in native form submission. It is
      // removed from the a11y tree and unreachable by Tab — not a tap target.
      if (el.getAttribute("aria-hidden") === "true" && el.tabIndex === -1) return false;
      if (parseFloat(cs.opacity) < 0.05) return false;
      const own = el.getBoundingClientRect();
      if (own.height === 0) return false;
      // The activating region is the control itself or the label that wraps it.
      const label = el.closest("label");
      const effective = Math.max(own.height, label?.getBoundingClientRect().height ?? 0);
      return effective < 44;
    })
    .map((el) => `${el.tagName.toLowerCase()}#${el.id || "?"}:${Math.round(el.getBoundingClientRect().height)}px`);
});
check("all interactive controls have a >= 44px tap target", small.length === 0, small.slice(0, 5).join(", "));

await browser.close();
console.log("\n" + (problems.length ? `${problems.length} PROBLEM(S)` : "all interaction checks passed"));
problems.forEach((p) => console.log(" - " + p));
process.exit(problems.length ? 1 : 0);
