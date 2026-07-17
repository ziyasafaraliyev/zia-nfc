import { NextResponse } from "next/server";
import path from "path";
import QRCode from "qrcode";
import sharp from "sharp";
import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import type { Profile } from "@/lib/types";

/** Cache QR PNG at CDN — profile URL rarely changes without admin save */
export const revalidate = 300;

const QR_SIZE = 384;
/** Logo is small in the center (~16% of QR) so scanning still works */
const LOGO_RATIO = 0.16;
const LOGO_PAD_RATIO = 1.2;

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
  ios: "#007AFF",
  iossoft: "#636366",
  iosdark: "#0A84FF",
};

function getQrColor(theme: Profile["theme"]) {
  return qrThemeColors[theme ?? "light"] ?? qrThemeColors.light;
}

// Validate slug format to prevent injection
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 2 && slug.length <= 50;
}

let cachedLogoOverlay: Buffer | null = null;

async function getLogoOverlay(): Promise<Buffer> {
  if (cachedLogoOverlay) return cachedLogoOverlay;

  const logoPath = path.join(process.cwd(), "public", "zianfclogo1.png");
  const logoSize = Math.round(QR_SIZE * LOGO_RATIO);
  const padSize = Math.round(logoSize * LOGO_PAD_RATIO);

  const resizedLogo = await sharp(logoPath)
    .resize(logoSize, logoSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();

  // White pad behind logo so QR modules don't show through
  cachedLogoOverlay = await sharp({
    create: {
      width: padSize,
      height: padSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: resizedLogo, gravity: "center" }])
    .png()
    .toBuffer();

  return cachedLogoOverlay;
}

async function buildQrPng(profileUrl: string, qrColor: string): Promise<Buffer> {
  // H error correction so center logo does not break scanning
  const qrBuffer = await QRCode.toBuffer(profileUrl, {
    type: "png",
    margin: 2,
    width: QR_SIZE,
    errorCorrectionLevel: "H",
    color: {
      dark: qrColor,
      light: "#ffffff",
    },
  });

  try {
    const logo = await getLogoOverlay();
    return await sharp(qrBuffer)
      .composite([{ input: logo, gravity: "center" }])
      .png()
      .toBuffer();
  } catch {
    // If logo is missing or sharp fails, still return plain QR
    return Buffer.from(qrBuffer);
  }
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
    const png = await buildQrPng(profileUrl, qrColor);

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
