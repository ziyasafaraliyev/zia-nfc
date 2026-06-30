"use client";

import React from "react";
import { ArrowUpRight, Plus, Minus, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
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
            {sections.map((section: any) => {
              const isExpanded = expandedSection === section.id;
              const hasImages = section.images?.length > 0;
              
              return (
                <div key={section.id} className="space-y-2">
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/85 shadow-sm"
                  >
                    <span className="text-sm font-bold text-slate-800">{section.name || "Untitled"}</span>
                    {isExpanded ? (
                      <Minus size={18} className="text-slate-600" />
                    ) : (
                      <Plus size={18} className="text-slate-600" />
                    )}
                  </button>
                  
                  {isExpanded && hasImages && (
                    <div className="grid grid-cols-2 gap-2.5">
                      {section.images.map((image: string, index: number) => (
                        <button
                          key={`${section.id}-${image}-${index}`}
                          onClick={() => openLightbox(section.images, index)}
                          className={`${index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"} group relative overflow-hidden rounded-[1.5rem] lux-gallery-item`}
                        >
                          <img
                            src={image}
                            alt={`${profile.name} — ${section.name} ${index + 1}`}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                          <div className="absolute bottom-3 right-3 flex size-8 translate-y-2 items-center justify-center rounded-full lux-gallery-btn opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <ArrowUpRight size={14} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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