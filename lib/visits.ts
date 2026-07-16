import { createServiceSupabaseClient } from "@/lib/supabase";

const STORAGE_BUCKET = "profiles";
const STORAGE_PREFIX = "internal/daily-visits";

/** Calendar date in Asia/Baku (YYYY-MM-DD). Azerbaijan is UTC+4 year-round. */
export function bakuDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Baku",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatBakuDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}

async function incrementViaRpc(
  supabase: NonNullable<ReturnType<typeof createServiceSupabaseClient>>,
  visitDate: string,
) {
  const { error } = await supabase.rpc("increment_site_visit", {
    p_date: visitDate,
  });
  return error;
}

async function getCountViaTable(
  supabase: NonNullable<ReturnType<typeof createServiceSupabaseClient>>,
  visitDate: string,
) {
  const { data, error } = await supabase
    .from("site_daily_visits")
    .select("count")
    .eq("visit_date", visitDate)
    .maybeSingle();

  if (error) return { error, count: 0 };
  return {
    error: null,
    count: typeof data?.count === "number" ? data.count : 0,
  };
}

/** Fallback when SQL table/RPC is not migrated yet — atomic enough for low traffic. */
async function incrementViaStorage(
  supabase: NonNullable<ReturnType<typeof createServiceSupabaseClient>>,
  visitDate: string,
) {
  const path = `${STORAGE_PREFIX}/${visitDate}.json`;
  let count = 0;

  const { data: existing } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(path);

  if (existing) {
    try {
      const text = await existing.text();
      const parsed = JSON.parse(text) as { count?: number };
      if (typeof parsed.count === "number" && parsed.count >= 0) {
        count = parsed.count;
      }
    } catch {
      count = 0;
    }
  }

  count += 1;
  const body = JSON.stringify({ count, updated_at: new Date().toISOString() });
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, body, {
      contentType: "application/json",
      upsert: true,
    });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, count };
}

async function getCountViaStorage(
  supabase: NonNullable<ReturnType<typeof createServiceSupabaseClient>>,
  visitDate: string,
) {
  const path = `${STORAGE_PREFIX}/${visitDate}.json`;
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(path);

  if (error || !data) {
    // Missing file = zero visits
    if (error?.message?.toLowerCase().includes("not found") || !data) {
      return { ok: true as const, count: 0 };
    }
    return { ok: false as const, error: error.message, count: 0 };
  }

  try {
    const text = await data.text();
    const parsed = JSON.parse(text) as { count?: number };
    return {
      ok: true as const,
      count: typeof parsed.count === "number" ? parsed.count : 0,
    };
  } catch {
    return { ok: true as const, count: 0 };
  }
}

export async function incrementDailyVisit(visitDate = bakuDateString()) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { ok: false as const, error: "Supabase not configured" };
  }

  const rpcError = await incrementViaRpc(supabase, visitDate);
  if (!rpcError) {
    return { ok: true as const, visitDate, backend: "table" as const };
  }

  // Table/RPC missing → storage fallback
  const storage = await incrementViaStorage(supabase, visitDate);
  if (!storage.ok) {
    return {
      ok: false as const,
      error: `RPC: ${rpcError.message}; Storage: ${storage.error}`,
    };
  }

  return {
    ok: true as const,
    visitDate,
    backend: "storage" as const,
    count: storage.count,
  };
}

export async function getDailyVisitCount(visitDate: string) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { ok: false as const, error: "Supabase not configured", count: 0 };
  }

  const table = await getCountViaTable(supabase, visitDate);
  if (!table.error) {
    return { ok: true as const, count: table.count, backend: "table" as const };
  }

  const storage = await getCountViaStorage(supabase, visitDate);
  if (!storage.ok) {
    return {
      ok: false as const,
      error: `Table: ${table.error.message}; Storage: ${storage.error}`,
      count: 0,
    };
  }

  return {
    ok: true as const,
    count: storage.count,
    backend: "storage" as const,
  };
}

export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || "1309527475";

  if (!token) {
    return { ok: false as const, error: "TELEGRAM_BOT_TOKEN missing" };
  }

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { ok: false as const, error: detail || "Telegram API error" };
  }

  return { ok: true as const };
}
