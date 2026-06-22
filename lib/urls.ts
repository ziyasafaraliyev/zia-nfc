export function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    (process.env.NODE_ENV === "production"
      ? "https://zianfc.vercel.app"
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";

  return url.replace(/\/+$/, "");
}

// Block dangerous URL protocols like javascript:, data:, etc.
export function isSafeUrl(url: string): boolean {
  const normalizedUrl = url.trim().toLowerCase();
  const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:"];
  return !dangerousProtocols.some((protocol) => normalizedUrl.startsWith(protocol));
}

export function getProfilePath(slug: string) {
  return `/${slug}`;
}

export function getProfileUrl(slug: string) {
  return `${getSiteUrl()}${getProfilePath(slug)}`;
}

export function getProfileVcardPath(slug: string) {
  return `${getProfilePath(slug)}/vcard`;
}

export function getRestaurantPath(slug: string) {
  return `/${slug}`;
}

export function getRestaurantUrl(slug: string) {
  return `${getSiteUrl()}${getRestaurantPath(slug)}`;
}
