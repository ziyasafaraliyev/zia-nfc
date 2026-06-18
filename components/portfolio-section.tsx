"use client";

import React, { useState } from "react";
import { Image, X, ArrowLeftRight, ChevronLeft, ChevronRight, Eye, ExternalLink } from "lucide-react";

export default function PortfolioSection({ gallery, profileName }: { gallery: string[]; profileName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  function nextImage() {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  }

  function prevImage() {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  }

  return (
    <>
      {/* ── PORTFOLIO BUTTON ── */}
      <button
        onClick={() => {
          setCurrentIndex(0);
          setIsOpen(true);
        }}
        className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
      >
        <span className="flex items-center gap-3">
          <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
            <Image size={18} />
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-sm font-bold text-gray-800">Portfolio</span>
            <span className="text-[10px] font-semibold text-gray-400 mt-0.5">{gallery.length} iş nümayiş olunur</span>
          </span>
        </span>
        <ExternalLink
          size={15}
          className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>

      {/* ── LIGHTBOX MODAL ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Top Info Bar */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-10">
            <span className="text-xs font-bold uppercase tracking-wider bg-black/40 px-3 py-1.5 rounded-full backdrop-blur">
              {currentIndex + 1} / {gallery.length}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition text-white/90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Image Viewer Frame */}
          <div
            className="relative max-w-3xl w-full aspect-square md:aspect-[4/3] max-h-[75vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[currentIndex]}
              alt={`${profileName} portfolio - ${currentIndex + 1}`}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {gallery.length > 1 && (
              <>
                {/* Left navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition active:scale-95"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Right navigation */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition active:scale-95"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {gallery.length > 1 && (
            <div
              className="mt-6 flex justify-center gap-2 overflow-x-auto max-w-full p-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative size-12 shrink-0 rounded-lg overflow-hidden border-2 transition duration-200 ${currentIndex === idx ? "border-[#29AEEE] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
