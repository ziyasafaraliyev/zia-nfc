import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/pay/Navbar";
import Footer from "@/components/pay/Footer";

export const metadata: Metadata = {
  title: "Məxfilik Siyasəti — Zia-Pay",
  description: "Zia-Pay məxfilik siyasəti və məlumatların qorunması.",
};

const sections = [
  {
    title: "1. Topladığımız məlumatlar",
    body: [
      "Zia-Pay xidmətini təmin etmək üçün məhdud miqdarda məlumat toplaya bilər: cihaz və brauzer məlumatı, NFC/QR sessiyası, menyu/səbət/sifariş məlumatı, ödəniş statusu (kart məlumatı deyil) və texniki loglar.",
      "Kart nömrəsi, CVV və digər həssas ödəniş məlumatları Zia-Pay serverlərində saxlanılmır — onlar birbaşa ödəniş provayderləri (Apple Pay, Google Pay, banklar) vasitəsilə emal olunur.",
    ],
  },
  {
    title: "2. Məlumatlardan necə istifadə edirik",
    body: [
      "Məlumatlar yalnız menyu göstərilməsi, səbət və sifarişin emalı, ödənişin təsdiqi, restoran panelinə ötürülmə, fırıldaqçılığın qarşısının alınması, texniki dəstək və xidmətin təkmilləşdirilməsi üçün istifadə olunur.",
      "Marketinq məqsədilə şəxsi məlumatlar satılmır və üçüncü tərəflərə ötürülmür (qanuni tələblər istisna olmaqla).",
    ],
  },
  {
    title: "3. Ödəniş təhlükəsizliyi",
    body: [
      "Ödənişlər Apple Pay və Google Pay vasitəsilə, sənaye standartlarına uyğun protokollarla qorunur. Biometrik təsdiq (Face ID, barmaq izi) cihazınızda qalır və Zia-Pay-ə ötürülmür.",
    ],
  },
  {
    title: "4. Məlumatların paylaşılması",
    body: [
      "Sifariş, səbət və ödəniş statusu restoran sisteminə/panelinə ötürülür — bu, xidmətin işləməsi üçün zəruridir.",
      "Hüquqi tələb olduqda və ya təhlükəsizlik təhdidlərinə cavab vermək üçün məlumat səlahiyyətli orqanlarla paylaşıla bilər.",
    ],
  },
  {
    title: "5. Kukilər və analitika",
    body: [
      "Saytımız texniki kukilər və məhdud analitika (məsələn, səhifə baxışları) istifadə edə bilər. Bu, xidmətin işləməsi və istifadəçi təcrübəsinin yaxşılaşdırılması üçündür.",
    ],
  },
  {
    title: "6. Məlumatların saxlanması",
    body: [
      "Sessiya və əməliyyat qeydləri yalnız zəruri müddət ərzində saxlanılır — qanuni, mühasibat və təhlükəsizlik tələblərinə uyğun olaraq.",
    ],
  },
  {
    title: "7. İstifadəçi hüquqları",
    body: [
      "Mövcud qanunvericilik çərçivəsində məlumatlarınıza baxmaq, düzəliş tələb etmək və ya silinməsini istəmək hüququnuz ola bilər. Sorğular üçün: office@zia-pay.az",
    ],
  },
  {
    title: "8. Üçüncü tərəf xidmətləri",
    body: [
      "Ödəniş emalı, hostinq və analitika üçün etibarlı üçüncü tərəf provayderlərdən istifadə edə bilərik. Onlar yalnız zəruri məlumatlara çıxış əldə edir və müvafiq müqavilə öhdəlikləri altındadır.",
    ],
  },
  {
    title: "9. Bu siyasətə dəyişikliklər",
    body: [
      "Bu Məxfilik Siyasətini vaxtaşırı yeniləyə bilərik. Yenilənmiş versiya bu səhifədə dərc olunacaq. Xidmətdən davamlı istifadə yenilənmiş siyasətin qəbulu hesab olunur.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="hero-gradient border-b border-slate-200/70 px-4 pb-16 pt-28 sm:px-6 md:pt-36 md:pb-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="section-label mb-4">Hüquqi</p>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Məxfilik Siyasəti
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Son yenilənmə: 12 iyul 2026
            </p>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-10 leading-8 text-slate-600">
              Zia-Pay olaraq məxfiliyinizə hörmət edirik. Bu siyasət NFC/QR
              menyu, səbət, sifariş təsdiqi və Apple Pay / Google Pay ödəniş
              axınından istifadə edərkən məlumatlarınızın necə toplandığını,
              istifadə olunduğunu və qorunduğunu izah edir.
            </p>

            <div className="space-y-10">
              {sections.map((s) => (
                <div key={s.title}>
                  <h2 className="mb-3 text-xl font-black text-slate-950">
                    {s.title}
                  </h2>
                  <ul className="space-y-2.5">
                    {s.body.map((p, i) => (
                      <li key={i} className="leading-7 text-slate-600">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="mb-2 font-black text-slate-950">Əlaqə</h3>
              <p className="text-sm text-slate-600">
                Məxfilik ilə bağlı suallarınız üçün:{" "}
                <a
                  href="mailto:office@zia-pay.az"
                  className="font-bold text-sky-600 hover:underline"
                >
                  office@zia-pay.az
                </a>
              </p>
            </div>

            <div className="mt-10">
              <Link
                href="/"
                className="text-sm font-bold text-sky-600 hover:text-sky-500"
              >
                ← Ana səhifəyə qayıt
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
