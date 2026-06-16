import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import path from "path";
import fs from "fs";
import { Jimp } from "jimp";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const profile = await getProfileBySlug(slug);
  if (!profile || !profile.enabled) {
    return new NextResponse("Not found", { status: 404 });
  }

  const profileUrl = getProfileUrl(profile.slug);

  let png = await QRCode.toBuffer(profileUrl, {
    margin: 2,
    width: 512,
    errorCorrectionLevel: "H",
    color: { dark: "#29AEEE", light: "#ffffff" },
  });

  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      const qrJimp = await Jimp.read(png);
      const logoJimp = await Jimp.read(logoPath);

      logoJimp.resize({ w: 68, h: 68 });

      // Create a white background container for the logo so it stands out and scans reliably
      const whiteBg = new Jimp({ width: 86, height: 86, color: 0xffffffff });
      whiteBg.composite(logoJimp, 9, 9);

      // Center on the 512x512 QR code
      // (512 - 86) / 2 = 213
      qrJimp.composite(whiteBg, 213, 213);

      png = await qrJimp.getBuffer("image/png");
    }
  } catch (error) {
    console.error("Error drawing logo on QR code:", error);
  }

  return new NextResponse(png as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, must-revalidate",
    },
  });
}

