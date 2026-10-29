import StoreShell from "@/components/StoreShell";
import { one } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Passport({ params }: { params: { sku: string } }) {
  const p = await one<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name, a.village, a.craft, a.photo, a.shg_name, a.years_experience
     FROM products p LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.sku=?`,
    [params.sku]
  );
  if (!p) notFound();
  return (
    <StoreShell>
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white border-2 border-maroon-800 rounded-3xl overflow-hidden">
          <div className="bg-maroon-800 text-cream-50 px-6 py-4 flex justify-between items-center">
            <span className="tracking-[0.3em] text-xs">INDIVA PASSPORT</span>
            <span className="font-mono text-sm">{p.sku}</span>
          </div>
          <img src={p.image} alt="" className="w-full h-56 object-cover" />
          <div className="p-6">
            <h1 className="font-display text-2xl">{p.name}</h1>
            <p className="text-sm text-maroon-600 mt-1">{p.origin_village}, {p.state_name}</p>
            <div className="mt-4 flex gap-4 items-center">
              <img src={p.photo} alt="" className="w-14 h-14 rounded-full object-cover" />
              <div>
                <p className="font-medium">{p.artisan_name}</p>
                <p className="text-xs text-maroon-600">{p.craft} · {p.years_experience} years · {p.shg_name}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed">{p.story}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-cream-200 rounded-lg p-2"><dt className="uppercase tracking-wider text-maroon-500">Process</dt><dd>{p.making_process}</dd></div>
              <div className="bg-cream-200 rounded-lg p-2"><dt className="uppercase tracking-wider text-maroon-500">Eco</dt><dd>{p.eco_impact}</dd></div>
              <div className="bg-cream-200 rounded-lg p-2"><dt className="uppercase tracking-wider text-maroon-500">GI</dt><dd>{p.gi_tagged ? p.gi_name : "—"}</dd></div>
              <div className="bg-cream-200 rounded-lg p-2"><dt className="uppercase tracking-wider text-maroon-500">HS code</dt><dd>{p.hs_code}</dd></div>
            </dl>
            <div className="mt-6 flex justify-center">
              <svg viewBox="0 0 120 120" className="w-28 h-28" aria-label="QR">
                <rect width="120" height="120" fill="#fbf7f0" />
                <rect x="8" y="8" width="34" height="34" fill="#6b2c1a" />
                <rect x="14" y="14" width="22" height="22" fill="#fbf7f0" />
                <rect x="20" y="20" width="10" height="10" fill="#6b2c1a" />
                <rect x="78" y="8" width="34" height="34" fill="#6b2c1a" />
                <rect x="84" y="14" width="22" height="22" fill="#fbf7f0" />
                <rect x="90" y="20" width="10" height="10" fill="#6b2c1a" />
                <rect x="8" y="78" width="34" height="34" fill="#6b2c1a" />
                <rect x="14" y="84" width="22" height="22" fill="#fbf7f0" />
                <rect x="20" y="90" width="10" height="10" fill="#6b2c1a" />
                {Array.from({ length: 36 }, (_, i) => (
                  <rect key={i} x={48 + (i % 6) * 5} y={48 + Math.floor(i / 6) * 5} width="4" height="4" fill={i % 3 ? "#6b2c1a" : "#c4a35a"} />
                ))}
              </svg>
            </div>
            <p className="text-center text-[11px] text-maroon-500">Scan in-store or share this URL. Blockchain traceability coming next.</p>
            <Link href={`/product/${p.slug}`} className="mt-4 block text-center py-2.5 rounded-full bg-maroon-700 text-cream-50">Buy this piece</Link>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
