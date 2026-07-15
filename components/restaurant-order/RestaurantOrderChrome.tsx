"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import {
  getOrderStepIndex,
  getOrderSteps,
  type OrderRestaurantPayload,
  type OrderStepId,
} from "@/lib/restaurant-order";
import { getRestaurantPath } from "@/lib/urls";

type Props = {
  restaurant: OrderRestaurantPayload;
  step: OrderStepId;
  children: React.ReactNode;
};

export default function RestaurantOrderChrome({
  restaurant,
  step,
  children,
}: Props) {
  const steps = getOrderSteps(restaurant.slug);
  const index = getOrderStepIndex(step);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white md:bg-white/90 md:backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <Link
            href={getRestaurantPath(restaurant.slug)}
            prefetch
            className="group inline-flex min-w-0 shrink items-center gap-2 transition hover:-translate-y-0.5"
          >
            {restaurant.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={restaurant.avatar_url}
                alt={restaurant.name}
                width={36}
                height={36}
                decoding="async"
                className="size-9 rounded-full object-cover shadow-md ring-2 ring-sky-400/40"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logo.webp"
                alt="Zia"
                width={36}
                height={36}
                className="size-9 rounded-full object-cover shadow-md ring-2 ring-sky-400/40"
              />
            )}
            <span className="truncate text-base font-black tracking-tight text-slate-950 group-hover:text-sky-600 sm:text-lg">
              {restaurant.name}
            </span>
          </Link>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-600">
              Zia Menyu
            </p>
            <p className="text-xs font-bold text-slate-400">
              {index + 1}/{steps.length}
            </p>
          </div>
        </div>

        <div className="mx-auto flex max-w-lg gap-1.5 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((s, i) => {
            const isActive = s.id === step;
            const isDone = i < index;
            return (
              <Link
                key={s.id}
                href={s.href}
                prefetch
                scroll={false}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition ${
                  isActive
                    ? "bg-slate-950 text-white shadow-md"
                    : isDone
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    isActive
                      ? "bg-sky-500 text-white"
                      : isDone
                        ? "bg-white/25 text-white"
                        : "bg-white text-slate-500"
                  }`}
                >
                  {isDone ? <Check size={11} strokeWidth={3} /> : i + 1}
                </span>
                {s.label}
              </Link>
            );
          })}
        </div>

        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-sky-500 transition-all duration-300"
            style={{
              width: `${Math.max(0, (index / (steps.length - 1)) * 100)}%`,
            }}
          />
        </div>
      </header>

      <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-lg px-4 py-5 pb-10">
        {children}
      </main>
    </div>
  );
}
