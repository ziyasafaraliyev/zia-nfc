"use client";

import { useState } from "react";
import { ImagePlus, Upload, Save, Trash2 } from "lucide-react";
import { saveProfile } from "@/app/admin/actions";
import type { Profile } from "@/lib/types";

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none backdrop-blur-sm transition duration-200 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100";

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

  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<{ name: string; previewUrl: string }[]>([]);

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

      // Compress gallery files
      const galleryFiles = formData.getAll("galleryFiles");
      formData.delete("galleryFiles");

      for (const entry of galleryFiles) {
        if (entry instanceof File && entry.size > 0) {
          const compressed = await compressImage(entry);
          formData.append("galleryFiles", compressed);
        }
      }

      setStatusText("Məlumatlar yadda saxlanılır...");
      await saveProfile(formData);
    } catch (err: any) {
      if (err.message === "NEXT_REDIRECT" || err.digest?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      setStatusText("Xəta baş verdi: " + err.message);
      setSubmitting(false);
    }
  }

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

      <Field
        name="location"
        label="Lokasiya"
        defaultValue={profile?.location}
      />

      <label className="block text-sm font-bold text-slate-700">
        Bio
        <textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          rows={4}
          className={inputClass}
        />
      </label>

      {/* ── ŞƏKİL PREVİEW VƏ YÜKLƏMƏ SAHƏSİ ── */}
      <div className="grid gap-6 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 md:grid-cols-2">
        {/* Profil Şəkli (Avatar) */}
        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Upload size={16} className="text-indigo-600" /> Profil şəkli (Avatar)
          </span>
          <div className="flex items-center gap-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-inner flex items-center justify-center">
              {avatarPreview && !removeAvatar ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload size={22} className="mx-auto text-slate-400" />
                  <span className="mt-1 block text-[10px] font-bold text-slate-400">Yoxdur</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition duration-200 hover:bg-indigo-700 active:scale-95">
                <Upload size={14} /> Şəkil seç
                <input
                  type="file"
                  name="avatar"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarPreview(URL.createObjectURL(file));
                      setRemoveAvatar(false);
                    }
                  }}
                />
              </label>
              {(profile?.avatar_url || (avatarPreview && !removeAvatar)) && (
                <button
                  type="button"
                  onClick={() => {
                    setRemoveAvatar(true);
                    setAvatarPreview("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 transition duration-200 hover:bg-rose-100"
                >
                  <Trash2 size={14} /> Şəkli sil
                </button>
              )}
              {removeAvatar && (
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg">
                  Cari şəkil silinəcək
                </span>
              )}
            </div>
          </div>
          <input type="hidden" name="remove_avatar" value={removeAvatar ? "on" : "off"} />
        </div>

        {/* Cover Şəkli (Background) */}
        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ImagePlus size={16} className="text-indigo-600" /> Cover şəkli (Arxa fon)
          </span>
          <div className="flex flex-col gap-3">
            <div className="relative h-24 w-full overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-inner flex items-center justify-center">
              {backgroundPreview && !removeBackground ? (
                <img src={backgroundPreview} alt="Cover" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImagePlus size={22} className="mx-auto text-slate-400" />
                  <span className="mt-1 block text-[10px] font-bold text-slate-400">Yoxdur</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition duration-200 hover:bg-indigo-700 active:scale-95">
                <Upload size={14} /> Şəkil seç
                <input
                  type="file"
                  name="background"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setBackgroundPreview(URL.createObjectURL(file));
                      setRemoveBackground(false);
                    }
                  }}
                />
              </label>
              {(profile?.background_url || (backgroundPreview && !removeBackground)) && (
                <button
                  type="button"
                  onClick={() => {
                    setRemoveBackground(true);
                    setBackgroundPreview("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 transition duration-200 hover:bg-rose-100"
                >
                  <Trash2 size={14} /> Şəkli sil
                </button>
              )}
              {removeBackground && (
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg">
                  Cari şəkil silinəcək
                </span>
              )}
            </div>
          </div>
          <input type="hidden" name="remove_background" value={removeBackground ? "on" : "off"} />
        </div>
      </div>

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
          <ImagePlus size={16} className="text-indigo-600" /> Portfolio Şəkilləri (Yeni)
        </span>
        <label className="block rounded-3xl border-2 border-dashed border-slate-200 bg-white p-6 text-center transition duration-200 hover:border-indigo-400 hover:shadow-sm cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-indigo-600" />
            <span className="text-sm font-bold text-slate-700">Yeni portfolio şəkilləri seçin</span>
            <span className="text-xs font-semibold text-slate-400">Maksimum 5MB • Çoxlu şəkil seçilə bilər</span>
          </div>
          <input
            name="galleryFiles"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                const newList = Array.from(files).map((file) => ({
                  name: file.name,
                  previewUrl: URL.createObjectURL(file),
                }));
                setSelectedGalleryFiles(newList);
              }
            }}
          />
        </label>
        {selectedGalleryFiles.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500">Yüklənəcək yeni şəkillər ({selectedGalleryFiles.length}):</span>
            <div className="grid grid-cols-4 gap-2">
              {selectedGalleryFiles.map((file, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img src={file.previewUrl} alt={file.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <label className="block text-sm font-bold text-slate-700">
        Portfolio URL-ləri
        <textarea
          name="gallery"
          defaultValue={(profile?.gallery ?? []).join("\n")}
          rows={4}
          className={inputClass}
          placeholder="Hər linki yeni sətirdə yaz"
        />
      </label>

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
        className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-4 font-bold text-white shadow-md shadow-indigo-500/10 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.96] disabled:bg-slate-400 disabled:shadow-none"
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
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
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
