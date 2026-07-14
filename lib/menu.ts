import type { RestaurantMenuCategory, RestaurantMenuItem } from "@/lib/types";

export const MAX_MENU_CATEGORIES = 30;
export const MAX_MENU_ITEMS_PER_CATEGORY = 80;
export const MAX_MENU_NAME_LENGTH = 80;
export const MAX_MENU_DESC_LENGTH = 300;

export function formatMenuPrice(price: number): string {
  if (!Number.isFinite(price)) return "0,00 ₼";
  return (
    price.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") +
    " ₼"
  );
}

export function newMenuId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyMenuItem(): RestaurantMenuItem {
  return {
    id: newMenuId(),
    name: "",
    description: "",
    price: 0,
    available: true,
  };
}

export function emptyMenuCategory(name = "Yeni kateqoriya"): RestaurantMenuCategory {
  return {
    id: newMenuId(),
    name,
    items: [],
  };
}

function asString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function asPrice(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value * 100) / 100);
  }
  if (typeof value === "string") {
    const normalized = value.replace(",", ".").replace(/[^\d.-]/g, "");
    const n = parseFloat(normalized);
    if (Number.isFinite(n)) return Math.max(0, Math.round(n * 100) / 100);
  }
  return 0;
}

function asBool(value: unknown, fallback = true): boolean {
  if (typeof value === "boolean") return value;
  if (value === "false" || value === 0 || value === "0") return false;
  if (value === "true" || value === 1 || value === "1") return true;
  return fallback;
}

/** Normalize raw JSON / DB value into a safe menu structure. */
export function parseRestaurantMenu(raw: unknown): RestaurantMenuCategory[] {
  if (!raw) return [];

  let data: unknown = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(data)) return [];

  const categories: RestaurantMenuCategory[] = [];

  for (const cat of data.slice(0, MAX_MENU_CATEGORIES)) {
    if (!cat || typeof cat !== "object") continue;
    const c = cat as Record<string, unknown>;
    const name = asString(c.name, MAX_MENU_NAME_LENGTH);
    if (!name) continue;

    const rawItems = Array.isArray(c.items) ? c.items : [];
    const items: RestaurantMenuItem[] = [];

    for (const item of rawItems.slice(0, MAX_MENU_ITEMS_PER_CATEGORY)) {
      if (!item || typeof item !== "object") continue;
      const it = item as Record<string, unknown>;
      const itemName = asString(it.name, MAX_MENU_NAME_LENGTH);
      if (!itemName) continue;

      const imageUrl =
        typeof it.image_url === "string" && it.image_url.startsWith("http")
          ? it.image_url.slice(0, 500)
          : null;

      items.push({
        id: asString(it.id, 64) || newMenuId(),
        name: itemName,
        description: asString(it.description, MAX_MENU_DESC_LENGTH) || null,
        price: asPrice(it.price),
        image_url: imageUrl,
        available: asBool(it.available, true),
      });
    }

    categories.push({
      id: asString(c.id, 64) || newMenuId(),
      name,
      items,
    });
  }

  return categories;
}

export function countMenuItems(menu: RestaurantMenuCategory[]): number {
  return menu.reduce((sum, cat) => sum + cat.items.length, 0);
}

export function hasBuiltInMenu(menu: RestaurantMenuCategory[] | undefined | null): boolean {
  if (!menu?.length) return false;
  return menu.some((cat) => cat.items.some((item) => item.name.trim()));
}

/** Public view: only available items (default true). */
export function menuForPublic(
  menu: RestaurantMenuCategory[] | undefined | null,
): RestaurantMenuCategory[] {
  if (!menu?.length) return [];
  return menu
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.available !== false && item.name.trim()),
    }))
    .filter((cat) => cat.items.length > 0);
}
