"use client";

import React, { useEffect, useState } from "react";
import { ImagePlus, Upload, Save, Trash2 } from "lucide-react";
import { saveRestaurant } from "@/app/admin/actions";
import { handleServerActionRejection } from "@/lib/server-action-client";
import RestaurantMenuEditor from "@/components/restaurant-menu-editor";
import ImageCropModal from "@/components/image-crop-modal";
import type { Restaurant } from "@/lib/types";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none backdrop-blur-sm transition duration-200 placeholder:text-slate-400 focus:border-[#29AEEE] focus:bg-white focus:ring-4 focus:ring-[#29AEEE]/20 font-sans";

const socialBaseUrls = {
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@",
  facebook: "https://www.facebook.com/",
} as const;

function getSocialFieldValue(
  key: keyof typeof socialBaseUrls,
  value?: string | null,
) {
  return value?.trim() ? value : "";
}

function getSocialPlaceholder(key: keyof typeof socialBaseUrls) {
  switch (key) {
    case "instagram":
      return "username";
    case "tiktok":
      return "username";
    case "facebook":
      return "username";
    default:
      return "";
  }
}

/** Client pre-compress → always WebP (server also stores as .webp). */
async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<File> {
  return new Promise((resolve) => {
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

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = "image/webp";
        const baseName =
          file.name.substring(0, file.name.lastIndexOf(".")) || file.name || "image";
        const newFileName = `${baseName}.webp`;
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], newFileName, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          mimeType,
          quality,
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export default function RestaurantForm({ restaurant, userRole = "super_admin" }: { restaurant?: Restaurant; userRole?: "super_admin" | "client" }) {
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(restaurant?.avatar_url || "");
  const [coverPreview, setCoverPreview] = useState(restaurant?.cover_url || "");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeCover, setRemoveCover] = useState(false);

  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(restaurant?.gallery ?? []);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<{ name: string; previewUrl: string; file?: File }[]>([]);
  const [theme, setTheme] = useState(restaurant?.theme || "light");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatusText("Şəkillər sıxılır...");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const avatarFile = formData.get("avatar") as File | null;
      if (avatarFile && avatarFile.size > 0 && !removeAvatar) {
        const compressed = await compressImage(avatarFile, 800, 0.84);
        formData.set("avatar", compressed);
      } else if (removeAvatar) {
        formData.delete("avatar");
      }

      const coverFile = formData.get("cover") as File | null;
      if (coverFile && coverFile.size > 0 && !removeCover) {
        const compressed = await compressImage(coverFile, 1600, 0.8);
        formData.set("cover", compressed);
      } else if (removeCover) {
        formData.delete("cover");
      }

      formData.delete("galleryFiles");
      for (const item of selectedGalleryFiles) {
        if (item.file) {
          const compressed = await compressImage(item.file, 1400, 0.8);
          formData.append("galleryFiles", compressed);
        }
      }

      setStatusText("Məlumatlar yadda saxlanılır...");
      await saveRestaurant(formData);
      window.location.href = "/restoran?saved=1";
    } catch (err: unknown) {
      if (handleServerActionRejection(err)) {
        return;
      }
      const message = err instanceof Error ? err.message : "Naməlum xəta";
      setStatusText("Xəta baş verdi: " + message);
      setSubmitting(false);
    }
  }

  const [isPortfolioDragging, setIsPortfolioDragging] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event).catch((error) => {
          if (!handleServerActionRejection(error)) {
            console.error(error);
          }
        });
      }}
      className="grid gap-5"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <input type="hidden" name="id" value={restaurant?.id ?? ""} />
      <textarea name="gallery" className="hidden" readOnly value={existingGalleryUrls.join("\n")} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          name="name"
          label="Restoran Adı"
          defaultValue={restaurant?.name}
          required
        />
        <Field
          name="slug"
          label="Link Adı (Slug)"
          defaultValue={restaurant?.slug}
          required
          readOnly={userRole !== "super_admin"}
        />
        <Field
          name="phone"
          label="Telefon"
          defaultValue={restaurant?.phone}
        />
        <Field
          name="menu_url"
          label="Xarici Menyu Linki (istəyə bağlı)"
          defaultValue={restaurant?.menu_url}
          placeholder="https://... (PDF və ya digər link)"
        />
        <Field
          name="instagram"
          label="Instagram"
          placeholder={getSocialPlaceholder("instagram")}
          defaultValue={getSocialFieldValue("instagram", restaurant?.instagram)}
        />
        <Field
          name="tiktok"
          label="TikTok"
          placeholder={getSocialPlaceholder("tiktok")}
          defaultValue={getSocialFieldValue("tiktok", restaurant?.tiktok)}
        />
        <Field
          name="facebook"
          label="Facebook"
          placeholder={getSocialPlaceholder("facebook")}
          defaultValue={getSocialFieldValue("facebook", restaurant?.facebook)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          name="location_name"
          label="Konum Adı"
          defaultValue={restaurant?.location_name}
          placeholder="məs: Bakı, Azərbaycan"
        />
        <Field
          name="location_url"
          label="Konum Linki (Google Maps)"
          defaultValue={restaurant?.location_url}
          placeholder="https://maps.google.com/..."
        />
      </div>

      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
        Açıqlama
        <textarea
          name="description"
          defaultValue={restaurant?.description ?? ""}
          rows={4}
          placeholder="Restoran haqqında qısa məlumat..."
          className={inputClass}
        />
      </label>

      <RestaurantMenuEditor initialMenu={restaurant?.menu} />

      <div className="grid grid-cols-2 gap-4">
        <ImageDropZone
          label="Restoran Şəkli"
          inputName="avatar"
          preview={avatarPreview}
          hasExisting={!!restaurant?.avatar_url}
          removed={removeAvatar}
          aspect="square"
          enableCrop
          cropTitle="Restoran şəklini kəsin"
          onFileChange={(file) => {
            setAvatarPreview(URL.createObjectURL(file));
            setRemoveAvatar(false);
          }}
          onRemove={() => {
            setRemoveAvatar(true);
            setAvatarPreview("");
          }}
        />
        <ImageDropZone
          label="Cover Şəkli"
          inputName="cover"
          preview={coverPreview}
          hasExisting={!!restaurant?.cover_url}
          removed={removeCover}
          aspect="square"
          onFileChange={(file) => {
            setCoverPreview(URL.createObjectURL(file));
            setRemoveCover(false);
          }}
          onRemove={() => {
            setRemoveCover(true);
            setCoverPreview("");
          }}
        />
      </div>
      <input type="hidden" name="remove_avatar" value={removeAvatar ? "on" : "off"} />
      <input type="hidden" name="remove_cover" value={removeCover ? "on" : "off"} />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          name="cover_style"
          label="Cover Görünüşü"
          defaultValue={restaurant?.cover_style ?? "auto"}
          options={[
            { value: "auto", label: "Auto / Premium" },
            { value: "square", label: "Kvadrat / 1:1" },
            { value: "banner", label: "Banner / Aşağı Hündürlük" },
          ]}
        />
        <SelectField
          name="cover_position"
          label="Cover Fokus Yeri"
          defaultValue={restaurant?.cover_position ?? "center"}
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
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "ios"
              ? "border-[#007AFF] bg-[#F2F2F7] text-[#007AFF] shadow-sm"
              : "border-slate-200 bg-[#F2F2F7] text-slate-700 hover:border-[#007AFF]/40"
          }`}>
            <input
              type="radio"
              name="theme"
              value="ios"
              checked={theme === "ios"}
              onChange={() => setTheme("ios")}
              className="sr-only"
            />
            <span>iOS Light</span>
          </label>
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "iossoft"
              ? "border-[#8E8E93] bg-[#F7F5F2] text-[#3A3A3C] shadow-sm"
              : "border-slate-200 bg-[#F7F5F2] text-slate-700 hover:border-[#8E8E93]/50"
          }`}>
            <input
              type="radio"
              name="theme"
              value="iossoft"
              checked={theme === "iossoft"}
              onChange={() => setTheme("iossoft")}
              className="sr-only"
            />
            <span>iOS Soft</span>
          </label>
          <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
            theme === "iosdark"
              ? "border-[#0A84FF] bg-[#1C1C1E] text-[#0A84FF] shadow-md"
              : "border-slate-200 bg-[#1C1C1E] text-slate-300 hover:border-[#0A84FF]/40"
          }`}>
            <input
              type="radio"
              name="theme"
              value="iosdark"
              checked={theme === "iosdark"}
              onChange={() => setTheme("iosdark")}
              className="sr-only"
            />
            <span>iOS Dark</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
          <ImagePlus size={14} className="text-[#29AEEE]" /> Qalereya Şəkilləri
        </span>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsPortfolioDragging(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsPortfolioDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsPortfolioDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsPortfolioDragging(false);
            const files = e.dataTransfer.files;
            if (files) {
              const MAX_GALLERY_IMAGES = 30;
              const remaining = Math.max(
                0,
                MAX_GALLERY_IMAGES - (selectedGalleryFiles?.length ?? 0),
              );
              const newList = Array.from(files)
                .filter(file => file.type.startsWith("image/"))
                .slice(0, remaining)
                .map((file) => ({
                  name: file.name,
                  previewUrl: URL.createObjectURL(file),
                  file,
                }));
              setSelectedGalleryFiles(prev => [...prev, ...newList]);
            }
          }}
          className={[
            "block rounded-3xl border-2 transition-all duration-200 text-center cursor-pointer select-none",
            isPortfolioDragging
              ? "border-[#29AEEE] bg-[#29AEEE]/5 scale-[1.01]"
              : "border-dashed border-slate-200 bg-white hover:border-[#29AEEE] hover:bg-[#29AEEE]/5 hover:shadow-sm"
          ].join(" ")}
          style={{ padding: "1.75rem" }}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/jpeg,image/png,image/webp,image/gif";
            input.multiple = true;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files) {
                const MAX_GALLERY_IMAGES = 30;
                const remaining = Math.max(
                  0,
                  MAX_GALLERY_IMAGES - (selectedGalleryFiles?.length ?? 0),
                );
                const newList = Array.from(files)
                  .filter(file => file.type.startsWith("image/"))
                  .slice(0, remaining)
                  .map((file) => ({
                    name: file.name,
                    previewUrl: URL.createObjectURL(file),
                    file,
                  }));
                setSelectedGalleryFiles(prev => [...prev, ...newList]);
              }
            };
            input.click();
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-[#29AEEE]" />
            <span className="text-xs font-semibold text-slate-600">Şəkil seçin və ya bura sürükləyin</span>
            <span className="text-[10px] font-medium text-slate-400">Maks. 20MB · Max 30 şəkil · JPG, PNG, WEBP, GIF</span>
          </div>
        </div>
        {existingGalleryUrls.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-green-600">Mövcud şəkillər ({existingGalleryUrls.length}):</span>
              <button
                type="button"
                onClick={() => setExistingGalleryUrls([])}
                className="text-xs text-red-500 hover:underline font-bold"
              >
                Hamısını sil
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {existingGalleryUrls.map((url, idx) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-green-200 bg-white group">
                  <img src={url} alt={`Qalereya ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExistingGalleryUrls(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedGalleryFiles.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-400">Yüklənəcək ({selectedGalleryFiles.length} yeni şəkil):</span>
              <button
                type="button"
                onClick={() => setSelectedGalleryFiles([])}
                className="text-xs text-red-500 hover:underline font-bold"
              >
                Hamısını sil
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {selectedGalleryFiles.map((file, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white group">
                  <img src={file.previewUrl} alt={file.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGalleryFiles(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {userRole === "super_admin" && (
        <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-bold text-slate-600 uppercase tracking-wide cursor-pointer hover:bg-slate-50 transition">
          <span>Restoran aktivdir</span>
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={restaurant?.enabled ?? true}
            className="size-5 rounded accent-indigo-650"
          />
        </label>
      )}

      <button
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#29AEEE] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#29AEEE]/20 transition-all duration-200 hover:bg-[#1a9ad4] hover:shadow-lg hover:shadow-[#29AEEE]/25 active:scale-[0.96] disabled:bg-slate-300 disabled:shadow-none"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
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
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
      {label}
      <input
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

function ImageDropZone({
  label,
  inputName,
  preview,
  hasExisting,
  removed,
  aspect,
  enableCrop = false,
  cropTitle = "Şəkli kəsin",
  onFileChange,
  onRemove,
}: {
  label: string;
  inputName: string;
  preview: string;
  hasExisting: boolean;
  removed: boolean;
  aspect: "square" | "wide";
  enableCrop?: boolean;
  cropTitle?: string;
  onFileChange: (file: File) => void;
  onRemove: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cropObjectUrlRef = React.useRef<string | null>(null);
  const hasImage = preview && !removed;

  function assignFileToInput(file: File) {
    if (!inputRef.current) return;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputRef.current.files = dataTransfer.files;
  }

  function clearInput() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function revokeCropUrl() {
    if (cropObjectUrlRef.current) {
      URL.revokeObjectURL(cropObjectUrlRef.current);
      cropObjectUrlRef.current = null;
    }
  }

  function openCrop(file: File) {
    revokeCropUrl();
    const url = URL.createObjectURL(file);
    cropObjectUrlRef.current = url;
    setCropSrc(url);
  }

  function applyCropped(file: File) {
    revokeCropUrl();
    setCropSrc(null);
    assignFileToInput(file);
    onFileChange(file);
  }

  function cancelCrop() {
    revokeCropUrl();
    setCropSrc(null);
    clearInput();
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (enableCrop && file.type !== "image/gif") {
      openCrop(file);
      return;
    }
    assignFileToInput(file);
    onFileChange(file);
  }

  function handleRemove() {
    clearInput();
    onRemove();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  useEffect(() => {
    return () => revokeCropUrl();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
        {inputName === "avatar" ? (
          <Upload size={13} className="text-[#29AEEE]" />
        ) : (
          <ImagePlus size={13} className="text-[#29AEEE]" />
        )}
        {label}
      </span>

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
              : "border-dashed border-slate-300 bg-slate-50 hover:border-[#29AEEE] hover:bg-[#29AEEE]/5"
        ].join(" ")}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
            <div className={[
              "grid size-10 place-items-center rounded-xl transition-colors duration-200",
              isDragging ? "bg-[#29AEEE]/15 text-[#29AEEE]" : "bg-slate-100 text-slate-400"
            ].join(" ")}>
              <Upload size={18} />
            </div>
            <div className="text-center">
              <p className={[
                "text-[11px] font-bold transition-colors",
                isDragging ? "text-[#29AEEE]" : "text-slate-500"
              ].join(" ")}>
                {isDragging ? "Buraxın!" : "Sürükləyin və ya basın"}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP</p>
            </div>
          </div>
        )}

        {hasImage && isDragging && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#29AEEE]/70 backdrop-blur-sm">
            <Upload size={24} className="text-white" />
            <p className="text-xs font-bold text-white">Buraxın!</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          name={cropSrc ? undefined : inputName}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (enableCrop && file.type !== "image/gif") {
              handleFile(file);
              e.target.value = "";
              return;
            }
            handleFile(file);
          }}
        />
      </div>

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
            onClick={handleRemove}
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

      {enableCrop && cropSrc ? (
        <ImageCropModal
          open
          src={cropSrc}
          title={cropTitle}
          aspect={aspect === "wide" ? 16 / 9 : 1}
          outputSize={1080}
          fileName={`${inputName || "avatar"}.webp`}
          onCancel={cancelCrop}
          onComplete={applyCropped}
        />
      ) : null}
    </div>
  );
}
