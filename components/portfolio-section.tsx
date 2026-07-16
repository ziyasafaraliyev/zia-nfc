"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Image as ImageIcon,
  X,
} from "lucide-react";
import type { PortfolioSection as PortfolioSectionType } from "@/lib/types";

type GalleryInput = string[] | PortfolioSectionType[];

function normalizeSections(gallery: GalleryInput): PortfolioSectionType[] {
  if (!gallery || gallery.length === 0) return [];

  if (
    gallery.length > 0 &&
    typeof gallery[0] === "object" &&
    gallery[0] !== null &&
    "images" in gallery[0]
  ) {
    return (gallery as PortfolioSectionType[]).filter(
      (section) => (section.images?.length ?? 0) > 0,
    );
  }

  const images = gallery as string[];
  if (images.length === 0) return [];

  return [
    {
      id: "default",
      name: "Portfolio",
      images,
    },
  ];
}

export default function PortfolioSection({
  gallery,
  profileName,
}: {
  gallery: GalleryInput;
  profileName: string;
}) {
  const sections = normalizeSections(gallery);
  const totalImages = sections.reduce(
    (acc, section) => acc + (section.images?.length ?? 0),
    0,
  );

  const [showSections, setShowSections] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [activeSectionName, setActiveSectionName] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (totalImages === 0) return null;

  function openLightbox(images: string[], sectionName: string, startIndex = 0) {
    setLightboxImages(images);
    setActiveSectionName(sectionName);
    setCurrentImageIndex(startIndex);
    setIsLightboxOpen(true);
  }

  function closeLightbox() {
    setIsLightboxOpen(false);
    setLightboxImages([]);
    setActiveSectionName("");
    setCurrentImageIndex(0);
  }

  function nextImage() {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  }

  function prevImage() {
    setCurrentImageIndex(
      (prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length,
    );
  }

  return (
    <>
      <div className="mt-2.5 space-y-3 lux-card-enter-4">
        <button
          type="button"
          onClick={() => setShowSections((open) => !open)}
          className="lux-save-contact group flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="flex items-center gap-3">
            <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
              <ImageIcon size={18} />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-sm font-bold text-gray-800">Portfolio</span>
              <span className="mt-0.5 text-[10px] font-semibold text-gray-400">
                {sections.length} bölmə · {totalImages} şəkil
              </span>
            </span>
          </span>
          {showSections ? (
            <ChevronUp size={18} className="text-gray-400 transition-colors group-hover:text-[#29AEEE]" />
          ) : (
            <ChevronDown size={18} className="text-gray-400 transition-colors group-hover:text-[#29AEEE]" />
          )}
        </button>

        {showSections ? (
          <div className="space-y-2.5">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  openLightbox(section.images, section.name || "Portfolio", 0)
                }
                className="lux-save-contact group flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 hover:scale-[1.01]"
              >
                <span className="text-sm font-bold text-gray-800">
                  {section.name || "Portfolio"}
                </span>
                <span className="text-xs font-semibold text-gray-400 transition-colors group-hover:text-[#29AEEE]">
                  {section.images.length} şəkil
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isLightboxOpen ? (
        <div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between text-white">
            <div className="flex flex-col gap-1">
              {activeSectionName ? (
                <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {activeSectionName}
                </span>
              ) : null}
              <span className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
                {currentImageIndex + 1} / {lightboxImages.length}
              </span>
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              className="rounded-full bg-black/40 p-2.5 text-white/90 transition hover:bg-black/60"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="relative flex aspect-square max-h-[75vh] w-full max-w-3xl items-center justify-center md:aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImages[currentImageIndex]}
              alt={`${profileName} — ${activeSectionName} — ${currentImageIndex + 1}`}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
              decoding="async"
            />

            {lightboxImages.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white transition hover:bg-black/60 active:scale-95"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white transition hover:bg-black/60 active:scale-95"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            ) : null}
          </div>

          {lightboxImages.length > 1 ? (
            <div
              className="z-10 mt-6 flex max-w-full justify-center gap-2 overflow-x-auto p-2"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxImages.map((image, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative size-12 shrink-0 overflow-hidden rounded-lg border-2 transition duration-200 ${
                    currentImageIndex === idx
                      ? "scale-105 border-[#29AEEE]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
