import { NextResponse } from "next/server";
import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import { buildQrPng, buildQrSvg } from "@/lib/qr";

/** Cache QR PNG at CDN — profile URL rarely changes without admin save */
export const revalidate = 300;

// Validate slug format to prevent injection
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 2 && slug.length <= 50;
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await ctx.params;

    // Validate slug format
    if (!isValidSlug(slug)) {
      return new NextResponse("Invalid slug format", { status: 400 });
    }

    const profile = await getProfileBySlug(slug);
    if (!profile || !profile.enabled) {
      return new NextResponse("Not found", { status: 404 });
    }

    const profileUrl = getProfileUrl(profile.slug);
    const format = new URL(req.url).searchParams.get("format");

    if (format === "svg") {
      const svg = await buildQrSvg(profileUrl);

      return new NextResponse(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `inline; filename="${profile.slug}-qr.svg"`,
          "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
        },
      });
    }



    const png = await buildQrPng(profileUrl);

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${profile.slug}-qr.png"`,
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
