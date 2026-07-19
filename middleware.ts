import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Markdown homepage content for AI agents */
const HOMEPAGE_MARKDOWN = `# Zia NFC — Premium NFC Digital Business Card Platform

**URL**: https://zianfc.vercel.app  
**Language**: Azerbaijani (az-AZ)  
**Category**: NFC Technology / Digital Business Cards

## About

Zia NFC is a premium digital business card platform powered by NFC (Near Field Communication) technology. 
It allows professionals and businesses to share contact information, portfolios, social media profiles, 
and galleries instantly with a tap of an NFC card or sticker.

## Products & Services

- **NFC Business Cards** — Premium physical NFC-enabled business cards (vizit kart)
- **NFC Stickers** — Adhesive NFC stickers for phones, laptops, and surfaces
- **NFC Table Stands** — Desktop NFC display stands for restaurants and offices  
- **Digital Profiles** — Customizable public profile pages with contact info and social links
- **Restaurant Menus** — Digital menu system for restaurants with QR/NFC ordering
- **Portfolio Pages** — Gallery and portfolio showcasing for creative professionals
- **Analytics Dashboard** — Visit tracking and analytics for NFC card interactions

## Public Profile Access

Individual public profiles are accessible at:
\`https://zianfc.vercel.app/u/{slug}\`

Each profile contains:
- Name, profession, bio
- Phone numbers (WhatsApp, standard)
- Social media links (Instagram, TikTok, LinkedIn, YouTube, etc.)
- Location and Google Maps links
- Portfolio gallery
- Contact download (vCard)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| \`/api/chat\` | POST | AI-powered chat for product/service queries |
| \`/api/visit\` | POST | NFC card visit tracking |

## Agent Discovery

- **API Catalog**: https://zianfc.vercel.app/.well-known/api-catalog
- **MCP Server Card**: https://zianfc.vercel.app/.well-known/mcp/server-card.json
- **Agent Skills**: https://zianfc.vercel.app/.well-known/agent-skills/index.json
- **Sitemap**: https://zianfc.vercel.app/sitemap.xml

## Contact & Purchase

Visit https://zianfc.vercel.app to order NFC cards or explore digital profile options.

---
*Content-Type: text/markdown | Generated for AI agent consumption*
`;

/**
 * Edge middleware: security headers + basic request hardening + Markdown negotiation.
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
   * Markdown Negotiation for AI agents (RFC 7231 content negotiation)
   * If an agent requests the homepage with Accept: text/markdown,
   * return a markdown representation instead of HTML.
   */
  if (
    pathname === "/" &&
    (method === "GET" || method === "HEAD") &&
    request.headers.get("accept")?.includes("text/markdown")
  ) {
    return new NextResponse(method === "HEAD" ? null : HOMEPAGE_MARKDOWN, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
        Vary: "Accept",
      },
    });
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
