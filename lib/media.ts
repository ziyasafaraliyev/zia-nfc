/**
 * Supabase Storage image transforms (CDN-side resize).
 * object/public/... → render/image/public/...?width=&quality=
 * Falls back to original URL if not a public storage object URL.
 */
export function storageImageUrl(
  url: string | null | undefined,
  opts: {
    width: number;
    height?: number;
    quality?: number;
    resize?: "cover" | "contain" | "fill";
  },
): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/storage\/v1\/object\/public\/(.+)$/);
    if (!match) return url;

    u.pathname = `/storage/v1/render/image/public/${match[1]}`;
    u.search = "";
    u.searchParams.set("width", String(opts.width));
    if (opts.height != null) u.searchParams.set("height", String(opts.height));
    u.searchParams.set("resize", opts.resize ?? "cover");
    u.searchParams.set("quality", String(opts.quality ?? 72));
    return u.toString();
  } catch {
    return url;
  }
}

/** Avatar on profile card (~7rem) — 2× for retina */
export function profileAvatarSrc(url: string | null | undefined) {
  return storageImageUrl(url, { width: 224, height: 224, quality: 72, resize: "cover" });
}

/** Cover / hero background — phone-width class */
export function profileCoverSrc(url: string | null | undefined) {
  return storageImageUrl(url, { width: 720, quality: 70, resize: "cover" });
}
