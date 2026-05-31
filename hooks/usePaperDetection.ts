import { MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

declare global {
  interface Window { cv: any } // eslint-disable-line @typescript-eslint/no-explicit-any
}

// ── OpenCV ──────────────────────────────────────────────────────────────────
let cvReady = false;
let cvFailed = false;
const cvResolve: (() => void)[] = [];
const cvReject: ((e: Error) => void)[] = [];

function loadOpenCV(): Promise<void> {
  if (cvReady) return Promise.resolve();
  if (cvFailed) return Promise.reject(new Error("opencv.js failed to load"));
  return new Promise((resolve, reject) => {
    cvResolve.push(resolve);
    cvReject.push(reject);
    if (document.getElementById("opencv-script")) return;

    function onReady() {
      cvReady = true;
      cvResolve.splice(0).forEach((cb) => cb());
      cvReject.length = 0;
    }

    const script = document.createElement("script");
    script.id    = "opencv-script";
    script.src   = "/opencv.js";
    script.async = true;
    script.onload = () => {
      const cv = window.cv;
      if (!cv) return;
      if (typeof cv.then === "function") {
        cv.then(onReady);
      } else if (typeof cv.Mat === "function") {
        onReady();
      } else {
        cv["onRuntimeInitialized"] = onReady;
      }
    };
    script.onerror = () => {
      cvFailed = true;
      const err = new Error("opencv.js failed to load");
      cvResolve.length = 0;
      cvReject.splice(0).forEach((cb) => cb(err));
    };
    document.head.appendChild(script);
  });
}

// ── MediaPipe ────────────────────────────────────────────────────────────────
let handLandmarker: HandLandmarker | null = null;

async function loadMediaPipe(): Promise<HandLandmarker | null> {
  if (handLandmarker) return handLandmarker;
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });
    return handLandmarker;
  } catch {
    console.warn("[usePaperDetection] MediaPipe failed to load — hand masking disabled");
    return null;
  }
}

// ── Pure helper functions ────────────────────────────────────────────────────

/** Guide zone ROI in video-native pixels (centred, A4 aspect ratio).
 *  Prefers 75 % of width but clamps height to 90 % of the frame so the rect
 *  never overflows a landscape camera (which is all normal webcams). */
function computeGuideZoneRect(videoW: number, videoH: number) {
  const A4 = Math.SQRT2; // height / width for A4 portrait
  let w = Math.round(videoW * 0.75);
  let h = Math.round(w * A4);
  if (h > Math.round(videoH * 0.9)) {
    h = Math.round(videoH * 0.9);
    w = Math.round(h / A4);
  }
  const x = Math.round((videoW - w) / 2);
  const y = Math.round((videoH - h) / 2);
  return { x, y, w, h };
}

/** Map corners from video-native pixels to display pixels (object-fit: cover). */
function videoToDisplay(pts: Corner[], video: HTMLVideoElement): Corner[] {
  const dw    = video.clientWidth;
  const dh    = video.clientHeight;
  const scale = Math.max(dw / video.videoWidth, dh / video.videoHeight);
  const ox    = (dw - video.videoWidth  * scale) / 2;
  const oy    = (dh - video.videoHeight * scale) / 2;
  return pts.map(([x, y]) => [Math.round(x * scale + ox), Math.round(y * scale + oy)]);
}

/** Order 4 corners as TL, TR, BR, BL. */
function orderCorners(pts: Corner[]): Corners {
  const sums  = pts.map(([x, y]) => x + y);
  const diffs = pts.map(([x, y]) => x - y);
  const tl = pts[sums.indexOf(Math.min(...sums))];
  const br = pts[sums.indexOf(Math.max(...sums))];
  const tr = pts[diffs.indexOf(Math.max(...diffs))];
  const bl = pts[diffs.indexOf(Math.min(...diffs))];
  return [tl, tr, br, bl];
}

/** Andrew's monotone-chain convex hull (O(n log n)). Returns hull in CCW order. */
function convexHull(pts: { x: number; y: number }[]): { x: number; y: number }[] {
  if (pts.length < 3) return pts;
  const s = [...pts].sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);
  const cross = (o: typeof pts[0], a: typeof pts[0], b: typeof pts[0]) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower: typeof pts = [];
  for (const p of s) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper: typeof pts = [];
  for (let i = s.length - 1; i >= 0; i--) {
    const p = s[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/**
 * Erase hand + arm pixels from the detection canvas.
 *
 * Two shapes per hand:
 *  1. Convex hull of the 21 landmarks — covers the hand itself.
 *  2. A rectangle strip extending from the wrist to the frame edge — covers the arm.
 *
 * Using destination-out so erased pixels become transparent (OpenCV reads them as 0).
 */
function maskHands(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number }[][],
  canvasW: number,
  canvasH: number,
) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "black";

  for (const hand of landmarks) {
    // 1. Convex hull over all 21 hand landmarks
    const hull = convexHull(hand);
    ctx.beginPath();
    hull.forEach(({ x, y }, i) => {
      i === 0
        ? ctx.moveTo(x * canvasW, y * canvasH)
        : ctx.lineTo(x * canvasW, y * canvasH);
    });
    ctx.closePath();
    ctx.fill();

    // 2. Arm strip: from wrist (landmark 0) toward the frame edge.
    //    Direction = wrist away from middle-finger MCP (landmark 9).
    const wrist = hand[0];
    const midMcp = hand[9];
    const dx = wrist.x - midMcp.x;
    const dy = wrist.y - midMcp.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ax = dx / len, ay = dy / len; // unit vector along arm

    // Half-width = index MCP (5) → pinky MCP (17) distance, + 30 % padding
    const hw = Math.sqrt(
      (hand[5].x - hand[17].x) ** 2 + (hand[5].y - hand[17].y) ** 2,
    ) / 2 * 1.3;
    const px = -ay, py = ax; // perpendicular to arm

    // Wrist edge of the strip (in 0-1 normalised space)
    const w0x = wrist.x + px * hw, w0y = wrist.y + py * hw;
    const w1x = wrist.x - px * hw, w1y = wrist.y - py * hw;
    // Far edge: 2× frame lengths off-screen — guaranteed to reach the boundary
    const f0x = w0x + ax * 2,      f0y = w0y + ay * 2;
    const f1x = w1x + ax * 2,      f1y = w1y + ay * 2;

    ctx.beginPath();
    ctx.moveTo(w0x * canvasW, w0y * canvasH);
    ctx.lineTo(w1x * canvasW, w1y * canvasH);
    ctx.lineTo(f1x * canvasW, f1y * canvasH);
    ctx.lineTo(f0x * canvasW, f0y * canvasH);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

const MIN_QUAD_AREA = 15_000; // square video-pixels — rejects tiny false positives

/** OpenCV quad detection within the ROI. Returns 4 corners in full-frame video-pixel space, or null. */
function detectQuad(
  canvas: HTMLCanvasElement,
  roi: { x: number; y: number; w: number; h: number },
): Corner[] | null {
  const cv  = window.cv;
  const src = cv.imread(canvas);
  const roiMat = src.roi(new cv.Rect(roi.x, roi.y, roi.w, roi.h));

  const gray    = new cv.Mat();
  const blurred = new cv.Mat();
  const thDst   = new cv.Mat();
  const edges   = new cv.Mat();

  cv.cvtColor(roiMat, gray, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
  const otsu = cv.threshold(blurred, thDst, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
  cv.Canny(blurred, edges, otsu * 0.5, otsu);

  const contours  = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  let best: Corner[] | null = null;
  let bestArea = 0;

  for (let i = 0; i < contours.size(); i++) {
    const c    = contours.get(i);
    const peri = cv.arcLength(c, true);
    const approx = new cv.Mat();
    cv.approxPolyDP(c, approx, 0.02 * peri, true);

    if (approx.rows === 4) {
      const area = Math.abs(cv.contourArea(approx, false));
      if (area > MIN_QUAD_AREA && area > bestArea) {
        bestArea = area;
        best = [];
        for (let j = 0; j < 4; j++) {
          // approxPolyDP output is CV_32SC2: data is interleaved [x0,y0,x1,y1,...]
          best.push([approx.data32S[j * 2] + roi.x, approx.data32S[j * 2 + 1] + roi.y]);
        }
      }
    }
    approx.delete();
    c.delete();
  }

  [roiMat, gray, blurred, thDst, edges, contours, hierarchy, src].forEach((m) => m.delete());
  return best;
}

const STABILITY_FRAMES    = 8;
const STABILITY_THRESHOLD = 10; // px
const RECENTER_FRAMES     = 30;

/** Returns true when the last STABILITY_FRAMES detections are all within STABILITY_THRESHOLD px. */
function cornersStable(buf: Corners[]): boolean {
  if (buf.length < STABILITY_FRAMES) return false;
  const ref = buf[0];
  return buf.every((c) =>
    c.every(([x, y], i) =>
      Math.abs(x - ref[i][0]) <= STABILITY_THRESHOLD &&
      Math.abs(y - ref[i][1]) <= STABILITY_THRESHOLD
    )
  );
}

// ── Exported types ───────────────────────────────────────────────────────────

export type DetectionStatus = "searching" | "locked" | "recenter" | "unavailable";
export type Corner  = [number, number]; // [x, y] in display pixels
export type Corners = [Corner, Corner, Corner, Corner]; // TL, TR, BR, BL

export interface UsePaperDetectionResult {
  /** Updated every detection frame; read inside RAF loops, not in JSX. */
  cornersRef: MutableRefObject<Corners | null>;
  /** React state — changes infrequently; safe to read in JSX. */
  status: DetectionStatus;
}

interface Options {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraActive: boolean;
}

export function usePaperDetection({ videoRef, cameraActive }: Options): UsePaperDetectionResult {
  const [status, setStatus]   = useState<DetectionStatus>("searching");
  const cornersRef             = useRef<Corners | null>(null);

  const mpRef       = useRef<HandLandmarker | null>(null);
  const cvLoadedRef = useRef(false);

  const stabBufRef    = useRef<Corners[]>([]);
  const framesLostRef = useRef(0);
  const everLockedRef = useRef(false);
  const lastMpTimeRef = useRef(-1);
  const frameCountRef = useRef(0); // for every-other-frame perf mode

  useEffect(() => {
    if (!cameraActive) return;
    let cancelled = false;

    Promise.all([loadOpenCV(), loadMediaPipe()]).then(([, mp]) => {
      if (cancelled) return;
      cvLoadedRef.current = true;
      mpRef.current = mp;
    }).catch(() => {
      if (!cancelled) setStatus("unavailable");
    });

    return () => { cancelled = true; };
  }, [cameraActive]);

  useEffect(() => {
    if (!cameraActive) return;
    let rafId = 0;

    const detCanvas = document.createElement("canvas");
    const detCtx    = detCanvas.getContext("2d", { willReadFrequently: true })!;
    let lastNow     = 0;

    function tick(now: number) {
      rafId = requestAnimationFrame(tick);
      if (!cvLoadedRef.current) return;

      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      // Performance: skip every other frame if we're struggling (<15fps ~= delta>66ms)
      frameCountRef.current += 1;
      const delta = now - (lastNow > 0 ? lastNow : now - 33);
      lastNow = now;
      const lowFps = delta > 66;
      if (lowFps && frameCountRef.current % 2 !== 0) return;

      // Resize detection canvas if needed
      if (detCanvas.width !== vw || detCanvas.height !== vh) {
        detCanvas.width  = vw;
        detCanvas.height = vh;
      }

      detCtx.drawImage(video, 0, 0, vw, vh);

      // MediaPipe hand masking (every frame regardless of lowFps)
      let handsPresent = false;
      const mp = mpRef.current;
      if (mp && now !== lastMpTimeRef.current) {
        lastMpTimeRef.current = now;
        const results = mp.detectForVideo(video, now);
        if (results.landmarks.length > 0) {
          handsPresent = true;
          maskHands(detCtx, results.landmarks, vw, vh);
        }
      }

      // When the paper is already locked and hands are in frame, skip OpenCV
      // entirely. The mask boundary is a hard edge that Canny would treat as a
      // new contour — running detection would corrupt the stability buffer and
      // break the lock. Resetting framesLost keeps the lock alive while writing.
      if (handsPresent && everLockedRef.current) {
        framesLostRef.current = 0;
        return;
      }

      // OpenCV quad detection within ROI
      const roi  = computeGuideZoneRect(vw, vh);
      let quad: Corner[] | null = null;
      try {
        quad = detectQuad(detCanvas, roi);
      } catch (err) {
        console.warn("[usePaperDetection] detectQuad error:", err);
      }

      if (quad) {
        framesLostRef.current = 0;
        const ordered  = orderCorners(quad);
        const display  = videoToDisplay(ordered, video) as Corners;
        cornersRef.current = display;

        const buf = stabBufRef.current;
        buf.unshift(display);
        if (buf.length > STABILITY_FRAMES) buf.pop();

        if (cornersStable(buf)) {
          everLockedRef.current = true;
          setStatus((s) => s !== "locked" ? "locked" : s);
        }
      } else {
        stabBufRef.current = [];
        framesLostRef.current += 1;

        if (framesLostRef.current > RECENTER_FRAMES) {
          const next = everLockedRef.current ? "recenter" : "searching";
          setStatus((s) => s !== next ? next : s);
          cornersRef.current = null;
        }
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); };
  }, [cameraActive, videoRef, cornersRef]);

  return { cornersRef, status };
}
