import StoreShell from "@/components/StoreShell";
import ProductCard from "@/components/ProductCard";
import { one, q } from "@/lib/db";
import { inr } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Artisan({ params }: { params: { id: string } }) {
  const a = await one<any>("SELECT * FROM artisans WHERE id=?", [params.id]);
  if (!a) notFound();
  const products = await q<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name FROM products p
     LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.artisan_id=? AND p.status='active'`,
    [a.id]
  );
  return (
    <StoreShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          <img src={a.photo} alt={a.name} className="w-full aspect-square object-cover rounded-3xl" />
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-maroon-500">Artisan passport</p>
            <h1 className="font-display text-4xl">{a.name}</h1>
            <p className="text-maroon-700">{a.craft} · {a.village}, {a.state}</p>
            <p className="mt-4 leading-relaxed">{a.bio}</p>
            <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-white border border-maroon-100 rounded-xl p-3"><dt className="text-xs text-maroon-500">Experience</dt><dd className="font-semibold">{a.years_experience} yrs</dd></div>
              <div className="bg-white border border-maroon-100 rounded-xl p-3"><dt className="text-xs text-maroon-500">GI</dt><dd className="font-semibold">{a.gi_certified ? "Certified" : "In progress"}</dd></div>
              <div className="bg-white border border-maroon-100 rounded-xl p-3"><dt className="text-xs text-maroon-500">SHG</dt><dd className="font-semibold">{a.shg_name}</dd></div>
              <div className="bg-white border border-maroon-100 rounded-xl p-3"><dt className="text-xs text-maroon-500">Lifetime income</dt><dd className="font-semibold">{inr(a.income_total)}</dd></div>
            </dl>
          </div>
        </div>
        <h2 className="font-display text-2xl mt-10 mb-4">Made by {a.name.split(" ")[0]}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p: any) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </StoreShell>
  );
}
