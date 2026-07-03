export type PortfolioSection = {
  id: string;
  name: string;
  images: string[];
};

export type Profile = {
  id?: string;
  slug: string;
  enabled: boolean;
  reservation_enabled?: boolean;
  name: string;
  profession?: string | null;
  bio?: string | null;
  phone?: string | null;
  phone2?: string | null;
  whatsapp?: string | null;
  whatsapp2?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  threads?: string | null;
  waze?: string | null;
  website?: string | null;
  facebook?: string | null;
  x?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  behance?: string | null;
  location?: string | null;
  location_url?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  background_url?: string | null;
  cover_style?: "auto" | "square" | "banner" | null;
  cover_position?: "top" | "center" | "bottom" | null;
  gallery: string[] | PortfolioSection[];
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

export type Restaurant = {
  id?: string;
  slug: string;
  enabled: boolean;
  name: string;
  description?: string | null;
  phone?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  menu_url?: string | null;
  location_name?: string | null;
  location_url?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  cover_style?: "auto" | "square" | "banner" | null;
  cover_position?: "top" | "center" | "bottom" | null;
  gallery: string[];
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
  revenue?: number;
  orders_count?: number;
  rating?: number;
};

export type RestaurantReview = {
  id?: string;
  restaurant_id: string;
  rating: number;
  comment?: string | null;
  created_at?: Date;
};
