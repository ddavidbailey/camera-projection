"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import type { Corners } from "@/hooks/usePaperDetection";

// Lazy-load PDF.js on first PDF encounter and cache the promise so the module
// is only imported once regardless of how many times the effect re-runs.
let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;
function getPdfjsLib() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      return lib;
    });
  }
  return pdfjsPromise;
}

interface WorksheetCanvasProps {
  cornersRef: MutableRefObject<Corners | null>;
  fileUrl: string | null;
  mimeType: string;
  flipped: boolean;
  flippedV: boolean;
  active: boolean;
  locked: boolean;
  overlayOpacity: number;
  zoom: number;
}

export function WorksheetCanvas({
  cornersRef,
  fileUrl,
  mimeType,
  flipped,
  flippedV,
  active,
  locked,
  overlayOpacity,
  zoom,
}: WorksheetCanvasProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const srcCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tmpCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef       = useRef(0);

  // Pre-render the worksheet into srcCanvasRef whenever fileUrl changes.
  // PDFs use PDF.js (page 1); everything else uses a plain <img>.
  useEffect(() => {
    let cancelled = false;
    srcCanvasRef.current = null;

    if (!fileUrl) return;

    if (mimeType === "application/pdf") {
      getPdfjsLib()
        .then(async (pdfjsLib) => {
          if (cancelled) return;
          const pdf  = await pdfjsLib.getDocument(fileUrl).promise;
          if (cancelled) return;
          const page = await pdf.getPage(1);
          if (cancelled) return;
          const viewport = page.getViewport({ scale: 2 });
          const sc = document.createElement("canvas");
          sc.width  = viewport.width;
          sc.height = viewport.height;
          await page.render({ canvas: sc, canvasContext: sc.getContext("2d")!, viewport }).promise;
          if (!cancelled) srcCanvasRef.current = sc;
        })
        .catch((err) => {
          if (!cancelled) console.warn("[WorksheetCanvas] PDF render error:", err);
        });
    } else {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        const sc = document.createElement("canvas");
        sc.width  = img.naturalWidth;
        sc.height = img.naturalHeight;
        sc.getContext("2d")!.drawImage(img, 0, 0);
        srcCanvasRef.current = sc;
      };
      img.onerror = () => { srcCanvasRef.current = null; };
      img.src = fileUrl;
    }

    return () => { cancelled = true; };
  }, [fileUrl, mimeType]);

  // Projection loop — warps srcCanvasRef onto the detected paper corners each frame.
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    function frame() {
      rafRef.current = requestAnimationFrame(frame);
      try {
        const c   = cornersRef.current;
        const ctx = canvas!.getContext("2d")!;
        const cv  = window.cv;

        const dw = canvas!.offsetWidth;
        const dh = canvas!.offsetHeight;
        if (canvas!.width !== dw || canvas!.height !== dh) {
          canvas!.width  = dw;
          canvas!.height = dh;
        }

        ctx.clearRect(0, 0, dw, dh);

        if (!c || !locked || !cv || !srcCanvasRef.current || !dw || !dh) return;

        const sc = srcCanvasRef.current;
        const iw = sc.width;
        const ih = sc.height;

        // Compensate for vertical flip toggle (scaleY(-1) on video, from center).
        // After that flip, physical BL→visual TL, BR→TR, TR→BR, TL→BL.
        const vCorrected: Corners = flippedV
          ? [
              [c[3][0], dh - c[3][1]],
              [c[2][0], dh - c[2][1]],
              [c[1][0], dh - c[1][1]],
              [c[0][0], dh - c[0][1]],
            ]
          : c;

        // Compensate for horizontal flip toggle (scaleX(-1) on video, from center).
        const flippedCorners: Corners = flipped
          ? [
              [dw - vCorrected[1][0], vCorrected[1][1]],
              [dw - vCorrected[0][0], vCorrected[0][1]],
              [dw - vCorrected[3][0], vCorrected[3][1]],
              [dw - vCorrected[2][0], vCorrected[2][1]],
            ]
          : vCorrected;

        // Apply the same scale(zoom) the video element uses (from center)
        const cx = dw / 2;
        const cy = dh / 2;
        const corners: Corners = flippedCorners.map(([x, y]) => [
          cx + (x - cx) * zoom,
          cy + (y - cy) * zoom,
        ]) as Corners;

        const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
          0,  0,
          iw, 0,
          iw, ih,
          0,  ih,
        ]);
        const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
          corners[0][0], corners[0][1],
          corners[1][0], corners[1][1],
          corners[2][0], corners[2][1],
          corners[3][0], corners[3][1],
        ]);

        const M   = cv.getPerspectiveTransform(srcPts, dstPts);
        const src = cv.imread(sc);
        const dst = new cv.Mat();
        cv.warpPerspective(src, dst, M, new cv.Size(dw, dh));

        let tmp = tmpCanvasRef.current;
        if (!tmp || tmp.width !== dw || tmp.height !== dh) {
          tmp = document.createElement("canvas");
          tmp.width  = dw;
          tmp.height = dh;
          tmpCanvasRef.current = tmp;
        }
        cv.imshow(tmp, dst);

        ctx.save();
        ctx.globalAlpha = overlayOpacity;
        ctx.beginPath();
        ctx.moveTo(corners[0][0], corners[0][1]);
        ctx.lineTo(corners[1][0], corners[1][1]);
        ctx.lineTo(corners[2][0], corners[2][1]);
        ctx.lineTo(corners[3][0], corners[3][1]);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(tmp, 0, 0);
        ctx.restore();

        [srcPts, dstPts, M, src, dst].forEach((m) => m.delete());
      } catch (err) {
        console.warn("[WorksheetCanvas] projection frame error:", err);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, cornersRef, flipped, flippedV, locked, overlayOpacity, zoom]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[6]"
    />
  );
}
