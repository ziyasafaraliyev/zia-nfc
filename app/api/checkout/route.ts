import { NextResponse } from "next/server";

/**
 * POST /api/checkout
 * Body: { plan: "standard" | "premium" }
 *
 * Polar.sh API ilə checkout yaradır və ödəniş URL-ni qaytarır.
 * Access Token server-side saxlanılır — client-ə heç vaxt göndərilmir.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan } = body as { plan: "standard" | "premium" };

    if (plan !== "standard" && plan !== "premium") {
      return NextResponse.json({ error: "Yanlış plan növü." }, { status: 400 });
    }

    const accessToken = process.env.POLAR_ACCESS_TOKEN;
    const productId =
      plan === "standard"
        ? process.env.POLAR_STANDARD_PRODUCT_ID
        : process.env.POLAR_PREMIUM_PRODUCT_ID;

    if (!accessToken) {
      console.error("[checkout] POLAR_ACCESS_TOKEN təyin edilməyib.");
      return NextResponse.json(
        { error: "Ödəniş sistemi konfiqurasiya edilməyib (Access Token çatışmır)." },
        { status: 500 }
      );
    }

    if (!productId) {
      console.error(`[checkout] POLAR_${plan.toUpperCase()}_PRODUCT_ID təyin edilməyib.`);
      return NextResponse.json(
        { error: `Ödəniş sistemi konfiqurasiya edilməyib (${plan} Məhsul ID çatışmır).` },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Polar.sh checkouts endpoint: POST https://api.polar.sh/v1/checkouts/
    const polarRes = await fetch("https://api.polar.sh/v1/checkouts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: `${siteUrl}?checkout=success`,
        metadata: {
          plan,
        },
      }),
    });

    if (!polarRes.ok) {
      const errText = await polarRes.text();
      console.error("[checkout] Polar.sh API xətası:", polarRes.status, errText);

      let parsedErr: { detail?: string; message?: string } | null = null;
      try {
        parsedErr = JSON.parse(errText);
      } catch {
        // null
      }

      const detailMsg =
        parsedErr?.detail || parsedErr?.message || `Polar API xətası (${polarRes.status})`;

      return NextResponse.json(
        { error: `Ödəniş sessiyası yaradıla bilmədi: ${detailMsg}` },
        { status: 502 }
      );
    }

    const polarData = await polarRes.json();
    const checkoutUrl: string = polarData?.url;

    if (!checkoutUrl) {
      console.error("[checkout] Checkout URL tapılmadı:", polarData);
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
