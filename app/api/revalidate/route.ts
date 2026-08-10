import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { profileCacheTag } from "@/lib/profiles";

/**
 * On-demand cache bust for public profiles.
 * Auth: Authorization: Bearer <CRON_SECRET>  OR  ?secret=<CRON_SECRET>
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const querySecret = request.nextUrl.searchParams.get("secret") || "";

  if (!secret || (bearer !== secret && querySecret !== secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let slug = request.nextUrl.searchParams.get("slug") || "";
  try {
    const body = (await request.json().catch(() => null)) as {
      slug?: string;
    } | null;
    if (body?.slug) slug = body.slug;
  } catch {
    /* empty */
  }

  if (!slug || slug.length < 2) {
    return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
  }

  revalidateTag(profileCacheTag(slug));
  revalidateTag("profiles");
  revalidatePath(`/${slug}`);
  revalidatePath(`/u/${slug}`);
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, slug, revalidated: true });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
