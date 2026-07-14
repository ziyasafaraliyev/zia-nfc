export default function TimeSaved() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="section-label mb-4">Təcrübə müqayisəsi</p>
          <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Ənənəvi axın vs{" "}
            <span className="text-sky-500">Zia-Pay axını</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Kağız menyu, ofisiant gözləməsi və terminal növbəsi yerinə — NFC/QR,
            rəqəmsal səbət və bir toxunuşla ödəniş.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="mb-6 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
              Ənənəvi
            </div>
            <div className="mb-1 text-4xl font-black text-slate-300 sm:text-5xl">
              Çox addım
            </div>
            <p className="mb-6 text-sm font-semibold text-slate-500">
              Sifariş + ödəniş gözləməsi
            </p>
            <ul className="space-y-3 text-sm text-slate-500">
              {[
                "Ofisiant / kağız menyu gözlə",
                "Sifarişi əl ilə ver",
                "Hesab və terminal gözlə",
                "«Kim nə yedi?» müzakirəsi",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-[0_18px_45px_rgba(14,165,233,0.2)]">
            <div className="mb-6 text-xs font-extrabold uppercase tracking-[0.18em] text-sky-300">
              Zia-Pay
            </div>
            <div className="mb-1 text-4xl font-black text-sky-400 sm:text-5xl">
              1 axın
            </div>
            <p className="mb-6 text-sm text-slate-400">
              Menyu → səbət → ödəniş
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                "NFC / QR oxu",
                "Menyudan seç, səbətə yığ",
                "Səbəti təsdiqlə",
                "Apple / Google Pay — tam və ya böl",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-sky-200 bg-sky-50 px-6 py-5 text-center">
          <p className="text-lg font-black text-slate-950">
            Sifariş və ödəniş eyni mobil axında — müştəri özü idarə edir.
          </p>
          <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-sky-700">
            App yox · Terminal növbəsi yox · Yediklərinlə ödə
          </p>
        </div>
      </div>
    </section>
  );
}
