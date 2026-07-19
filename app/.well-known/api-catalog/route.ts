import { NextResponse } from "next/server";

const BASE_URL = "https://zianfc.vercel.app";

/**
 * RFC 9727 — API Catalog
 * Returns application/linkset+json describing this site's API surface.
 */
export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: `${BASE_URL}/api/chat`,
        "service-desc": [
          {
            href: `${BASE_URL}/.well-known/openapi.json`,
            type: "application/openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${BASE_URL}/api/chat`,
            type: "text/html",
          },
        ],
        type: [{ value: "AI chat endpoint for NFC profile queries" }],
      },
      {
        anchor: `${BASE_URL}/api/visit`,
        type: [{ value: "NFC card visit tracking endpoint" }],
      },
    ],
  };

  return NextResponse.json(catalog, {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    },
  });
}
