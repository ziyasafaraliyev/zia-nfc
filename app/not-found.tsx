import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 text-center text-ink">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-clay">404</p>
        <h1 className="mt-3 text-4xl font-black">Profil tapılmadı.</h1>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 font-black text-paper">
          Ana səhifəyə qayıt
        </Link>
      </div>
    </main>
  );
}
