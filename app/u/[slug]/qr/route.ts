import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await ctx.params;

    const profile = await getProfileBySlug(slug);
    if (!profile || !profile.enabled) {
      return new NextResponse("Not found", { status: 404 });
    }

    const profileUrl = getProfileUrl(profile.slug);

    // Node mühitində işləməsi üçün "npm install canvas" olunmalıdır
    const png = await QRCode.toBuffer(profileUrl, {
      type: "png",
      margin: 2,
      width: 512,
      errorCorrectionLevel: "H",
      color: {
        dark: "#29AEEE",
        light: "#ffffff",
      },
    });

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${profile.slug}-qr.png"`,
        "Cache-Control": "public, max-age=86400, must-revalidate",
      },
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
