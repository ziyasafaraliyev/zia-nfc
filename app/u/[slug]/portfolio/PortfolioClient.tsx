"use client";

import React from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
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
  const sections = normalizeGallery(profile.gallery);

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
                        <a
                          key={`${section.id}-${image}-${index}`}
                          href={image}
                          target="_blank"
                          rel="noreferrer"
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
                        </a>
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
    </main>
  );
}