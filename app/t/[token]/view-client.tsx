"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Logomark } from "@/components/tempLink/Logomark";
import { CameraView } from "@/components/tempLink/CameraView";
import { ControlsPanel } from "@/components/tempLink/ControlsPanel";
import { WorksheetPanel } from "@/components/tempLink/WorksheetPanel";
import type { CameraState } from "@/components/tempLink/CameraView";

const WORKSHEETS = [
  { id: "ws-03", file: "worksheet-03.pdf", pages: 4 },
  { id: "ws-04", file: "letterforms-A.pdf", pages: 3 },
] as const;

export function ViewClient() {
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [overlayOpacity, setOverlayOpacity] = useState(0.85);
  const [torch, setTorch] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  // Check existing camera permission on mount — auto-start if already granted,
  // jump to denied state if blocked. Safari may not support querying "camera",
  // so we catch and stay idle (the gate handles it via getUserMedia).
  useEffect(() => {
    if (!navigator?.permissions) return;

    let status: PermissionStatus | null = null;

    const onChange = () => {
      if (!status) return;
      if (status.state === "granted") setCameraState("live");
      else if (status.state === "denied") setCameraState("denied");
      else setCameraState("idle");
    };

    navigator.permissions
      .query({ name: "camera" as PermissionName })
      .then((s) => {
        status = s;
        if (s.state === "granted") setCameraState("live");
        else if (s.state === "denied") setCameraState("denied");
        s.addEventListener("change", onChange);
      })
      .catch(() => {
        // Safari / browsers that don't expose "camera" as a queryable permission.
        // Stay in "idle" — getUserMedia inside requestCamera will trigger the
        // native prompt and resolve the state from there.
      });

    return () => {
      status?.removeEventListener("change", onChange);
    };
  }, []);

  // Paper detection is simulated — real detection will wire in OpenCV.js
  const paperDetected = false;

  const worksheet = WORKSHEETS[0];

  const requestCamera = useCallback(async () => {
    try {
      const probe = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      probe.getTracks().forEach((t) => t.stop());
      setCameraState("live");
    } catch {
      setCameraState("denied");
    }
  }, []);

  return (
    <div className="view-page" data-palette="paper">
      <header className="view-topstrip">
        <div className="view-wrap view-topstrip-inner">
          <Link href="/" className="view-brand">
            <Logomark />
            <span className="view-brand-name">Tracelight</span>
            <span className="view-brand-tag">beta</span>
          </Link>
          <span className="view-topstrip-spacer" />
          <span className="view-tip">no app · no sign-in</span>
        </div>
      </header>

      <main className="view-main">
        <div className="view-wrap">
          <div className="view-layout">
            <CameraView
              zoom={zoom}
              brightness={brightness}
              overlayOpacity={overlayOpacity}
              paperDetected={paperDetected}
              pageIndex={pageIndex}
              cameraState={cameraState}
              onRequest={requestCamera}
              torch={torch}
              flipped={flipped}
            />

            <aside className="view-rail">
              <WorksheetPanel
                worksheet={worksheet}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
              />
              <ControlsPanel
                zoom={zoom}
                setZoom={setZoom}
                brightness={brightness}
                setBrightness={setBrightness}
                overlayOpacity={overlayOpacity}
                setOverlayOpacity={setOverlayOpacity}
                torch={torch}
                setTorch={setTorch}
                flipped={flipped}
                setFlipped={setFlipped}
              />
            </aside>
          </div>

          <div className="view-foot">
            <span className="spacer" />
            <span>privacy · terms · status</span>
          </div>
        </div>
      </main>
    </div>
  );
}
