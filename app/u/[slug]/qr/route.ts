import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";


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
    version: 5,
    color: { dark: "#29AEEE", light: "#ffffff" },
  });



  return new NextResponse(png as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, must-revalidate",
    },
  });
}

