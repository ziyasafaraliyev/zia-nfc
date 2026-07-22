import { NextResponse } from "next/server";

/**
 * Deprecated Lemon Squeezy webhook route.
 * System migrated to Polar.sh (/api/webhooks/polar).
 */
export async function POST() {
  return NextResponse.json(
    { message: "Lemon Squeezy webhook endpoint is deprecated. Use /api/webhooks/polar." },
    { status: 410 }
  );
}
