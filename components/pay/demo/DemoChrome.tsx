"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import {
  demoSteps,
  getStepIndex,
  restaurant,
  type DemoStepId,
} from "@/lib/demo-data";

/** Correct for /pay/demo/skan — last path segment is the step id */
function stepIdFromPath(pathname: string): DemoStepId {
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "skan";
  const found = demoSteps.find((s) => s.id === last);
  return found ? found.id : "skan";
}

export default function DemoChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const stepId = stepIdFromPath(pathname);
  const index = getStepIndex(stepId);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/pay"
            className="group inline-flex shrink-0 items-center gap-2 transition hover:-translate-y-0.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-pay.webp"
              alt="Zia Pay"
              className="size-9 rounded-full object-cover shadow-md ring-2 ring-sky-400/40 transition group-hover:ring-sky-400"
            />
            <span className="text-base font-black tracking-tight text-slate-950 group-hover:text-sky-600 sm:text-lg">
              Zia Pay
            </span>
          </Link>
          <div className="min-w-0 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-600">
              Zia Pay demo
            </p>
            <p className="truncate text-sm font-black text-slate-950">
              {restaurant.table} · {restaurant.name}
            </p>
          </div>
          <div className="w-16 text-right text-xs font-bold text-slate-400">
            {index + 1}/{demoSteps.length}
          </div>
        </div>

        <div className="mx-auto flex max-w-lg gap-1.5 overflow-x-auto px-4 pb-3">
          {demoSteps.map((s, i) => {
            const isActive = s.id === stepId;
            const isDone = i < index;
            return (
              <Link
                key={s.id}
                href={s.href}
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
            className="h-full bg-sky-500 transition-all duration-500"
            style={{
              width: `${Math.max(0, (index / (demoSteps.length - 1)) * 100)}%`,
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
