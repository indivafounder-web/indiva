import StoreShell from "@/components/StoreShell";
import ProductCard from "@/components/ProductCard";
import { q } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Shop({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const sp = searchParams;
  const where = ["p.status='active'"];
  const args: any[] = [];
  if (sp.q) {
    where.push("(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)");
    const like = `%${sp.q}%`;
    args.push(like, like, like);
  }
  if (sp.category) {
    where.push("c.slug=?");
    args.push(sp.category);
  }
  if (sp.state) {
    where.push("s.slug=?");
    args.push(sp.state);
  }
  if (sp.gi === "1") where.push("p.gi_tagged=1");
  if (sp.tier) {
    where.push("p.quality_tier=?");
    args.push(Number(sp.tier));
  }
  if (sp.featured === "1") where.push("p.featured=1");
  const sort = sp.sort || "featured";
  const order =
    sort === "price_asc" ? "p.price ASC" :
    sort === "price_desc" ? "p.price DESC" :
    sort === "rating" ? "p.rating DESC" :
    "p.featured DESC, p.sold DESC";

  const products = await q<any>(
    `SELECT p.*, c.name AS category_name, s.name AS state_name, a.name AS artisan_name
     FROM products p
     LEFT JOIN categories c ON c.id=p.category_id
     LEFT JOIN states s ON s.id=p.state_id
     LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE ${where.join(" AND ")} ORDER BY ${order}`,
    args
  );
  const cats = await q<any>("SELECT * FROM categories");
  const states = await q<any>("SELECT * FROM states ORDER BY name");

  const title = sp.q ? `Results for “${sp.q}”` : sp.category ? (cats.find((c: any) => c.slug === sp.category)?.name || "Shop") : "All products";

  const qs = (extra: Record<string, string>) => {
    const u = new URLSearchParams();
    Object.entries({ ...sp, ...extra }).forEach(([k, v]) => {
      if (v) u.set(k, String(v));
    });
    return "/shop?" + u.toString();
  };

  return (
    <StoreShell>
      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden md:block">
          <h2 className="font-semibold mb-3">Filters</h2>
          <div className="space-y-5 text-sm">
            <div>
              <p className="font-medium mb-2">Department</p>
              <ul className="space-y-1">
                <li><Link href="/shop" className={!sp.category ? "text-maroon-700 font-medium" : ""}>All</Link></li>
                {cats.map((c: any) => (
                  <li key={c.id}>
                    <Link href={qs({ category: c.slug })} className={sp.category === c.slug ? "text-maroon-700 font-medium" : ""}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Quality tier</p>
              <ul className="space-y-1">
                <li><Link href={qs({ tier: "1" })}>Tier 1 — Luxury / Export</Link></li>
                <li><Link href={qs({ tier: "2" })}>Tier 2 — Standard</Link></li>
                <li><Link href={qs({ tier: "3" })}>Tier 3 — Accessible</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Authenticity</p>
              <Link href={qs({ gi: "1" })} className="flex items-center gap-2">
                <span className="w-3 h-3 border border-maroon-700 rounded-sm bg-maroon-700" /> GI tagged
              </Link>
            </div>
            <div>
              <p className="font-medium mb-2">State</p>
              <ul className="space-y-1 max-h-56 overflow-auto">
                {states.map((s: any) => (
                  <li key={s.id}>
                    <Link href={qs({ state: s.slug })}>{s.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-maroon-500">INDIVA store</p>
              <h1 className="font-display text-3xl">{title}</h1>
              <p className="text-sm text-maroon-600">{products.length} results</p>
            </div>
            <div className="flex gap-2 text-sm">
              {[
                ["featured", "Featured"],
                ["price_asc", "Price: Low"],
                ["price_desc", "Price: High"],
                ["rating", "Rating"],
              ].map(([k, l]) => (
                <Link key={k} href={qs({ sort: k })} className={`px-3 py-1 rounded-full border ${sort === k ? "bg-maroon-700 text-white border-maroon-700" : "border-maroon-200"}`}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
          {products.length === 0 ? (
            <p className="py-20 text-center text-maroon-600">No products match those filters.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p: any) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </StoreShell>
  );
}
