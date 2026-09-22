import playwright from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = playwright;
const OUT = "/home/user/NEOM/.verify/shots";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox","--use-gl=swiftshader","--enable-unsafe-swiftshader"] });

for (const [tag, w, h] of [["desk", 1440, 950], ["mob", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, locale: "ar-SA" });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  // Walk the page so every reveal fires, capturing at each stop.
  const total = await page.evaluate(() => document.body.scrollHeight);
  let shot = 0;
  for (let y = 0; y < total - h; y += Math.round(h * 0.85)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${tag}-scroll-${String(++shot).padStart(2,"0")}.png` });
    if (shot >= 6) break;
  }
  await page.close();
}
await browser.close();
console.log("done");
