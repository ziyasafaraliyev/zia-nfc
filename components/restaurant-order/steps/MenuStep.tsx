"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useRestaurantCart } from "@/components/restaurant-order/RestaurantCartContext";
import { getRestaurantCartPath } from "@/lib/urls";
import { storageImageUrl } from "@/lib/media";

export default function MenuStep() {
  const router = useRouter();
  const {
    restaurant,
    qty,
    add,
    remove,
    cartCount,
    cartTotal,
    formatPrice,
  } = useRestaurantCart();

  const categories = restaurant.menu;
  const [activeCategoryId, setActiveCategoryId] = useState(
    () => categories[0]?.id ?? "",
  );

  // Prefetch cart route while user is browsing — next click feels instant
  useEffect(() => {
    router.prefetch(getRestaurantCartPath(restaurant.slug));
  }, [router, restaurant.slug]);

  const activeCategory = useMemo(() => {
    return (
      categories.find((c) => c.id === activeCategoryId) ?? categories[0] ?? null
    );
  }, [categories, activeCategoryId]);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <UtensilsCrossed className="text-slate-300" size={40} />
        <h1 className="text-xl font-black text-slate-950">Menyu boşdur</h1>
        <p className="text-sm text-slate-500">
          Bu restoran hələ rəqəmsal menyu əlavə etməyib.
        </p>
      </div>
    );
  }

  const items = activeCategory?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-600">
          Addım 1 · Menyu
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          {restaurant.name}
        </h1>
        <p className="text-sm text-slate-500">
          Məhsul seç və səbətə əlavə et
        </p>
      </div>

      {/* Horizontal category tabs */}
      <nav
        className="sticky top-[7.25rem] z-10 -mx-1 flex gap-2 overflow-x-auto bg-slate-100 px-1 py-2 md:bg-slate-100/95 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Menyu kateqoriyaları"
      >
        {categories.map((cat) => {
          const selected =
            cat.id === (activeCategory?.id ?? activeCategoryId);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryId(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-black transition active:scale-[0.97] ${
                selected
                  ? "bg-slate-950 text-white shadow-md shadow-slate-900/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-600"
              }`}
              aria-pressed={selected}
            >
              {cat.name}
            </button>
          );
        })}
      </nav>

      {/* Vertical products for selected category */}
      <div className="flex flex-col gap-3">
        {activeCategory ? (
          <p className="px-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {activeCategory.name}
            <span className="ml-1.5 font-semibold normal-case tracking-normal text-slate-300">
              · {items.length} məhsul
            </span>
          </p>
        ) : null}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
            <p className="text-sm font-bold text-slate-600">
              Bu kateqoriyada məhsul yoxdur
            </p>
          </div>
        ) : (
          items.map((item) => {
            const count = qty[item.id] || 0;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      storageImageUrl(item.image_url, {
                        width: 112,
                        height: 112,
                        quality: 70,
                        resize: "cover",
                      }) ?? item.image_url
                    }
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    width={56}
                    height={56}
                    className="size-14 shrink-0 rounded-xl object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="font-black text-slate-950">{item.name}</p>
                  {item.description ? (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.description}
                    </p>
                  ) : null}
                  <p className="mt-1.5 text-sm font-bold text-sky-600">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {count === 0 ? (
                  <button
                    type="button"
                    onClick={() => add(item.id)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white transition hover:bg-sky-500 active:scale-95"
                    aria-label={`${item.name} əlavə et`}
                  >
                    <Plus size={18} />
                  </button>
                ) : (
                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-1">
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm active:scale-95"
                      aria-label="Azalt"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center text-sm font-black tabular-nums">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => add(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white active:scale-95"
                      aria-label="Artır"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Cart bar */}
      <div className="sticky bottom-3 z-20 rounded-2xl bg-slate-950 p-4 text-white shadow-xl">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-slate-400">
            <ShoppingBag size={16} className="text-sky-400" />
            Səbət · {cartCount} məhsul
          </span>
          <span className="font-black text-sky-400">
            {formatPrice(cartTotal)}
          </span>
        </div>
        {cartCount > 0 ? (
          <Link
            href={getRestaurantCartPath(restaurant.slug)}
            prefetch
            scroll={false}
            className="flex w-full items-center justify-center rounded-full bg-sky-500 py-3.5 text-sm font-black text-white transition hover:bg-sky-400 active:scale-[0.98]"
          >
            Səbətə bax →
          </Link>
        ) : (
          <p className="rounded-full bg-white/10 py-3.5 text-center text-sm font-bold text-slate-400">
            Məhsul seçmək üçün + bas
          </p>
        )}
      </div>
    </div>
  );
}
