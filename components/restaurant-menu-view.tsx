import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { formatMenuPrice, menuForPublic } from "@/lib/menu";
import type { Restaurant, RestaurantMenuCategory } from "@/lib/types";
import { getRestaurantPath } from "@/lib/urls";

type Props = {
  restaurant: Restaurant;
  /** When true, show back link to restaurant profile */
  showBack?: boolean;
};

export default function RestaurantMenuView({
  restaurant,
  showBack = true,
}: Props) {
  const categories = menuForPublic(restaurant.menu);
  const themeClass =
    restaurant.theme && restaurant.theme !== "light"
      ? `${restaurant.theme}-theme`
      : "";

  return (
    <main
      className={`lux-shell relative min-h-screen overflow-x-hidden ${themeClass}`}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="lux-orb-1 absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full" />
        <div className="lux-orb-2 absolute right-[-15%] top-[20%] h-[28rem] w-[28rem] rounded-full" />
        <div className="lux-orb-3 absolute bottom-[-8%] left-[-12%] h-[32rem] w-[32rem] rounded-full" />
        <div className="lux-grid absolute inset-0" />
        <div className="lux-noise absolute inset-0 opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[440px] px-4 py-6 pb-16">
        {showBack ? (
          <Link
            href={getRestaurantPath(restaurant.slug)}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ArrowLeft size={14} />
            {restaurant.name}
          </Link>
        ) : null}

        <section className="lux-card overflow-hidden rounded-[1.75rem] p-5">
          <div className="flex items-start gap-3">
            {restaurant.avatar_url ? (
              <img
                src={restaurant.avatar_url}
                alt={restaurant.name}
                className="size-14 shrink-0 rounded-2xl object-cover ring-2 ring-white shadow-md"
              />
            ) : (
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#29AEEE]/15 text-[#29AEEE]">
                <UtensilsCrossed size={22} />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#29AEEE]">
                Zia Menyu
              </p>
              <h1 className="mt-0.5 truncate text-xl font-black tracking-tight text-slate-950">
                {restaurant.name}
              </h1>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Rəqəmsal menyu
              </p>
            </div>
          </div>
        </section>

        {categories.length === 0 ? (
          <div className="mt-4 rounded-[1.75rem] border border-dashed border-slate-200 bg-white/80 px-5 py-10 text-center shadow-sm">
            <UtensilsCrossed size={24} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-700">
              Menyu hələ əlavə olunmayıb
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Tezliklə burada yemək və içkilər görünəcək.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {categories.length > 1 ? (
              <nav className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#cat-${cat.id}`}
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-[#29AEEE] hover:text-[#29AEEE]"
                  >
                    {cat.name}
                  </a>
                ))}
              </nav>
            ) : null}

            {categories.map((cat) => (
              <MenuCategoryBlock key={cat.id} category={cat} />
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="lux-footer-divider" />
          <div className="mt-2 flex items-center gap-1.5">
            <img
              src="/logo.webp"
              alt="Zia NFC"
              className="size-4 rounded-full object-cover opacity-60"
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              Powered by <span className="lux-brand-text">Zia NFC</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function MenuCategoryBlock({ category }: { category: RestaurantMenuCategory }) {
  return (
    <section id={`cat-${category.id}`} className="scroll-mt-4">
      <div className="mb-2.5 flex items-center gap-2 px-1">
        <h2 className="text-sm font-black uppercase tracking-[0.12em] text-slate-800">
          {category.name}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
      </div>
      <div className="space-y-2.5">
        {category.items.map((item) => (
          <article
            key={item.id}
            className="lux-card flex gap-3 rounded-2xl p-3.5"
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="size-16 shrink-0 rounded-xl object-cover"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-black leading-snug text-slate-950">
                  {item.name}
                </h3>
                <p className="shrink-0 text-sm font-black tabular-nums text-[#29AEEE]">
                  {formatMenuPrice(item.price)}
                </p>
              </div>
              {item.description ? (
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {item.description}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
