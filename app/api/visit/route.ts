import { incrementDailyVisit } from "@/lib/visits";

/**
 * Counts a unique browser session visit for today (Asia/Baku).
 * Does NOT send Telegram — daily report goes out at 20:00 via cron.
 */
export async function POST() {
  const result = await incrementDailyVisit();

  if (!result.ok) {
    // Fail soft so the site never breaks for visitors
    return Response.json(
      { success: false, error: result.error },
      { status: 500 },
    );
  }

  return Response.json({ success: true, date: result.visitDate });
}
