import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-center shadow-[0_30px_80px_rgba(15,23,42,0.2)] sm:px-12 md:py-20">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(14,165,233,0.45) 0%, transparent 70%)",
          }}
        />

        <div className="relative">
          <p className="section-label-light mb-4">Hazırsınız?</p>
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Menyü, səbət və ödəniş —{" "}
            <span className="text-sky-400">bir NFC/QR toxunuşunda.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
            Restoranınızda müştərilər menyunu özü aça, səbətə yığa, təsdiqləyə və
            Apple Pay / Google Pay ilə — tam və ya yediklərini seçərək — ödəyə
            bilsin.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:office@zia-pay.az"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400"
            >
              Restoran kimi qoşul
              <ArrowRight size={16} />
            </a>
            <a
              href="/pay/demo/skan"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-black uppercase tracking-[0.1em] text-white transition duration-200 hover:bg-white/10"
            >
              Demoya bax
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
