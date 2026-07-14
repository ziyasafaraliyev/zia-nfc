/** Shared helpers — eyni pattern zia-nfc `lib/` qovluğu ilə */

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const site = {
  name: "Zia-Pay",
  email: "office@zia-pay.az",
  whatsapp: "https://wa.me/994702990252",
  description:
    "NFC və QR ilə menyu, səbət və Apple Pay / Google Pay ödəniş platforması.",
} as const;
