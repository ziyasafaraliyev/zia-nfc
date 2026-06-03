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

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name}`,
    profile.profession ? `TITLE:${profile.profession}` : "",
    profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
    profile.website
      ? `URL:${profile.website}`
      : `URL:${getProfileUrl(profile.slug)}`,
    profile.location ? `ADR;TYPE=WORK:;;${profile.location};;;;` : "",
    profile.bio ? `NOTE:${profile.bio}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${profile.slug}.vcf"`,
    },
  });
}
