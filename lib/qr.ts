import path from "path";
import QRCode from "qrcode";
import sharp from "sharp";

const QR_SIZE = 384;
const LOGO_RATIO = 0.26;
const LOGO_PAD_RATIO = 1.06;
const QR_BRAND_COLOR = "#1F99FF";

let cachedLogoOverlay: Buffer | null = null;

async function getLogoOverlay(): Promise<Buffer> {
  if (cachedLogoOverlay) return cachedLogoOverlay;

  const logoPath = path.join(process.cwd(), "public", "logoarxafonsuz.png");
  const logoSize = Math.round(QR_SIZE * LOGO_RATIO);
  const padSize = Math.round(logoSize * LOGO_PAD_RATIO);

  const resizedLogo = await sharp(logoPath)
    .resize(logoSize, logoSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();

  cachedLogoOverlay = await sharp({
    create: {
      width: padSize,
      height: padSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: resizedLogo, gravity: "center" }])
    .png()
    .toBuffer();

  return cachedLogoOverlay;
}

export async function buildQrPng(profileUrl: string): Promise<Buffer> {
  const qrBuffer = await QRCode.toBuffer(profileUrl, {
    type: "png",
    margin: 2,
    width: QR_SIZE,
    errorCorrectionLevel: "H",
    color: {
      dark: QR_BRAND_COLOR,
      light: "#ffffff",
    },
  });

  try {
    const logo = await getLogoOverlay();
    return await sharp(qrBuffer)
      .composite([{ input: logo, gravity: "center" }])
      .png()
      .toBuffer();
  } catch {
    return Buffer.from(qrBuffer);
  }
}

export async function buildQrSvg(profileUrl: string): Promise<string> {
  return QRCode.toString(profileUrl, {
    type: "svg",
    margin: 2,
    width: QR_SIZE,
    errorCorrectionLevel: "H",
    color: {
      dark: QR_BRAND_COLOR,
      light: "#ffffff",
    },
  });
}
