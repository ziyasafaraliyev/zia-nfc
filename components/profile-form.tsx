"use client";

import React, { useState } from "react";
import { ImagePlus, Upload, Save, Trash2, Plus, Minus } from "lucide-react";
import { saveProfile } from "@/app/admin/actions";
import type { Profile, PortfolioSection } from "@/lib/types";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none backdrop-blur-sm transition duration-200 placeholder:text-slate-400 focus:border-[#29AEEE] focus:bg-white focus:ring-4 focus:ring-[#29AEEE]/20" +
  " font-[Outfit]";

const socialBaseUrls = {
  whatsapp: "https://wa.me/994",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@",
  threads: "https://www.threads.net/@",
  website: "https://www.",
  waze: "https://www.waze.com/ul?ll=",
  facebook: "https://www.facebook.com/",
  x: "https://x.com/",
  linkedin: "https://www.linkedin.com/in/",
  youtube: "https://www.youtube.com/@",
  behance: "https://www.behance.net/",
} as const;

function getSocialFieldValue(
  key: keyof typeof socialBaseUrls,
  value?: string | null,
) {
  return value?.trim() ? value : socialBaseUrls[key];
}

// Canvas-based client-side image compression function (preserves PNG transparency)
async function compressImage(file: File, maxWidth = 1200, quality = 0.75): Promise<File> {
  return new Promise((resolve) => {
    // If not an image or is a GIF, return unmodified
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize dynamically
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type;
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          mimeType,
          mimeType === "image/jpeg" || mimeType === "image/webp" ? quality : undefined
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

// Helper to process items in parallel with a concurrency limit
async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency = 3
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await processor(items[currentIndex]);
    }
  }

  const workers: Promise<void>[] = [];
  for (let i = 0; i < Math.min(concurrency, items.length); i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
  return results;
}

// Helper to normalize old gallery data
function normalizeGallery(gallery: string[] | PortfolioSection[] | undefined): PortfolioSection[] {
  if (!gallery || gallery.length === 0) return [];
  
  // If it's already the new format
  if (gallery.length > 0 && typeof gallery[0] === 'object' && 'id' in gallery[0]) {
    return gallery as PortfolioSection[];
  }
  
  // If it's the old format, convert to a default section
  return [{
    id: crypto.randomUUID(),
    name: "Portfolio",
    images: gallery as string[]
  }];
}

type SectionWithFiles = PortfolioSection & {
  newFiles: { name: string; previewUrl: string; file?: File }[];
};

export default function ProfileForm({ profile, userRole = "super_admin" }: { profile?: Profile; userRole?: "super_admin" | "client" }) {
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [backgroundPreview, setBackgroundPreview] = useState(profile?.background_url || "");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [removeCv, setRemoveCv] = useState(false);

  const [sections, setSections] = useState<SectionWithFiles[]>(() => 
    normalizeGallery(profile?.gallery).map(section => ({
      ...section,
      newFiles: []
    }))
  );
  const [theme, setTheme] = useState(profile?.theme || "light");

  // Add new section
  const addSection = () => {
    setSections(prev => [...prev, {
      id: crypto.randomUUID(),
      name: "",
      images: [],
      newFiles: []
    }]);
  };

  // Delete section
  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
  };

  // Update section name
  const updateSectionName = (sectionId: string, name: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, name } : s
    ));
  };

  // Remove image from section
  const removeImageFromSection = (sectionId: string, imageIndex: number) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        images: s.images.filter((_, i) => i !== imageIndex)
      };
    }));
  };

  // Add new files to section
  const addFilesToSection = (sectionId: string, files: FileList) => {
    const newFilesList = Array.from(files)
      .filter(file => file.type.startsWith("image/"))
      .map(file => ({
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        file
      }));

    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, newFiles: [...s.newFiles, ...newFilesList] } : s
    ));
  };

  // Remove new file from section
  const removeNewFileFromSection = (sectionId: string, fileIndex: number) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        newFiles: s.newFiles.filter((_, i) => i !== fileIndex)
      };
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatusText("Şəkillər hazırlanır...");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      // Handle avatar file compression
      const avatarFile = formData.get("avatar") as File | null;
      if (avatarFile && avatarFile.size > 0 && !removeAvatar) {
        const compressed = await compressImage(avatarFile);
        formData.set("avatar", compressed);
      } else if (removeAvatar) {
        formData.delete("avatar");
      }

      // Handle background file compression
      const backgroundFile = formData.get("background") as File | null;
      if (backgroundFile && backgroundFile.size > 0 && !removeBackground) {
        const compressed = await compressImage(backgroundFile);
        formData.set("background", compressed);
      } else if (removeBackground) {
        formData.delete("background");
      }

      if (removeCv) {
        formData.delete("cv");
      }

      // Compress all section files in parallel
      const allFilesToCompress: { sectionId: string; file: File }[] = [];
      sections.forEach(section => {
        section.newFiles.forEach(item => {
          if (item.file) {
            allFilesToCompress.push({ sectionId: section.id, file: item.file });
          }
        });
      });

      const compressedFiles: { sectionId: string; file: File }[] = [];
      if (allFilesToCompress.length > 0) {
        setStatusText(`Şəkil sıxılır: 0/${allFilesToCompress.length}`);
        let processed = 0;
        
        const results = await processInParallel(
          allFilesToCompress,
          async ({ sectionId, file }) => {
            const compressed = await compressImage(file);
            processed++;
            setStatusText(`Şəkil sıxılır: ${processed}/${allFilesToCompress.length}`);
            return { sectionId, file: compressed };
          },
          3
        );
        
        compressedFiles.push(...results);
      }

      // Build final sections data
      const finalSections: PortfolioSection[] = sections.map(section => {
        const newSectionImages = compressedFiles
          .filter(cf => cf.sectionId === section.id)
          .map(_ => ""); // We'll fill these in the server action
        
        return {
          id: section.id,
          name: section.name || "Untitled Section",
          images: section.images
        };
      });

      // Add gallery data to form
      formData.set("gallery", JSON.stringify(finalSections));

      // Add all compressed files with section ID prefix
      compressedFiles.forEach(({ sectionId, file }, index) => {
        formData.append(`galleryFiles_${sectionId}`, file);
      });

      setStatusText("Məlumatlar yadda saxlanılır...");
      await saveProfile(formData);
      window.location.reload();
    } catch (err: any) {
      if (err.message === "NEXT_REDIRECT" || err.digest?.includes("NEXT_REDIRECT")) {
        window.location.href = "/admin?saved=1";
        return;
      }
      setStatusText("Xəta baş verdi: " + err.message);
      setSubmitting(false);
    }
  }

  const [isPortfolioDragging, setIsPortfolioDragging] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <input type="hidden" name="id" value={profile?.id ?? ""} />
      
      {/* ── ŞƏXSİ MƏLUMATLAR ── */}
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          name="name"
          label="Ad Soyad"
          defaultValue={profile?.name}
          required
        />
        <Field
          name="slug"
          label="Profil linki / slug"
          defaultValue={profile?.slug}
          required
          readOnly={userRole === "client"}
        />
        <Field
          name="profession"
          label="Peşə"
          defaultValue={profile?.profession}
        />
        <Field
          name="email"
          label="E-poçt"
          defaultValue={profile?.email}
          placeholder="email@example.com"
          type="email"
        />
        <Field name="phone" label="Telefon" defaultValue={profile?.phone} />
        <Field name="phone2" label="Telefon 2" defaultValue={profile?.phone2} />
        <Field
          name="whatsapp"
          label="WhatsApp"
          defaultValue={getSocialFieldValue("whatsapp", profile?.whatsapp)}
        />
        <Field
          name="whatsapp2"
          label="WhatsApp 2"
          defaultValue={profile?.whatsapp2}
        />
        <Field
          name="instagram"
          label="Instagram URL"
          defaultValue={getSocialFieldValue("instagram", profile?.instagram)}
        />
        <Field
          name="tiktok"
          label="TikTok URL"
          defaultValue={getSocialFieldValue("tiktok", profile?.tiktok)}
        />
        <Field
          name="website"
          label="Website URL"
          defaultValue={getSocialFieldValue("website", profile?.website)}
        />
        <Field
          name="facebook"
          label="Facebook URL"
          defaultValue={getSocialFieldValue("facebook", profile?.facebook)}
        />
        <Field
          name="x"
          label="X (Twitter) URL"
          defaultValue={getSocialFieldValue("x", profile?.x)}
        />
        <Field
          name="threads"
          label="Threads URL"
          defaultValue={getSocialFieldValue("threads", profile?.threads)}
        />
        <Field
          name="linkedin"
          label="LinkedIn URL"
          defaultValue={getSocialFieldValue("linkedin", profile?.linkedin)}
        />
        <Field
          name="youtube"
          label="YouTube URL"
          defaultValue={getSocialFieldValue("youtube", profile?.youtube)}
        />
        <Field
          name="behance"
          label="Behance URL"
          defaultValue={getSocialFieldValue("behance", profile?.behance)}
        />
        <Field
          name="waze"
          label="Waze URL"
          defaultValue={getSocialFieldValue("waze", profile?.waze)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          name="location"
          label="Lokasiya adı"
          defaultValue={profile?.location}
          placeholder="məs: Bakı, Azərbaycan"
        />
        <Field
          name="location_url"
          label="Xəritə linki (Google Maps)"
          defaultValue={profile?.location_url}
          placeholder="https://maps.google.com/..."
        />
      </div>

      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
        Bio
        <textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          rows={4}
          placeholder="Özünüz haqqında qısa məlumat..."
          className={inputClass}
        />
      </label>

      {/* ── ŞƏKİL YÜKLƏMƏ ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Avatar */}
        <ImageDropZone
          label="Profil şəkli"
          inputName="avatar"
          preview={avatarPreview}
          hasExisting={!!profile?.avatar_url}
          removed={removeAvatar}
          aspect="square"
          onFileChange={(file) => {
            setAvatarPreview(URL.createObjectURL(file));
            setRemoveAvatar(false);
          }}
          onRemove={() => {
            setRemoveAvatar(true);
            setAvatarPreview("");
          }}
        />
        {/* Background */}
        <ImageDropZone
          label="Cover şəkli"
          inputName="background"
          preview={backgroundPreview}
          hasExisting={!!profile?.background_url}
          removed={removeBackground}
          aspect="square"
          onFileChange={(file) => {
            setBackgroundPreview(URL.createObjectURL(file));
            setRemoveBackground(false);
          }}
          onRemove={() => {
            setRemoveBackground(true);
            setBackgroundPreview("");
          }}
        />
      </div>
      <input type="hidden" name="remove_avatar" value={removeAvatar ? "on" : "off"} />
      <input type="hidden" name="remove_background" value={removeBackground ? "on" : "off"} />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          name="cover_style"
          label="Cover görünüşü"
          defaultValue={profile?.cover_style ?? "auto"}
          options={[
            { value: "auto", label: "Auto / premium" },
            { value: "square", label: "Kvadrat / 1:1" },
            { value: "banner", label: "Banner / aşağı hündürlük" },
          ]}
        />
        <SelectField
          name="cover_position"
          label="Cover fokus yeri"
          defaultValue={profile?.cover_position ?? "center"}
          options={[
            { value: "top", label: "Yuxarı" },
            { value: "center", label: "Mərkəz" },
            { value: "bottom", label: "Aşağı" },
          ]}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2.5">
          Profil Teması
        </span>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "light"
              ? "border-[#29AEEE] bg-[#29AEEE]/5 text-[#29AEEE] shadow-sm"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}>
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
              className="sr-only"
            />
            <span>Ağ (Light)</span>
          </label>
          <label className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "dark"
              ? "border-slate-800 bg-slate-900 text-white shadow-md shadow-slate-900/20"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
              className="sr-only"
            />
            <span>Qara (Dark)</span>
          </label>
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "premium"
              ? "border-[#d4af37] bg-[linear-gradient(135deg,#120f08_0%,#23180a_45%,#3a2a10_100%)] text-[#f5deb3] shadow-[0_12px_30px_rgba(212,175,55,0.22)]"
              : "border-slate-200 bg-[linear-gradient(135deg,#fffaf0_0%,#ffffff_100%)] text-slate-700 hover:border-[#d4af37]/50 hover:bg-[#fffaf0]"
          }`}>
            <span
              aria-hidden
              className={`absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(245,222,179,0.9),transparent)] transition-opacity duration-200 ${
                theme === "premium" ? "opacity-100" : "opacity-0"
              }`}
            />
            <input
              type="radio"
              name="theme"
              value="premium"
              checked={theme === "premium"}
              onChange={() => setTheme("premium")}
              className="sr-only"
            />
            <span>Premium Gold</span>
          </label>
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "emerald"
              ? "border-[#10b981] bg-[linear-gradient(135deg,#062c22_0%,#0d4334_45%,#116b53_100%)] text-[#d1fae5] shadow-[0_12px_30px_rgba(16,185,129,0.22)]"
              : "border-slate-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_100%)] text-slate-700 hover:border-[#10b981]/50 hover:bg-[#ecfdf5]"
          }`}>
            <input
              type="radio"
              name="theme"
              value="emerald"
              checked={theme === "emerald"}
              onChange={() => setTheme("emerald")}
              className="sr-only"
            />
            <span>Zümrüd</span>
          </label>
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "ruby"
              ? "border-[#e11d48] bg-[linear-gradient(135deg,#310814_0%,#5e1028_45%,#881337_100%)] text-[#ffe4e6] shadow-[0_12px_30px_rgba(225,29,72,0.22)]"
              : "border-slate-200 bg-[linear-gradient(135deg,#fff1f2_0%,#ffffff_100%)] text-slate-700 hover:border-[#e11d48]/50 hover:bg-[#fff1f2]"
          }`}>
            <input
              type="radio"
              name="theme"
              value="ruby"
              checked={theme === "ruby"}
              onChange={() => setTheme("ruby")}
              className="sr-only"
            />
            <span>Yaqut</span>
          </label>
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "violet"
              ? "border-[#8b5cf6] bg-[linear-gradient(135deg,#1e1038_0%,#35205f_45%,#5b21b6_100%)] text-[#ede9fe] shadow-[0_12px_30px_rgba(139,92,246,0.22)]"
              : "border-slate-200 bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_100%)] text-slate-700 hover:border-[#8b5cf6]/50 hover:bg-[#f5f3ff]"
          }`}>
            <input
              type="radio"
              name="theme"
              value="violet"
              checked={theme === "violet"}
              onChange={() => setTheme("violet")}
              className="sr-only"
            />
            <span>Bənövşəyi</span>
          </label>
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "sapphire"
              ? "border-[#29AEEE] bg-[linear-gradient(135deg,#071821_0%,#0c2d40_45%,#155978_100%)] text-[#e6f8ff] shadow-[0_12px_30px_rgba(41,174,238,0.24)]"
              : "border-slate-200 bg-[linear-gradient(135deg,#eefaff_0%,#ffffff_100%)] text-slate-700 hover:border-[#29AEEE]/50 hover:bg-[#eefaff]"
          }`}>
            <input
              type="radio"
              name="theme"
              value="sapphire"
              checked={theme === "sapphire"}
              onChange={() => setTheme("sapphire")}
              className="sr-only"
            />
            <span>Mavi</span>
          </label>
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "sunset"
              ? "border-[#fb7185] bg-[linear-gradient(135deg,#2f1118_0%,#5b2434_45%,#9f4058_100%)] text-[#fff1f2] shadow-[0_12px_30px_rgba(251,113,133,0.22)]"
              : "border-slate-200 bg-[linear-gradient(135deg,#fff1f2_0%,#ffffff_100%)] text-slate-700 hover:border-[#fb7185]/50 hover:bg-[#fff1f2]"
          }`}>
            <input
              type="radio"
              name="theme"
              value="sunset"
              checked={theme === "sunset"}
              onChange={() => setTheme("sunset")}
              className="sr-only"
            />
            <span>Günbatımı</span>
          </label>
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "copper"
              ? "border-[#1da2f1] bg-[linear-gradient(135deg,#0a1824_0%,#10314a_45%,#1d4f73_100%)] text-[#eef8ff] shadow-[0_12px_30px_rgba(29,162,241,0.2)]"
              : "border-slate-200 bg-[linear-gradient(135deg,#eff8ff_0%,#ffffff_100%)] text-slate-700 hover:border-[#1da2f1]/40 hover:bg-[#eff8ff]"
          }`}>
            <input
              type="radio"
              name="theme"
              value="copper"
              checked={theme === "copper"}
              onChange={() => setTheme("copper")}
              className="sr-only"
            />
            <span>Digital</span>
          </label>
        </div>
      </div>

      {/* ── PORTFOLIO ŞƏKİLLƏRİ ── */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <ImagePlus size={14} className="text-[#29AEEE]" /> Portfolio Bölmələri
          </span>
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#29AEEE] bg-white px-4 py-2 text-[11px] font-bold text-[#29AEEE] shadow-sm transition-all duration-200 hover:bg-[#29AEEE]/5"
          >
            <Plus size={14} /> Yeni Bölmə
          </button>
        </div>

        {/* Sections */}
        {sections.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
            <p className="text-sm font-bold text-slate-600">Hələ bölmə yoxdur.</p>
            <button
              type="button"
              onClick={addSection}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#29AEEE] px-4 py-2 text-[11px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#1a9ad4]"
            >
              <Plus size={14} /> İlk Bölməni Əlavə Et
            </button>
          </div>
        ) : (
          sections.map((section) => (
            <div key={section.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={section.name}
                  onChange={(e) => updateSectionName(section.id, e.target.value)}
                  placeholder="Bölmə adı (məs: Üstəri Layihələri)"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/10 outline-none"
                />
                <button
                  type="button"
                  onClick={() => deleteSection(section.id)}
                  className="grid size-10 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Upload area for section */}
              <div
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/jpeg,image/png,image/webp,image/gif";
                  input.multiple = true;
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) addFilesToSection(section.id, files);
                  };
                  input.click();
                }}
                className="block rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center cursor-pointer hover:border-[#29AEEE] hover:bg-[#29AEEE]/5 transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <Upload size={20} className="text-[#29AEEE]" />
                  <span className="text-xs font-semibold text-slate-600">Bu bölməyə şəkil əlavə et</span>
                </div>
              </div>

              {/* Existing images in section */}
              {section.images.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-green-600">Mövcud şəkillər ({section.images.length}):</span>
                  <div className="grid grid-cols-4 gap-2">
                    {section.images.map((url, index) => (
                      <div key={`${section.id}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-green-200 bg-white group">
                        <img src={url} alt={`${section.name} ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImageFromSection(section.id, index);
                          }}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New files for section */}
              {section.newFiles.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400">Yüklənəcək ({section.newFiles.length} yeni şəkil):</span>
                  <div className="grid grid-cols-4 gap-2">
                    {section.newFiles.map((file, index) => (
                      <div key={`${section.id}-new-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white group">
                        <img src={file.previewUrl} alt={file.name} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNewFileFromSection(section.id, index);
                          }}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>


      {/* ── CV YÜKLƏMƏ (PDF) ── */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
          CV / Resüme <span className="text-[10px] text-slate-400 font-medium normal-case tracking-normal">(yalnız PDF)</span>
        </span>
        <input 
          type="file" 
          name="cv" 
          accept="application/pdf" 
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#29AEEE]/10 file:text-[#29AEEE] hover:file:bg-[#29AEEE]/20 transition"
        />
        {/* @ts-ignore - cv_url is not strictly in Profile type if we didn't update it yet */}
        {(profile as any)?.cv_url && !removeCv && (
           <div className="text-sm font-bold text-green-600 flex items-center gap-2 mt-2">
             ✓ Cari CV mövcuddur 
             <button type="button" onClick={() => setRemoveCv(true)} className="text-red-500 underline ml-2">Sil</button>
           </div>
        )}
        {removeCv && (
           <div className="text-sm text-red-500 font-bold mt-2">
             CV silinəcək. 
             <button type="button" onClick={() => setRemoveCv(false)} className="text-[#29AEEE] underline ml-2">Ləğv et</button>
           </div>
        )}
        <input type="hidden" name="remove_cv" value={removeCv ? "on" : "off"} />
      </div>

      {userRole === "super_admin" && (
        <>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Müştəri Giriş Məlumatları
            </span>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Field
                  name="client_email"
                  label="Müştəri E-poçtu"
                  defaultValue={profile?.client_email}
                  placeholder="musteri@example.com"
                />
              </div>
              <div className="flex-1">
                <Field
                  name="client_password"
                  label="Yeni Şifrə (dəyişmək üçün doldurun)"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-bold text-slate-600 uppercase tracking-wide cursor-pointer hover:bg-slate-50 transition">
            <span>Profil aktivdir</span>
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={profile?.enabled ?? true}
              className="size-5 rounded accent-indigo-650"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-bold text-slate-600 uppercase tracking-wide cursor-pointer hover:bg-slate-50 transition">
            <span>Rezervasiya sistemi aktivdir</span>
            <input
              type="checkbox"
              name="reservation_enabled"
              defaultChecked={profile?.reservation_enabled ?? false}
              className="size-5 rounded accent-indigo-650"
            />
          </label>
        </>
      )}

      <button
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#29AEEE] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#29AEEE]/20 transition-all duration-200 hover:bg-[#1a9ad4] hover:shadow-lg hover:shadow-[#29AEEE]/25 active:scale-[0.96] disabled:bg-slate-300 disabled:shadow-none"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <Save size={16} /> {submitting ? statusText : "Yadda Saxla"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  required = false,
  placeholder,
  readOnly = false,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
      {label}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${inputClass} ${readOnly ? "bg-slate-100 cursor-not-allowed opacity-80" : ""}`}
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
      {label}
      <select name={name} defaultValue={defaultValue} className={inputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ── Drag & Drop Upload Zone ── */
function ImageDropZone({
  label,
  inputName,
  preview,
  hasExisting,
  removed,
  aspect,
  onFileChange,
  onRemove,
}: {
  label: string;
  inputName: string;
  preview: string;
  hasExisting: boolean;
  removed: boolean;
  aspect: "square" | "wide";
  onFileChange: (file: File) => void;
  onRemove: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasImage = preview && !removed;

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    onFileChange(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
        {inputName === "avatar" ? (
          <Upload size={13} className="text-[#29AEEE]" />
        ) : (
          <ImagePlus size={13} className="text-[#29AEEE]" />
        )}
        {label}
      </span>

      {/* Drop Zone */}
      <div
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        onClick={() => !hasImage && inputRef.current?.click()}
        className={[
          "relative overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none",
          aspect === "square" ? "aspect-square w-full" : "aspect-video w-full",
          hasImage
            ? "border-slate-200 cursor-default"
            : isDragging
              ? "border-[#29AEEE] bg-[#29AEEE]/5 scale-[1.01]"
              : "border-dashed border-slate-300 bg-slate-50 hover:border-[#29AEEE] hover:bg-[#29AEEE]/5",
        ].join(" ")}
      >
        {hasImage ? (
          /* Preview */
          <img
            src={preview}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          /* Empty state */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
            <div className={[
              "grid size-10 place-items-center rounded-xl transition-colors duration-200",
              isDragging ? "bg-[#29AEEE]/15 text-[#29AEEE]" : "bg-slate-100 text-slate-400",
            ].join(" ")}>
              <Upload size={18} />
            </div>
            <div className="text-center">
              <p className={[
                "text-[11px] font-bold transition-colors",
                isDragging ? "text-[#29AEEE]" : "text-slate-500",
              ].join(" ")}>
                {isDragging ? "Buraxın!" : "Sürükleyin və ya basın"}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP</p>
            </div>
          </div>
        )}

        {/* Drag overlay on preview */}
        {hasImage && isDragging && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#29AEEE]/70 backdrop-blur-sm">
            <Upload size={24} className="text-white" />
            <p className="text-xs font-bold text-white">Buraxın!</p>
          </div>
        )}

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          name={inputName}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#29AEEE] px-3 py-2 text-[11px] font-bold text-white shadow-sm transition duration-200 hover:bg-[#1a9ad4] active:scale-95"
        >
          <Upload size={12} /> Şəkil seç
        </button>
        {(hasExisting || hasImage) && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-bold text-rose-600 transition duration-200 hover:bg-rose-100 active:scale-95"
          >
            <Trash2 size={12} /> Sil
          </button>
        )}
      </div>

      {removed && (
        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg text-center">
          Şəkil silinəcək
        </span>
      )}
    </div>
  );
}
