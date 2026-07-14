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
import { menuItems } from "@/lib/demo-data";

type CartMap = Record<number, number>;
/** item id → seçilmiş ödəniş miqdarı (split), 0..cartQty */
type PayQtyMap = Record<number, number>;

type CartLine = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

type PaidLine = CartLine & {
  paidQuantity: number;
  paidTotal: number;
};

type DemoCartContextValue = {
  qty: CartMap;
  add: (id: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, n: number) => void;
  payQty: PayQtyMap;
  setPayQty: (id: number, n: number) => void;
  adjustPayQty: (id: number, delta: number) => void;
  selectedForPay: number[];
  togglePayItem: (id: number) => void;
  payMode: "full" | "split";
  setPayMode: (m: "full" | "split") => void;
  cartLines: CartLine[];
  cartTotal: number;
  cartCount: number;
  splitTotal: number;
  payAmount: number;
  paidLines: PaidLine[];
  resetDemo: () => void;
};

const DemoCartContext = createContext<DemoCartContextValue | null>(null);

const initialCart: CartMap = {};

export function DemoCartProvider({ children }: { children: ReactNode }) {
  const [qty, setQtyMap] = useState<CartMap>(initialCart);
  const [payQty, setPayQtyMap] = useState<PayQtyMap>({});
  const [payMode, setPayMode] = useState<"full" | "split">("full");

  const add = useCallback((id: number) => {
    setQtyMap((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
    setPayQtyMap((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  }, []);

  const remove = useCallback((id: number) => {
    setQtyMap((q) => {
      const next = { ...q };
      const cur = next[id] || 0;
      if (cur <= 1) delete next[id];
      else next[id] = cur - 1;
      return next;
    });
    setPayQtyMap((p) => {
      const next = { ...p };
      const curPay = next[id] || 0;
      // cart-dan 1 azalır — pay-ı da clamp edəcəyik useEffect-də, burada yumşaq azaldırıq
      if (curPay > 0) {
        // max cart after remove is unknown in this callback; clamp in effect
        next[id] = curPay;
      }
      return next;
    });
  }, []);

  const setQty = useCallback((id: number, n: number) => {
    setQtyMap((q) => {
      const next = { ...q };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }, []);

  /** Checkbox: 0 ↔ full line qty */
  const togglePayItem = useCallback(
    (id: number) => {
      const max = qty[id] || 0;
      if (max <= 0) return;
      setPayQtyMap((p) => {
        const cur = p[id] || 0;
        return { ...p, [id]: cur > 0 ? 0 : max };
      });
    },
    [qty],
  );

  const resetDemo = useCallback(() => {
    setQtyMap({});
    setPayQtyMap({});
    setPayMode("full");
  }, []);

  const cartLines = useMemo(() => {
    return menuItems
      .filter((m) => (qty[m.id] || 0) > 0)
      .map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        quantity: qty[m.id],
        lineTotal: m.price * qty[m.id],
      }));
  }, [qty]);

  const cartTotal = cartLines.reduce((s, l) => s + l.lineTotal, 0);
  const cartCount = cartLines.reduce((s, l) => s + l.quantity, 0);

  // payQty-ni cart-a uyğunlaşdır: yeni məhsul → full; mövcud → clamp; silinən → sil
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
        Object.keys(next).every((k) => prev[Number(k)] === next[Number(k)]);
      return same ? prev : next;
    });
  }, [cartLines]);

  // setPayQty / adjustPayQty max clamp against current qty
  const setPayQtyClamped = useCallback(
    (id: number, n: number) => {
      const max = qty[id] || 0;
      setPayQtyMap((p) => ({ ...p, [id]: Math.max(0, Math.min(n, max)) }));
    },
    [qty],
  );

  const adjustPayQtyClamped = useCallback(
    (id: number, delta: number) => {
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

  const selectedForPay = useMemo(
    () =>
      Object.entries(payQty)
        .filter(([, n]) => n > 0)
        .map(([id]) => Number(id)),
    [payQty],
  );

  const value: DemoCartContextValue = {
    qty,
    add,
    remove,
    setQty,
    payQty,
    setPayQty: setPayQtyClamped,
    adjustPayQty: adjustPayQtyClamped,
    selectedForPay,
    togglePayItem,
    payMode,
    setPayMode,
    cartLines,
    cartTotal,
    cartCount,
    splitTotal,
    payAmount,
    paidLines,
    resetDemo,
  };

  return (
    <DemoCartContext.Provider value={value}>{children}</DemoCartContext.Provider>
  );
}

export function useDemoCart() {
  const ctx = useContext(DemoCartContext);
  if (!ctx) throw new Error("useDemoCart must be used inside DemoCartProvider");
  return ctx;
}
