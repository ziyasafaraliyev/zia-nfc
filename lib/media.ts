/**
 * Optional CDN resize for media URLs.
 * - Legacy Supabase Storage: object/public → render/image/public (width/quality)
 * - Cloudflare R2 (and any other host): return the original public URL as-is
 *   (R2 public buckets do not provide Supabase-style image transforms)
 *
 * Prefer resize "contain" for profile media so high-res uploads are not
 * center-cropped (which looks like a zoom) before CSS object-fit runs.
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
    // Not Supabase Storage (e.g. R2 public URL) — use as stored in DB
    if (!match) return url;

    u.pathname = `/storage/v1/render/image/public/${match[1]}`;
    u.search = "";
    u.searchParams.set("width", String(opts.width));
    if (opts.height != null) u.searchParams.set("height", String(opts.height));
    u.searchParams.set("resize", opts.resize ?? "contain");
    u.searchParams.set("quality", String(opts.quality ?? 80));
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Avatar on profile card (~7rem) — 2× retina.
 * contain + width only: full photo scaled down; CSS object-cover frames the square.
 * (resize=cover on CDN was center-cropping high-res photos and looked zoomed.)
 */
export function profileAvatarSrc(url: string | null | undefined) {
  return storageImageUrl(url, {
    width: 400,
    quality: 82,
    resize: "contain",
  });
}

/**
 * Cover / hero background — phone-width class, no crop on CDN.
 */
export function profileCoverSrc(url: string | null | undefined) {
  return storageImageUrl(url, {
    width: 1200,
    quality: 82,
    resize: "contain",
  });
}
