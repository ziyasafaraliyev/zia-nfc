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

  const png = await QRCode.toBuffer(profileUrl, {
    margin: 2,
    width: 512,
    color: { dark: "#000000", light: "#ffffff" },
  });

  return new NextResponse(png as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

