/**
 * Dev-only screenshot harness. Serves ./dist under /asterza/ and captures the
 * site at three viewports so layout can be reviewed without a display server.
 *
 * Captures viewport-sized slices rather than one full-page image, because a
 * long marketing page exceeds the reviewer's max image dimensions.
 *
 *   node tools/shots.mjs [route ...]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(fileURLToPath(new URL("../dist", import.meta.url)));
const outDir = "/projects/sandbox/.kiro/artifacts/screenshots";
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".woff2": "font/woff2",
};

const BASE = process.env.SITE_BASE ?? "/chlebwebsites";

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  p = p.replace(BASE, "") || "/";
  let file = path.join(root, p);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(root, "index.html");
  }
  res.writeHead(200, {
    "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
  });
  fs.createReadStream(file).pipe(res);
});

const PORT = 4319;

const argv = process.argv.slice(2);
const only = argv.filter((a) => !a.startsWith("--"));
const vpFilter = argv.find((a) => a.startsWith("--vp="))?.slice(5);
const maxSlices = Number(argv.find((a) => a.startsWith("--max="))?.slice(6)) || 8;

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 1050 },
  { name: "mobile", width: 390, height: 780 },
].filter((v) => !vpFilter || v.name === vpFilter);

const routes = only.length
  ? only
  : ["/", "/vps", "/pricing", "/servers", "/docs", "/status"];

await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const errors = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${vp.name} ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`${vp.name} ${e.message}`));

  for (const route of routes) {
    await page.goto(`http://127.0.0.1:${PORT}${BASE}${route}`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(2800); // let staggered reveals settle
    const label = route === "/" ? "home" : route.replace(/\//g, "-").slice(1);

    const total = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    const slices = Math.min(maxSlices, Math.ceil(total / vp.height));

    for (let i = 0; i < slices; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * vp.height);
      await page.waitForTimeout(320);
      const file = path.join(
        outDir,
        `${label}-${vp.name}-${String(i + 1).padStart(2, "0")}.png`,
      );
      await page.screenshot({ path: file });
    }
    console.log(`${label} ${vp.name}: ${slices} slices of ${total}px`);
  }
  await ctx.close();
}

await browser.close();
server.close();

if (errors.length) {
  console.log("\n--- console errors ---");
  for (const e of [...new Set(errors)]) console.log(e);
} else {
  console.log("\nno console errors");
}
