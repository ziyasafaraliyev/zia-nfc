import {
  bakuDateString,
  formatBakuDateLabel,
  getDailyVisitCount,
  sendTelegramMessage,
} from "@/lib/visits";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET> when set
  const auth = request.headers.get("authorization");
  if (secret) {
    return auth === `Bearer ${secret}`;
  }
  // Local / manual: allow only when explicitly unlocked (never open in prod without secret)
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  return false;
}

/**
 * Daily Telegram report at 20:00 Asia/Baku (cron: 16:00 UTC).
 * Reports how many people visited the site that calendar day.
 */
export async function GET(request: Request) {
  if (!authorize(request)) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const visitDate = bakuDateString();
  const { ok, count, error } = await getDailyVisitCount(visitDate);

  if (!ok) {
    return Response.json(
      { success: false, error: error || "Failed to read visit count" },
      { status: 500 },
    );
  }

  const label = formatBakuDateLabel(visitDate);
  const text =
    count === 0
      ? `📊 Günlük hesabat (${label})\n\nBu gün sayta hələ heç kim daxil olmayıb.`
      : `📊 Günlük hesabat (${label})\n\nBu gün sayta ${count} nəfər daxil olub.`;

  const telegram = await sendTelegramMessage(text);

  if (!telegram.ok) {
    return Response.json(
      { success: false, error: telegram.error, count, date: visitDate },
      { status: 502 },
    );
  }

  return Response.json({
    success: true,
    date: visitDate,
    count,
    message: text,
  });
}
