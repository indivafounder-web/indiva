import StoreShell from "@/components/StoreShell";
import { q } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { usd } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ExportDesk() {
  const products = await q<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name FROM products p
     LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.quality_tier=1 AND p.status='active' LIMIT 8`
  );
  return (
    <StoreShell>
      <div className="bg-maroon-800 text-cream-50">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-gold-200 text-xs">Export desk</p>
            <h1 className="font-display text-4xl mt-2">India&apos;s cultural luxury ambassador</h1>
            <p className="mt-4 text-cream-100/90">Tier 1 pieces only. Eco packaging, QR authentication, HS codes, FDA/EU labelling. Primary markets: United States, United Kingdom, UAE, Canada, Singapore, Australia.</p>
            <Link href="/shop?tier=1" className="inline-block mt-6 px-6 py-3 rounded-full bg-gold-400 text-maroon-900 font-semibold">Shop export-ready</Link>
          </div>
          <img src="/brand/store.jpg" alt="" className="rounded-2xl h-64 w-full object-cover" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="font-display text-2xl mb-4">Channels</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {["Cross-border e-commerce", "Retail boutiques abroad", "B2B cultural hampers", "Trade fairs — Heimtextil, NY NOW"].map((t) => (
            <div key={t} className="bg-white border border-maroon-100 rounded-xl p-4">{t}</div>
          ))}
        </div>
        <h2 className="font-display text-2xl mt-10 mb-4">Sample export pricing</h2>
        <div className="overflow-auto bg-white border border-maroon-100 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-cream-200"><tr><th className="text-left p-3">Product</th><th>INR</th><th>Export USD</th></tr></thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="border-t border-maroon-50">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">₹{p.price}</td>
                  <td className="p-3">{usd(p.export_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {products.slice(0, 4).map((p: any) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </StoreShell>
  );
}
