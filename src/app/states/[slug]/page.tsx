import StoreShell from "@/components/StoreShell";
import ProductCard from "@/components/ProductCard";
import { one, q } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StatePage({ params }: { params: { slug: string } }) {
  const s = await one<any>("SELECT * FROM states WHERE slug=?", [params.slug]);
  if (!s) notFound();
  const products = await q<any>(
    `SELECT p.*, st.name AS state_name, a.name AS artisan_name FROM products p
     LEFT JOIN states st ON st.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.state_id=? AND p.status='active'`,
    [s.id]
  );
  return (
    <StoreShell>
      <div className="relative h-64">
        <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-maroon-900/55" />
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-8 text-cream-50">
          <p className="uppercase tracking-[0.3em] text-gold-200 text-xs">{s.region} India</p>
          <h1 className="font-display text-5xl">{s.name}</h1>
          <p className="font-script italic text-xl text-gold-200">{s.tagline}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <p className="max-w-2xl text-maroon-800">{s.story}</p>
        <h2 className="font-display text-2xl mt-10 mb-4">From this state</h2>
        {products.length === 0 ? <p>New crafts arriving soon.</p> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p: any) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
