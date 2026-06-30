"use client";

import React from "react";
import { Image, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";

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
  const [showProjects, setShowProjects] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sections = normalizeGallery(profile.gallery);

  function openLightbox(images: string[], startIndex: number) {
    setLightboxImages(images);
    setCurrentImageIndex(startIndex);
    setIsLightboxOpen(true);
  }

  function nextImage() {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  }

  function prevImage() {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  }

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
                  <Image size={18} />
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

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Info Bar */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-10">
            <span className="text-xs font-bold uppercase tracking-wider bg-black/40 px-3 py-1.5 rounded-full backdrop-blur">
              {currentImageIndex + 1} / {lightboxImages.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
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
              src={lightboxImages[currentImageIndex]}
              alt={`${profile.name} portfolio - ${currentImageIndex + 1}`}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {lightboxImages.length > 1 && (
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
          {lightboxImages.length > 1 && (
            <div
              className="mt-6 flex justify-center gap-2 overflow-x-auto max-w-full p-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxImages.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative size-12 shrink-0 rounded-lg overflow-hidden border-2 transition duration-200 ${currentImageIndex === idx ? "border-[#29AEEE] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}