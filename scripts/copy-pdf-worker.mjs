// Copies the PDF.js web worker from node_modules → public/ so it can be served
// as a static asset. Runs as part of postinstall so Vercel picks it up on deploy.
import { copyFileSync, existsSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const dest = fileURLToPath(new URL("../public/pdf.worker.min.mjs", import.meta.url));

if (existsSync(dest)) {
  console.log("public/pdf.worker.min.mjs already present, skipping.");
  process.exit(0);
}

try {
  const src = require.resolve("pdfjs-dist/build/pdf.worker.min.mjs");
  copyFileSync(src, dest);
  console.log("[postinstall] pdf.worker.min.mjs → public/");
} catch (e) {
  console.error("[postinstall] Failed to copy pdf.worker.min.mjs:", e.message);
  process.exit(1);
}
