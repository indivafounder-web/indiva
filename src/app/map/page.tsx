import StoreShell from "@/components/StoreShell";
import { q } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const states = await q<any>("SELECT * FROM states ORDER BY name");
  return (
    <StoreShell>
      <div className="bg-[#232f3e] text-white">
        <div className="max-w-[1500px] mx-auto px-6 py-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#febd69]">Feature 01</p>
          <h1 className="text-4xl font-semibold">29-state cultural atlas</h1>
          <p className="mt-2 text-gray-300">Every tile is a department. GI crafts, foods and textiles — no middlemen.</p>
        </div>
      </div>
      <div className="max-w-[1500px] mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {states.map((s: any) => (
          <Link key={s.id} href={`/states/${s.slug}`} className="group bg-white border border-gray-200 rounded overflow-hidden hover:shadow-lg">
            <div className="h-24 overflow-hidden">
              <img src={s.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-2">
              <p className="text-sm font-semibold">{s.name}</p>
              <p className="text-[11px] text-gray-500 line-clamp-2">{s.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </StoreShell>
  );
}
