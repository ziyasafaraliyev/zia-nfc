"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

function normalizeGallery(gallery: any[]) {
  if (!gallery || gallery.length === 0) return [];
  
  if (gallery.length > 0 && typeof gallery[0] === 'object' && 'images' in gallery[0]) {
    return gallery;
  }
  
  return [{
    id: "default",
    name: "Portfolio",
    images: gallery
  }];
}

export default function PortfolioClient({ profile }: { profile: any }) {
  const [mounted, setMounted] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sections = normalizeGallery(profile.gallery);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  function openLightbox(images: string[], startIndex: number) {
    setLightboxImages(images);
    setCurrentImageIndex(startIndex);
    setIsLightboxOpen(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    setIsLightboxOpen(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }

  function nextImage() {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  }

  function prevImage() {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  }

  const lightboxContent = isLightboxOpen ? (
    <div
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black/90 p-4"
      onClick={closeLightbox}
    >
      {/* Top Info Bar */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-10">
        <span className="text-xs font-bold uppercase tracking-wider bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">
          {currentImageIndex + 1} / {lightboxImages.length}
        </span>
        <button
          onClick={closeLightbox}
          className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 transition text-white/90 backdrop-blur-md"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image Viewer Frame */}
      <div
        className="relative flex h-full max-h-[85vh] w-full max-w-4xl items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lightboxImages[currentImageIndex]}
          alt={`${profile.name} portfolio - ${currentImageIndex + 1}`}
          className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
          decoding="async"
        />

        {lightboxImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition active:scale-95 backdrop-blur-md"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition active:scale-95 backdrop-blur-md"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  ) : null;

  return (
    <main className="lux-shell relative min-h-screen overflow-x-hidden">
      <div className="relative z-10 mx-auto max-w-[440px] px-4 py-6 pb-16">
        <header className="mt-2">
          <p className="lux-overline">Selected work</p>
          <h1 className="lux-name mt-1">{profile.name}</h1>
          {profile.profession ? (
            <p className="lux-overline mt-1">{profile.profession}</p>
          ) : null}
        </header>

        {sections.length > 0 ? (
          <section className="mt-6 space-y-4">
            {/* Portfolio Button */}
            <button
              onClick={() => setShowProjects(!showProjects)}
              className="lux-save-contact group w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition-transform duration-200 hover:scale-[1.02]"
            >
              <span className="flex items-center gap-3">
                <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
                  <ImageIcon size={18} />
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold text-gray-800">Portfolio</span>
                  <span className="text-[10px] font-semibold text-gray-400 mt-0.5">
                    {sections.length} layihə, {sections.reduce((acc: number, s: any) => acc + (s.images?.length || 0), 0)} şəkil
                  </span>
                </span>
              </span>
              <ExternalLink
                size={15}
                className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>

            {/* Project List */}
            {showProjects && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {sections.map((section: any) => {
                  const hasImages = section.images?.length > 0;
                  if (!hasImages) return null;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => openLightbox(section.images, 0)}
                      className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/85 hover:scale-[1.01] shadow-sm"
                    >
                      <span className="text-sm font-bold text-slate-800">{section.name || "Untitled"}</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {section.images.length} şəkil
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="mt-10 rounded-[2.25rem] border border-white/80 bg-white/60 p-6 text-center">
            <p className="text-sm font-bold text-slate-700">Hələ portfolio yoxdur.</p>
          </section>
        )}
      </div>

      {mounted && lightboxContent
        ? createPortal(lightboxContent, document.body)
        : null}
    </main>
  );
}