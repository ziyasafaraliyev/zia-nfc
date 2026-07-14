import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/pay/Navbar";
import Footer from "@/components/pay/Footer";

export const metadata: Metadata = {
  title: "Haqqında — Zia-Pay",
  description:
    "Zia-Pay: NFC/QR ilə menyu, səbət, təsdiq və Apple Pay / Google Pay ilə tam və ya yediklərini seçərək ödəniş.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="hero-gradient border-b border-slate-200/70 px-4 pb-16 pt-28 sm:px-6 md:pt-36 md:pb-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="section-label mb-4">Zia-Pay haqqında</p>
            <h1 className="mb-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Menyu, səbət və ödəniş —{" "}
              <span className="text-sky-500">bir axında.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Müştəri restoran masasında NFC və ya QR oxuyur, rəqəmsal menyu
              açılır, istədiklərini səbətə yığır, təsdiqləyir və Apple Pay /
              Google Pay ilə tam və ya yalnız yediyi məhsulları seçərək ödəyir.
            </p>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-10">
              <div>
                <h2 className="mb-3 text-2xl font-black text-slate-950">
                  Missiyamız
                </h2>
                <p className="leading-8 text-slate-600">
                  Restoranda sifariş və ödəniş hələ də çox vaxt kağız menyu,
                  ofisiant növbəsi və terminal gözləməsi ilə bağlıdır. Zia-Pay
                  bunu rəqəmsallaşdırır: müştəri özü menyuya daxil olur, səbətə
                  yığır və müasir ödəniş üsulları ilə bitirir — restoran isə
                  daha az əməliyyat yükü ilə daha yaxşı təcrübə təqdim edir.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-2xl font-black text-slate-950">
                  Sistem necə işləyir?
                </h2>
                <ol className="mb-4 list-decimal space-y-2 pl-5 leading-8 text-slate-600">
                  <li>
                    Müştəri masadakı <strong>NFC</strong> karta toxunur və ya{" "}
                    <strong>QR</strong> kodu skan edir.
                  </li>
                  <li>
                    Brauzerdə restoranın <strong>rəqəmsal menyusu</strong>{" "}
                    açılır.
                  </li>
                  <li>
                    İstədiyi məhsulları <strong>səbətə</strong> əlavə edir.
                  </li>
                  <li>
                    <strong>Səbəti təsdiqləyir</strong> (miqdar yoxlanır).
                  </li>
                  <li>
                    <strong>Apple Pay</strong> və ya <strong>Google Pay</strong>{" "}
                    ilə bütün məbləği ödəyir — və ya yalnız{" "}
                    <strong>yediyi məhsulları seçərək</strong> öz payını ödəyir.
                  </li>
                </ol>
                <Link
                  href="/pay#how-it-works"
                  className="inline-flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-500"
                >
                  Addım-addım axına bax →
                </Link>
              </div>

              <div>
                <h2 className="mb-3 text-2xl font-black text-slate-950">
                  Ödəniş təhlükəsizliyi
                </h2>
                <p className="leading-8 text-slate-600">
                  Kart məlumatları Zia-Pay-də saxlanılmır. Apple Pay və Google
                  Pay cihaz səviyyəli biometrik təsdiq (Face ID, barmaq izi) və
                  sənaye standartı şifrələmə ilə işləyir.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-2xl font-black text-slate-950">
                  Əlaqə
                </h2>
                <p className="leading-8 text-slate-600">
                  Restoranınızı Zia-Pay-ə qoşmaq üçün:{" "}
                  <a
                    href="mailto:office@zia-pay.az"
                    className="font-bold text-sky-600 hover:underline"
                  >
                    office@zia-pay.az
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-full bg-sky-500 px-6 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(14,165,233,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-400"
              >
                Ana səhifə
              </Link>
              <Link
                href="/pay/privacy-policy"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
              >
                Məxfilik Siyasəti
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
