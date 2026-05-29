// scripts/download-opencv.mjs
import { existsSync, writeFileSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dest = resolve(__dirname, "../public/opencv.js");

const MIN_SIZE = 1_000_000; // 1 MB — guard against truncated files

if (existsSync(dest) && statSync(dest).size >= MIN_SIZE) {
  console.log("public/opencv.js already present, skipping download.");
  process.exit(0);
}

const VERSION = "4.9.0";
const url = `https://docs.opencv.org/${VERSION}/opencv.js`;
const TIMEOUT_MS = 60_000; // 60 seconds

console.log(`Downloading OpenCV.js ${VERSION} from ${url} ...`);

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

let res;
try {
  res = await fetch(url, { signal: controller.signal });
} catch (err) {
  clearTimeout(timer);
  throw new Error(`Failed to fetch opencv.js: ${err.message}`);
} finally {
  clearTimeout(timer);
}

if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
const buf = await res.arrayBuffer();
writeFileSync(dest, Buffer.from(buf));
console.log(`Saved public/opencv.js (${(buf.byteLength / 1024 / 1024).toFixed(1)} MB)`);
