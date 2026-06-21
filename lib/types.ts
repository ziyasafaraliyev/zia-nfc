export type Profile = {
  id?: string;
  slug: string;
  enabled: boolean;
  reservation_enabled?: boolean;
  name: string;
  profession?: string | null;
  bio?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  website?: string | null;
  facebook?: string | null;
  x?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  location?: string | null;
  location_url?: string | null;
  avatar_url?: string | null;
  background_url?: string | null;
  cover_style?: "auto" | "square" | "banner" | null;
  cover_position?: "top" | "center" | "bottom" | null;
  gallery: string[];
  cv_url?: string | null;
  theme?:
    | "light"
    | "dark"
    | "premium"
    | "emerald"
    | "ruby"
    | "violet"
    | "sapphire"
    | "sunset"
    | "copper"
    | null;
  client_email?: string | null;
  client_password?: string | null;
};
