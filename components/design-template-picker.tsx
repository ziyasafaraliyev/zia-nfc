"use client";

import {
  Briefcase,
  Camera,
  Home,
  Scale,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react";
import {
  DESIGN_TEMPLATE_LIST,
  type DesignTemplateId,
} from "@/lib/design-templates";

const templateIcons = {
  business: Briefcase,
  realtor: Home,
  doctor: Stethoscope,
  restaurant: UtensilsCrossed,
  lawyer: Scale,
  photographer: Camera,
  influencer: Sparkles,
} as const;

type Props = {
  value: DesignTemplateId;
  onChange: (id: DesignTemplateId) => void;
};

export default function DesignTemplatePicker({ value, onChange }: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-500">
          Hazır Dizayn Şablonları
        </span>
        <p className="mt-1 text-xs font-medium text-slate-400">
          Bir kliklə tema, cover və layout dəyişsin.
        </p>
      </div>

      <input type="hidden" name="design_template" value={value} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DESIGN_TEMPLATE_LIST.map((template) => {
          const Icon = templateIcons[template.id];
          const selected = value === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={[
                "group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-200",
                selected
                  ? "border-[#29AEEE] bg-[#29AEEE]/5 shadow-[0_8px_24px_rgba(41,174,238,0.18)] ring-2 ring-[#29AEEE]/25"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
              ].join(" ")}
            >
              <div
                className="mb-3 h-14 rounded-xl"
                style={{ background: template.previewGradient }}
              />
              <div className="flex items-start gap-2.5">
                <span
                  className={[
                    "grid size-8 shrink-0 place-items-center rounded-xl transition-colors",
                    selected
                      ? "bg-[#29AEEE] text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
                  ].join(" ")}
                >
                  <Icon size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-black tracking-tight text-slate-900">
                    {template.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-semibold text-slate-400">
                    {template.labelAz}
                  </span>
                </span>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                {template.description}
              </p>
              {selected ? (
                <span className="absolute right-2.5 top-2.5 rounded-full bg-[#29AEEE] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                  Aktiv
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}