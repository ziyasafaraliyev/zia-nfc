import { PhoneStatusBar } from "@/components/pay/PhoneFrame";
import { formatAz, restaurant } from "@/lib/demo-data";

const items = [
  { name: "Lülə kabab", price: 16, added: true },
  { name: "Şah plov", price: 14, added: true },
  { name: "Yarpaq dolması", price: 12, added: false },
  { name: "Qutab", price: 6, added: true },
];

const cartTotal = items
  .filter((i) => i.added)
  .reduce((sum, i) => sum + i.price, 0);
const cartCount = items.filter((i) => i.added).length;

/** Hero / showcase içində tam menyu ekranı */
export default function PhoneMenuScreen() {
  return (
    <div className="flex h-full flex-col bg-slate-50">
      <PhoneStatusBar />

      <div className="flex min-h-0 flex-1 flex-col px-3.5 pb-6 pt-1">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {restaurant.table} · {restaurant.name}
        </p>
        <p className="mb-2.5 text-center text-[14px] font-black text-slate-950">
          Zia-Pay Menyü
        </p>

        <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white px-2.5 py-2 shadow-sm"
            >
              <span className="min-w-0 truncate text-[12px] font-medium text-slate-700">
                {item.name}
              </span>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="text-[12px] font-bold text-slate-950">
                  {formatAz(item.price)}
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                    item.added
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {item.added ? "✓" : "+"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2.5 shrink-0 space-y-1.5">
          <div className="rounded-2xl bg-slate-950 px-3 py-2 text-white">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">
                Səbət · {cartCount} məhsul
              </span>
              <span className="font-black text-sky-400">
                {formatAz(cartTotal)}
              </span>
            </div>
          </div>
          <div className="w-full rounded-full bg-sky-500 py-2.5 text-center text-[12px] font-black text-white shadow-[0_8px_20px_rgba(14,165,233,0.25)]">
            Səbəti təsdiqlə
          </div>
          <div className="w-full rounded-full border border-slate-200 bg-white py-2 text-center text-[11px] font-bold text-slate-900">
            Yediklərimi seçib ödə
          </div>
        </div>
      </div>
    </div>
  );
}
