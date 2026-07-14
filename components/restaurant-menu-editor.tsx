"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import {
  countMenuItems,
  emptyMenuCategory,
  emptyMenuItem,
  formatMenuPrice,
  MAX_MENU_CATEGORIES,
  MAX_MENU_ITEMS_PER_CATEGORY,
  parseRestaurantMenu,
} from "@/lib/menu";
import type { RestaurantMenuCategory } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/15";

type Props = {
  initialMenu?: RestaurantMenuCategory[] | null;
};

export default function RestaurantMenuEditor({ initialMenu }: Props) {
  const [categories, setCategories] = useState<RestaurantMenuCategory[]>(() =>
    parseRestaurantMenu(initialMenu ?? []),
  );
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(
    () => parseRestaurantMenu(initialMenu ?? [])[0]?.id ?? null,
  );

  const totalItems = useMemo(() => countMenuItems(categories), [categories]);
  const menuJson = useMemo(() => JSON.stringify(categories), [categories]);

  function updateCategory(
    categoryId: string,
    updater: (cat: RestaurantMenuCategory) => RestaurantMenuCategory,
  ) {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? updater(cat) : cat)),
    );
  }

  function addCategory() {
    if (categories.length >= MAX_MENU_CATEGORIES) return;
    const cat = emptyMenuCategory(`Kateqoriya ${categories.length + 1}`);
    setCategories((prev) => [...prev, cat]);
    setOpenCategoryId(cat.id);
  }

  function removeCategory(categoryId: string) {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setOpenCategoryId((id) => (id === categoryId ? null : id));
  }

  function moveCategory(categoryId: string, direction: -1 | 1) {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === categoryId);
      if (index < 0) return prev;
      const next = index + direction;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  }

  function addItem(categoryId: string) {
    updateCategory(categoryId, (cat) => {
      if (cat.items.length >= MAX_MENU_ITEMS_PER_CATEGORY) return cat;
      return { ...cat, items: [...cat.items, emptyMenuItem()] };
    });
  }

  function removeItem(categoryId: string, itemId: string) {
    updateCategory(categoryId, (cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.id !== itemId),
    }));
  }

  function moveItem(categoryId: string, itemId: string, direction: -1 | 1) {
    updateCategory(categoryId, (cat) => {
      const index = cat.items.findIndex((i) => i.id === itemId);
      if (index < 0) return cat;
      const next = index + direction;
      if (next < 0 || next >= cat.items.length) return cat;
      const items = [...cat.items];
      const [item] = items.splice(index, 1);
      items.splice(next, 0, item);
      return { ...cat, items };
    });
  }

  return (
    <div
      className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <input type="hidden" name="menu_json" value={menuJson} readOnly />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-[#29AEEE]/10 text-[#29AEEE]">
              <UtensilsCrossed size={16} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Zia Menyu
              </p>
              <h3 className="text-base font-black tracking-tight text-slate-900">
                Rəqəmsal menyu
              </h3>
            </div>
          </div>
          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-400">
            Kateqoriya və məhsullar əlavə edin. Müştərilər restoran səhifəsində
            menyunu bir toxunuşla aça biləcək.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-right">
          <p className="text-lg font-black tabular-nums text-slate-900">
            {categories.length}
            <span className="mx-1 text-slate-300">/</span>
            {totalItems}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Kateqoriya / məhsul
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
          <UtensilsCrossed size={22} className="mx-auto text-[#29AEEE]" />
          <p className="mt-2 text-sm font-bold text-slate-700">
            Hələ menyu yoxdur
          </p>
          <p className="mt-1 text-xs font-medium text-slate-400">
            İlk kateqoriyanı əlavə edib məhsulları daxil edin.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat, catIndex) => {
            const open = openCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/40"
              >
                <div className="flex items-center gap-2 p-3">
                  <span className="hidden text-slate-300 sm:inline">
                    <GripVertical size={16} />
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCategoryId((id) => (id === cat.id ? null : cat.id))
                    }
                    className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#29AEEE] hover:text-[#29AEEE]"
                    aria-expanded={open}
                    aria-label={open ? "Bağla" : "Aç"}
                  >
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <input
                    value={cat.name}
                    onChange={(e) =>
                      updateCategory(cat.id, (c) => ({
                        ...c,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Kateqoriya adı"
                    className={`${inputClass} font-bold`}
                  />
                  <span className="hidden shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200 sm:inline">
                    {cat.items.length} məhsul
                  </span>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => moveCategory(cat.id, -1)}
                      disabled={catIndex === 0}
                      className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition enabled:hover:border-[#29AEEE] enabled:hover:text-[#29AEEE] disabled:opacity-40"
                      title="Yuxarı"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCategory(cat.id, 1)}
                      disabled={catIndex === categories.length - 1}
                      className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition enabled:hover:border-[#29AEEE] enabled:hover:text-[#29AEEE] disabled:opacity-40"
                      title="Aşağı"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCategory(cat.id)}
                      className="grid size-9 place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      title="Kateqoriyanı sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {open ? (
                  <div className="space-y-3 border-t border-slate-200 bg-white p-3 sm:p-4">
                    {cat.items.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs font-medium text-slate-400">
                        Bu kateqoriyada məhsul yoxdur.
                      </p>
                    ) : (
                      cat.items.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
                        >
                          <div className="grid gap-2 sm:grid-cols-[1fr_7rem_auto]">
                            <input
                              value={item.name}
                              onChange={(e) =>
                                updateCategory(cat.id, (c) => ({
                                  ...c,
                                  items: c.items.map((it) =>
                                    it.id === item.id
                                      ? { ...it, name: e.target.value }
                                      : it,
                                  ),
                                }))
                              }
                              placeholder="Məhsul adı"
                              className={inputClass}
                            />
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={Number.isFinite(item.price) ? item.price : 0}
                              onChange={(e) =>
                                updateCategory(cat.id, (c) => ({
                                  ...c,
                                  items: c.items.map((it) =>
                                    it.id === item.id
                                      ? {
                                          ...it,
                                          price:
                                            parseFloat(e.target.value) || 0,
                                        }
                                      : it,
                                  ),
                                }))
                              }
                              placeholder="Qiymət"
                              className={inputClass}
                            />
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => moveItem(cat.id, item.id, -1)}
                                disabled={itemIndex === 0}
                                className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 disabled:opacity-40"
                                title="Yuxarı"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveItem(cat.id, item.id, 1)}
                                disabled={itemIndex === cat.items.length - 1}
                                className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 disabled:opacity-40"
                                title="Aşağı"
                              >
                                <ChevronDown size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(cat.id, item.id)}
                                className="grid size-9 place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600"
                                title="Sil"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                            <input
                              value={item.description ?? ""}
                              onChange={(e) =>
                                updateCategory(cat.id, (c) => ({
                                  ...c,
                                  items: c.items.map((it) =>
                                    it.id === item.id
                                      ? {
                                          ...it,
                                          description: e.target.value,
                                        }
                                      : it,
                                  ),
                                }))
                              }
                              placeholder="Qısa açıqlama (istəyə bağlı)"
                              className={inputClass}
                            />
                            <label className="inline-flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                              <span>Aktiv</span>
                              <input
                                type="checkbox"
                                checked={item.available !== false}
                                onChange={(e) =>
                                  updateCategory(cat.id, (c) => ({
                                    ...c,
                                    items: c.items.map((it) =>
                                      it.id === item.id
                                        ? {
                                            ...it,
                                            available: e.target.checked,
                                          }
                                        : it,
                                    ),
                                  }))
                                }
                                className="size-4 rounded accent-[#29AEEE]"
                              />
                            </label>
                          </div>
                          <p className="mt-1.5 text-[10px] font-semibold text-slate-400">
                            Preview:{" "}
                            <span className="text-[#29AEEE]">
                              {item.name || "—"} · {formatMenuPrice(item.price)}
                            </span>
                          </p>
                        </div>
                      ))
                    )}

                    <button
                      type="button"
                      onClick={() => addItem(cat.id)}
                      disabled={
                        cat.items.length >= MAX_MENU_ITEMS_PER_CATEGORY
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#29AEEE]/40 bg-[#29AEEE]/5 px-3 py-2.5 text-xs font-bold text-[#29AEEE] transition hover:bg-[#29AEEE]/10 disabled:opacity-50"
                    >
                      <Plus size={14} /> Məhsul əlavə et
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={addCategory}
        disabled={categories.length >= MAX_MENU_CATEGORIES}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50"
      >
        <Plus size={16} /> Kateqoriya əlavə et
      </button>
    </div>
  );
}
