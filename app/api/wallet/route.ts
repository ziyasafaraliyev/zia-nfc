import { NextRequest, NextResponse } from "next/server";
import { SignJWT, importPKCS8 } from "jose";

const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID!;
const SA_EMAIL = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL!;
const PRIVATE_KEY_PEM = (process.env.GOOGLE_WALLET_PRIVATE_KEY ?? "").replace(
  /\\n/g,
  "\n",
);

/**
 * POST /api/wallet
 * Body: { slug, name, profession, phone, email, profileUrl, avatarUrl }
 * Returns: { walletUrl } — "Add to Google Wallet" save link
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name, profession, phone, email, profileUrl, avatarUrl } =
      body as {
        slug: string;
        name: string;
        profession?: string;
        phone?: string;
        email?: string;
        profileUrl: string;
        avatarUrl?: string;
      };

    if (!slug || !name) {
      return NextResponse.json(
        { error: "slug and name are required" },
        { status: 400 },
      );
    }

    const objectSuffix = slug.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const classId = `${ISSUER_ID}.zianfc_contact`;
    const objectId = `${ISSUER_ID}.zianfc_${objectSuffix}`;

    // Build Generic Pass object
    const genericObject: Record<string, unknown> = {
      id: objectId,
      classId,
      genericType: "GENERIC_TYPE_UNSPECIFIED",
      hexBackgroundColor: "#0A0A0A",
      logo: {
        sourceUri: {
          uri: "https://zianfc.vercel.app/logo.webp",
        },
      },
      cardTitle: {
        defaultValue: { language: "az", value: "Zia NFC" },
      },
      subheader: {
        defaultValue: {
          language: "az",
          value: profession || "Rəqəmsal Profil",
        },
      },
      header: {
        defaultValue: { language: "az", value: name },
      },
      linksModuleData: {
        uris: [
          {
            uri: profileUrl,
            description: "Profili aç",
            id: "profile_link",
          },
        ],
      },
    };

    // Optional hero image from avatar
    if (avatarUrl && avatarUrl.startsWith("http")) {
      genericObject.heroImage = {
        sourceUri: { uri: avatarUrl },
      };
    }

    // Text modules for phone + email
    const textModulesData: { id: string; header: string; body: string }[] = [];
    if (phone) {
      textModulesData.push({ id: "phone", header: "Telefon", body: phone });
    }
    if (email) {
      textModulesData.push({ id: "email", header: "E-poçt", body: email });
    }
    if (textModulesData.length > 0) {
      genericObject.textModulesData = textModulesData;
    }

    // Build JWT claims
    const claims = {
      iss: SA_EMAIL,
      aud: "google",
      origins: ["https://zianfc.vercel.app"],
      typ: "savetowallet",
      payload: {
        genericClasses: [
          {
            id: classId,
            issuerName: "Zia NFC",
            reviewStatus: "UNDER_REVIEW",
            multipleDevicesAndHoldersAllowedStatus:
              "MULTIPLE_HOLDERS",
          },
        ],
        genericObjects: [genericObject],
      },
    };

    const privateKey = await importPKCS8(PRIVATE_KEY_PEM, "RS256");
    const token = await new SignJWT(claims)
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuedAt()
      .sign(privateKey);

    const walletUrl = `https://pay.google.com/gp/v/save/${token}`;

    return NextResponse.json({ walletUrl });
  } catch (err) {
    console.error("Google Wallet error:", err);
    return NextResponse.json(
      { error: "Failed to generate wallet pass" },
      { status: 500 },
    );
  }
}
