import { MutableRefObject, RefObject, useEffect, useRef, useState } from "react";

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

  // Detection logic added in Tasks 4–6.
  void cameraActive; void videoRef;

  return { cornersRef, status };
}
