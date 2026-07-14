import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer id="əlaqə" className="bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-pay.webp"
              alt="Zia-Pay"
              className="size-9 rounded-full object-cover"
            />
            <span className="text-base font-black tracking-tight text-sky-300">
              Zia Pay
            </span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
            NFC və ya QR ilə menyu açılır, müştəri səbətə yığır, təsdiqləyir və
            Apple Pay / Google Pay ilə tam və ya yediklərini seçərək ödəyir.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <Link href="/pay/about" className="transition-colors hover:text-white">
              Haqqında
            </Link>
            <Link
              href="/pay/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Məxfilik
            </Link>
            <span>© {new Date().getFullYear()} Zia-Pay</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:office@zia-pay.az"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition duration-200 hover:bg-sky-400"
            >
              <Mail size={16} /> E-poçt
            </a>
            <a
              href="https://wa.me/994702990252"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition duration-200 hover:bg-sky-400"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            NFC · QR · Menyu · Səbət · Ödə
          </p>
        </div>
      </div>
    </footer>
  );
}
