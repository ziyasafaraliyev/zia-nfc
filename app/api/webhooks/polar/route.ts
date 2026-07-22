import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Standard Webhooks (Svix) signature verification
 */
function verifyPolarSignature(
  payload: string,
  headers: {
    id: string | null;
    timestamp: string | null;
    signature: string | null;
  },
  secret: string
): boolean {
  if (!headers.signature) return false;

  try {
    // Standard Svix secret format starts with 'whsec_'
    const rawSecret = secret.startsWith("whsec_")
      ? secret.substring(6)
      : secret;

    // Decode secret key
    const secretBytes = Buffer.from(rawSecret, "base64");

    // Construct signature content: msg_id.timestamp.payload
    const signaturePayload = `${headers.id ?? ""}.${headers.timestamp ?? ""}.${payload}`;

    const expectedSignature = crypto
      .createHmac("sha256", secretBytes)
      .update(signaturePayload)
      .digest("base64");

    // Extract signatures (format: "v1,sig1 v1,sig2")
    const signatures = headers.signature.split(" ");
    return signatures.some((sig) => {
      const [, signatureValue] = sig.split(",");
      return signatureValue === expectedSignature;
    });
  } catch (err) {
    console.warn("[webhook/polar] Signature verification error:", err);
    return false;
  }
}

/**
 * POST /api/webhooks/polar
 *
 * Polar.sh-dən gələn webhook eventlərini emal edir.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();

  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook/polar] POLAR_WEBHOOK_SECRET təyin edilməyib.");
    return NextResponse.json({ error: "Config xətası." }, { status: 500 });
  }

  // Header-ləri oxu (Standard Webhooks / Svix)
  const webhookId =
    request.headers.get("webhook-id") || request.headers.get("svix-id");
  const webhookTimestamp =
    request.headers.get("webhook-timestamp") ||
    request.headers.get("svix-timestamp");
  const webhookSignature =
    request.headers.get("webhook-signature") ||
    request.headers.get("svix-signature") ||
    request.headers.get("polar-signature");

  if (webhookSignature) {
    const isValid = verifyPolarSignature(
      rawBody,
      {
        id: webhookId,
        timestamp: webhookTimestamp,
        signature: webhookSignature,
      },
      secret
    );

    if (!isValid) {
      console.warn("[webhook/polar] Webhook imzası təsdiqlənmədi.");
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON parse xətası." }, { status: 400 });
  }

  const type = (payload as { type?: string }).type;
  const data = (payload as { data?: Record<string, unknown> }).data ?? {};

  console.log("[webhook/polar] Event alındı:", type);

  switch (type) {
    case "order.created":
    case "checkout.created": {
      const customerEmail =
        (data.customer as Record<string, unknown>)?.email ||
        data.customer_email;
      const amount = data.amount;
      const metadata = (data.metadata as Record<string, unknown>) ?? {};
      const plan = metadata.plan ?? "standard";

      console.log(
        `[webhook/polar] Sifariş tamamlandı: Email: ${customerEmail} | Məbləğ: ${amount} | Plan: ${plan}`
      );
      break;
    }

    case "subscription.created": {
      const customerEmail =
        (data.customer as Record<string, unknown>)?.email || data.user_email;
      const subscriptionId = data.id;
      const status = data.status;

      console.log(
        `[webhook/polar] Yeni abunəlik: ${subscriptionId} | Email: ${customerEmail} | Status: ${status}`
      );
      break;
    }

    case "subscription.revoked":
    case "subscription.cancelled": {
      const subscriptionId = data.id;
      const customerEmail = (data.customer as Record<string, unknown>)?.email;

      console.log(
        `[webhook/polar] Abunəlik ləğv edildi: ${subscriptionId} | Email: ${customerEmail}`
      );
      break;
    }

    default:
      console.log("[webhook/polar] İdarə edilməyən event tipi:", type);
  }

  return NextResponse.json({ received: true });
}
