import QRCode from "qrcode";

const QR_SIZE = 384;
const QR_BRAND_COLOR = "#1F99FF";

export async function buildQrPng(profileUrl: string): Promise<Buffer> {
  return QRCode.toBuffer(profileUrl, {
    type: "png",
    margin: 2,
    width: QR_SIZE,
    errorCorrectionLevel: "M",
    color: {
      dark: QR_BRAND_COLOR,
      light: "#ffffff",
    },
  });
}

export async function buildQrSvg(profileUrl: string): Promise<string> {
  return QRCode.toString(profileUrl, {
    type: "svg",
    margin: 2,
    width: QR_SIZE,
    errorCorrectionLevel: "M",
    color: {
      dark: QR_BRAND_COLOR,
      light: "#ffffff",
    },
  });
}
