"use client";

import React, { useState } from "react";
import { Download, QrCode, X, ZoomIn } from "lucide-react";

export default function QrCodeModal({ qrUrl, profileName }: { qrUrl: string; profileName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
        onClick={() => setIsOpen(true)}
        className="mt-5 lux-qr-card flex items-center gap-5 rounded-2xl p-4 lux-card-enter-7 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition duration-200 group"
      >
        <div className="lux-qr-wrap shrink-0 rounded-xl p-2 relative bg-white">
          <img
            src={qrUrl}
            alt={`${profileName} QR`}
            className="size-[7rem] rounded-lg transition group-hover:opacity-90 object-contain border-none outline-none"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition rounded-xl">
            <ZoomIn className="text-white drop-shadow-md" size={20} />
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <QrCode size={14} className="text-indigo-500 shrink-0" />
            <span>QR kod</span>
          </div>
          <p className="mt-1 text-[11px] font-medium leading-[1.6] text-gray-400">
            NFC işləmədikdə klikləyib böyüdün və kamera ilə skan edin.
          </p>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative bg-white p-6 rounded-3xl max-w-sm w-full flex flex-col items-center shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition text-slate-500"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">{profileName} — QR Kod</h3>
            <div className="p-3 bg-white rounded-2xl shadow-inner">
              <img
                src={qrUrl}
                alt={`${profileName} QR`}
                className="size-[18rem] rounded-xl object-contain border-none outline-none"
              />
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-4 text-center">
              Digər cihazın kamerası ilə skan edərək profili tez aça bilərsiniz.
            </p>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#29AEEE] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#29AEEE]/20 transition-all duration-200 hover:bg-[#1a9ad4] active:scale-[0.96] disabled:bg-slate-300 disabled:shadow-none"
            >
              <Download size={16} />
              {downloading ? "Endirilir..." : "PNG olaraq endir"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

