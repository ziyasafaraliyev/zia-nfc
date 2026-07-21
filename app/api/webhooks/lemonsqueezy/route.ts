import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/webhooks/lemonsqueezy
 *
 * Lemon Squeezy-dən gələn webhook eventlərini emal edir.
 * İmzanı HMAC-SHA256 ilə yoxlayır.
 *
 * Dəstəklənən eventlər:
 *   - order_created       → bir dəfəlik ödəniş tamamlandı
 *   - subscription_created → abunəlik yaradıldı
 *   - subscription_cancelled → abunəlik ləğv edildi
 */
export async function POST(request: Request) {
  // 1. Raw body — imza yoxlaması üçün
  const rawBody = await request.text();

  // 2. Lemon Squeezy webhook signature yoxlaması
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook/ls] LEMONSQUEEZY_WEBHOOK_SECRET təyin edilməyib.");
    return NextResponse.json({ error: "Config xətası." }, { status: 500 });
  }

  const signature = request.headers.get("x-signature");
  if (!signature) {
    return NextResponse.json({ error: "İmza tapılmadı." }, { status: 401 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );

  if (!isValid) {
    console.warn("[webhook/ls] Yanlış webhook imzası.");
    return NextResponse.json({ error: "Yanlış imza." }, { status: 401 });
  }

  // 3. Event-i parse et
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON parse xətası." }, { status: 400 });
  }

  const eventName = (payload as { meta?: { event_name?: string } }).meta
    ?.event_name;

  console.log("[webhook/ls] Event alındı:", eventName);

  switch (eventName) {
    case "order_created": {
      const data = (payload as { data?: { attributes?: Record<string, unknown> } }).data;
      const attrs = data?.attributes ?? {};
      const orderNumber = attrs.order_number;
      const customerEmail = attrs.user_email;
      const total = attrs.total_formatted;
      const plan = ((attrs.first_order_item as Record<string, unknown>)?.custom_data as Record<string, unknown>)?.plan ?? "standard";

      console.log(
        `[webhook/ls] Yeni sifariş: #${orderNumber} | ${customerEmail} | ${total} | Plan: ${plan}`
      );

      // TODO: Supabase-ə order yazın:
      // await supabase.from("orders").insert({ ... })

      break;
    }

    case "subscription_created": {
      const data = (payload as { data?: { attributes?: Record<string, unknown> } }).data;
      const attrs = data?.attributes ?? {};
      const customerEmail = attrs.user_email;
      const subscriptionId = (payload as { data?: { id?: string } }).data?.id;
      const status = attrs.status;

      console.log(
        `[webhook/ls] Yeni abunəlik: ${subscriptionId} | ${customerEmail} | Status: ${status}`
      );

      // TODO: Supabase-ə subscription yazın:
      // await supabase.from("subscriptions").insert({ ... })

      break;
    }

    case "subscription_cancelled": {
      const data = (payload as { data?: { attributes?: Record<string, unknown>; id?: string } }).data;
      const subscriptionId = data?.id;
      const customerEmail = data?.attributes?.user_email;

      console.log(
        `[webhook/ls] Abunəlik ləğv edildi: ${subscriptionId} | ${customerEmail}`
      );

      // TODO: Supabase-də abunəliyi deaktiv edin

      break;
    }

    default:
      console.log("[webhook/ls] İdarə edilməyən event:", eventName);
  }

  return NextResponse.json({ received: true });
}
