"use client";

import { useEffect } from "react";

const BASE_URL = "https://zianfc.vercel.app";

/**
 * WebMCP Provider — registers browser-native AI agent tools via
 * navigator.modelContext API (Chrome experimental).
 *
 * These tools allow browser-based AI agents to interact with
 * Zia NFC platform capabilities without screen-scraping.
 */
export function WebMCPProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const modelContext = (window.navigator as unknown as Record<string, unknown>)
      .modelContext as
      | {
          registerTool?: (tool: object) => void;
          provideContext?: (tools: object[]) => void;
        }
      | undefined;

    if (!modelContext) return;

    const tools = [
      {
        name: "lookup_nfc_profile",
        description:
          "Look up a public NFC digital business card profile by slug. Returns the person's name, profession, bio, contact info (phone, WhatsApp, email), social media links, location, and portfolio gallery.",
        inputSchema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              description:
                "The unique profile slug (e.g. 'ziya', 'john-doe'). Visible in profile URLs like /u/{slug}",
            },
          },
          required: ["slug"],
        },
        execute: async (args: { slug: string }) => {
          const res = await fetch(`${BASE_URL}/u/${args.slug}`, {
            headers: { Accept: "text/html" },
          });
          return {
            content: [
              {
                type: "text",
                text: res.ok
                  ? `Profile found at: ${BASE_URL}/u/${args.slug}`
                  : `Profile not found for slug: ${args.slug}`,
              },
            ],
          };
        },
      },
      {
        name: "chat_with_zia_nfc",
        description:
          "Ask questions about Zia NFC products, NFC business cards, pricing, ordering, and services using AI-powered chat.",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The user question or message about Zia NFC",
            },
            profileSlug: {
              type: "string",
              description: "Optional: provide a profile slug for context",
            },
          },
          required: ["message"],
        },
        execute: async (args: { message: string; profileSlug?: string }) => {
          const res = await fetch(`${BASE_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: args.message,
              profileSlug: args.profileSlug,
            }),
          });
          const data = await res.json().catch(() => ({ reply: "Error" }));
          return {
            content: [
              {
                type: "text",
                text: data.reply ?? data.message ?? JSON.stringify(data),
              },
            ],
          };
        },
      },
      {
        name: "get_site_info",
        description:
          "Get general information about the Zia NFC platform, including available products, services, and contact details.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
        execute: async () => {
          return {
            content: [
              {
                type: "text",
                text: [
                  "# Zia NFC Platform",
                  `URL: ${BASE_URL}`,
                  "",
                  "## Products",
                  "- NFC Business Cards (vizit kart)",
                  "- NFC Stickers",
                  "- NFC Table Stands",
                  "- Digital Profile Pages",
                  "- Restaurant Digital Menus",
                  "",
                  "## Key URLs",
                  `- Profiles: ${BASE_URL}/u/{slug}`,
                  `- API Catalog: ${BASE_URL}/.well-known/api-catalog`,
                  `- MCP Card: ${BASE_URL}/.well-known/mcp/server-card.json`,
                  `- Sitemap: ${BASE_URL}/sitemap.xml`,
                ].join("\n"),
              },
            ],
          };
        },
      },
    ];

    // Use registerTool if available (preferred), fallback to provideContext
    if (typeof modelContext.registerTool === "function") {
      tools.forEach((tool) => modelContext.registerTool!(tool));
    } else if (typeof modelContext.provideContext === "function") {
      modelContext.provideContext(tools);
    }
  }, []);

  return null;
}
