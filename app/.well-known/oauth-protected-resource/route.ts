import { NextResponse } from "next/server";

const BASE_URL = "https://zianfc.vercel.app";

/**
 * RFC 9728 — OAuth Protected Resource Metadata
 * Tells agents which authorization servers can issue tokens for this resource,
 * and which scopes are supported.
 *
 * Since most endpoints are public, we declare no authorization_servers
 * and indicate the resource is publicly accessible.
 */
export async function GET() {
  const metadata = {
    resource: BASE_URL,
    resource_name: "Zia NFC Platform",
    resource_documentation: `${BASE_URL}/auth.md`,
    authorization_servers: [],
    scopes_supported: ["read:profiles", "read:menus"],
    bearer_methods_supported: ["header"],
    resource_signing_alg_values_supported: [],
    // Public resource — no auth required for most endpoints
    introspection_endpoint: null,
    // Agent discovery links
    agent_auth: {
      register_uri: `${BASE_URL}/api/agents/register`,
      identity_types: ["anonymous", "oidc_token"],
      credential_types: ["none", "bearer"],
      claim_uri: null,
      revocation_uri: null,
    },
  };

  return NextResponse.json(metadata, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    },
  });
}
