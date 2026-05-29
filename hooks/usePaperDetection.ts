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

  // videoRef consumed in Task 7's RAF loop effect.
  void videoRef;

  return { cornersRef, status };
}
