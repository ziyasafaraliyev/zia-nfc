export type PortfolioSection = {
  id: string;
  name: string;
  images: string[];
};

/** Catalog link item — title opens URL on public profile */
export type CatalogItem = {
  id: string;
  name: string;
  url: string;
};

export type Profile = {
  id?: string;
  slug: string;
  enabled: boolean;
  reservation_enabled?: boolean;
  /** When false, portfolio button is hidden on public profile (super admin) */
  portfolio_enabled?: boolean;
  /** When false, Google Wallet button is hidden on public profile (super admin) */
  wallet_enabled?: boolean;
  /** When true, referral link button is shown on public profile (super admin) */
  referral_enabled?: boolean;
  /** Optional custom referral URL; falls back to profile public URL when empty */
  referral_url?: string | null;
  views_count?: number;
  saves_count?: number;
  /** When false, view/save stats & share panel is hidden on public profile (super admin) */
  stats_enabled?: boolean;
  /** When true, language switcher is shown on public profile (super admin) */
  lang_switcher_enabled?: boolean;
  /** Languages enabled for this profile (super admin) */
  enabled_languages?: ("az" | "en" | "de" | "fr" | "ru")[] | null;
  /** Default language the profile opens in — set by super admin (az, en, de, fr, ru) */
  default_lang?: "az" | "en" | "de" | "fr" | "ru" | null;
  name: string;
  profession?: string | null;
  bio?: string | null;
  phone?: string | null;
  phone2?: string | null;
  whatsapp?: string | null;
  whatsapp2?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  telegram?: string | null;
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
  google_review_url?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  background_url?: string | null;
  cover_style?: "auto" | "square" | "banner" | "fit" | null;
  cover_position?: "top" | "center" | "bottom" | null;
  avatar_shape?: "square" | "circle" | null;
  gallery: string[] | PortfolioSection[];
  /** Separate link catalog (title + URL) */
  catalog?: CatalogItem[] | null;
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
    | "ios"
    | "iossoft"
    | "iosdark"
    | "editorial"
    | "spotlight"
    | "compact"
    | null;
  client_email?: string | null;
  client_password?: string | null;
};

export type RestaurantMenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  available?: boolean;
};

export type RestaurantMenuCategory = {
  id: string;
  name: string;
  items: RestaurantMenuItem[];
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
  /** Built-in digital menu: categories → items */
  menu?: RestaurantMenuCategory[];
  location_name?: string | null;
  location_url?: string | null;
  google_review_url?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  cover_style?: "auto" | "square" | "banner" | "fit" | null;
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
    | "ios"
    | "iossoft"
    | "iosdark"
    | "editorial"
    | "spotlight"
    | "compact"
    | null;
  /** Ortalama reytinq — rəylərdən avtomatik hesablanır */
  rating?: number;
};

export type RestaurantReview = {
  id?: string;
  restaurant_id: string;
  rating: number;
  comment?: string | null;
  created_at?: Date;
};

export type CarProfile = {
  id?: string;
  slug: string;
  enabled: boolean;
  car_name: string;
  plate: string;
  driver_name: string;
  phone?: string | null;
  phone2?: string | null;
  whatsapp?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  telegram?: string | null;
  waze?: string | null;
  created_at?: string | Date;
};
