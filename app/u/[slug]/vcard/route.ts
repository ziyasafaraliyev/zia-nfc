import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { slug } = await params;

  const profile = await getProfileBySlug(slug);

  if (!profile || !profile.enabled) {
    return new NextResponse("Not found", { status: 404 });
  }

  const escapeVCardValue = (val: string) => {
    return val
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  };

  const cleanUrl = (url: string) => url.replace(/[\r\n]/g, "");

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardValue(profile.name)}`,
    profile.profession ? `TITLE:${escapeVCardValue(profile.profession)}` : "",
    profile.phone ? `TEL;TYPE=CELL:${escapeVCardValue(profile.phone)}` : "",
    profile.website
      ? `URL:${cleanUrl(profile.website)}`
      : `URL:${cleanUrl(getProfileUrl(profile.slug))}`,
    profile.location ? `ADR;TYPE=WORK:;;${escapeVCardValue(profile.location)};;;;` : "",
    profile.bio ? `NOTE:${escapeVCardValue(profile.bio)}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${profile.slug}.vcf"`,
    },
  });
}
