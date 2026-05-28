"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Logomark } from "@/components/tempLink/Logomark";
import { CameraView } from "@/components/tempLink/CameraView";
import { ControlsPanel } from "@/components/tempLink/ControlsPanel";
import { WorksheetPanel } from "@/components/tempLink/WorksheetPanel";
import type { CameraState } from "@/components/tempLink/CameraView";

interface ShareLinkFile {
  id: string;
  fileId: string;
  provider: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  sortOrder: number;
}

interface ViewClientProps {
  token: string;
  files: ShareLinkFile[];
}

export function ViewClient({ token: _token, files }: ViewClientProps) {
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

  const clampedPageIndex = Math.min(pageIndex, Math.max(0, files.length - 1));

  const worksheet = files[0] ?? null;

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
    <div
      className="relative z-1 flex flex-col min-h-dvh font-ui antialiased [text-rendering:optimizeLegibility] overflow-x-hidden text-(--color-foreground) bg-(--color-background) min-[880px]:h-dvh min-[880px]:overflow-hidden"

    >
      {/* Subtle radial background gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 18% 8%, color-mix(in oklab, var(--color-background), white 6%), transparent 42%)," +
            "radial-gradient(circle at 88% 85%, color-mix(in oklab, var(--color-background), black 4%), transparent 55%)",
        }}
      />

      <header
        className="relative z-2 border-b"
        style={{
          background:
            "color-mix(in oklab, var(--color-background), transparent 18%)",
          borderColor:
            "color-mix(in oklab, var(--color-border), transparent 40%)",
          backdropFilter: "blur(8px) saturate(110%)",
        }}
      >
        <div className="w-full max-w-[1480px] mx-auto px-8 max-[720px]:px-[18px] flex items-center gap-[18px] h-14">
          <Link
            href="/"
            className="inline-flex items-center gap-[9px] text-(--color-foreground) no-underline"
          >
            <Logomark />
            <span className="font-heading text-[19px] tracking-[-0.01em]">
              Tracelight
            </span>
            <span className="font-code text-[10px] uppercase tracking-[0.14em] text-(--color-muted) px-[7px] py-[3px] border border-(--color-border) rounded-full ml-1">
              beta
            </span>
          </Link>
          <span className="flex-1" />
          <span className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted) max-[720px]:hidden">
            no app · no sign-in
          </span>
        </div>
      </header>

      <main className="flex-1 pt-[18px] pb-7 relative z-1 min-[880px]:flex min-[880px]:flex-col min-[880px]:min-h-0">
        <div className="w-full max-w-[1480px] mx-auto px-8 max-[720px]:px-[18px] min-[880px]:flex-1 min-[880px]:min-h-0 min-[880px]:flex min-[880px]:flex-col">
          <div className="grid grid-cols-[minmax(0,1fr)_260px] gap-[22px] items-start max-[880px]:grid-cols-1 min-[880px]:flex-1 min-[880px]:min-h-0 min-[880px]:items-stretch">
            <CameraView
              zoom={zoom}
              brightness={brightness}
              overlayOpacity={overlayOpacity}
              paperDetected={paperDetected}
              pageIndex={clampedPageIndex}
              cameraState={cameraState}
              onRequest={requestCamera}
              torch={torch}
              flipped={flipped}
            />

            <aside className="flex flex-col gap-[14px] min-[880px]:min-h-0 min-[880px]:overflow-y-auto">
              <WorksheetPanel
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                worksheet={worksheet as any}
                pageIndex={clampedPageIndex}
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

          <div className="mt-[18px] flex items-center font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted)">
            <span className="flex-1" />
            <span>privacy · terms · status</span>
          </div>
        </div>
      </main>
    </div>
  );
}
