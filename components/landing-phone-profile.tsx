import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  UserPlus,
  Youtube,
} from "lucide-react";

/** Static phone profile mock — Server Component friendly (no client hooks). */
export function LandingPhoneProfile({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`${compact ? "" : "p-1"} overflow-hidden rounded-[1.5rem] bg-white`}
    >
      <div
        className={`relative flex flex-col items-center justify-center overflow-visible bg-[linear-gradient(145deg,#0f172a_0%,#0c2340_45%,#0369a1_100%)] ${compact ? "h-28" : "h-40"}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.06)_50%,transparent_70%)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.webp"
          alt="Zia NFC"
          className={`relative z-10 rounded-full object-cover ring-2 ring-white/20 shadow-xl ${compact ? "size-12" : "size-20"}`}
        />
        <p
          className={`relative z-10 mt-1.5 font-black uppercase tracking-[0.18em] text-white/80 ${compact ? "text-[9px]" : "text-[11px]"}`}
        >
          ZIA NFC
        </p>
      </div>

      <div className={`${compact ? "p-4" : "p-5"} bg-white`}>
        <div className="mb-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ziya.webp"
            alt="Ziya Safaraliyev"
            className={`shrink-0 border-2 border-slate-100 object-cover shadow-lg ${
              compact ? "size-12 rounded-xl" : "size-16 rounded-2xl"
            }`}
          />
          <div className="min-w-0">
            <p
              className={`truncate font-bold text-sky-600 ${compact ? "text-[10px]" : "text-xs"}`}
            >
              Founder ZIA NFC
            </p>
            <h3
              className={`truncate font-black leading-tight tracking-tight text-slate-900 ${compact ? "text-base" : "text-xl"}`}
            >
              Ziya Safaraliyev
            </h3>
            <p
              className={`truncate font-medium text-slate-500 ${compact ? "text-[9px]" : "text-[11px]"}`}
            >
              IT | Architect | Founder | Automation
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-2 ${compact ? "gap-1.5" : "gap-2"}`}>
          <div
            className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-950 font-black text-white ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"}`}
          >
            <Phone size={compact ? 12 : 16} /> Zəng et
          </div>
          <div
            className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-sky-500 font-black text-white ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"}`}
          >
            <MessageCircle size={compact ? 12 : 16} /> Çat
          </div>
        </div>

        <div
          className={`grid grid-cols-3 ${compact ? "mt-3 gap-1.5" : "mt-3 gap-2"}`}
        >
          {[Globe, Instagram, MapPin, Linkedin, Github, Youtube].map(
            (Icon, index) => (
              <div
                key={index}
                className={`grid place-items-center bg-slate-100 text-slate-700 ${compact ? "h-10 rounded-xl" : "h-14 rounded-2xl"}`}
              >
                <Icon size={compact ? 15 : 20} />
              </div>
            ),
          )}
        </div>

        <div className="mt-3">
          <div
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-100/50 bg-sky-50 font-extrabold text-sky-700 ${compact ? "py-3 text-xs" : "py-4 text-sm"}`}
          >
            <UserPlus size={compact ? 13 : 16} /> Kontaktı yadda saxla
          </div>
        </div>

        <div className="mt-3">
          <div
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-100/50 bg-sky-50 font-extrabold text-sky-700 ${compact ? "py-3 text-xs" : "py-4 text-sm"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={compact ? 13 : 16}
              height={compact ? 13 : 16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="m9 15 3 3 3-3" />
            </svg>
            <span>PDF (CV / Menyu)</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 ${compact ? "mt-3 p-2.5" : "mt-3 p-3"}`}
        >
          <div className="shrink-0 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
            <QrCode
              size={compact ? 28 : 38}
              strokeWidth={1.5}
              className="text-slate-900"
            />
          </div>
          <div className="min-w-0 text-left">
            <div
              className={`flex items-center gap-1.5 font-extrabold text-slate-800 ${compact ? "text-[10px]" : "text-xs"}`}
            >
              <QrCode size={compact ? 10 : 12} className="text-sky-500" />
              QR Kod ehtiyatı
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -right-3 top-4 z-20 hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.1)] sm:block">
        <QrCode className="text-slate-950" size={70} strokeWidth={1.5} />
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_90px_rgba(15,23,42,0.1)]">
        <LandingPhoneProfile />
      </div>
    </div>
  );
}
