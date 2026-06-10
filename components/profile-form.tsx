"use client";

import { useState } from "react";
import { ImagePlus, Upload, Save } from "lucide-react";
import { saveProfile } from "@/app/admin/actions";
import type { Profile } from "@/lib/types";

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none backdrop-blur-sm transition duration-200 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100";

// Canvas-based client-side image compression function
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

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatusText("Şəkillər sıxılır...");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      // Compress avatar
      const avatarFile = formData.get("avatar") as File | null;
      if (avatarFile && avatarFile.size > 0) {
        const compressed = await compressImage(avatarFile);
        formData.set("avatar", compressed);
      }

      // Compress background
      const backgroundFile = formData.get("background") as File | null;
      if (backgroundFile && backgroundFile.size > 0) {
        const compressed = await compressImage(backgroundFile);
        formData.set("background", compressed);
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
      // Re-throw Next.js redirect errors so that redirection works
      if (err.message === "NEXT_REDIRECT" || err.digest?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      setStatusText("Xəta baş verdi: " + err.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input type="hidden" name="id" value={profile?.id ?? ""} />
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
      <div className="grid gap-4 md:grid-cols-3">
        <UploadField name="avatar" label="Profil şəkli" />
        <UploadField name="background" label="Cover şəkli" />
        <UploadField name="galleryFiles" label="Portfolio şəkilləri" multiple />
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

function UploadField({
  name,
  label,
  multiple = false,
}: {
  name: string;
  label: string;
  multiple?: boolean;
}) {
  return (
    <label className="block rounded-3xl border border-dashed border-slate-200 bg-white/50 p-4 text-sm font-bold text-slate-700 transition duration-200 ease-out hover:border-indigo-400 hover:bg-white hover:shadow-sm cursor-pointer">
      <span className="flex items-center gap-2 text-slate-800">
        {multiple ? <ImagePlus size={17} className="text-indigo-650" /> : <Upload size={17} className="text-indigo-650" />} {label}
      </span>
      <span className="mt-2 block text-xs font-semibold text-slate-400">
        Max 5MB · JPG, PNG, WEBP və ya GIF
      </span>
      <input
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        className="mt-3 w-full text-sm font-semibold text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-indigo-700 file:hover:bg-indigo-100 file:transition-colors file:cursor-pointer"
      />
    </label>
  );
}
