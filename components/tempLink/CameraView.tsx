"use client";

import { useEffect, useRef } from "react";
import { ProjectionOverlay } from "./ProjectionOverlay";

export type CameraState = "idle" | "live" | "denied";

export interface CameraViewProps {
  zoom: number;
  brightness: number;
  overlayOpacity: number;
  paperDetected: boolean;
  pageIndex: number;
  cameraState: CameraState;
  onRequest: () => void;
  torch: boolean;
  flipped: boolean;
}

export function CameraView({
  zoom,
  brightness,
  overlayOpacity,
  paperDetected,
  pageIndex,
  cameraState,
  onRequest,
  torch,
  flipped,
}: CameraViewProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
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
    <div className="cam">
      <span className="crop crop-tl" />
      <span className="crop crop-tr" />
      <span className="crop crop-bl" />
      <span className="crop crop-br" />

      {cameraState === "live" && (
        <video
          ref={videoRef}
          className="cam-video"
          autoPlay
          playsInline
          muted
          style={{ transform, filter }}
        />
      )}

      <div className="cam-grain" />

      {/* Overlay shown only while searching for paper */}
      {cameraState === "live" && !paperDetected && (
        <svg className="cam-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(200 150) scale(0.5) translate(-200 -150)">
            <ProjectionOverlay opacity={overlayOpacity} pageIndex={pageIndex} />
          </g>
        </svg>
      )}

      {cameraState === "live" && (
        <>
          <div className="cam-strip-top">
            <span className="pill">
              <span className={`dot${paperDetected ? " is-ok" : ""}`} />
              {paperDetected ? "Paper locked" : "Searching"}
            </span>
          </div>

          {!paperDetected && (
            <div className="cam-prompt">
              <div className="cam-prompt-eyebrow">
                <span className="dot" />
                <span>no paper yet</span>
              </div>
              <h3 className="cam-prompt-title">
                Center a <em>sheet of paper</em> on screen.
              </h3>
              <p className="cam-prompt-sub">
                Any blank A4 will do. We&apos;ll lock onto its corners automatically.
              </p>
            </div>
          )}

          <div className="cam-strip-bot">
            <span className="spacer" />
            <span className="label-dim">1280 × 960 · 30fps</span>
          </div>
        </>
      )}

      {/* Permission gate */}
      {cameraState !== "live" && (
        <div className="gate">
          <div className="gate-inner">
            {cameraState === "denied" ? (
              <>
                <h2 className="gate-title">
                  Camera <em>blocked.</em>
                </h2>
                <p className="gate-sub">
                  Tracelight needs the camera to align the worksheet on your paper. Enable it in
                  your browser&apos;s site settings, then reload.
                </p>
                <button className="gate-btn" onClick={onRequest}>
                  Try again <span className="arrow">→</span>
                </button>
                <div className="gate-foot">no video leaves your device</div>
              </>
            ) : (
              <>
                <h2 className="gate-title">
                  Point at <em>any blank sheet.</em>
                </h2>
                <p className="gate-sub">
                  Allow the camera and Tracelight will lock onto a piece of paper in front of you,
                  then project today&apos;s worksheet on top.
                </p>
                <button className="gate-btn" onClick={onRequest}>
                  Allow camera <span className="arrow">→</span>
                </button>
                <div className="gate-foot">no video leaves your device</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
