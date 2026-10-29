import StoreShell from "@/components/StoreShell";
import { q } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function States() {
  const states = await q<any>("SELECT * FROM states ORDER BY region, name");
  const regions: Record<string, any[]> = {};
  for (const s of states) {
    (regions[s.region] ||= []).push(s);
  }
  return (
    <StoreShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-xs tracking-[0.3em] uppercase text-maroon-500">One India</p>
        <h1 className="font-display text-4xl">Shop by state</h1>
        <p className="mt-2 max-w-2xl text-maroon-700">Every state is a department. Tap a map tile to shop GI crafts, foods and textiles sourced with no middlemen.</p>
        {Object.entries(regions).map(([r, list]) => (
          <section key={r} className="mt-10">
            <h2 className="font-display text-2xl mb-4">{r}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {list.map((s) => (
                <Link key={s.id} href={`/states/${s.slug}`} className="group rounded-2xl overflow-hidden bg-white border border-maroon-100 hover:shadow-lift">
                  <div className="h-28 overflow-hidden">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-[11px] text-maroon-500 line-clamp-2">{s.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </StoreShell>
  );
}
