import { NextResponse } from "next/server";
import { createHash } from "crypto";

const BASE_URL = "https://zianfc.vercel.app";

/**
 * Agent Skills Discovery Index — RFC v0.2.0
 * Publishes the skills/capabilities this site offers to AI agents.
 */
export async function GET() {
  const skills = [
    {
      name: "lookup-nfc-profile",
      type: "retrieval",
      description:
        "Retrieve a public NFC digital business card profile by slug. Returns contact information, social media links, bio, location, and portfolio details.",
      url: `${BASE_URL}/u/{slug}`,
      parameters: {
        slug: {
          type: "string",
          description: "The unique profile identifier",
          required: true,
        },
      },
      outputFormat: "text/html",
      tags: ["nfc", "profile", "contact", "vcard"],
    },
    {
      name: "chat-with-zia-nfc",
      type: "conversational",
      description:
        "Ask questions about Zia NFC products, NFC business cards, pricing, and services using AI-powered chat.",
      url: `${BASE_URL}/api/chat`,
      method: "POST",
      inputSchema: {
        type: "object",
        properties: {
          message: { type: "string" },
          profileSlug: { type: "string" },
        },
        required: ["message"],
      },
      outputFormat: "application/json",
      tags: ["chat", "ai", "nfc", "support"],
    },
    {
      name: "visit-nfc-card",
      type: "action",
      description:
        "Track or register a visit to an NFC profile card.",
      url: `${BASE_URL}/api/visit`,
      method: "POST",
      outputFormat: "application/json",
      tags: ["nfc", "analytics", "visit"],
    },
  ];

  // Generate SHA-256 digests for each skill for integrity verification
  const skillsWithDigest = skills.map((skill) => {
    const content = JSON.stringify(skill);
    const digest = createHash("sha256").update(content).digest("hex");
    return { ...skill, sha256: digest };
  });

  const index = {
    $schema:
      "https://agentskills.io/schemas/v0.2.0/index.json",
    version: "0.2.0",
    name: "Zia NFC Agent Skills",
    description:
      "AI-accessible skills for the Zia NFC digital business card platform",
    homepage: BASE_URL,
    skills: skillsWithDigest,
  };

  return NextResponse.json(index, {
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
