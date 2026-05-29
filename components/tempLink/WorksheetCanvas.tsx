"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import type { Corners } from "@/hooks/usePaperDetection";

interface WorksheetCanvasProps {
  cornersRef: MutableRefObject<Corners | null>;
  fileUrl: string | null;
  flipped: boolean;
  active: boolean;
}

export function WorksheetCanvas({ cornersRef, fileUrl, flipped, active }: WorksheetCanvasProps) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const imageRef      = useRef<HTMLImageElement | null>(null);
  const srcCanvasRef  = useRef<HTMLCanvasElement | null>(null);
  const tmpCanvasRef  = useRef<HTMLCanvasElement | null>(null);
  const rafRef        = useRef(0);

  // Keep imageRef in sync with fileUrl
  useEffect(() => {
    if (!fileUrl) { imageRef.current = null; srcCanvasRef.current = null; return; }
    const img  = new Image();
    img.onload = () => {
      imageRef.current = img;
      // Pre-draw worksheet onto a stable source canvas for cv.imread
      const sc  = document.createElement("canvas");
      sc.width  = img.naturalWidth;
      sc.height = img.naturalHeight;
      sc.getContext("2d")!.drawImage(img, 0, 0);
      srcCanvasRef.current = sc;
    };
    img.src = fileUrl;
  }, [fileUrl]);

  // Projection loop
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    function frame() {
      rafRef.current = requestAnimationFrame(frame);
      const c   = cornersRef.current;
      const ctx = canvas!.getContext("2d")!;
      const cv  = window.cv;

      // Sync canvas size to displayed size
      const dw = canvas!.offsetWidth;
      const dh = canvas!.offsetHeight;
      if (canvas!.width !== dw || canvas!.height !== dh) {
        canvas!.width  = dw;
        canvas!.height = dh;
      }

      ctx.clearRect(0, 0, dw, dh);

      if (!c || !cv || !srcCanvasRef.current) return;

      const sc  = srcCanvasRef.current;
      const iw  = sc.width;
      const ih  = sc.height;

      // Mirror corners horizontally when camera is flipped
      const corners: Corners = flipped
        ? [
            [dw - c[1][0], c[1][1]], // TR → TL
            [dw - c[0][0], c[0][1]], // TL → TR
            [dw - c[3][0], c[3][1]], // BL → BR
            [dw - c[2][0], c[2][1]], // BR → BL
          ]
        : c;

      // Compute perspective transform: worksheet → paper on screen
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

      const M    = cv.getPerspectiveTransform(srcPts, dstPts);
      const src  = cv.imread(sc);
      const dst  = new cv.Mat();
      cv.warpPerspective(src, dst, M, new cv.Size(dw, dh));

      // Reuse a stable temp canvas for cv.imshow (avoids per-frame allocation)
      let tmp = tmpCanvasRef.current;
      if (!tmp || tmp.width !== dw || tmp.height !== dh) {
        tmp = document.createElement("canvas");
        tmp.width  = dw;
        tmp.height = dh;
        tmpCanvasRef.current = tmp;
      }
      cv.imshow(tmp, dst);

      ctx.save();
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
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, cornersRef, flipped]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[6]"
    />
  );
}
