/** Screenshots the deployed site so the live deployment can be verified. */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "https://osk4rrv.github.io/chlebwebsites";
const outDir = "/projects/sandbox/.kiro/artifacts/screenshots";
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const errors = [];

for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 780 },
]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${vp.name} ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`${vp.name} ${e.message}`));
  page.on("requestfailed", (r) =>
    errors.push(`${vp.name} FAILED ${r.url()} ${r.failure()?.errorText}`),
  );

  for (const route of ["/", "/pricing", "/status"]) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const label = route === "/" ? "home" : route.slice(1);
    const slices = vp.name === "desktop" ? 2 : 2;
    for (let i = 0; i < slices; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * vp.height);
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outDir, `live-${label}-${vp.name}-0${i + 1}.png`),
      });
    }
    const title = await page.title();
    console.log(`${vp.name} ${route} -> "${title}"`);
  }
  await ctx.close();
}

await browser.close();
console.log(errors.length ? "\nISSUES:\n" + [...new Set(errors)].join("\n") : "\nno console or network errors");
