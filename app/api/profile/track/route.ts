import { createServiceSupabaseClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { slug, action } = (await req.json()) as {
      slug?: string;
      action?: "view" | "save";
    };

    if (!slug || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase uninitialized" }, { status: 500 });
    }

    if (action === "view") {
      const { error } = await supabase.rpc("increment_profile_view", { p_slug: slug });
      if (error) {
        // Fallback if RPC function is not created yet in DB
        const { data } = await supabase
          .from("profiles")
          .select("views_count")
          .eq("slug", slug)
          .single();
        const current = (data?.views_count ?? 0) + 1;
        await supabase
          .from("profiles")
          .update({ views_count: current })
          .eq("slug", slug);
      }
    } else if (action === "save") {
      const { error } = await supabase.rpc("increment_profile_save", { p_slug: slug });
      if (error) {
        // Fallback if RPC function is not created yet in DB
        const { data } = await supabase
          .from("profiles")
          .select("saves_count")
          .eq("slug", slug)
          .single();
        const current = (data?.saves_count ?? 0) + 1;
        await supabase
          .from("profiles")
          .update({ saves_count: current })
          .eq("slug", slug);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
