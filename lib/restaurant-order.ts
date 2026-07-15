import { menuForPublic } from "@/lib/menu";
import { profileAvatarSrc, storageImageUrl } from "@/lib/media";
import type { Restaurant, RestaurantMenuCategory, RestaurantMenuItem } from "@/lib/types";
import {
  getRestaurantCartPath,
  getRestaurantDonePath,
  getRestaurantMenuPath,
  getRestaurantPayPath,
} from "@/lib/urls";

export type OrderStepId = "menyu" | "sebet" | "ode" | "hazir";

/** Restoran servis haqqı — yemək məbləğinin 12%-i */
export const SERVICE_FEE_RATE = 0.12;

export type OrderFeeBreakdown = {
  /** Seçilmiş yemək/içki cəmi */
  subtotal: number;
  /** 12% servis haqqı */
  serviceFee: number;
  /** Ödəniləcək yekun */
  grandTotal: number;
};

function roundMoney(n: number): number {
  return Math.round(Math.max(0, n) * 100) / 100;
}

/** Səbətdən ödənişə keçəndə cəkdəki haqlar */
export function calcOrderFees(subtotal: number): OrderFeeBreakdown {
  const food = roundMoney(subtotal);
  const serviceFee = roundMoney(food * SERVICE_FEE_RATE);
  const grandTotal = roundMoney(food + serviceFee);
  return { subtotal: food, serviceFee, grandTotal };
}

export type OrderCatalogItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  categoryName: string;
};

export function getOrderSteps(slug: string) {
  return [
    {
      id: "menyu" as const,
      label: "Menyu",
      href: getRestaurantMenuPath(slug),
      title: "Rəqəmsal menyu",
    },
    {
      id: "sebet" as const,
      label: "Səbət",
      href: getRestaurantCartPath(slug),
      title: "Sifarişi təsdiqlə",
    },
    {
      id: "ode" as const,
      label: "Ödə",
      href: getRestaurantPayPath(slug),
      title: "Ödəniş",
    },
    {
      id: "hazir" as const,
      label: "Hazır",
      href: getRestaurantDonePath(slug),
      title: "Ödəniş uğurlu",
    },
  ];
}

export function getOrderStepIndex(id: OrderStepId) {
  const order: OrderStepId[] = ["menyu", "sebet", "ode", "hazir"];
  return order.indexOf(id);
}

export function flattenMenuCatalog(
  menu: RestaurantMenuCategory[] | undefined | null,
): OrderCatalogItem[] {
  const categories = menuForPublic(menu);
  const items: OrderCatalogItem[] = [];
  for (const cat of categories) {
    for (const item of cat.items) {
      items.push({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        categoryName: cat.name,
      });
    }
  }
  return items;
}

export function publicCategories(
  restaurant: Restaurant,
): RestaurantMenuCategory[] {
  return menuForPublic(restaurant.menu);
}

export function cartStorageKey(slug: string) {
  return `zia-restaurant-cart:v1:${slug}`;
}

export type StoredCart = {
  qty: Record<string, number>;
  payQty: Record<string, number>;
  payMode: "full" | "split";
};

export function readStoredCart(slug: string): StoredCart | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(cartStorageKey(slug));
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredCart;
    if (!data || typeof data !== "object") return null;
    return {
      qty: data.qty && typeof data.qty === "object" ? data.qty : {},
      payQty: data.payQty && typeof data.payQty === "object" ? data.payQty : {},
      payMode: data.payMode === "split" ? "split" : "full",
    };
  } catch {
    return null;
  }
}

export function writeStoredCart(slug: string, cart: StoredCart) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(cartStorageKey(slug), JSON.stringify(cart));
  } catch {
    // ignore quota errors
  }
}

export function clearStoredCart(slug: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(cartStorageKey(slug));
  } catch {
    // ignore
  }
}

/** Serialize restaurant fields needed client-side for order flow */
export type OrderRestaurantPayload = {
  slug: string;
  name: string;
  avatar_url?: string | null;
  theme?: Restaurant["theme"];
  menu: RestaurantMenuCategory[];
};

export function toOrderRestaurantPayload(
  restaurant: Restaurant,
): OrderRestaurantPayload {
  const menu = publicCategories(restaurant).map((cat) => ({
    ...cat,
    items: cat.items.map((item) => ({
      ...item,
      // CDN thumbs for list — full URL still available if transform fails
      image_url:
        storageImageUrl(item.image_url, {
          width: 112,
          height: 112,
          quality: 70,
          resize: "cover",
        }) ?? item.image_url,
    })),
  }));

  return {
    slug: restaurant.slug,
    name: restaurant.name,
    avatar_url: profileAvatarSrc(restaurant.avatar_url) ?? restaurant.avatar_url,
    theme: restaurant.theme,
    menu,
  };
}

export type { RestaurantMenuItem };
