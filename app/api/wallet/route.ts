import { NextRequest, NextResponse } from "next/server";
import { SignJWT, importPKCS8 } from "jose";

const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID ?? "";
const SA_EMAIL = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL ?? "";
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
    throw new Error(`OAuth error: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      slug,
      name,
      profession,
      phone,
      email,
      profileUrl,
      avatarUrl,
      backgroundUrl,
      bio,
      website,
      location,
      whatsapp,
      linkedin,
    } = body as {
      slug: string;
      name: string;
      profession?: string;
      phone?: string;
      email?: string;
      profileUrl: string;
      avatarUrl?: string;
      backgroundUrl?: string;
      bio?: string;
      website?: string;
      location?: string;
      whatsapp?: string;
      linkedin?: string;
    };

    if (!slug || !name) {
      return NextResponse.json({ error: "slug and name required" }, { status: 400 });
    }

    const token = await getAccessToken();

    const objectSuffix = slug.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const classId = `${ISSUER_ID}.zianfc_vcard_class_light_v4`;
    const objectId = `${ISSUER_ID}.zianfc_pass_${objectSuffix}`;

    // 1. Ensure Class Exists
    const classUrl = `https://walletobjects.googleapis.com/walletobjects/v1/genericClass/${classId}`;
    const getRes = await fetch(classUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (getRes.status === 404) {
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
            classTemplateInfo: {
              cardTemplateOverride: {
                cardRowTemplateInfos: [
                  {
                    oneItem: {
                      item: {
                        firstValue: {
                          fields: [{ fieldPath: "object.textModulesData['phone']" }],
                        },
                      },
                    },
                  },
                  {
                    oneItem: {
                      item: {
                        firstValue: {
                          fields: [{ fieldPath: "object.textModulesData['email']" }],
                        },
                      },
                    },
                  },
                  {
                    oneItem: {
                      item: {
                        firstValue: {
                          fields: [{ fieldPath: "object.textModulesData['bio']" }],
                        },
                      },
                    },
                  },
                ],
              },
            },
          }),
        },
      );
      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error("Class create failed:", errText);
      }
    }

    // 2. Build Generic Object
    const textModulesData: { id: string; header: string; body: string }[] = [];
    if (phone) {
      textModulesData.push({ id: "phone", header: "TELEFON", body: phone });
    }
    if (email) {
      textModulesData.push({ id: "email", header: "E-POÇT", body: email });
    }
    if (bio) {
      textModulesData.push({ id: "bio", header: "HAQQINDA", body: bio });
    }

    const vcardUrl = `https://zianfc.vercel.app/api/vcard/${slug}`;

    const urisData: { uri: string; description: string; id: string }[] = [
      {
        uri: profileUrl,
        description: "Zia NFC Profilini Aç",
        id: "profile_link",
      },
      {
        uri: vcardUrl,
        description: "Kontaktı Telefonuna Yüklə (.vcf)",
        id: "vcard_link",
      },
    ];

    if (whatsapp) {
      const waClean = whatsapp.replace(/[^0-9]/g, "");
      urisData.push({
        uri: `https://wa.me/${waClean}`,
        description: "WhatsApp ilə Yaz",
        id: "whatsapp_link",
      });
    }

    if (linkedin) {
      urisData.push({
        uri: linkedin,
        description: "LinkedIn Profilı",
        id: "linkedin_link",
      });
    }

    const genericObject: Record<string, unknown> = {
      id: objectId,
      classId,
      state: "ACTIVE",
      cardTitle: {
        defaultValue: { language: "az", value: "ZIA NFC | Rəqəmsal Vizit Kart" },
      },
      header: {
        defaultValue: { language: "az", value: name },
      },
      subheader: {
        defaultValue: {
          language: "az",
          value: profession || "Rəqəmsal Vizit Kart",
        },
      },
      logo: {
        sourceUri: {
          uri: "https://zianfc.vercel.app/logo.webp",
        },
        contentDescription: {
          defaultValue: { language: "az", value: "Zia NFC Logo" },
        },
      },
      hexBackgroundColor: "#FFFFFF",
      barcode: {
        type: "QR_CODE",
        value: profileUrl,
        alternateText: "Profili Skan Et",
      },
      linksModuleData: {
        uris: urisData,
      },
      textModulesData: textModulesData.length > 0 ? textModulesData : undefined,
    };

    // 3. Create / Put Object via REST API
    const getObjRes = await fetch(
      `https://walletobjects.googleapis.com/walletobjects/v1/genericObject/${objectId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (getObjRes.status === 200) {
      await fetch(
        `https://walletobjects.googleapis.com/walletobjects/v1/genericObject/${objectId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(genericObject),
        },
      );
    } else {
      const createObjRes = await fetch(
        "https://walletobjects.googleapis.com/walletobjects/v1/genericObject",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(genericObject),
        },
      );
      if (!createObjRes.ok) {
        const errText = await createObjRes.text();
        console.error("Object create failed:", errText);
      }
    }

    // 4. Generate JWT with full payload object for Wallet App
    const privateKey = await importPKCS8(PRIVATE_KEY_PEM, "RS256");
    const saveJwt = await new SignJWT({
      iss: SA_EMAIL,
      aud: "google",
      origins: ["https://zianfc.vercel.app"],
      typ: "savetowallet",
      payload: {
        genericObjects: [genericObject],
      },
    })
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuedAt()
      .sign(privateKey);

    return NextResponse.json({
      walletUrl: `https://pay.google.com/gp/v/save/${saveJwt}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
