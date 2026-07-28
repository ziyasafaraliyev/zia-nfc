"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  User,
  Phone,
  Mail,
  FileText,
  Send,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function CheckoutSuccessPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedMessage = `🎉 *YENİ ÖDƏNİŞ & SİFARİŞ MƏLUMATI* 🎉\n\n` +
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
    <div className="min-h-screen bg-[#05070E] text-white flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full" />

      {/* Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Səhifəyə Qayıt</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs tracking-wider uppercase font-semibold text-emerald-400">
            Ödəniş Təsdiqləndi
          </span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 max-w-xl mx-auto w-full px-4 py-6 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/20"
        >
          {/* Badge & Title */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ödənişiniz Uğurla Tamamlandı! 🎉
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
              NFC kartınızın hazırlanması və dizaynın təsdiqlənməsi üçün zəhmət
              olmasa məlumatlarınızı daxil edin və WhatsApp komandamıza göndərin.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ad və Soyad */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Ad və Soyadınız <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="məs. Ziya Səfərəliyev"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Telefon Nömrəsi */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Telefon Nömrəniz (WhatsApp) <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+994 50 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Gmail / Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Gmail / Əlaqə E-poçtunuz <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="nümunə@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Qeyd / Dizayn İstəyi */}
            <div>
              <label
                htmlFor="note"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Not / Xüsusi Dizayn İstəyi (İstəyə bağlı)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  id="note"
                  rows={3}
                  placeholder="Məsələn: Kart üzərində loqomun olmasını istəyirəm..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Məlumatları WhatsApp-a Göndər</span>
            </button>
          </form>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp tətbiqi açıldı! Mesajı göndər düyməsinə sıxın.</span>
            </motion.div>
          )}

          {/* Info Footer inside card */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Məlumatlarınız təhlükəsiz şəkildə qorunur.</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full px-6 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Zia NFC. Bütün hüquqlar qorunur.
      </footer>
    </div>
  );
}
