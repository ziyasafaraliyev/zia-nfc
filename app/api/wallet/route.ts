import { NextRequest, NextResponse } from "next/server";
import { SignJWT, importPKCS8 } from "jose";

const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID!;
const SA_EMAIL = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL!;
const PRIVATE_KEY_PEM = (process.env.GOOGLE_WALLET_PRIVATE_KEY ?? "").replace(
  /\\n/g,
  "\n",
);

/** Get OAuth2 access token from service account */
async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const privateKey = await importPKCS8(PRIVATE_KEY_PEM, "RS256");

  const jwt = await new SignJWT({
    iss: SA_EMAIL,
    sub: SA_EMAIL,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: "https://www.googleapis.com/auth/wallet_object.issuer",
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .sign(privateKey);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`OAuth token error: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

/** Ensure the Generic Class exists */
async function ensureClass(token: string, classId: string) {
  // Try to get existing class
  const getRes = await fetch(
    `https://walletobjects.googleapis.com/walletobjects/v1/genericClass/${classId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (getRes.status === 200) return; // already exists

  if (getRes.status === 404) {
    // Create class
    const createRes = await fetch(
      "https://walletobjects.googleapis.com/walletobjects/v1/genericClass",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: classId,
          issuerName: "Zia NFC",
          reviewStatus: "UNDER_REVIEW",
          multipleDevicesAndHoldersAllowedStatus: "MULTIPLE_HOLDERS",
        }),
      },
    );
    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Class create failed (${createRes.status}): ${err}`);
    }
    return;
  }

  const err = await getRes.text();
  throw new Error(`Class get failed (${getRes.status}): ${err}`);
}

/**
 * POST /api/wallet
 * Body: { slug, name, profession, phone, email, profileUrl, avatarUrl }
 * Returns: { walletUrl }
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

    // 1. Get access token
    const token = await getAccessToken();

    const objectSuffix = slug.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const classId = `${ISSUER_ID}.zianfc_contact`;
    const objectId = `${ISSUER_ID}.zianfc_${objectSuffix}`;

    // 2. Ensure class exists
    await ensureClass(token, classId);

    // 3. Build generic object
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

    if (avatarUrl && avatarUrl.startsWith("http")) {
      genericObject.heroImage = {
        sourceUri: { uri: avatarUrl },
      };
    }

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

    // 4. Create or update object via REST API
    const getObjRes = await fetch(
      `https://walletobjects.googleapis.com/walletobjects/v1/genericObject/${objectId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (getObjRes.status === 200) {
      // Update existing
      await fetch(
        `https://walletobjects.googleapis.com/walletobjects/v1/genericObject/${objectId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(genericObject),
        },
      );
    } else {
      // Create new
      const createObjRes = await fetch(
        "https://walletobjects.googleapis.com/walletobjects/v1/genericObject",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(genericObject),
        },
      );
      if (!createObjRes.ok) {
        const err = await createObjRes.text();
        throw new Error(`Object create failed (${createObjRes.status}): ${err}`);
      }
    }

    // 5. Generate JWT save link
    const privateKey = await importPKCS8(PRIVATE_KEY_PEM, "RS256");
    const saveJwt = await new SignJWT({
      iss: SA_EMAIL,
      aud: "google",
      origins: ["https://zianfc.vercel.app"],
      typ: "savetowallet",
      payload: {
        genericObjects: [{ id: objectId }],
      },
    })
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuedAt()
      .sign(privateKey);

    const walletUrl = `https://pay.google.com/gp/v/save/${saveJwt}`;

    return NextResponse.json({ walletUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Google Wallet error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
