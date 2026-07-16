export async function POST() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || "1309527475";

  if (!token) {
    return Response.json(
      { success: false, error: "TELEGRAM_BOT_TOKEN missing" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "1 nəfər daxil oldu",
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return Response.json(
        { success: false, error: "Telegram API error", detail: body },
        { status: 502 },
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Failed to notify" },
      { status: 500 },
    );
  }
}
