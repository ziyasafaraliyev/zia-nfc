"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  User,
  Phone,
  Mail,
  FileText,
  Send,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutSuccessPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedMessage =
      `🎉 *YENİ SİFARİŞ VƏ ÖDƏNİŞ MƏLUMATI* 🎉\n\n` +
      `👤 *Ad və Soyad:* ${name.trim()}\n` +
      `📞 *Telefon Nömrəsi:* ${phone.trim()}\n` +
      `📧 *Gmail / Email:* ${email.trim()}\n` +
      `📝 *Qeyd / Dizayn İstəyi:* ${note.trim() || "Xüsusi qeyd yoxdur"}\n\n` +
      `Sifarişimi təsdiqləyib dizayn üçün əlaqə saxlamağınızı xahiş edirəm.`;

    const whatsappNumber = "994702990252";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      formattedMessage
    )}`;

    window.open(whatsappUrl, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col justify-between selection:bg-sky-500/20 selection:text-sky-950 font-sans">
      {/* Header Navbar */}
      <header className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white/90 px-5 py-3 shadow-md backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-black tracking-tight text-slate-950 transition hover:-translate-y-0.5"
          >
            <Image
              src="/logo.webp"
              alt="Zia NFC"
              width={38}
              height={38}
              className="size-9 rounded-full object-cover"
            />
            <span>Zia NFC</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700 hover:bg-slate-200 transition"
          >
            <ArrowLeft size={14} />
            <span>Ana Səhifə</span>
          </Link>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="mx-auto w-full max-w-xl px-4 py-8 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-[0_20px_70px_rgba(15,23,42,0.08)] text-slate-950"
        >
          {/* Badge & Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
              <CheckCircle2 className="size-9 text-emerald-500" />
            </div>

            <span className="inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-800">
              Ödəniş Uğurla Tamamlandı 🎉
            </span>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Sifariş Məlumatlarınız
            </h1>

            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-semibold">
              Kartınızın hazırlanması və dizaynın dəqiqləşdirilməsi üçün məlumatlarınızı daxil edin və WhatsApp komandamıza göndərin.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ad və Soyad */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-black uppercase tracking-[0.08em] text-slate-700 mb-1.5"
              >
                Ad və Soyadınız <span className="text-sky-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="məs. Ziya Səfərəliyev"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition duration-200"
                />
              </div>
            </div>

            {/* Telefon Nömrəsi */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-black uppercase tracking-[0.08em] text-slate-700 mb-1.5"
              >
                Telefon Nömrəniz (WhatsApp) <span className="text-sky-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+994 50 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition duration-200"
                />
              </div>
            </div>

            {/* Gmail / Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-black uppercase tracking-[0.08em] text-slate-700 mb-1.5"
              >
                Gmail / Əlaqə E-poçtunuz <span className="text-sky-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="nümunə@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition duration-200"
                />
              </div>
            </div>

            {/* Qeyd / Dizayn İstəyi */}
            <div>
              <label
                htmlFor="note"
                className="block text-xs font-black uppercase tracking-[0.08em] text-slate-700 mb-1.5"
              >
                Not / Xüsusi Dizayn İstəyi (İstəyə bağlı)
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                  <FileText size={18} />
                </div>
                <textarea
                  id="note"
                  rows={3}
                  placeholder="Məsələn: Kart üzərində loqomun çap edilməsini istəyirəm..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition duration-200 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-emerald-500 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(16,185,129,0.25)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-400 active:scale-[0.98]"
            >
              <Send size={18} />
              <span>Məlumatları WhatsApp-a Göndər</span>
            </button>
          </form>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800"
            >
              <Sparkles size={16} className="text-emerald-600" />
              <span>WhatsApp tətbiqi açıldı! Mesajı göndər düyməsinə sıxın.</span>
            </motion.div>
          )}

          {/* Footer Info */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck size={16} className="text-sky-500" />
            <span>Məlumatlarınız təhlükəsiz şəkildə qorunur</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-7xl px-6 py-6 text-center text-xs font-semibold text-slate-500">
        © {new Date().getFullYear()} Zia NFC. Bütün hüquqlar qorunur.
      </footer>
    </div>
  );
}
