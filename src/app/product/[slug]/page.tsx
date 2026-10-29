import StoreShell from "@/components/StoreShell";
import ProductCard from "@/components/ProductCard";
import { one, q } from "@/lib/db";
import { inr, usd, parseJson, plain } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import BuyBox from "./BuyBox";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await one<any>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
            s.name AS state_name, s.slug AS state_slug,
            a.id AS artisan_id, a.name AS artisan_name, a.village, a.craft, a.photo AS artisan_photo, a.bio, a.gi_certified, a.women_led, a.shg_name
     FROM products p
     LEFT JOIN categories c ON c.id=p.category_id
     LEFT JOIN states s ON s.id=p.state_id
     LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.slug=?`,
    [params.slug]
  );
  if (!p) notFound();
  const reviews = await q<any>("SELECT * FROM reviews WHERE product_id=? ORDER BY id DESC", [p.id]);
  const related = await q<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name FROM products p
     LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.status='active' AND p.category_id=? AND p.id!=? LIMIT 4`,
    [p.category_id, p.id]
  );
  const images = parseJson<string[]>(p.images, [p.image]);
  const off = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;

  return (
    <StoreShell>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-xs text-maroon-500 mb-4">
          <Link href="/">INDIVA</Link> › <Link href={`/shop?category=${p.category_slug}`}>{p.category_name}</Link> › {p.state_name}
        </p>
        <div className="grid lg:grid-cols-[1.1fr_1fr_280px] gap-8">
          <div>
            <div className="bg-white rounded-2xl border border-maroon-100 overflow-hidden aspect-square">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((src, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-maroon-100">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div>
            {p.gi_tagged ? <span className="text-[11px] uppercase tracking-wider bg-maroon-700 text-gold-200 px-2 py-1 rounded">GI · {p.gi_name}</span> : null}
            <h1 className="font-display text-3xl mt-2">{p.name}</h1>
            <p className="text-sm text-maroon-600 mt-1">
              by <Link href={`/artisan/${p.artisan_id}`} className="underline">{p.artisan_name}</Link> · {p.village}, {p.state_name}
            </p>
            <p className="stars mt-2 text-lg">
              {"★".repeat(Math.round(p.rating))}{"☆".repeat(5 - Math.round(p.rating))}
              <span className="text-sm text-maroon-600 ml-2">{p.rating} · {p.reviews_count} ratings · {p.sold} sold</span>
            </p>
            <div className="gold-line my-4" />
            <div className="flex items-end gap-3">
              {off ? <span className="text-2xl text-red-700">-{off}%</span> : null}
              <span className="text-3xl font-semibold">{inr(p.price)}</span>
              {p.mrp > p.price ? <span className="line-through text-maroon-400">M.R.P. {inr(p.mrp)}</span> : null}
            </div>
            <p className="text-sm text-maroon-600 mt-1">Inclusive of taxes · Export price {usd(p.export_price)} · HS {p.hs_code}</p>
            <p className="mt-4 leading-relaxed text-maroon-800">{p.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[
                ["SKU", p.sku],
                ["Material", p.material],
                ["Origin", p.origin_village],
                ["Process", p.making_process],
                ["Care", p.care],
                ["Packaging", p.eco_impact],
                ["Warehouse", p.warehouse],
                ["Quality tier", `Tier ${p.quality_tier}`],
              ].map(([k, v]) => (
                <div key={k} className="bg-cream-200/60 rounded-lg px-3 py-2">
                  <dt className="text-[11px] uppercase tracking-wider text-maroon-500">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 p-4 rounded-2xl bg-cream-200 border border-maroon-100">
              <p className="text-xs uppercase tracking-widest text-maroon-500">Product passport</p>
              <p className="font-display text-xl mt-1">The story behind this piece</p>
              <p className="mt-2 text-sm leading-relaxed">{p.story}</p>
              <Link href={`/passport/${p.sku}`} className="inline-block mt-3 text-sm text-maroon-700 underline">
                Open full digital passport (QR)
              </Link>
            </div>
          </div>
          <BuyBox p={plain(p)} />
        </div>

        {p.artisan_id ? (
          <Link href={`/artisan/${p.artisan_id}`} className="mt-10 flex gap-4 items-center bg-white border border-maroon-100 rounded-2xl p-5 hover:shadow-soft">
            <img src={p.artisan_photo} alt="" className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-medium">{p.artisan_name} {p.women_led ? "· Women-led SHG" : ""} {p.gi_certified ? "· GI certified" : ""}</p>
              <p className="text-sm text-maroon-600">{p.craft} · {p.shg_name}</p>
              <p className="text-sm mt-1 line-clamp-2">{p.bio}</p>
            </div>
          </Link>
        ) : null}

        <section className="mt-10">
          <h2 className="font-display text-2xl mb-4">Customer reviews</h2>
          {reviews.length === 0 ? <p className="text-maroon-600 text-sm">No reviews yet.</p> : (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((r: any) => (
                <article key={r.id} className="bg-white border border-maroon-100 rounded-xl p-4">
                  <p className="stars text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                  <h3 className="font-medium mt-1">{r.title}</h3>
                  <p className="text-sm mt-1 text-maroon-800">{r.body}</p>
                  <p className="text-xs text-maroon-500 mt-2">{r.author}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl mb-4">Frequently bought together</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((r: any) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      </div>
    </StoreShell>
  );
}
