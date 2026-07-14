"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  calcOrderFees,
  clearStoredCart,
  flattenMenuCatalog,
  readStoredCart,
  writeStoredCart,
  type OrderCatalogItem,
  type OrderFeeBreakdown,
  type OrderRestaurantPayload,
} from "@/lib/restaurant-order";
import { formatMenuPrice } from "@/lib/menu";

type CartMap = Record<string, number>;
type PayQtyMap = Record<string, number>;

export type CartLine = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  image_url?: string | null;
};

type PaidLine = CartLine & {
  paidQuantity: number;
  paidTotal: number;
};

type RestaurantCartContextValue = {
  restaurant: OrderRestaurantPayload;
  catalog: OrderCatalogItem[];
  qty: CartMap;
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, n: number) => void;
  payQty: PayQtyMap;
  setPayQty: (id: string, n: number) => void;
  adjustPayQty: (id: string, delta: number) => void;
  togglePayItem: (id: string) => void;
  payMode: "full" | "split";
  setPayMode: (m: "full" | "split") => void;
  cartLines: CartLine[];
  cartTotal: number;
  cartCount: number;
  splitTotal: number;
  /** Ödəniləcək yemək cəmi (full və ya split) — haqlar daxil deyil */
  payAmount: number;
  /** 12% servis haqqı və yekun */
  fees: OrderFeeBreakdown;
  /** Ödəniş düyməsi üçün yekun (yemək + haqlar) */
  payGrandTotal: number;
  paidLines: PaidLine[];
  resetCart: () => void;
  formatPrice: (n: number) => string;
  hydrated: boolean;
};

const RestaurantCartContext = createContext<RestaurantCartContextValue | null>(
  null,
);

type Props = {
  restaurant: OrderRestaurantPayload;
  children: ReactNode;
};

export function RestaurantCartProvider({ restaurant, children }: Props) {
  const catalog = useMemo(
    () => flattenMenuCatalog(restaurant.menu),
    [restaurant.menu],
  );
  const catalogMap = useMemo(() => {
    const map = new Map<string, OrderCatalogItem>();
    for (const item of catalog) map.set(item.id, item);
    return map;
  }, [catalog]);

  const [qty, setQtyMap] = useState<CartMap>({});
  const [payQty, setPayQtyMap] = useState<PayQtyMap>({});
  const [payMode, setPayMode] = useState<"full" | "split">("full");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage once
  useEffect(() => {
    const stored = readStoredCart(restaurant.slug);
    if (stored) {
      setQtyMap(stored.qty);
      setPayQtyMap(stored.payQty);
      setPayMode(stored.payMode);
    }
    setHydrated(true);
  }, [restaurant.slug]);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    writeStoredCart(restaurant.slug, { qty, payQty, payMode });
  }, [hydrated, restaurant.slug, qty, payQty, payMode]);

  const add = useCallback((id: string) => {
    if (!catalogMap.has(id)) return;
    setQtyMap((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
    setPayQtyMap((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  }, [catalogMap]);

  const remove = useCallback((id: string) => {
    setQtyMap((q) => {
      const next = { ...q };
      const cur = next[id] || 0;
      if (cur <= 1) delete next[id];
      else next[id] = cur - 1;
      return next;
    });
  }, []);

  const setQty = useCallback((id: string, n: number) => {
    setQtyMap((q) => {
      const next = { ...q };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }, []);

  const togglePayItem = useCallback(
    (id: string) => {
      const max = qty[id] || 0;
      if (max <= 0) return;
      setPayQtyMap((p) => {
        const cur = p[id] || 0;
        return { ...p, [id]: cur > 0 ? 0 : max };
      });
    },
    [qty],
  );

  const resetCart = useCallback(() => {
    setQtyMap({});
    setPayQtyMap({});
    setPayMode("full");
    clearStoredCart(restaurant.slug);
  }, [restaurant.slug]);

  const cartLines = useMemo((): CartLine[] => {
    const lines: CartLine[] = [];
    for (const [id, quantity] of Object.entries(qty)) {
      if (quantity <= 0) continue;
      const item = catalogMap.get(id);
      if (!item) continue;
      lines.push({
        id,
        name: item.name,
        price: item.price,
        quantity,
        lineTotal: item.price * quantity,
        image_url: item.image_url ?? null,
      });
    }
    return lines;
  }, [qty, catalogMap]);

  const cartTotal = cartLines.reduce((s, l) => s + l.lineTotal, 0);
  const cartCount = cartLines.reduce((s, l) => s + l.quantity, 0);

  useEffect(() => {
    setPayQtyMap((prev) => {
      const next: PayQtyMap = {};
      for (const line of cartLines) {
        if (prev[line.id] === undefined) {
          next[line.id] = line.quantity;
        } else {
          next[line.id] = Math.min(Math.max(0, prev[line.id]), line.quantity);
        }
      }
      const same =
        Object.keys(prev).length === Object.keys(next).length &&
        Object.keys(next).every((k) => prev[k] === next[k]);
      return same ? prev : next;
    });
  }, [cartLines]);

  const setPayQtyClamped = useCallback(
    (id: string, n: number) => {
      const max = qty[id] || 0;
      setPayQtyMap((p) => ({ ...p, [id]: Math.max(0, Math.min(n, max)) }));
    },
    [qty],
  );

  const adjustPayQtyClamped = useCallback(
    (id: string, delta: number) => {
      const max = qty[id] || 0;
      setPayQtyMap((p) => {
        const cur = p[id] || 0;
        return { ...p, [id]: Math.max(0, Math.min(max, cur + delta)) };
      });
    },
    [qty],
  );

  const splitTotal = cartLines.reduce((s, l) => {
    const n = payQty[l.id] || 0;
    return s + l.price * n;
  }, 0);

  const payAmount = payMode === "full" ? cartTotal : splitTotal;
  const fees = useMemo(() => calcOrderFees(payAmount), [payAmount]);
  const payGrandTotal = fees.grandTotal;

  const paidLines: PaidLine[] = useMemo(() => {
    if (payMode === "full") {
      return cartLines.map((l) => ({
        ...l,
        paidQuantity: l.quantity,
        paidTotal: l.lineTotal,
      }));
    }
    return cartLines
      .map((l) => {
        const paidQuantity = payQty[l.id] || 0;
        return {
          ...l,
          paidQuantity,
          paidTotal: l.price * paidQuantity,
        };
      })
      .filter((l) => l.paidQuantity > 0);
  }, [payMode, cartLines, payQty]);

  const value: RestaurantCartContextValue = {
    restaurant,
    catalog,
    qty,
    add,
    remove,
    setQty,
    payQty,
    setPayQty: setPayQtyClamped,
    adjustPayQty: adjustPayQtyClamped,
    togglePayItem,
    payMode,
    setPayMode,
    cartLines,
    cartTotal,
    cartCount,
    splitTotal,
    payAmount,
    fees,
    payGrandTotal,
    paidLines,
    resetCart,
    formatPrice: formatMenuPrice,
    hydrated,
  };

  return (
    <RestaurantCartContext.Provider value={value}>
      {children}
    </RestaurantCartContext.Provider>
  );
}

export function useRestaurantCart() {
  const ctx = useContext(RestaurantCartContext);
  if (!ctx) {
    throw new Error(
      "useRestaurantCart must be used inside RestaurantCartProvider",
    );
  }
  return ctx;
}
