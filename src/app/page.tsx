import Link from "next/link";
import StoreShell from "@/components/StoreShell";
import ProductCard from "@/components/ProductCard";
import { q } from "@/lib/db";
import { ShieldCheck, Leaf, Globe2, QrCode, Sparkles } from "lucide-react";
import { RecentlyViewed, DealClock } from "@/components/Experience";
import Reveal from "@/components/Reveal";
import { Corner, Filigree, Lotus } from "@/components/Ornament";

export const dynamic = "force-dynamic";

function plain<T>(rows: T[]): T[] {
  return JSON.parse(JSON.stringify(rows || []));
}

export default async function Home() {
  const featured = plain(await q<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name
     FROM products p LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.status='active' AND p.featured=1 LIMIT 8`
  ));
  const best = plain(await q<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name
     FROM products p LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.status='active' ORDER BY p.sold DESC LIMIT 8`
  ));
  const deals = plain(await q<any>(
    `SELECT p.*, s.name AS state_name, a.name AS artisan_name
     FROM products p LEFT JOIN states s ON s.id=p.state_id LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE p.status='active' AND p.mrp > p.price ORDER BY (1.0 * p.price / p.mrp) ASC LIMIT 6`
  ));
  const cats = plain(await q<any>("SELECT * FROM categories"));
  const states = plain(await q<any>("SELECT * FROM states ORDER BY featured DESC, name LIMIT 12"));
  const artisans = plain(await q<any>("SELECT * FROM artisans ORDER BY id LIMIT 6"));

  const film = [
    "/brand/cat-fashion.jpg",
    "/brand/cat-decor.jpg",
    "/brand/cat-gourmet.jpg",
    "/brand/cat-wellness.jpg",
    "/brand/cat-jewelry.jpg",
    "/brand/artisan.jpg",
    "/brand/month-gujarat.jpg",
    "/brand/store.jpg",
  ];

  return (
    <StoreShell>
      <section className="relative min-h-[92vh] flex items-center overflow-hidden film-grain vignette">
        <img src="/brand/hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover kenburns" />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/90 via-maroon-900/55 to-maroon-900/10" />
        <Filigree className="absolute right-[-8%] top-[-10%] w-[520px] opacity-30 spin-slow hidden md:block" />
        <Corner className="absolute top-8 left-8 w-16 opacity-80 hidden sm:block" />
        <Corner className="absolute top-8 right-8 w-16 opacity-80 hidden sm:block" flip />
        <div className="dust absolute inset-0 pointer-events-none hidden md:block">
          <span /><span /><span /><span /><span />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-cream-50">
          <p className="uppercase tracking-[0.4em] text-gold-200 text-xs mb-5 animate-fade-up">Essence of Every State</p>
          <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] max-w-2xl animate-fade-up delay-1">
            Discover India&apos;s<br />
            <span className="italic text-gold-200">Finest Crafts</span>
          </h1>
          <p className="mt-3 font-script italic text-2xl text-gold-100/90 animate-fade-up delay-2">
            One country. One store. One experience.
          </p>
          <p className="mt-5 max-w-lg text-cream-100/90 text-lg animate-fade-up delay-2">
            Handcrafts, wellness, décor and foods from all 29 states. Each piece carries a story — and a QR passport of the artisan who made it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 animate-fade-up delay-3">
            <Link href="/shop" className="px-7 py-3.5 rounded-full bg-gold-400 text-maroon-900 font-semibold btn-pulse">
              Enter the house →
            </Link>
            <Link href="/map" className="px-7 py-3.5 rounded-full bg-white/10 backdrop-blur border border-gold-200/50 hover:bg-white/20">
              Shop by state
            </Link>
          </div>
          <dl className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              ["29", "States"],
              ["500+", "Heirlooms"],
              ["10,000+", "Artisans"],
              ["70–80%", "To the maker"],
            ].map(([n, l], i) => (
              <div key={l} className={`animate-fade-up delay-${i + 1} border-l border-gold-400/40 pl-4`}>
                <dt className="font-display text-4xl text-gold-200">{n}</dt>
                <dd className="text-sm text-cream-200 mt-1 tracking-wide">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="bg-maroon-900 overflow-hidden py-4 border-y border-gold-400/20">
        <div className="marquee-track gap-0">
          {[0, 1].flatMap((k) =>
            film.map((src, i) => (
              <div key={k + src} className="w-40 h-24 mx-1.5 overflow-hidden rounded-lg opacity-90">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-maroon-800 text-gold-200 overflow-hidden py-3">
        <div className="marquee-track gap-12 text-sm tracking-[0.22em] uppercase">
          {[0, 1].flatMap((k) =>
            ["Kanjivaram · Tamil Nadu", "Pashmina · Kashmir", "Bandhani · Gujarat", "Kolhapuri · Maharashtra", "Madhubani · Bihar", "Blue pottery · Jaipur", "Muga silk · Assam", "Saffron · Pampore"].map((t) => (
              <span key={k + t} className="px-4">{t}</span>
            ))
          )}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            {[
              [ShieldCheck, "INDIVA Authentic", "GI tags & digital passports"],
              [Leaf, "Plastic-free", "Bamboo & seed-paper packs"],
              [Globe2, "Ships the world", "US · UK · UAE · EU · JP"],
              [QrCode, "Artisan QR story", "Origin village on every SKU"],
            ].map(([Icon, t, d]: any, i) => (
              <div key={t} className="flex items-start gap-3">
                <Icon className="text-gold-600 mt-0.5 float-y" size={22} style={{ animationDelay: `${i * 0.4}s` }} />
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-maroon-500">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <Reveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold-600">Walk the house</p>
              <h2 className="font-display text-4xl mt-1">
                Shop by <span className="italic text-gold-600">atelier</span>
              </h2>
            </div>
            <Link href="/shop" className="text-sm text-maroon-700">The full floor →</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cats.map((c: any, i: number) => (
            <Reveal key={c.id} delay={i * 70}>
              <Link href={`/shop?category=${c.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-cream-300 img-zoom gold-frame block">
                <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/85 via-maroon-900/10 to-transparent" />
                <div className="absolute bottom-4 left-3 right-3 text-cream-50">
                  <p className="font-display text-xl leading-tight">{c.name}</p>
                  <p className="text-[11px] text-gold-200 mt-1 line-clamp-2">{c.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-0 pb-16">
        <Reveal>
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden gold-frame">
            <div className="relative min-h-[360px] img-zoom">
              <img src="/brand/month-gujarat.jpg" alt="Gujarat" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-10 md:p-14 flex flex-col justify-center bg-maroon-800 text-cream-50 relative">
              <Lotus className="absolute right-6 top-6 w-16 opacity-40" />
              <p className="uppercase tracking-[0.3em] text-gold-200 text-xs">This month</p>
              <h2 className="font-display text-5xl mt-2">Gujarat</h2>
              <p className="font-script italic text-2xl text-gold-200 mt-1">The Land of Threads & Thalis</p>
              <p className="mt-5 text-cream-200/90 leading-relaxed">
                Bandhani, Patola, agate and the language of celebration. Meet Parvati Ben of Bhuj — 4,000 knots in a single odhani.
              </p>
              <Link href="/states/gujarat" className="mt-8 inline-flex self-start px-6 py-2.5 rounded-full bg-gold-400 text-maroon-900 font-semibold">
                Shop Gujarat
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-6 gap-3 flex-wrap">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold-600">Limited hours</p>
            <h2 className="font-display text-3xl">Today at the <span className="italic text-gold-600">house</span></h2>
          </div>
          <p className="text-sm text-maroon-700">Closes in <DealClock /> · <Link href="/shop?sort=price_asc">See more →</Link></p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {deals.map((p: any) => (
            <ProductCard key={p.id} p={p} compact />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
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

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold-600">29 states · one roof</p>
            <h2 className="font-display text-3xl">The cultural <span className="italic text-gold-600">atlas</span></h2>
          </div>
          <Link href="/states" className="text-sm text-maroon-700">All states →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {states.map((s: any, i: number) => (
            <Reveal key={s.id} delay={i * 40}>
              <Link href={`/states/${s.slug}`} className="rounded-2xl overflow-hidden bg-white border border-maroon-100 card-lift img-zoom block">
                <div className="h-28 overflow-hidden">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-[11px] text-maroon-500 line-clamp-1">{s.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-10 items-center bg-cream-100 border border-gold-200 rounded-[2rem] p-6 md:p-12 gold-frame">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold-600">Concept store</p>
              <h2 className="font-display text-4xl mt-1">Walk the floor</h2>
              <p className="mt-4 text-maroon-700 leading-relaxed">
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
                  <Link key={n} href={h} className="border border-maroon-200 rounded-lg px-3 py-2 hover:bg-gold-100 hover:border-gold-400 transition">
                    {n}
                  </Link>
                ))}
              </div>
            </div>
            <FloorPlan />
          </div>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
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

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div className="relative rounded-[2rem] overflow-hidden h-80 gold-frame img-zoom">
            <img src="/brand/artisan.jpg" alt="Artisan" className="w-full h-full object-cover" />
          </div>
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-gold-600">Direct from the loom</p>
            <h2 className="font-display text-3xl mt-1">No middlemen. 70–80% to the maker.</h2>
            <p className="mt-4 text-maroon-700 leading-relaxed">
              We onboard artisans through transparent agreements, GI tagging and quality tiers — luxury for the world, fair price at home. Every maker is paid fairly, with savings and a safety line so no craftsperson is left alone.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/about" className="px-5 py-2.5 rounded-full bg-maroon-700 text-cream-50">Our story</Link>
              <Link href="/impact" className="px-5 py-2.5 rounded-full border border-maroon-300">Sustainability</Link>
            </div>
          </Reveal>
        </div>
        <div className="mt-10 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {artisans.map((a: any) => (
            <Link key={a.id} href={`/artisan/${a.id}`} className="bg-white border border-maroon-100 rounded-2xl overflow-hidden card-lift img-zoom">
              <img src={a.photo} alt={a.name} className="h-32 w-full object-cover" />
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
        <Reveal>
          <div className="rounded-[2rem] bg-gradient-to-r from-maroon-900 via-maroon-700 to-maroon-800 text-cream-50 p-8 md:p-12 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
            <Filigree className="absolute right-0 top-0 w-56 opacity-20" />
            <div className="relative">
              <p className="text-xs tracking-[0.3em] uppercase text-gold-200">INDIVA Atelier</p>
              <h2 className="font-display text-3xl mt-1">Belong to the house</h2>
              <p className="mt-2 text-cream-100/90 max-w-xl">Free festival shipping, early access to state-of-the-month, and artisan stories a week before the floor. Inclusive of every order over ₹2,999.</p>
            </div>
            <Link href="/register" className="relative px-6 py-3 rounded-full bg-gold-400 text-maroon-900 font-semibold">Join Atelier</Link>
          </div>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-[2rem] overflow-hidden relative min-h-[300px] flex items-center film-grain">
          <img src="/brand/store.jpg" alt="" className="absolute inset-0 w-full h-full object-cover kenburns" />
          <div className="absolute inset-0 bg-maroon-900/65" />
          <div className="relative p-10 md:p-14 text-cream-50 max-w-xl">
            <Sparkles className="text-gold-200 mb-3" />
            <h2 className="font-display text-3xl">Keep INDIVA in your pocket</h2>
            <p className="mt-3 text-cream-100/90">
              Add to your home screen — shop by state, scan passports, track orders, and save the makers you love.
            </p>
            <p className="mt-4 text-sm text-gold-200">Works on iPhone, Android and desktop. Look for “Add to Home Screen”.</p>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}

function FloorPlan() {
  return (
    <div className="border-2 border-maroon-800 rounded-2xl p-5 bg-cream-50 relative">
      <Lotus className="w-10 mx-auto mb-2" gold={false} />
      <p className="font-display text-center text-2xl tracking-[0.35em] text-maroon-800 mb-4">INDIVA</p>
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs font-medium text-maroon-800">
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Artisan Jewelry</div>
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Artisan Jewelry</div>
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Signature Spices</div>
        <div className="border border-maroon-700 rounded-md p-6 bg-white">Food & Gourmet</div>
        <div className="border-2 border-gold-400 rounded-md p-6 bg-cream-200 font-display tracking-[0.2em]">LOBBY</div>
        <div className="border border-maroon-700 rounded-md p-6 bg-white">Wellness & Beauty</div>
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Fashion</div>
        <div className="border-2 border-maroon-800 rounded-md p-4 bg-maroon-700 text-cream-50">Entrance</div>
        <div className="border border-maroon-700 rounded-md p-4 bg-white">Lifestyle</div>
      </div>
    </div>
  );
}
