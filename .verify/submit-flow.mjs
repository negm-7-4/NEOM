import playwright from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = playwright;
const problems = [];
const check = (l, ok, d="") => { console.log(`${ok?"PASS":"FAIL"}  ${l}${d?" — "+d:""}`); if(!ok) problems.push(l); };

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox","--use-gl=swiftshader","--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: "ar-SA" });
page.on("request", (r) => { if (r.url().includes("/api/register")) console.log("  -> POST", r.url()); });
page.on("response", async (r) => { if (r.url().includes("/api/register")) console.log("  <- ", r.status(), (await r.text().catch(()=>"")).slice(0,160)); });
page.on("pageerror", (e) => console.log("  PAGEERROR:", e.message));
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.locator("#registration").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

const pickSelect = async (id, index) => {
  await page.locator(`#${id}`).click();
  await page.waitForTimeout(350);
  await page.getByRole("option").nth(index).click();
  await page.waitForTimeout(350);
};

await pickSelect("field-educationLevel", 2);
await pickSelect("field-specialization", 0);
await page.locator("#studySystem-direct").click();
await page.locator("#field-fullNameAr").fill("سارة عبد الله القحطاني");
await page.locator("#field-fullNameEn").fill("Sara Abdullah Al-Qahtani");
await page.locator("#field-nationality").click();
await page.waitForTimeout(300);
await page.keyboard.type("السعودية");
await page.waitForTimeout(450);
await page.getByRole("option").first().click();
await page.locator("#gender-female").click();
await page.locator("#purpose-other").click();
await page.waitForTimeout(400);
await page.locator("#field-purposeOther").fill("تغيير المسار المهني");
await page.locator("#field-phoneNumber").fill("0501234567");
await page.locator("#whatsappSameAsPhone").click();
await page.locator("#field-email").fill("sara.test@example.com");
await page.locator("#field-address").fill("المملكة العربية السعودية - منطقة مكة - جدة - حي الروضة - شارع الأمير سلطان - بجوار مركز الأندلس");
await pickSelect("field-adSource", 5);
await page.locator("#consent").click();
await page.waitForTimeout(600);

const pct = await page.locator('[role="progressbar"]').getAttribute("aria-valuenow");
check("progress reaches 100% with all required fields valid", pct === "100", `${pct}%`);

const submit = page.getByRole("button", { name: /إرسال طلب التسجيل/ });
await submit.scrollIntoViewIfNeeded();
await submit.click();
// The button must be disabled while in flight.
await page.waitForTimeout(120);
const busy = await page.evaluate(() => {
  const b = [...document.querySelectorAll("button[type=submit]")][0];
  return { disabled: b?.disabled, busy: b?.getAttribute("aria-busy"), label: b?.innerText.trim() };
});
check("submit disabled while pending", busy.disabled === true, JSON.stringify(busy));

await page.waitForTimeout(4000);
const okTitle = await page.getByText("تم إرسال طلب التسجيل").count();
check("confirmation shown", okTitle === 1);
const refText = await page.locator("code").first().innerText().catch(() => "");
check("submission reference displayed", /^NEOM-\d{6}-[0-9A-Z]{6}$/.test(refText.trim()), refText);
check("confirmation body shown", (await page.getByText("سيتواصل معك أحد المستشارين التعليميين لاستكمال التفاصيل.").count()) === 1);

await page.screenshot({ path: "/home/user/NEOM/.verify/shots/confirmation.png" });

/* Browser storage must not hold applicant data. */
const stored = await page.evaluate(() => ({
  local: { ...localStorage },
  session: { ...sessionStorage },
}));
const blob = JSON.stringify(stored);
check("no applicant data in browser storage", !/القحطاني|Al-Qahtani|0501234567|sara\.test|الروضة/.test(blob), blob.slice(0, 120));

await browser.close();
console.log("\n" + (problems.length ? `${problems.length} PROBLEM(S)` : "submit flow verified"));
problems.forEach((p) => console.log(" - " + p));
process.exit(problems.length ? 1 : 0);
