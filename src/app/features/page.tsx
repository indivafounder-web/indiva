import StoreShell from "@/components/StoreShell";
import { FEATURES } from "@/lib/features";
import Link from "next/link";

export default function FeaturesPage() {
  const pillars = ["Customer", "Artisan", "Export", "Intelligence"] as const;
  return (
    <StoreShell>
      <div className="bg-[#232f3e] text-white">
        <div className="max-w-[1500px] mx-auto px-6 py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[#febd69]">Roadmap in production</p>
          <h1 className="text-4xl font-semibold mt-2">100 future-ready features</h1>
          <p className="mt-3 max-w-2xl text-gray-300">Every capability from the INDIVA brief is wired into the house — shop, seller, export desk and intelligence. Open a card to use it.</p>
        </div>
      </div>
      <div className="max-w-[1500px] mx-auto px-6 py-10 space-y-12">
        {pillars.map((p) => (
          <section key={p}>
            <h2 className="text-2xl font-semibold mb-4">{p}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.filter((f) => f.pillar === p).map((f) => (
                <Link key={f.n} href={f.href} className="bg-white border border-gray-200 rounded p-4 hover:shadow-lg transition-shadow">
                  <span className="text-xs text-[#c45500] font-bold">#{String(f.n).padStart(3, "0")}</span>
                  <h3 className="font-medium mt-1">{f.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{f.blurb}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </StoreShell>
  );
}
