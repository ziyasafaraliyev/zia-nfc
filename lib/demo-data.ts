export const demoSteps = [
  {
    id: "skan",
    label: "Skan",
    href: "/pay/demo/skan",
    title: "NFC toxun və ya QR skan et",
    text: "Masadakı NFC karta telefonu yaxınlaşdırır və ya QR kodu kamerayla oxuyur.",
  },
  {
    id: "menyu",
    label: "Menyu",
    href: "/pay/demo/menyu",
    title: "Rəqəmsal menyu",
    text: "Restoranın menyusu brauzerdə açılır. İstədiyini səbətə əlavə et.",
  },
  {
    id: "sebet",
    label: "Səbət",
    href: "/pay/demo/sebet",
    title: "Səbəti təsdiqlə",
    text: "Siyahını yoxla, miqdarı düzəlt və sifarişi təsdiqlə.",
  },
  {
    id: "ode",
    label: "Ödə",
    href: "/pay/demo/ode",
    title: "Ödəniş",
    text: "Tam ödə və ya yalnız yediklərini seç. Apple Pay / Google Pay.",
  },
  {
    id: "hazir",
    label: "Hazır",
    href: "/pay/demo/hazir",
    title: "Ödəniş uğurlu",
    text: "Qəbz hazırdır. Qalan məhsullar digər qonaqlar üçün açıqdır.",
  },
] as const;

export type DemoStepId = (typeof demoSteps)[number]["id"];

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  desc: string;
};

export const restaurant = {
  name: "Qəbələ Xanlar",
  table: "Masa 12",
  tagline: "Azərbaycan mətbəxi · Qəbələ",
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Lülə kabab",
    price: 16,
    desc: "Quzu əti, sumaq, lavaş",
  },
  {
    id: 2,
    name: "Şah plov",
    price: 14,
    desc: "Qoyun əti, quru meyvə, zəfəran",
  },
  {
    id: 3,
    name: "Yarpaq dolması",
    price: 12,
    desc: "Üzüm yarpağı, quzu, düyü",
  },
  {
    id: 4,
    name: "Qutab",
    price: 6,
    desc: "Yaşıl / ətli / balqabaq",
  },
];

export function formatAz(n: number) {
  return n.toFixed(2).replace(".", ",") + " ₼";
}

export function getStepIndex(id: DemoStepId) {
  return demoSteps.findIndex((s) => s.id === id);
}

export function getNextHref(id: DemoStepId) {
  const i = getStepIndex(id);
  if (i < 0 || i >= demoSteps.length - 1) return null;
  return demoSteps[i + 1].href;
}

export function getPrevHref(id: DemoStepId) {
  const i = getStepIndex(id);
  if (i <= 0) return null;
  return demoSteps[i - 1].href;
}
