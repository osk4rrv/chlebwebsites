import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Served as a GitHub Pages project site, so assets and the router basename
// both hang off the repository name. Override with BASE_PATH when hosting at a
// domain root (e.g. BASE_PATH=/ behind a custom domain).
export default defineConfig({
  base: process.env.BASE_PATH ?? "/chlebwebsites/",
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
