"use client";

import React, { useState } from "react";
import { Download, QrCode, X, ZoomIn } from "lucide-react";
import type { Profile } from "@/lib/types";

const qrThemeColors: Record<
  NonNullable<Profile["theme"]>,
  { accent: string; hover: string; shadow: string; text: string }
> = {
  light: {
    accent: "#1a1a2e",
    hover: "#111827",
    shadow: "rgba(26, 26, 46, 0.2)",
    text: "#ffffff",
  },
  dark: {
    accent: "#38bdf8",
    hover: "#0ea5e9",
    shadow: "rgba(56, 189, 248, 0.24)",
    text: "#082f49",
  },
  premium: {
    accent: "#d4af37",
    hover: "#b8941f",
    shadow: "rgba(212, 175, 55, 0.26)",
    text: "#1a1206",
  },
  emerald: {
    accent: "#10b981",
    hover: "#059669",
    shadow: "rgba(16, 185, 129, 0.24)",
    text: "#052e25",
  },
  ruby: {
    accent: "#e11d48",
    hover: "#be123c",
    shadow: "rgba(225, 29, 72, 0.24)",
    text: "#ffffff",
  },
  violet: {
    accent: "#8b5cf6",
    hover: "#7c3aed",
    shadow: "rgba(139, 92, 246, 0.24)",
    text: "#ffffff",
  },
  sapphire: {
    accent: "#29AEEE",
    hover: "#1a9ad4",
    shadow: "rgba(41, 174, 238, 0.24)",
    text: "#ffffff",
  },
  sunset: {
    accent: "#fb7185",
    hover: "#f43f5e",
    shadow: "rgba(251, 113, 133, 0.24)",
    text: "#44131d",
  },
  copper: {
    accent: "#1da2f1",
    hover: "#0284c7",
    shadow: "rgba(29, 162, 241, 0.24)",
    text: "#ffffff",
  },
  ios: {
    accent: "#007AFF",
    hover: "#0066D6",
    shadow: "rgba(0, 122, 255, 0.22)",
    text: "#ffffff",
  },
  iossoft: {
    accent: "#636366",
    hover: "#48484A",
    shadow: "rgba(99, 99, 102, 0.18)",
    text: "#ffffff",
  },
  iosdark: {
    accent: "#0A84FF",
    hover: "#409CFF",
    shadow: "rgba(10, 132, 255, 0.28)",
    text: "#ffffff",
  },
};

function getQrThemeColor(theme: Profile["theme"]) {
  return qrThemeColors[theme ?? "light"] ?? qrThemeColors.light;
}

/**
 * QR is generated server-side on demand — do NOT load the PNG on first paint.
 * Thumbnail loads only after the card is opened (or after idle preload).
 */
export default function QrCodeModal({
  qrUrl,
  profileName,
  theme,
}: {
  qrUrl: string;
  profileName: string;
  theme?: Profile["theme"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadQr, setLoadQr] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const themeColor = getQrThemeColor(theme);

  function open() {
    setLoadQr(true);
    setIsOpen(true);
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${profileName.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silent
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        className="lux-qr-card lux-card-enter-7 group mt-5 flex cursor-pointer items-center gap-5 rounded-2xl p-4 transition duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="lux-qr-wrap relative grid size-[7rem] shrink-0 place-items-center rounded-xl bg-white p-2">
          {loadQr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrUrl}
              alt={`${profileName} QR`}
              className="size-full rounded-lg object-contain transition group-hover:opacity-90"
              decoding="async"
            />
          ) : (
            <QrCode size={48} className="text-slate-700" strokeWidth={1.5} />
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/10 opacity-0 transition group-hover:opacity-100">
            <ZoomIn className="text-white drop-shadow-md" size={20} />
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <QrCode size={14} className="shrink-0 text-indigo-500" />
            <span>QR kod</span>
          </div>
          <p className="mt-1 text-[11px] font-medium leading-[1.6] text-gray-400">
            NFC işləmədikdə klikləyib böyüdün və kamera ilə skan edin.
          </p>
        </div>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 transition-all duration-300 md:bg-black/80 md:backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <X size={20} />
            </button>
            <h3 className="mb-4 text-center text-lg font-bold text-slate-800">
              {profileName} — QR Kod
            </h3>
            <div className="rounded-2xl bg-white p-3 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt={`${profileName} QR`}
                className="size-[18rem] rounded-xl object-contain"
                decoding="async"
              />
            </div>
            <p className="mt-4 text-center text-xs font-semibold text-slate-400">
              Digər cihazın kamerası ilə skan edərək profili tez aça bilərsiniz.
            </p>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.96] disabled:bg-slate-300 disabled:text-white disabled:shadow-none"
              style={{
                backgroundColor: downloading ? "#cbd5e1" : themeColor.accent,
                color: downloading ? "#ffffff" : themeColor.text,
                boxShadow: downloading
                  ? "none"
                  : `0 10px 24px ${themeColor.shadow}`,
              }}
            >
              <Download size={16} />
              {downloading ? "Endirilir..." : "PNG olaraq endir"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
