/**
 * Emits a real index.html for every route so GitHub Pages answers deep links
 * with 200 instead of falling back to 404.html. Doc slugs are read from the
 * data file, so adding an article needs no change here.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(fileURLToPath(new URL("../dist", import.meta.url)));
const docsSrc = path.resolve(
  fileURLToPath(new URL("../src/data/docs.ts", import.meta.url)),
);

const slugs = [...fs.readFileSync(docsSrc, "utf8").matchAll(/^\s*slug: "([\w-]+)"/gm)].map(
  (m) => m[1],
);

const routes = [
  "products",
  "vps",
  "game-servers",
  "discord-bots",
  "servers",
  "pricing",
  "docs",
  "status",
  "login",
  "signup",
  ...slugs.map((s) => `docs/${s}`),
];

const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");

for (const route of routes) {
  const dir = path.join(dist, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

console.log(`prerendered ${routes.length} routes (${slugs.length} doc pages)`);
