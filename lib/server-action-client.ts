import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getNextRedirectUrl } from "@/lib/is-next-redirect";

export function isBenignServerActionRejection(error: unknown): boolean {
  if (isRedirectError(error)) {
    return true;
  }

  if (typeof Event !== "undefined" && error instanceof Event) {
    return true;
  }

  return false;
}

export function handleServerActionRejection(error: unknown): boolean {
  if (isRedirectError(error)) {
    window.location.href = getNextRedirectUrl(error) ?? window.location.pathname;
    return true;
  }

  if (typeof Event !== "undefined" && error instanceof Event) {
    return true;
  }

  return false;
}