import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

const qrThemeColors: Record<NonNullable<Profile["theme"]>, string> = {
  light: "#1a1a2e",
  dark: "#38bdf8",
  premium: "#d4af37",
  emerald: "#10b981",
  ruby: "#e11d48",
  violet: "#8b5cf6",
  sapphire: "#29AEEE",
  sunset: "#fb7185",
  copper: "#1da2f1",
};

function getQrColor(theme: Profile["theme"]) {
  return qrThemeColors[theme ?? "light"] ?? qrThemeColors.light;
}

// Validate slug format to prevent injection
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 2 && slug.length <= 50;
}

export async function GET(
  _req: Request,
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
    const qrColor = getQrColor(profile.theme);

    // Node mühitində işləməsi üçün "npm install canvas" olunmalıdır
    const png = await QRCode.toBuffer(profileUrl, {
      type: "png",
      margin: 2,
      width: 512,
      errorCorrectionLevel: "H",
      color: {
        dark: qrColor,
        light: "#ffffff",
      },
    });

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${profile.slug}-qr.png"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
