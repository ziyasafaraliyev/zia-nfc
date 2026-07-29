import { getProfileBySlug } from "@/lib/profiles";
import { getProfileUrl } from "@/lib/urls";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPhotoVCardLine(avatarUrl?: string | null, requestUrl?: string): Promise<string> {
  if (!avatarUrl) return "";
  try {
    let fullUrl = avatarUrl;
    if (avatarUrl.startsWith("/")) {
      const origin = new URL(requestUrl || "https://zianfc.vercel.app").origin;
      fullUrl = `${origin}${avatarUrl}`;
    }

    const res = await fetch(fullUrl, {
      headers: { Accept: "image/*" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return "";

    const contentType = res.headers.get("content-type") || "";
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength === 0) return "";

    const base64 = Buffer.from(buffer).toString("base64");
    let mediaType = "JPEG";
    if (contentType.includes("png") || avatarUrl.endsWith(".png")) {
      mediaType = "PNG";
    } else if (contentType.includes("webp") || avatarUrl.endsWith(".webp")) {
      mediaType = "WEBP";
    } else if (contentType.includes("gif") || avatarUrl.endsWith(".gif")) {
      mediaType = "GIF";
    }

    const chunks = base64.match(/.{1,74}/g) || [base64];
    const foldedBase64 = chunks.join("\r\n ");

    return `PHOTO;ENCODING=b;TYPE=${mediaType}:${foldedBase64}`;
  } catch (err) {
    console.error("vCard photo fetch error:", err);
    return "";
  }
}

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

  const photoLine = await getPhotoVCardLine(profile.avatar_url, request.url);

  const socialProfiles: string[] = [];
  if (profile.instagram) socialProfiles.push(`X-SOCIALPROFILE;type=instagram:${cleanUrl(profile.instagram)}`);
  if (profile.telegram) socialProfiles.push(`X-SOCIALPROFILE;type=telegram:${cleanUrl(profile.telegram)}`);
  if (profile.linkedin) socialProfiles.push(`X-SOCIALPROFILE;type=linkedin:${cleanUrl(profile.linkedin)}`);
  if (profile.facebook) socialProfiles.push(`X-SOCIALPROFILE;type=facebook:${cleanUrl(profile.facebook)}`);
  if (profile.x) socialProfiles.push(`X-SOCIALPROFILE;type=twitter:${cleanUrl(profile.x)}`);

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(profile.name)};;;;`,
    `FN:${escapeVCardValue(profile.name)}`,
    profile.profession ? `TITLE:${escapeVCardValue(profile.profession)}` : "",
    profile.phone ? `TEL;TYPE=CELL,VOICE:${escapeVCardValue(profile.phone)}` : "",
    profile.phone2 ? `TEL;TYPE=WORK,VOICE:${escapeVCardValue(profile.phone2)}` : "",
    profile.email ? `EMAIL;TYPE=INTERNET:${escapeVCardValue(profile.email)}` : "",
    `URL;TYPE=ZiaNFC:${cleanUrl(getProfileUrl(profile.slug))}`,
    profile.website ? `URL;TYPE=WORK:${cleanUrl(profile.website)}` : "",
    profile.location ? `ADR;TYPE=WORK:;;${escapeVCardValue(profile.location)};;;;` : "",
    photoLine,
    ...socialProfiles,
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
