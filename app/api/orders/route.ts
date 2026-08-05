import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, amount } = body ?? {};

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Missing service DB key" }, { status: 500 });
    }

    const token = cryptoToken();

    const { data, error } = await supabase
      .from("restaurant_orders")
      .insert([
        {
          token,
          restaurant_slug: slug,
          amount: amount ?? 0,
          status: "pending",
        },
      ])
      .select("id, token")
      .limit(1)
      .single();

    if (error || !data) {
      console.error("[api/orders] insert error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, token: data.token });
  } catch (err) {
    console.error("[api/orders] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function cryptoToken() {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  // fallback
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
