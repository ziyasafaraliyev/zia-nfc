"use client";

import React, { useState } from "react";
import { ImagePlus, Upload, Save, Trash2 } from "lucide-react";
import { saveProfile } from "@/app/admin/actions";
import type { Profile } from "@/lib/types";

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none backdrop-blur-sm transition duration-200 placeholder:text-slate-400 focus:border-[#29AEEE] focus:bg-white focus:ring-4 focus:ring-[#29AEEE]/20";

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

export default function ProfileForm({ profile }: { profile?: Profile }) {
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [backgroundPreview, setBackgroundPreview] = useState(profile?.background_url || "");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [removeCv, setRemoveCv] = useState(false);

  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<{ name: string; previewUrl: string; file?: File }[]>([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatusText("Şəkillər sıxılır...");

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

      // Compress gallery files
      formData.delete("galleryFiles");
      for (const item of selectedGalleryFiles) {
        if (item.file) {
          const compressed = await compressImage(item.file);
          formData.append("galleryFiles", compressed);
        }
      }

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
    <form onSubmit={handleSubmit} className="grid gap-6">
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
        />
        <Field
          name="profession"
          label="Peşə"
          defaultValue={profile?.profession}
        />
        <Field name="phone" label="Telefon" defaultValue={profile?.phone} />
        <Field
          name="whatsapp"
          label="WhatsApp"
          defaultValue={profile?.whatsapp}
        />
        <Field
          name="instagram"
          label="Instagram URL"
          defaultValue={profile?.instagram}
        />
        <Field
          name="tiktok"
          label="TikTok URL"
          defaultValue={profile?.tiktok}
        />
        <Field
          name="website"
          label="Website URL"
          defaultValue={profile?.website}
        />
        <Field
          name="facebook"
          label="Facebook URL"
          defaultValue={profile?.facebook}
        />
        <Field
          name="x"
          label="X (Twitter) URL"
          defaultValue={profile?.x}
        />
        <Field
          name="linkedin"
          label="LinkedIn URL"
          defaultValue={profile?.linkedin}
        />
        <Field
          name="youtube"
          label="YouTube URL"
          defaultValue={profile?.youtube}
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

      <label className="block text-sm font-bold text-slate-700">
        Bio
        <textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          rows={4}
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

      {/* ── PORTFOLIO ŞƏKİLLƏRİ ── */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
        <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <ImagePlus size={16} className="text-[#29AEEE]" /> Portfolio Şəkilləri (Yeni)
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
              const newList = Array.from(files)
                .filter(file => file.type.startsWith("image/"))
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
                const newList = Array.from(files).map((file) => ({
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
            <span className="text-sm font-bold text-slate-700">Yeni portfolio şəkilləri seçin və ya bura sürükləyin</span>
            <span className="text-xs font-semibold text-slate-400">Maksimum 5MB • Çoxlu şəkil seçilə bilər</span>
          </div>
        </div>
        {selectedGalleryFiles.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Yüklənəcək yeni şəkillər ({selectedGalleryFiles.length}):</span>
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


      {/* ── CV YÜKLƏMƏ (PDF) ── */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
        <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
          CV / Resüme (yalnız PDF)
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

      <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm font-bold text-slate-700">
        <span>Profil aktivdir</span>
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={profile?.enabled ?? true}
          className="size-5 rounded accent-indigo-650"
        />
      </label>

      <button
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#29AEEE] px-5 py-4 font-bold text-white shadow-md shadow-[#29AEEE]/20 transition-all duration-200 hover:bg-[#1a9ad4] hover:shadow-lg hover:shadow-[#29AEEE]/25 active:scale-[0.96] disabled:bg-slate-400 disabled:shadow-none"
      >
        <Save size={18} /> {submitting ? statusText : "Yadda saxla"}
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
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className={inputClass}
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
    <label className="block text-sm font-bold text-slate-700">
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
