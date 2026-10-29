import Link from "next/link";
import StoreShell from "@/components/StoreShell";
import ProductCard from "@/components/ProductCard";
import { q } from "@/lib/db";
import { ShieldCheck, Leaf, Globe2, QrCode, Sparkles } from "lucide-react";
import { RecentlyViewed, DealClock } from "@/components/Experience";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await q<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name
     FROM products p LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.status='active' AND p.featured=1 LIMIT 8`
  );
  const best = await q<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name
     FROM products p LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.status='active' ORDER BY p.sold DESC LIMIT 8`
  );
  const deals = await q<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name
     FROM products p LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.status='active' AND p.mrp > p.price ORDER BY (1.0 * p.price / p.mrp) ASC LIMIT 6`
  );
  const cats = await q<any>("SELECT * FROM categories");
  const states = await q<any>("SELECT * FROM states ORDER BY featured DESC, name LIMIT 12");
  const artisans = await q<any>("SELECT * FROM artisans ORDER BY id LIMIT 6");

  return (
    <StoreShell>
      <section className="relative min-h-[82vh] flex items-center overflow-hidden">
        <img src="/brand/hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover kenburns" />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/85 via-maroon-900/55 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-cream-50">
          <p className="uppercase tracking-[0.35em] text-gold-200 text-xs mb-4 animate-fade-up">Essence of Every State</p>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight max-w-xl animate-fade-up delay-1">
            Discover India&apos;s<br />
            <span className="italic text-gold-200">Finest Crafts</span>
          </h1>
          <p className="mt-5 max-w-lg text-cream-100/90 text-lg animate-fade-up delay-2">
            Authentic handcrafts, wellness, décor and foods from all 29 states. Each piece carries a story — and a QR passport of the artisan who made it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up delay-3">
            <Link href="/shop" className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-gold-400 text-maroon-900 font-semibold btn-pulse">
              Shop Now →
            </Link>
            <Link href="/states" className="px-6 py-3 rounded-full bg-white/15 backdrop-blur border border-white/30">
              Explore States
            </Link>
          </div>
          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              ["29", "States covered"],
              ["500+", "Products"],
              ["10,000+", "Artisans"],
              ["70–80%", "To the maker"],
            ].map(([n, l], i) => (
              <div key={l} className={`animate-fade-up delay-${i + 1}`}>
                <dt className="font-display text-3xl text-gold-200">{n}</dt>
                <dd className="text-sm text-cream-200">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="bg-maroon-900 text-gold-200 overflow-hidden py-3">
        <div className="marquee-track gap-12 text-sm tracking-wide">
          {[0, 1].flatMap((k) =>
            ["Kanjivaram · Tamil Nadu", "Pashmina · Kashmir", "Bandhani · Gujarat", "Kolhapuri · Maharashtra", "Madhubani · Bihar", "Blue pottery · Jaipur", "Muga silk · Assam", "Saffron · Pampore"].map((t) => (
              <span key={k + t} className="px-4">{t}</span>
            ))
          )}
        </div>
      </div>

      <section className="max-w-[1500px] mx-auto px-4 -mt-10 relative z-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
        {[
          ["/map", "/brand/month-gujarat.jpg", "Shop by 29 states", "Open the cultural atlas"],
          ["/shop?gi=1", "/brand/cat-fashion.jpg", "GI tagged originals", "Passports on every SKU"],
          ["/hampers", "/brand/cat-gourmet.jpg", "Festive hampers", "Build a gift in minutes"],
          ["/live", "/brand/artisan.jpg", "Live from the loom", "Watch makers at work"],
        ].map(([h, img, t, d]) => (
          <Link key={t} href={h} className="bg-white p-4 shadow-soft hover:shadow-lift">
            <h3 className="font-semibold text-lg mb-2">{t}</h3>
            <img src={img} alt="" className="w-full h-36 object-cover" />
            <p className="text-sm text-[#007185] mt-2">{d}</p>
          </Link>
        ))}
      </section>

      <section className="bg-white border-y border-maroon-100">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          {[
            [ShieldCheck, "INDIVA Authentic", "GI tags & digital passports"],
            [Leaf, "Plastic-free", "Bamboo & seed-paper packs"],
            [Globe2, "Export ready", "US · UK · UAE · EU · JP"],
            [QrCode, "Artisan QR story", "Origin village on every SKU"],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="flex items-start gap-3">
              <Icon className="text-maroon-700 mt-0.5" size={22} />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-maroon-500">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-maroon-500">Departments</p>
            <h2 className="font-display text-3xl">
              Shop by <span className="italic text-gold-600">Category</span>
            </h2>
          </div>
          <Link href="/shop" className="text-sm text-maroon-700">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cats.map((c: any) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-cream-300">
              <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-cream-50">
                <p className="font-display text-lg leading-tight">{c.name}</p>
                <p className="text-[11px] text-gold-200 mt-1 line-clamp-2">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="grid md:grid-cols-2 gap-6 rounded-3xl overflow-hidden bg-maroon-800 text-cream-50">
          <img src="/brand/month-gujarat.jpg" alt="Gujarat" className="h-72 md:h-full w-full object-cover" />
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <p className="uppercase tracking-[0.3em] text-gold-200 text-xs">This month</p>
            <h2 className="font-display text-4xl mt-2">Gujarat</h2>
            <p className="font-script italic text-xl text-gold-200">The Land of Threads & Thalis</p>
            <p className="mt-4 text-cream-200/90">
              Bandhani, Patola, agate and the language of celebration. Meet Parvati Ben of Bhuj — 4,000 knots in a single odhani.
            </p>
            <Link href="/states/gujarat" className="mt-6 inline-flex self-start px-5 py-2.5 rounded-full bg-gold-400 text-maroon-900 font-semibold">
              Shop Gujarat
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex items-end justify-between mb-6 gap-3 flex-wrap">
          <h2 className="font-display text-3xl">Lightning <span className="italic text-gold-600">deals</span></h2>
          <p className="text-sm text-maroon-700">Ends in <DealClock /> · <Link href="/shop?sort=price_asc">See more →</Link></p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {deals.map((p: any) => (
            <ProductCard key={p.id} p={p} compact />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl">Featured <span className="italic text-gold-600">heirlooms</span></h2>
          <Link href="/shop?featured=1" className="text-sm text-maroon-700">See all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p: any) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-maroon-500">29 states · one roof</p>
            <h2 className="font-display text-3xl">Shop by <span className="italic text-gold-600">State</span></h2>
          </div>
          <Link href="/states" className="text-sm text-maroon-700">All states →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {states.map((s: any) => (
            <Link key={s.id} href={`/states/${s.slug}`} className="rounded-xl overflow-hidden bg-white border border-maroon-100 hover:shadow-soft">
              <div className="h-24 overflow-hidden">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-[11px] text-maroon-500 line-clamp-1">{s.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="grid lg:grid-cols-2 gap-8 items-center bg-white border border-maroon-100 rounded-3xl p-6 md:p-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-maroon-500">Concept store</p>
            <h2 className="font-display text-3xl mt-1">Walk the floor plan</h2>
            <p className="mt-3 text-maroon-700 leading-relaxed">
              INDIVA stores are open-hall concept spaces — museum meets marketplace. Maroon and beige, region-wise shelves, live weaving corners, and a QR passport on every object.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {[
                ["Artisan Jewelry", "/shop?category=lifestyle"],
                ["Signature Spices", "/shop?category=gourmet"],
                ["Food & Gourmet", "/shop?category=gourmet"],
                ["Wellness & Beauty", "/shop?category=wellness"],
                ["Fashion & Textiles", "/shop?category=fashion"],
                ["Accessories & Lifestyle", "/shop?category=lifestyle"],
              ].map(([n, h]) => (
                <Link key={n} href={h} className="border border-maroon-200 rounded-lg px-3 py-2 hover:bg-cream-200">
                  {n}
                </Link>
              ))}
            </div>
          </div>
          <FloorPlan />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl">Bestsellers</h2>
          <Link href="/shop?sort=rating" className="text-sm text-maroon-700">See more →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {best.map((p: any) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-center">
          <img src="/brand/artisan.jpg" alt="Artisan" className="rounded-3xl h-80 w-full object-cover" />
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-maroon-500">Direct from the loom</p>
            <h2 className="font-display text-3xl mt-1">No middlemen. 70–80% to the maker.</h2>
            <p className="mt-4 text-maroon-700 leading-relaxed">
              We onboard artisans through transparent agreements, GI tagging and quality tiers — luxury for the world, fair price at home. Every maker is paid fairly, with savings and a safety line so no craftsperson is left alone.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/about" className="px-5 py-2.5 rounded-full bg-maroon-700 text-cream-50">Our story</Link>
              <Link href="/impact" className="px-5 py-2.5 rounded-full border border-maroon-300">Sustainability</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {artisans.map((a: any) => (
            <Link key={a.id} href={`/artisan/${a.id}`} className="bg-white border border-maroon-100 rounded-xl overflow-hidden hover:shadow-soft">
              <img src={a.photo} alt={a.name} className="h-28 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-[11px] text-maroon-500">{a.craft}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <RecentlyViewed />

      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="rounded-3xl bg-gradient-to-r from-maroon-800 to-maroon-600 text-cream-50 p-8 md:p-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold-200">INDIVA Atelier</p>
            <h2 className="font-display text-3xl mt-1">Beyond Prime. Belong to the house.</h2>
            <p className="mt-2 text-cream-100/90 max-w-xl">Free festival shipping, early access to state-of-the-month, and artisan stories a week before the floor. Inclusive of every order over ₹2,999.</p>
          </div>
          <Link href="/register" className="px-6 py-3 rounded-full bg-gold-400 text-maroon-900 font-semibold">Join Atelier</Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-3xl overflow-hidden relative min-h-[280px] flex items-center">
          <img src="/brand/store.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-maroon-900/60" />
          <div className="relative p-10 text-cream-50 max-w-xl">
            <Sparkles className="text-gold-200 mb-3" />
            <h2 className="font-display text-3xl">Install the INDIVA app</h2>
            <p className="mt-2 text-cream-100/90">
              Add to your home screen for an Amazon-smooth shop — shop by state, scan passports, track orders, and save artisans.
            </p>
            <p className="mt-4 text-sm text-gold-200">Works on iPhone, Android and desktop. Look for “Add to Home Screen”.</p>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}

function FloorPlan() {
  const rooms = [
    { n: "Artisan Jewelry", c: "col-span-2" },
    { n: "Signature Spices", c: "" },
    { n: "Food & Gourmet", c: "" },
    { n: "Wellness & Beauty", c: "" },
    { n: "Fashion & Textiles", c: "" },
    { n: "Entrance Lobby", c: "row-span-1" },
    { n: "Accessories & Lifestyle", c: "" },
  ];
  return (
    <div className="border-2 border-maroon-800 rounded-2xl p-4 bg-cream-100">
      <p className="font-display text-center text-2xl tracking-[0.3em] text-maroon-800 mb-3">INDIVA</p>
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs font-medium text-maroon-800">
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Artisan Jewelry</div>
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Artisan Jewelry</div>
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Signature Spices</div>
        <div className="border border-maroon-700 rounded-md p-6 bg-white">Food & Gourmet</div>
        <div className="border border-maroon-700 rounded-md p-6 bg-cream-200 font-display tracking-widest">LOBBY</div>
        <div className="border border-maroon-700 rounded-md p-6 bg-white">Wellness & Beauty</div>
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Fashion</div>
        <div className="border-2 border-maroon-800 rounded-md p-4 bg-maroon-700 text-cream-50">Entrance</div>
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Lifestyle</div>
      </div>
    </div>
  );
}
