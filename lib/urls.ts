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

export function getProfilePath(slug: string) {
  return `/${slug}`;
}

export function getProfileUrl(slug: string) {
  return `${getSiteUrl()}${getProfilePath(slug)}`;
}

export function getProfileVcardPath(slug: string) {
  return `${getProfilePath(slug)}/vcard`;
}
