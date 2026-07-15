import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware: security headers + basic request hardening.
 * Auth for admin is enforced in server components/actions (HMAC cookie).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block path traversal / null-byte probes early
  if (
    pathname.includes("..") ||
    pathname.includes("%2e%2e") ||
    pathname.includes("\0") ||
    pathname.includes("%00")
  ) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Disallow unexpected methods on public pages (noise / probes)
  const method = request.method.toUpperCase();
  if (
    !["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"].includes(
      method,
    )
  ) {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  /**
   * Public NFC profile routes: skip redundant header work.
   * Security headers already come from next.config — this saves edge latency
   * on the hottest path (customer opens profile after card tap).
   */
  const isPublicProfile =
    pathname.startsWith("/u/") ||
    pathname.startsWith("/r/") ||
    // short slug path e.g. /zaur (single segment, not reserved)
    (/^\/[a-z0-9-]+\/?$/i.test(pathname) &&
      !["/admin", "/pay", "/restoran", "/api"].some((p) =>
        pathname.startsWith(p),
      ));

  if (isPublicProfile && (method === "GET" || method === "HEAD")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Defense-in-depth headers (also set in next.config; middleware covers edge cases)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
  );
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Don't cache authenticated admin shells
  if (pathname.startsWith("/admin") || pathname.startsWith("/restoran")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * All paths except static assets and Next internals
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
