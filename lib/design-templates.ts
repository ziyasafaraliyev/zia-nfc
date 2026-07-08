import type { Profile } from "@/lib/types";

export const DESIGN_TEMPLATE_IDS = [
  "business",
  "realtor",
  "doctor",
  "restaurant",
  "lawyer",
  "photographer",
  "influencer",
] as const;

export type DesignTemplateId = (typeof DESIGN_TEMPLATE_IDS)[number];

export type ProfileSectionKey =
  | "identity"
  | "actions"
  | "socials"
  | "save"
  | "reservation"
  | "location"
  | "google_review"
  | "portfolio"
  | "cv"
  | "qr"
  | "footer";

export type DesignTemplate = {
  id: DesignTemplateId;
  label: string;
  labelAz: string;
  description: string;
  theme: NonNullable<Profile["theme"]>;
  cover_style: NonNullable<Profile["cover_style"]>;
  cover_position: NonNullable<Profile["cover_position"]>;
  accentColor: string;
  previewGradient: string;
  sectionOrder: ProfileSectionKey[];
  heroVariant: "classic" | "minimal" | "bold" | "showcase";
  socialGridCols: 2 | 3;
  showTemplateBadge: boolean;
};

export const DESIGN_TEMPLATES: Record<DesignTemplateId, DesignTemplate> = {
  business: {
    id: "business",
    label: "Business",
    labelAz: "Biznes",
    description: "Korporativ, etibarlı və peşəkar görünüş",
    theme: "sapphire",
    cover_style: "auto",
    cover_position: "center",
    accentColor: "#29AEEE",
    previewGradient: "linear-gradient(135deg, #071821 0%, #0c2d40 50%, #155978 100%)",
    sectionOrder: [
      "identity",
      "actions",
      "socials",
      "save",
      "location",
      "google_review",
      "portfolio",
      "cv",
      "reservation",
      "qr",
      "footer",
    ],
    heroVariant: "classic",
    socialGridCols: 3,
    showTemplateBadge: false,
  },
  realtor: {
    id: "realtor",
    label: "Realtor",
    labelAz: "Rieltor",
    description: "Lokasiya və əlaqə ön planda",
    theme: "light",
    cover_style: "banner",
    cover_position: "center",
    accentColor: "#0f766e",
    previewGradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #ffffff 100%)",
    sectionOrder: [
      "identity",
      "location",
      "google_review",
      "actions",
      "socials",
      "save",
      "portfolio",
      "cv",
      "reservation",
      "qr",
      "footer",
    ],
    heroVariant: "bold",
    socialGridCols: 3,
    showTemplateBadge: true,
  },
  doctor: {
    id: "doctor",
    label: "Doctor",
    labelAz: "Həkim",
    description: "Təmiz, etibarlı və sakit dizayn",
    theme: "emerald",
    cover_style: "auto",
    cover_position: "top",
    accentColor: "#10b981",
    previewGradient: "linear-gradient(135deg, #062c22 0%, #0d4334 50%, #116b53 100%)",
    sectionOrder: [
      "identity",
      "actions",
      "save",
      "cv",
      "location",
      "google_review",
      "socials",
      "portfolio",
      "reservation",
      "qr",
      "footer",
    ],
    heroVariant: "minimal",
    socialGridCols: 3,
    showTemplateBadge: true,
  },
  restaurant: {
    id: "restaurant",
    label: "Restaurant",
    labelAz: "Restoran",
    description: "İsti rənglər, rezervasiya və menyu fokusu",
    theme: "sunset",
    cover_style: "banner",
    cover_position: "center",
    accentColor: "#fb7185",
    previewGradient: "linear-gradient(135deg, #2f1118 0%, #5b2434 50%, #9f4058 100%)",
    sectionOrder: [
      "identity",
      "actions",
      "reservation",
      "location",
      "google_review",
      "socials",
      "save",
      "portfolio",
      "cv",
      "qr",
      "footer",
    ],
    heroVariant: "bold",
    socialGridCols: 3,
    showTemplateBadge: true,
  },
  lawyer: {
    id: "lawyer",
    label: "Lawyer",
    labelAz: "Vəkil",
    description: "Rəsmi, premium və ciddi stil",
    theme: "premium",
    cover_style: "square",
    cover_position: "top",
    accentColor: "#d4af37",
    previewGradient: "linear-gradient(135deg, #120f08 0%, #23180a 50%, #3a2a10 100%)",
    sectionOrder: [
      "identity",
      "save",
      "cv",
      "actions",
      "socials",
      "location",
      "google_review",
      "portfolio",
      "reservation",
      "qr",
      "footer",
    ],
    heroVariant: "classic",
    socialGridCols: 3,
    showTemplateBadge: true,
  },
  photographer: {
    id: "photographer",
    label: "Photographer",
    labelAz: "Fotoqraf",
    description: "Portfolio birinci, vizual vurğu",
    theme: "dark",
    cover_style: "square",
    cover_position: "center",
    accentColor: "#8b5cf6",
    previewGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
    sectionOrder: [
      "identity",
      "portfolio",
      "socials",
      "actions",
      "save",
      "location",
      "google_review",
      "cv",
      "reservation",
      "qr",
      "footer",
    ],
    heroVariant: "showcase",
    socialGridCols: 2,
    showTemplateBadge: true,
  },
  influencer: {
    id: "influencer",
    label: "Influencer",
    labelAz: "İnfluenser",
    description: "Sosial şəbəkələr və dinamik görünüş",
    theme: "violet",
    cover_style: "auto",
    cover_position: "center",
    accentColor: "#8b5cf6",
    previewGradient: "linear-gradient(135deg, #1e1038 0%, #35205f 50%, #5b21b6 100%)",
    sectionOrder: [
      "identity",
      "socials",
      "actions",
      "portfolio",
      "save",
      "location",
      "google_review",
      "cv",
      "reservation",
      "qr",
      "footer",
    ],
    heroVariant: "bold",
    socialGridCols: 2,
    showTemplateBadge: true,
  },
};

export const DESIGN_TEMPLATE_LIST = DESIGN_TEMPLATE_IDS.map(
  (id) => DESIGN_TEMPLATES[id],
);

export function getDesignTemplate(id?: string | null): DesignTemplate {
  if (id && id in DESIGN_TEMPLATES) {
    return DESIGN_TEMPLATES[id as DesignTemplateId];
  }
  return DESIGN_TEMPLATES.business;
}

export function isDesignTemplateId(value: string): value is DesignTemplateId {
  return (DESIGN_TEMPLATE_IDS as readonly string[]).includes(value);
}