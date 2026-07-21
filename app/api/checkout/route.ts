import { NextResponse } from "next/server";

/**
 * POST /api/checkout
 * Body: { plan: "standard" | "premium" }
 *
 * Lemon Squeezy API-da checkout yaradır və overlay URL qaytarır.
 * API key server-side saxlanılır — client-ə heç vaxt göndərilmir.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan } = body as { plan: "standard" | "premium" };

    if (plan !== "standard" && plan !== "premium") {
      return NextResponse.json({ error: "Yanlış plan növü." }, { status: 400 });
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId =
      plan === "standard"
        ? process.env.LEMONSQUEEZY_STANDARD_VARIANT_ID
        : process.env.LEMONSQUEEZY_PREMIUM_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      console.error("[checkout] Lemon Squeezy env dəyişənləri çatışmır.");
      return NextResponse.json(
        { error: "Ödəniş sistemi konfiqurasiya edilməyib." },
        { status: 500 }
      );
    }

    const planLabel = plan === "standard" ? "Standart" : "Premium";
    const planPrice = plan === "standard" ? "59 AZN" : "99 AZN";
    const monthlyPrice = plan === "standard" ? "2.90 AZN/ay" : "4.90 AZN/ay";

    // Lemon Squeezy checkouts endpoint
    const lsRes = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            // Checkout pəncərəsini overlay olaraq aç
            checkout_options: {
              embed: true,
              media: true,
              logo: true,
              desc: true,
              discount: false,
            },
            product_options: {
              name: `Zia NFC — ${planLabel} Paket`,
              description: `NFC vizit kart: ${planPrice} (bir dəfəlik) + ${monthlyPrice} aylıq abunəlik.`,
            },
            checkout_data: {
              custom: {
                plan,
              },
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: storeId },
            },
            variant: {
              data: { type: "variants", id: variantId },
            },
          },
        },
      }),
    });

    if (!lsRes.ok) {
      const errText = await lsRes.text();
      console.error("[checkout] Lemon Squeezy API xətası:", errText);
      return NextResponse.json(
        { error: "Ödəniş sessiyası yaradıla bilmədi." },
        { status: 502 }
      );
    }

    const lsData = await lsRes.json();
    const checkoutUrl: string = lsData?.data?.attributes?.url;

    if (!checkoutUrl) {
      console.error("[checkout] Checkout URL tapılmadı:", lsData);
      return NextResponse.json(
        { error: "Checkout URL alına bilmədi." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("[checkout] Gözlənilməz xəta:", err);
    return NextResponse.json(
      { error: "Server xətası baş verdi." },
      { status: 500 }
    );
  }
}
