"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";
import { ProjectionOverlay } from "./ProjectionOverlay";
import { CropMark } from "./CropMark";
import { GuideZone } from "./GuideZone";
import { WorksheetCanvas } from "./WorksheetCanvas";
import type { DetectionStatus, Corners } from "@/hooks/usePaperDetection";

export type CameraState = "idle" | "live" | "denied";

export interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  zoom: number;
  brightness: number;
  overlayOpacity: number;
  detectionStatus: DetectionStatus;
  cornersRef: MutableRefObject<Corners | null>;
  pageIndex: number;
  cameraState: CameraState;
  onRequest: () => void;
  torch: boolean;
  flipped: boolean;
  fileUrl?: string | null;
}

export function CameraView({
  videoRef,
  zoom, brightness, overlayOpacity,
  detectionStatus, cornersRef: _cornersRef, pageIndex,
  cameraState, onRequest,
  torch, flipped,
  fileUrl: _fileUrl,
}: CameraViewProps) {
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (cameraState !== "live") return;
    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn("camera unavailable:", err instanceof Error ? err.name : err);
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraState]);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track?.applyConstraints) return;
    track
      .applyConstraints({ advanced: [{ torch: !!torch } as MediaTrackConstraintSet] })
      .catch(() => {});
  }, [torch, cameraState]);

  const filter    = `brightness(${brightness}) contrast(${1 + (brightness - 1) * 0.4})`;
  const transform = `scale(${zoom})${flipped ? " scaleX(-1)" : ""}`;

  return (
    <div
      className="relative w-full aspect-[4/3] border border-(--color-border) rounded-[2px] overflow-hidden min-[880px]:h-full min-[880px]:[aspect-ratio:unset]"
      style={{
        background:
          "radial-gradient(ellipse 70% 45% at 50% 12%, color-mix(in oklab, var(--color-secondary), transparent 80%) 0%, transparent 70%)," +
          "linear-gradient(180deg, color-mix(in oklab, var(--color-background), black 8%), color-mix(in oklab, var(--color-background), black 14%))",
      }}
    >
      <CropMark position="tl" variant="cam" />
      <CropMark position="tr" variant="cam" />
      <CropMark position="bl" variant="cam" />
      <CropMark position="br" variant="cam" />

      {cameraState === "live" && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover bg-[#0c0d10] block [transform-origin:center] transition-transform duration-[0.18s]"
          autoPlay playsInline muted
          style={{ transform, filter }}
        />
      )}

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] mix-blend-multiply"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 3px)," +
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Guide zone — always visible while live */}
      {cameraState === "live" && (
        <GuideZone status={detectionStatus} />
      )}

      {/* Pre-lock search animation — only while searching */}
      {cameraState === "live" && detectionStatus === "searching" && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <g transform="translate(200 150) scale(0.5) translate(-200 -150)">
            <ProjectionOverlay opacity={overlayOpacity} pageIndex={pageIndex} />
          </g>
        </svg>
      )}

      {/* Worksheet projection canvas */}
      {cameraState === "live" && (
        <WorksheetCanvas
          cornersRef={_cornersRef}
          fileUrl={_fileUrl ?? null}
          flipped={flipped}
          active={cameraState === "live"}
        />
      )}

      {cameraState === "live" && (
        <>
          {/* Top HUD */}
          <div className="absolute top-[14px] left-[18px] right-[18px] flex items-center gap-[10px] font-code text-[10px] tracking-[0.16em] uppercase text-[rgba(248,242,228,0.82)] z-[5]">
            <span className="inline-flex items-center gap-[6px] px-[8px] py-[4px] border border-[rgba(248,242,228,0.22)] rounded-full bg-[rgba(0,0,0,0.28)] backdrop-blur-[6px]">
              <span
                className={`w-[5px] h-[5px] rounded-full ${
                  detectionStatus === "locked"
                    ? "bg-(--color-secondary) shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-secondary),transparent_75%)]"
                    : "bg-(--color-primary) shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary),transparent_75%)] animate-auth-pulse"
                }`}
              />
              {detectionStatus === "locked" ? "Paper locked" : "Searching"}
            </span>
          </div>

          {/* Bottom HUD */}
          <div className="absolute left-[18px] right-[18px] bottom-[14px] flex items-center z-[5]">
            <span className="flex-1" />
            <span className="font-code text-[10px] tracking-[0.16em] uppercase text-[rgba(248,242,228,0.45)]">
              1280 × 960 · 30fps
            </span>
          </div>
        </>
      )}

      {/* Permission gate */}
      {cameraState !== "live" && (
        <div
          className="absolute inset-0 z-[7] grid place-items-center text-center p-8 text-(--color-surface)"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.7))" }}
        >
          <div className="max-w-[360px]">
            {cameraState === "denied" ? (
              <>
                <h2 className="font-heading font-normal text-[34px] leading-[1.08] tracking-[-0.015em] m-0 mb-[14px] text-balance">
                  Camera <em className="italic text-(--color-primary)">blocked.</em>
                </h2>
                <p className="text-[14.5px] leading-[1.55] text-[rgba(248,242,228,0.72)] m-0 mb-[22px] text-pretty">
                  Tracelight needs the camera to align the worksheet on your paper. Enable it in
                  your browser&apos;s site settings, then reload.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-heading font-normal text-[34px] leading-[1.08] tracking-[-0.015em] m-0 mb-[14px] text-balance">
                  Point at <em className="italic text-(--color-primary)">any blank sheet.</em>
                </h2>
                <p className="text-[14.5px] leading-[1.55] text-[rgba(248,242,228,0.72)] m-0 mb-[22px] text-pretty">
                  Allow the camera and Tracelight will lock onto a piece of paper in front of you,
                  then project today&apos;s worksheet on top.
                </p>
              </>
            )}
            <button
              className="group font-code text-[11px] font-medium tracking-[0.14em] uppercase px-[18px] py-[11px] bg-(--color-surface) text-(--color-foreground) border border-(--color-surface) rounded-[10px] inline-flex items-center gap-[10px] cursor-pointer hover:-translate-y-px transition-transform duration-[0.18s]"
              onClick={onRequest}
            >
              {cameraState === "denied" ? "Try again" : "Allow camera"}
              <span className="transition-transform duration-200 group-hover:translate-x-[2px]">→</span>
            </button>
            <div className="mt-[16px] font-code text-[10px] tracking-[0.16em] uppercase text-[rgba(248,242,228,0.4)]">
              no video leaves your device
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
