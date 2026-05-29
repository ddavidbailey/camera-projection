import { MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

declare global {
  interface Window { cv: any } // eslint-disable-line @typescript-eslint/no-explicit-any
}

// ── OpenCV ──────────────────────────────────────────────────────────────────
let cvReady = false;
const cvCallbacks: (() => void)[] = [];

function loadOpenCV(): Promise<void> {
  if (cvReady) return Promise.resolve();
  return new Promise((resolve) => {
    cvCallbacks.push(resolve);
    if (document.getElementById("opencv-script")) return;

    function onReady() {
      cvReady = true;
      cvCallbacks.splice(0).forEach((cb) => cb());
    }

    const script = document.createElement("script");
    script.id    = "opencv-script";
    script.src   = "/opencv.js";
    script.async = true;
    script.onload = () => {
      const cv = window.cv;
      if (!cv) return;
      // cv may be a Promise (newer OpenCV.js builds) or an object
      if (typeof cv.then === "function") {
        cv.then(onReady);
      } else if (typeof cv.Mat === "function") {
        onReady();
      } else {
        cv["onRuntimeInitialized"] = onReady;
      }
    };
    script.onerror = () => cvCallbacks.splice(0); // unblock callers
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

/** Guide zone ROI in video-native pixels (centred, A4 aspect ratio, 75 % width). */
function computeGuideZoneRect(videoW: number, videoH: number) {
  const w = Math.round(videoW * 0.75);
  const h = Math.round(w * Math.SQRT2); // A4
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
  const tr = pts[diffs.indexOf(Math.min(...diffs))];
  const bl = pts[diffs.indexOf(Math.max(...diffs))];
  return [tl, tr, br, bl];
}

/** Zero out hand pixels using MediaPipe landmarks (composite: destination-out). */
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
    ctx.beginPath();
    hand.forEach(({ x, y }, i) => {
      i === 0
        ? ctx.moveTo(x * canvasW, y * canvasH)
        : ctx.lineTo(x * canvasW, y * canvasH);
    });
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
          best.push([approx.intAt(j, 0) + roi.x, approx.intAt(j, 1) + roi.y]);
        }
      }
    }
    approx.delete();
    c.delete();
  }

  [src, roiMat, gray, blurred, thDst, edges, contours, hierarchy].forEach((m) => m.delete());
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
      const mp = mpRef.current;
      if (mp && now !== lastMpTimeRef.current) {
        lastMpTimeRef.current = now;
        const results = mp.detectForVideo(video, now);
        if (results.landmarks.length > 0) {
          maskHands(detCtx, results.landmarks, vw, vh);
        }
      }

      // OpenCV quad detection within ROI
      const roi  = computeGuideZoneRect(vw, vh);
      const quad = detectQuad(detCanvas, roi);

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
