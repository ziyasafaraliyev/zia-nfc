export type GalleryFileMetaEntry = {
  sectionId: string;
  fileName?: string;
  mimeType?: string;
};

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "heic",
  "heif",
]);

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  pdf: "application/pdf",
};

export function asUploadEntry(
  entry: FormDataEntryValue | null | undefined,
): File | Blob | null {
  if (
    typeof entry === "object" &&
    entry !== null &&
    "arrayBuffer" in entry &&
    typeof (entry as Blob).size === "number" &&
    (entry as Blob).size > 0
  ) {
    return entry as File | Blob;
  }

  return null;
}

export function isUploadEntry(
  entry: FormDataEntryValue | null | undefined,
): boolean {
  return asUploadEntry(entry) !== null;
}

export function getUploadFileName(file: Blob, fallbackName?: string): string {
  if (file instanceof File && file.name) {
    return file.name;
  }
  return fallbackName || `upload-${Date.now()}.webp`;
}

export function getExtension(fileName: string): string {
  return (fileName.split(".").pop() || "").toLowerCase();
}

export function guessMimeType(fileName: string, declaredType?: string): string {
  if (declaredType && declaredType.trim()) {
    return declaredType.trim();
  }

  const ext = getExtension(fileName);
  return MIME_BY_EXTENSION[ext] || "application/octet-stream";
}

export function isAllowedImageMime(mime: string, fileName: string): boolean {
  if (mime.startsWith("image/")) {
    return true;
  }

  return IMAGE_EXTENSIONS.has(getExtension(fileName));
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/") && mime !== "application/pdf";
}

/** Stored raster images are always WebP — keep helper for callers that need a safe ext. */
export function safeImageExtension(_fileName: string, _mime: string): string {
  return "webp";
}