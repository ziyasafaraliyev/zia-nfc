"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Upload,
  Save,
  Trash2,
  Plus,
} from "lucide-react";
import { saveProfile } from "@/app/admin/actions";
import { handleServerActionRejection } from "@/lib/server-action-client";
import type { CatalogItem, Profile, PortfolioSection } from "@/lib/types";
import ImageCropModal from "@/components/image-crop-modal";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none backdrop-blur-sm transition duration-200 placeholder:text-slate-400 focus:border-[#29AEEE] focus:bg-white focus:ring-4 focus:ring-[#29AEEE]/20" +
  " font-sans";

const socialBaseUrls = {
  whatsapp: "https://wa.me/994",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@",
  telegram: "https://t.me/",
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
  return value?.trim() ? value : "";
}

function getSocialPlaceholder(key: keyof typeof socialBaseUrls) {
  switch (key) {
    case "whatsapp":
      return "99450xxxxxxx";
    case "instagram":
    case "tiktok":
    case "telegram":
    case "threads":
    case "facebook":
    case "x":
    case "linkedin":
    case "youtube":
    case "behance":
      return "username";
    case "website":
      return "example.com";
    case "waze":
      return "40.4093,49.8671";
    default:
      return "";
  }
}

/**
 * Client pre-compress → WebP (server also re-encodes with sharp + EXIF rotate).
 * Uses max EDGE (not only width) so tall/portrait photos are not left huge,
 * and createImageBitmap imageOrientation so phone EXIF is applied (avoids
 * "zoomed/cropped" wrong orientation after WebP convert).
 */
async function compressImage(
  file: File,
  maxEdge = 1600,
  quality = 0.85,
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  try {
    let sourceWidth = 0;
    let sourceHeight = 0;
    let drawSource: CanvasImageSource | null = null;
    let bitmap: ImageBitmap | null = null;

    if (typeof createImageBitmap === "function") {
      try {
        bitmap = await createImageBitmap(file, {
          // Respect EXIF orientation from phone cameras
          imageOrientation: "from-image",
        } as ImageBitmapOptions);
        sourceWidth = bitmap.width;
        sourceHeight = bitmap.height;
        drawSource = bitmap;
      } catch {
        bitmap = null;
      }
    }

    if (!drawSource) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("read failed"));
        reader.readAsDataURL(file);
      });
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("decode failed"));
        el.src = dataUrl;
      });
      sourceWidth = img.naturalWidth || img.width;
      sourceHeight = img.naturalHeight || img.height;
      drawSource = img;
    }

    if (!sourceWidth || !sourceHeight || !drawSource) {
      bitmap?.close();
      return file;
    }

    // Scale by longest side — keeps full frame, no center crop
    const longest = Math.max(sourceWidth, sourceHeight);
    const scale = longest > maxEdge ? maxEdge / longest : 1;
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap?.close();
      return file;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(drawSource, 0, 0, width, height);
    bitmap?.close();

    const targetMime = "image/webp";
    const baseName =
      file.name.substring(0, file.name.lastIndexOf(".")) ||
      file.name ||
      "image";
    const newFileName = `${baseName}.webp`;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), targetMime, quality);
    });

    if (!blob || blob.size === 0) return file;

    return new File([blob], newFileName, {
      type: targetMime,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
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

// Helper to normalize old gallery data (images only)
function normalizeGallery(gallery: string[] | PortfolioSection[] | undefined): PortfolioSection[] {
  if (!gallery || gallery.length === 0) return [];

  if (gallery.length > 0 && typeof gallery[0] === "object" && "id" in gallery[0]) {
    return (gallery as PortfolioSection[]).map((section) => ({
      id: section.id,
      name: section.name || "Portfolio",
      images: Array.isArray(section.images) ? section.images : [],
    }));
  }

  return [
    {
      id: crypto.randomUUID(),
      name: "Portfolio",
      images: gallery as string[],
    },
  ];
}

function normalizeCatalog(
  catalog: CatalogItem[] | null | undefined,
  gallery?: string[] | PortfolioSection[],
): CatalogItem[] {
  const fromCatalog: CatalogItem[] = Array.isArray(catalog)
    ? catalog
        .filter((item) => item && typeof item.url === "string" && item.url.trim())
        .map((item) => ({
          id: item.id || crypto.randomUUID(),
          name: (item.name || "").trim() || "Kataloq",
          url: item.url.trim(),
        }))
    : [];

  // One-time migrate legacy link-only portfolio sections into catalog
  const legacy: CatalogItem[] = [];
  if (
    Array.isArray(gallery) &&
    gallery.length > 0 &&
    typeof gallery[0] === "object" &&
    gallery[0] !== null
  ) {
    for (const section of gallery as Array<PortfolioSection & { url?: string }>) {
      const url = typeof section.url === "string" ? section.url.trim() : "";
      const images = Array.isArray(section.images) ? section.images : [];
      if (url && images.length === 0) {
        legacy.push({
          id: section.id || crypto.randomUUID(),
          name: (section.name || "").trim() || "Kataloq",
          url,
        });
      }
    }
  }

  if (fromCatalog.length > 0) return fromCatalog;
  return legacy;
}

type SectionWithFiles = PortfolioSection & {
  newFiles: { name: string; previewUrl: string; file?: File }[];
};

export default function ProfileForm({
  profile,
  userRole = "super_admin",
  mode = profile?.id ? "edit" : "create",
}: {
  profile?: Profile;
  userRole?: "super_admin" | "client";
  mode?: "create" | "edit";
}) {
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [backgroundPreview, setBackgroundPreview] = useState(profile?.background_url || "");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [removeCv, setRemoveCv] = useState(false);

  const [sections, setSections] = useState<SectionWithFiles[]>(() =>
    normalizeGallery(profile?.gallery).map((section) => ({
      ...section,
      newFiles: [],
    })),
  );
  const sectionsRef = useRef(sections);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(() =>
    normalizeCatalog(profile?.catalog, profile?.gallery),
  );
  /** Admin lists stay collapsed; only one open editor at a time */
  const [expandedCatalogId, setExpandedCatalogId] = useState<string | null>(null);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const [catalogPanelOpen, setCatalogPanelOpen] = useState(false);
  const [portfolioPanelOpen, setPortfolioPanelOpen] = useState(false);
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const catalogRef = useRef(catalogItems);
  const [theme, setTheme] = useState(profile?.theme || "light");
  const [coverStyle, setCoverStyle] = useState(profile?.cover_style ?? "auto");
  const [coverPosition, setCoverPosition] = useState(profile?.cover_position ?? "center");

  const themeLabel =
    (
      {
        light: "Ağ (Light)",
        dark: "Qara (Dark)",
        premium: "Premium Gold",
        emerald: "Zümrüd",
        ruby: "Yaqut",
        violet: "Bənövşəyi",
        sapphire: "Mavi",
        sunset: "Günbatımı",
        copper: "Digital",
      } as Record<string, string>
    )[theme] || "Ağ (Light)";

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  useEffect(() => {
    catalogRef.current = catalogItems;
  }, [catalogItems]);

  useEffect(() => {
    setSections(
      normalizeGallery(profile?.gallery).map((section) => ({
        ...section,
        newFiles: [],
      })),
    );
    setCatalogItems(normalizeCatalog(profile?.catalog, profile?.gallery));
    setExpandedCatalogId(null);
    setExpandedSectionId(null);
    setCatalogPanelOpen(false);
    setPortfolioPanelOpen(false);
    setThemePanelOpen(false);
    setAvatarPreview(profile?.avatar_url || "");
    setBackgroundPreview(profile?.background_url || "");
    setRemoveAvatar(false);
    setRemoveBackground(false);
    setRemoveCv(false);
    setTheme(profile?.theme || "light");
    setCoverStyle(profile?.cover_style ?? "auto");
    setCoverPosition(profile?.cover_position ?? "center");
  }, [profile?.id]);

  // Add new section
  const addSection = () => {
    const id = crypto.randomUUID();
    setSections((prev) => [
      ...prev,
      {
        id,
        name: "",
        images: [],
        newFiles: [],
      },
    ]);
    setPortfolioPanelOpen(true);
    setExpandedSectionId(id);
  };

  // Delete section
  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setExpandedSectionId((current) =>
      current === sectionId ? null : current,
    );
  };

  // Update section name
  const updateSectionName = (sectionId: string, name: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, name } : s
    ));
  };

  const addCatalogItem = () => {
    const id = crypto.randomUUID();
    setCatalogItems((prev) => [...prev, { id, name: "", url: "" }]);
    setCatalogPanelOpen(true);
    setExpandedCatalogId(id);
  };

  const updateCatalogItem = (
    id: string,
    field: "name" | "url",
    value: string,
  ) => {
    setCatalogItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const deleteCatalogItem = (id: string) => {
    setCatalogItems((prev) => prev.filter((item) => item.id !== id));
    setExpandedCatalogId((current) => (current === id ? null : current));
  };

  const toggleCatalogExpanded = (id: string) => {
    setExpandedCatalogId((current) => (current === id ? null : id));
  };

  const toggleSectionExpanded = (id: string) => {
    setExpandedSectionId((current) => (current === id ? null : id));
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
      const removed = s.newFiles[fileIndex];
      if (removed?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return {
        ...s,
        newFiles: s.newFiles.filter((_, i) => i !== fileIndex)
      };
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "edit" && !profile?.id) {
      setStatusText("Xəta: redaktə üçün profil tapılmadı.");
      return;
    }

    setSubmitting(true);
    setStatusText("Şəkillər hazırlanır...");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentSections = sectionsRef.current;

    try {
      // Avatar / cover → client scale (full frame, EXIF-aware) then server sharp → WebP
      const avatarFile = formData.get("avatar") as File | null;
      if (avatarFile && avatarFile.size > 0 && !removeAvatar) {
        const compressed = await compressImage(avatarFile, 1200, 0.88);
        formData.set("avatar", compressed);
      } else if (removeAvatar) {
        formData.delete("avatar");
      }

      const backgroundFile = formData.get("background") as File | null;
      if (backgroundFile && backgroundFile.size > 0 && !removeBackground) {
        const compressed = await compressImage(backgroundFile, 2000, 0.86);
        formData.set("background", compressed);
      } else if (removeBackground) {
        formData.delete("background");
      }

      if (removeCv) {
        formData.delete("cv");
      }

      // Compress all section files in parallel
      const allFilesToCompress: { sectionId: string; file: File }[] = [];
      currentSections.forEach((section) => {
        section.newFiles.forEach((item) => {
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
            try {
              const compressed = await compressImage(file);
              processed++;
              setStatusText(`Şəkil sıxılır: ${processed}/${allFilesToCompress.length}`);
              return { sectionId, file: compressed };
            } catch {
              processed++;
              setStatusText(`Şəkil sıxılır: ${processed}/${allFilesToCompress.length}`);
              return { sectionId, file };
            }
          },
          2
        );
        
        compressedFiles.push(...results);
      }

      // Portfolio: images only
      const finalSections: PortfolioSection[] = currentSections.map((section) => ({
        id: section.id,
        name: section.name.trim() || "Portfolio",
        images: section.images,
      }));

      // Catalog: separate title + URL list
      const finalCatalog: CatalogItem[] = catalogRef.current
        .map((item) => ({
          id: item.id,
          name: item.name.trim() || "Kataloq",
          url: item.url.trim(),
        }))
        .filter((item) => item.url.length > 0);

      formData.set("gallery", JSON.stringify(finalSections));
      formData.set("gallerySectionCount", String(finalSections.length));
      formData.set("catalog", JSON.stringify(finalCatalog));
      // Only when user actually had links and removed them all in this session
      if (
        finalCatalog.length === 0 &&
        Array.isArray(profile?.catalog) &&
        profile.catalog.length > 0
      ) {
        formData.set("catalog_clear", "on");
      }

      formData.delete("galleryFiles");
      formData.delete("galleryFileMeta");
      for (const key of Array.from(formData.keys())) {
        if (key.startsWith("galleryFiles_")) {
          formData.delete(key);
        }
      }

      const fileMeta: { sectionId: string; fileName: string; mimeType: string }[] = [];
      for (const { sectionId, file } of compressedFiles) {
        if (file.size > 0) {
          const fileName = file.name || `portfolio-${Date.now()}.jpg`;
          const mimeType = file.type || "image/jpeg";
          formData.append("galleryFiles", file, fileName);
          fileMeta.push({ sectionId, fileName, mimeType });
        }
      }
      formData.set("galleryFileMeta", JSON.stringify(fileMeta));

      const totalUploadBytes = compressedFiles.reduce((sum, item) => sum + item.file.size, 0);
      if (totalUploadBytes > 45 * 1024 * 1024) {
        throw new Error(
          "Yüklənən şəkillər çox böyükdür (45MB+). Daha az şəkil seçin və ya kiçik fayllar yükləyin.",
        );
      }

      setStatusText("Məlumatlar yadda saxlanılır...");
      await saveProfile(formData);
      window.location.href = "/admin?saved=1";
    } catch (err: unknown) {
      if (handleServerActionRejection(err)) {
        return;
      }
      const message = err instanceof Error ? err.message : "Naməlum xəta";
      setStatusText("Xəta baş verdi: " + message);
      setSubmitting(false);
    }
  }

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
        <PhoneField
          name="phone"
          label="Telefon"
          defaultValue={profile?.phone}
          placeholder="+994 50 123 45 67"
        />
        <PhoneField
          name="phone2"
          label="Telefon 2"
          defaultValue={profile?.phone2}
          placeholder="+994 50 123 45 67"
        />
        <PhoneField
          name="whatsapp"
          label="WhatsApp"
          placeholder={getSocialPlaceholder("whatsapp")}
          defaultValue={getSocialFieldValue("whatsapp", profile?.whatsapp)}
        />
        <PhoneField
          name="whatsapp2"
          label="WhatsApp 2"
          placeholder={getSocialPlaceholder("whatsapp")}
          defaultValue={profile?.whatsapp2}
        />
      </div>

      {/* Sosial şəbəkələr — aydın başlıq ki, admin paneldə asan tapılsın */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Sosial şəbəkələr
          </p>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Username və ya tam link yazın (məs: username və ya https://t.me/username)
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            name="telegram"
            label="Telegram"
            placeholder="username və ya t.me/username"
            defaultValue={getSocialFieldValue("telegram", profile?.telegram)}
          />
          <Field
            name="instagram"
            label="Instagram"
            placeholder={getSocialPlaceholder("instagram")}
            defaultValue={getSocialFieldValue("instagram", profile?.instagram)}
          />
          <Field
            name="tiktok"
            label="TikTok"
            placeholder={getSocialPlaceholder("tiktok")}
            defaultValue={getSocialFieldValue("tiktok", profile?.tiktok)}
          />
          <Field
            name="website"
            label="Website"
            defaultValue={getSocialFieldValue("website", profile?.website)}
          />
          <Field
            name="facebook"
            label="Facebook"
            placeholder={getSocialPlaceholder("facebook")}
            defaultValue={getSocialFieldValue("facebook", profile?.facebook)}
          />
          <Field
            name="x"
            label="X (Twitter)"
            placeholder={getSocialPlaceholder("x")}
            defaultValue={getSocialFieldValue("x", profile?.x)}
          />
          <Field
            name="threads"
            label="Threads"
            placeholder={getSocialPlaceholder("threads")}
            defaultValue={getSocialFieldValue("threads", profile?.threads)}
          />
          <Field
            name="linkedin"
            label="LinkedIn"
            placeholder={getSocialPlaceholder("linkedin")}
            defaultValue={getSocialFieldValue("linkedin", profile?.linkedin)}
          />
          <Field
            name="youtube"
            label="YouTube"
            placeholder={getSocialPlaceholder("youtube")}
            defaultValue={getSocialFieldValue("youtube", profile?.youtube)}
          />
          <Field
            name="behance"
            label="Behance"
            placeholder={getSocialPlaceholder("behance")}
            defaultValue={getSocialFieldValue("behance", profile?.behance)}
          />
          <Field
            name="waze"
            label="Waze"
            placeholder={getSocialPlaceholder("waze")}
            defaultValue={getSocialFieldValue("waze", profile?.waze)}
          />
        </div>
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

      {/* ── ŞƏKİL YÜKLƏMƏ (kiçik) ── */}
      <div className="grid grid-cols-2 gap-3 max-w-sm">
        <ImageDropZone
          label="Profil şəkli"
          inputName="avatar"
          preview={avatarPreview}
          hasExisting={!!profile?.avatar_url}
          removed={removeAvatar}
          aspect="square"
          compact
          enableCrop
          cropTitle="Profil şəklini kəsin"
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
          label="Cover şəkli"
          inputName="background"
          preview={backgroundPreview}
          hasExisting={!!profile?.background_url}
          removed={removeBackground}
          aspect="square"
          compact
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
          value={coverStyle}
          onChange={(value) => setCoverStyle(value as typeof coverStyle)}
          options={[
            { value: "auto", label: "Auto / premium" },
            { value: "square", label: "Kvadrat / 1:1" },
            { value: "banner", label: "Banner / aşağı hündürlük" },
          ]}
        />
        <SelectField
          name="cover_position"
          label="Cover fokus yeri"
          value={coverPosition}
          onChange={(value) => setCoverPosition(value as typeof coverPosition)}
          options={[
            { value: "top", label: "Yuxarı" },
            { value: "center", label: "Mərkəz" },
            { value: "bottom", label: "Aşağı" },
          ]}
        />
      </div>

      {/* ── PROFİL TEMASI — toxun-aç ── */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setThemePanelOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
        >
          <span className="min-w-0">
            <span className="block text-sm font-bold text-slate-800">
              Profil Teması
            </span>
            <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
              {themeLabel} · basıb aç
            </span>
          </span>
          {themePanelOpen ? (
            <ChevronUp size={18} className="shrink-0 text-slate-400" />
          ) : (
            <ChevronDown size={18} className="shrink-0 text-slate-400" />
          )}
        </button>

        {themePanelOpen ? (
          <div className="grid gap-2 border-t border-slate-100 p-3 sm:grid-cols-3">
            <label className={`flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
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
            <label className={`flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
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
            <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
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
            <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
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
            <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
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
            <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
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
            <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
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
            <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
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
            <label className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 ${
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
        ) : (
          /* Keep selected theme in form when panel is closed */
          <input type="hidden" name="theme" value={theme} />
        )}
      </div>

      {/* ── PORTFOLIO — yığcam düymə, basanda açılır ── */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center gap-2 p-2">
          <button
            type="button"
            onClick={() => setPortfolioPanelOpen((v) => !v)}
            className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left transition hover:bg-slate-50"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <ImagePlus size={16} className="shrink-0 text-[#29AEEE]" />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-800">
                  Portfolio
                </span>
                <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
                  {sections.length === 0
                    ? "Bölmə yoxdur"
                    : `${sections.length} bölmə · basıb aç`}
                </span>
              </span>
            </span>
            {portfolioPanelOpen ? (
              <ChevronUp size={18} className="shrink-0 text-slate-400" />
            ) : (
              <ChevronDown size={18} className="shrink-0 text-slate-400" />
            )}
          </button>
          <button
            type="button"
            onClick={addSection}
            className="mr-1 inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#29AEEE] bg-[#29AEEE]/5 px-3 py-2 text-[11px] font-bold text-[#29AEEE] transition hover:bg-[#29AEEE]/10"
          >
            <Plus size={14} /> Əlavə et
          </button>
        </div>

        {portfolioPanelOpen ? (
          <div className="space-y-2 border-t border-slate-100 px-3 pb-3 pt-2">
            {sections.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm font-medium text-slate-500">
                Hələ bölmə yoxdur. &quot;Əlavə et&quot; ilə yaradın.
              </p>
            ) : (
              sections.map((section) => {
                const isOpen = expandedSectionId === section.id;
                const title = section.name.trim() || "Adsız bölmə";
                const imgCount =
                  section.images.length + section.newFiles.length;

                return (
                  <div
                    key={section.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/80"
                  >
                    <div className="flex items-center gap-1 p-1.5">
                      <button
                        type="button"
                        onClick={() => toggleSectionExpanded(section.id)}
                        className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition hover:bg-white"
                      >
                        <span className="truncate text-sm font-semibold text-slate-800">
                          {title}
                        </span>
                        <span className="flex shrink-0 items-center gap-2 text-[11px] font-semibold text-slate-400">
                          {imgCount} şəkil
                          {isOpen ? (
                            <ChevronUp size={15} />
                          ) : (
                            <ChevronDown size={15} />
                          )}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSection(section.id)}
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isOpen ? (
                      <div className="space-y-3 border-t border-slate-200/80 px-3 pb-3 pt-3">
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) =>
                            updateSectionName(section.id, e.target.value)
                          }
                          placeholder="Bölmə adı (məs: Üstəri Layihələri)"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/10"
                        />

                        <div
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept =
                              "image/jpeg,image/png,image/webp,image/gif";
                            input.multiple = true;
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement)
                                .files;
                              if (files) addFilesToSection(section.id, files);
                            };
                            input.click();
                          }}
                          className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-white p-3 text-center transition hover:border-[#29AEEE] hover:bg-[#29AEEE]/5"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Upload size={18} className="text-[#29AEEE]" />
                            <span className="text-xs font-semibold text-slate-600">
                              Şəkil əlavə et
                            </span>
                          </div>
                        </div>

                        {section.images.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {section.images.map((url, index) => (
                              <div
                                key={`${section.id}-${index}`}
                                className="group relative aspect-square overflow-hidden rounded-xl border border-green-200 bg-white"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeImageFromSection(section.id, index)
                                  }
                                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
                                >
                                  <Trash2 size={14} className="text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {section.newFiles.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {section.newFiles.map((file, index) => (
                              <div
                                key={`${section.id}-new-${index}`}
                                className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={file.previewUrl}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeNewFileFromSection(
                                      section.id,
                                      index,
                                    )
                                  }
                                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
                                >
                                  <Trash2 size={14} className="text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        ) : null}
      </div>

      {/* ── KATALOQ — yığcam düymə, basanda açılır ── */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center gap-2 p-2">
          <button
            type="button"
            onClick={() => setCatalogPanelOpen((v) => !v)}
            className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left transition hover:bg-slate-50"
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold text-slate-800">
                Kataloq
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
                {catalogItems.length === 0
                  ? "Link yoxdur"
                  : `${catalogItems.length} link · basıb aç`}
              </span>
            </span>
            {catalogPanelOpen ? (
              <ChevronUp size={18} className="shrink-0 text-slate-400" />
            ) : (
              <ChevronDown size={18} className="shrink-0 text-slate-400" />
            )}
          </button>
          <button
            type="button"
            onClick={addCatalogItem}
            className="mr-1 inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#29AEEE] bg-[#29AEEE]/5 px-3 py-2 text-[11px] font-bold text-[#29AEEE] transition hover:bg-[#29AEEE]/10"
          >
            <Plus size={14} /> Əlavə et
          </button>
        </div>

        {catalogPanelOpen ? (
          <div className="space-y-2 border-t border-slate-100 px-3 pb-3 pt-2">
            {catalogItems.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm font-medium text-slate-500">
                Hələ link yoxdur. &quot;Əlavə et&quot; ilə yaradın.
              </p>
            ) : (
              catalogItems.map((item) => {
                const isExpanded = expandedCatalogId === item.id;
                const title = item.name.trim() || "Başlıqsız link";

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/80"
                  >
                    <div className="flex items-center gap-1 p-1.5">
                      <button
                        type="button"
                        onClick={() => toggleCatalogExpanded(item.id)}
                        className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition hover:bg-white"
                      >
                        <span className="truncate text-sm font-semibold text-slate-800">
                          {title}
                        </span>
                        {isExpanded ? (
                          <ChevronUp
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                        ) : (
                          <ChevronDown
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCatalogItem(item.id)}
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isExpanded ? (
                      <div className="space-y-2 border-t border-slate-200/80 px-3 pb-3 pt-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateCatalogItem(item.id, "name", e.target.value)
                          }
                          placeholder="Başlıq (məs: Məhsul kataloqu)"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/10"
                        />
                        <input
                          type="text"
                          inputMode="url"
                          autoComplete="url"
                          value={item.url}
                          onChange={(e) =>
                            updateCatalogItem(item.id, "url", e.target.value)
                          }
                          placeholder="https://example.com/kataloq"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/10"
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        ) : null}
      </div>

      {/* ── CV YÜKLƏMƏ (PDF) ── */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
          CV <span className="text-[10px] text-slate-400 font-medium normal-case tracking-normal">(yalnız PDF)</span>
        </span>
        <input 
          type="file" 
          name="cv" 
          accept="application/pdf" 
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#29AEEE]/10 file:text-[#29AEEE] hover:file:bg-[#29AEEE]/20 transition"
        />
        {profile?.cv_url && !removeCv && (
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

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-bold text-slate-600 uppercase tracking-wide cursor-pointer hover:bg-slate-50 transition">
            <span>Referral link düyməsi aktivdir</span>
            <input
              type="checkbox"
              name="referral_enabled"
              defaultChecked={profile?.referral_enabled ?? false}
              className="size-5 rounded accent-indigo-650"
            />
          </label>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Referral link
            </span>
            <Field
              name="referral_url"
              label="Xüsusi referral URL (boş buraxsa profil linki istifadə olunur)"
              defaultValue={profile?.referral_url ?? undefined}
              placeholder="https://..."
            />
          </div>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-bold text-slate-600 uppercase tracking-wide cursor-pointer hover:bg-slate-50 transition">
            <span>Portfolio düyməsi aktivdir</span>
            <input
              type="checkbox"
              name="portfolio_enabled"
              defaultChecked={profile?.portfolio_enabled ?? true}
              className="size-5 rounded accent-indigo-650"
            />
          </label>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Google Review
            </span>
            <Field
              name="google_review_url"
              label="Google Review linki"
              defaultValue={profile?.google_review_url}
              placeholder="https://g.page/r/..."
            />
          </div>
        </>
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

/** Phone / WhatsApp — paste always works (spaces, +, dashes, copied text). */
function normalizePhonePaste(raw: string): string {
  const text = raw.replace(/\u00a0/g, " ").trim();
  if (!text) return "";
  // Keep digits and common phone punctuation; drop letters / invisible junk
  const cleaned = text.replace(/[^\d+()\s.-]/g, "").replace(/\s+/g, " ").trim();
  return cleaned || text;
}

function PhoneField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  return (
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
      {label}
      <input
        type="text"
        name={name}
        value={value}
        inputMode="tel"
        autoComplete="tel"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onPaste={(e) => {
          // Force clipboard text into the field (fixes blocked / partial paste)
          e.preventDefault();
          const pasted =
            e.clipboardData?.getData("text/plain") ||
            e.clipboardData?.getData("text") ||
            "";
          const next = normalizePhonePaste(pasted);
          const input = e.currentTarget;
          const start = input.selectionStart ?? value.length;
          const end = input.selectionEnd ?? value.length;
          const merged = value.slice(0, start) + next + value.slice(end);
          setValue(merged);
        }}
        className={inputClass}
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  value,
  onChange,
  options,
}: {
  name: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className={inputClass}
      >
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
  compact = false,
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
  compact?: boolean;
  /** Instagram-style pan/zoom crop before applying (avatars) */
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
    // Allow re-picking the same file
    clearInput();
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    // GIF animations break with canvas crop — skip modal
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
    <div className={`flex flex-col ${compact ? "gap-1.5" : "gap-2"}`}>
      {/* Label */}
      <span
        className={`font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5 ${
          compact ? "text-[10px]" : "text-xs"
        }`}
      >
        {inputName === "avatar" ? (
          <Upload size={compact ? 11 : 13} className="text-[#29AEEE]" />
        ) : (
          <ImagePlus size={compact ? 11 : 13} className="text-[#29AEEE]" />
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
          "relative overflow-hidden border-2 transition-all duration-200 cursor-pointer select-none",
          compact ? "rounded-xl" : "rounded-2xl",
          compact
            ? aspect === "square"
              ? "aspect-square w-full max-w-[7.5rem]"
              : "aspect-video w-full max-w-[10rem]"
            : aspect === "square"
              ? "aspect-square w-full"
              : "aspect-video w-full",
          hasImage
            ? "border-slate-200 cursor-default"
            : isDragging
              ? "border-[#29AEEE] bg-[#29AEEE]/5 scale-[1.01]"
              : "border-dashed border-slate-300 bg-slate-50 hover:border-[#29AEEE] hover:bg-[#29AEEE]/5",
        ].join(" ")}
      >
        {hasImage ? (
          /* Preview */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          /* Empty state */
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center ${
              compact ? "gap-1 p-1.5" : "gap-2 p-3"
            }`}
          >
            <div className={[
              "grid place-items-center rounded-lg transition-colors duration-200",
              compact ? "size-7" : "size-10 rounded-xl",
              isDragging ? "bg-[#29AEEE]/15 text-[#29AEEE]" : "bg-slate-100 text-slate-400",
            ].join(" ")}>
              <Upload size={compact ? 13 : 18} />
            </div>
            <div className="text-center">
              <p className={[
                "font-bold transition-colors",
                compact ? "text-[9px] leading-tight" : "text-[11px]",
                isDragging ? "text-[#29AEEE]" : "text-slate-500",
              ].join(" ")}>
                {isDragging ? "Buraxın!" : compact ? "Basın" : "Sürükleyin və ya basın"}
              </p>
              {!compact ? (
                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP</p>
              ) : null}
            </div>
          </div>
        )}

        {/* Drag overlay on preview */}
        {hasImage && isDragging && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#29AEEE]/70 backdrop-blur-sm">
            <Upload size={compact ? 16 : 24} className="text-white" />
            <p className={`font-bold text-white ${compact ? "text-[10px]" : "text-xs"}`}>
              Buraxın!
            </p>
          </div>
        )}

        {/* Hidden input — no name while cropping so form doesn't submit raw pick */}
        <input
          ref={inputRef}
          type="file"
          name={cropSrc ? undefined : inputName}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            // Crop path: clear value so the same file can be re-picked after cancel.
            // Non-crop: keep files on the input for form submit.
            if (enableCrop && file.type !== "image/gif") {
              handleFile(file);
              e.target.value = "";
              return;
            }
            handleFile(file);
          }}
        />
      </div>

      {/* Action buttons */}
      <div className={`flex gap-1.5 ${compact ? "max-w-[7.5rem]" : ""}`}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#29AEEE] font-bold text-white shadow-sm transition duration-200 hover:bg-[#1a9ad4] active:scale-95 ${
            compact ? "px-2 py-1.5 text-[10px]" : "rounded-xl px-3 py-2 text-[11px] gap-1.5"
          }`}
        >
          <Upload size={compact ? 10 : 12} /> {compact ? "Seç" : "Şəkil seç"}
        </button>
        {(hasExisting || hasImage) && (
          <button
            type="button"
            onClick={handleRemove}
            className={`inline-flex items-center justify-center gap-1 border border-rose-200 bg-rose-50 font-bold text-rose-600 transition duration-200 hover:bg-rose-100 active:scale-95 ${
              compact
                ? "rounded-lg px-2 py-1.5 text-[10px]"
                : "rounded-xl px-3 py-2 text-[11px] gap-1.5"
            }`}
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
