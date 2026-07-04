export function isNextRedirect(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const digest =
    "digest" in error ? String((error as { digest?: unknown }).digest ?? "") : "";

  return digest.startsWith("NEXT_REDIRECT");
}

/** Parse target URL from Next.js redirect error digest: NEXT_REDIRECT;replace;/path;307; */
export function getNextRedirectUrl(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !isNextRedirect(error)) {
    return null;
  }

  const digest = String((error as { digest?: unknown }).digest ?? "");

  const parts = digest.split(";");
  const url = parts[2];

  if (typeof url === "string" && url.startsWith("/")) {
    return url;
  }

  return null;
}