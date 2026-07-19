import { NextResponse } from "next/server";

const BASE_URL = "https://zianfc.vercel.app";

/**
 * MCP Server Card — SEP-1649 / SEP-2127
 * Advertises this site's MCP-compatible capabilities to AI agents.
 */
export async function GET() {
  const serverCard = {
    $schema:
      "https://modelcontextprotocol.io/schemas/server-card/v1.json",
    serverInfo: {
      name: "Zia NFC",
      version: "1.0.0",
      description:
        "Zia NFC platforması — NFC vizit kart profillərini idarə etmək və kontakt məlumatlarını paylaşmaq üçün rəqəmsal həll.",
      vendor: "Zia NFC",
      homepage: BASE_URL,
    },
    transport: {
      type: "http",
      endpoint: `${BASE_URL}/api/chat`,
    },
    capabilities: {
      tools: [
        {
          name: "lookup_profile",
          description:
            "Look up a public NFC profile by slug. Returns name, contact info, social links and bio.",
          inputSchema: {
            type: "object",
            properties: {
              slug: {
                type: "string",
                description: "The profile slug (e.g. 'ziya' or 'john-doe')",
              },
            },
            required: ["slug"],
          },
          endpoint: `${BASE_URL}/u/{slug}`,
          method: "GET",
        },
        {
          name: "chat",
          description:
            "Ask questions about Zia NFC's products, services and pricing using AI.",
          inputSchema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "The user question or message",
              },
              profileSlug: {
                type: "string",
                description: "Optional profile slug for context",
              },
            },
            required: ["message"],
          },
          endpoint: `${BASE_URL}/api/chat`,
          method: "POST",
        },
      ],
      resources: [
        {
          name: "NFC Profiles",
          description: "Public NFC digital business card profiles",
          uriTemplate: `${BASE_URL}/u/{slug}`,
        },
      ],
    },
    authentication: {
      required: false,
      publicEndpoints: ["/u/{slug}", "/api/chat"],
    },
  };

  return NextResponse.json(serverCard, {
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
