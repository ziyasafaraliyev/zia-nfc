export type Profile = {
  id?: string;
  slug: string;
  enabled: boolean;
  name: string;
  profession?: string | null;
  bio?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  website?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  background_url?: string | null;
  cover_style?: "auto" | "square" | "banner" | null;
  cover_position?: "top" | "center" | "bottom" | null;
  gallery: string[];
};
