"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, X, ZoomIn, ZoomOut } from "lucide-react";

type ImageCropModalProps = {
  open: boolean;
  src: string;
  title?: string;
  /** width / height — profile avatar uses 1 (square) */
  aspect?: number;
  /** Export edge length in px (square side or longer side of rect) */
  outputSize?: number;
  fileName?: string;
  onCancel: () => void;
  onComplete: (file: File) => void;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

/**
 * Instagram-style square crop: pan + zoom, then export a clean WebP.
 */
export default function ImageCropModal({
  open,
  src,
  title = "Profil şəklini kəsin",
  aspect = 1,
  outputSize = 1080,
  fileName = "avatar.webp",
  onCancel,
  onComplete,
}: ImageCropModalProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [frame, setFrame] = useState({ w: 320, h: 320 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  // Measure crop frame on open / resize
  useEffect(() => {
    if (!open) return;

    function measure() {
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      setFrame({ w, h });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, aspect]);

  // Reset when a new image opens
  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setNatural({ w: 0, h: 0 });
    setImgReady(false);
    setBusy(false);
  }, [open, src]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const minScale = useMemo(() => {
    if (!natural.w || !natural.h || !frame.w || !frame.h) return 1;
    return Math.max(frame.w / natural.w, frame.h / natural.h);
  }, [natural, frame]);

  const renderScale = minScale * zoom;
  const displayW = natural.w * renderScale;
  const displayH = natural.h * renderScale;

  const clampOffset = useCallback(
    (x: number, y: number, nextZoom = zoom) => {
      const nextRender = minScale * nextZoom;
      const dw = natural.w * nextRender;
      const dh = natural.h * nextRender;
      const mx = Math.max(0, (dw - frame.w) / 2);
      const my = Math.max(0, (dh - frame.h) / 2);
      return {
        x: Math.min(mx, Math.max(-mx, x)),
        y: Math.min(my, Math.max(-my, y)),
      };
    },
    [frame.h, frame.w, minScale, natural.h, natural.w, zoom],
  );

  // Keep offset valid when zoom/frame changes
  useEffect(() => {
    if (!imgReady) return;
    setOffset((prev) => clampOffset(prev.x, prev.y, zoom));
  }, [zoom, frame.w, frame.h, imgReady, clampOffset]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setNatural({
      w: img.naturalWidth || img.width,
      h: img.naturalHeight || img.height,
    });
    setImgReady(true);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!imgReady || busy) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    e.preventDefault();
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    setOffset(clampOffset(drag.originX + dx, drag.originY + dy));
  }

  function onPointerUp(e: React.PointerEvent) {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
    }
  }

  function onWheel(e: React.WheelEvent) {
    if (!imgReady || busy) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom((z) => Math.min(4, Math.max(1, Math.round((z + delta) * 100) / 100)));
  }

  async function handleApply() {
    if (!imgReady || !natural.w || busy) return;
    setBusy(true);

    try {
      const cropW = frame.w / renderScale;
      const cropH = frame.h / renderScale;
      let sx = natural.w / 2 - cropW / 2 - offset.x / renderScale;
      let sy = natural.h / 2 - cropH / 2 - offset.y / renderScale;

      // Clamp to image bounds (float safety)
      sx = Math.min(Math.max(0, sx), Math.max(0, natural.w - cropW));
      sy = Math.min(Math.max(0, sy), Math.max(0, natural.h - cropH));

      const outW =
        aspect >= 1 ? outputSize : Math.max(1, Math.round(outputSize * aspect));
      const outH =
        aspect >= 1 ? Math.max(1, Math.round(outputSize / aspect)) : outputSize;

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Prefer bitmap with EXIF orientation; fall back to DOM image
      let drawn = false;
      if (typeof createImageBitmap === "function") {
        try {
          const res = await fetch(src);
          const blob = await res.blob();
          const bitmap = await createImageBitmap(blob, {
            imageOrientation: "from-image",
          } as ImageBitmapOptions);
          // If EXIF rotated, natural of <img> may differ — use bitmap dims for source
          const bw = bitmap.width;
          const bh = bitmap.height;
          const scaleX = bw / natural.w;
          const scaleY = bh / natural.h;
          ctx.drawImage(
            bitmap,
            sx * scaleX,
            sy * scaleY,
            cropW * scaleX,
            cropH * scaleY,
            0,
            0,
            outW,
            outH,
          );
          bitmap.close();
          drawn = true;
        } catch {
          drawn = false;
        }
      }

      if (!drawn) {
        const img = imgRef.current;
        if (!img) throw new Error("image");
        ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, outW, outH);
      }

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/webp", 0.92);
      });

      if (!blob || blob.size === 0) throw new Error("empty");

      const base =
        fileName.replace(/\.[^.]+$/, "") ||
        "avatar";
      const file = new File([blob], `${base}.webp`, {
        type: "image/webp",
        lastModified: Date.now(),
      });

      onComplete(file);
    } catch {
      setBusy(false);
    }
  }

  if (!open) return null;

  // Frame max width for mobile/desktop
  const frameStyle = {
    width: "min(100%, 22rem)",
    aspectRatio: `${aspect}`,
  } as const;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Bağla"
        onClick={onCancel}
        disabled={busy}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-slate-950 shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
            Ləğv et
          </button>
          <p className="text-sm font-black text-white">{title}</p>
          <button
            type="button"
            onClick={handleApply}
            disabled={!imgReady || busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#29AEEE] px-3 py-1.5 text-sm font-black text-white shadow-lg shadow-[#29AEEE]/30 transition hover:bg-[#1a9ad4] disabled:opacity-50"
          >
            <Check size={16} />
            {busy ? "..." : "Hazır"}
          </button>
        </div>

        {/* Crop stage */}
        <div className="flex flex-col items-center gap-4 px-4 py-5">
          <p className="text-center text-[11px] font-semibold text-white/50">
            Şəkli sürükləyin · zoom ilə böyüdün
          </p>

          <div
            ref={frameRef}
            className="relative touch-none select-none overflow-hidden rounded-[1.55rem] bg-black shadow-inner ring-2 ring-white/20"
            style={frameStyle}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
          >
            {/* Grid overlay like Instagram */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 grid grid-cols-3 grid-rows-3"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-white/15" />
              ))}
            </div>

            {/* Soft vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 rounded-[1.55rem] ring-1 ring-inset ring-white/10"
            />

            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={src}
                alt=""
                draggable={false}
                onLoad={onImageLoad}
                className="absolute max-w-none will-change-transform"
                style={{
                  width: displayW || "100%",
                  height: displayH || "auto",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                  opacity: imgReady ? 1 : 0,
                  cursor: dragRef.current ? "grabbing" : "grab",
                }}
              />
            ) : null}

            {!imgReady && (
              <div className="absolute inset-0 grid place-items-center text-xs font-bold text-white/50">
                Yüklənir...
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="flex w-full max-w-sm items-center gap-3 px-1">
            <ZoomOut size={16} className="shrink-0 text-white/50" />
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              disabled={!imgReady || busy}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#29AEEE] disabled:opacity-40"
              aria-label="Zoom"
            />
            <ZoomIn size={16} className="shrink-0 text-white/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
