// scripts/download-opencv.mjs
import { existsSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dest = resolve(__dirname, "../public/opencv.js");

if (existsSync(dest)) {
  console.log("public/opencv.js already present, skipping download.");
  process.exit(0);
}

const VERSION = "4.9.0";
const url = `https://docs.opencv.org/${VERSION}/opencv.js`;

console.log(`Downloading OpenCV.js ${VERSION} from ${url} ...`);
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
const buf = await res.arrayBuffer();
writeFileSync(dest, Buffer.from(buf));
console.log(`Saved public/opencv.js (${(buf.byteLength / 1024 / 1024).toFixed(1)} MB)`);
