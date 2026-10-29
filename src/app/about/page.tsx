import StoreShell from "@/components/StoreShell";
import Link from "next/link";

export default function About() {
  return (
    <StoreShell>
      <div className="relative h-72">
        <img src="/brand/store.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-maroon-900/60" />
        <div className="relative max-w-4xl mx-auto px-6 h-full flex flex-col justify-end pb-10 text-cream-50">
          <p className="uppercase tracking-[0.3em] text-gold-200 text-xs">The movement</p>
          <h1 className="font-display text-5xl">INDIVA</h1>
          <p className="font-script italic text-2xl">One India. One Store. One Experience.</p>
        </div>
      </div>
      <article className="max-w-3xl mx-auto px-6 py-12 leading-relaxed text-maroon-900 space-y-6">
        <p>INDIVA is not just a retail brand — it is a movement toward unifying India&apos;s diverse craftsmanship under one experiential roof. We curate premium heritage products from all 29 Indian states and transform them into a luxury lifestyle showcase.</p>
        <p>Foreign houses have sold Kolhapuri chappals without naming Kolhapur. A shopper in Tamil Nadu still struggles to find a genuine Pashmina without a middleman. INDIVA exists so the original makers are visible, paid, and GI-protected.</p>
        <h2 className="font-display text-2xl">Three values</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Authenticity</b> — GI tags, digital passports, no power-loom copies.</li>
          <li><b>Empowerment</b> — 70–80% of every sale returns to the artisan. Women SHGs first.</li>
          <li><b>Experience</b> — museum-meets-marketplace stores, AR/QR, and this app.</li>
        </ul>
        <h2 className="font-display text-2xl">How we procure</h2>
        <p>Regional curation teams visit clusters. Artisans are onboarded with transparent agreements. Goods move to Mumbai/Delhi hubs, graded into three quality tiers — luxury/export, standard, and accessible — so nothing is wasted.</p>
        <h2 className="font-display text-2xl">The apps</h2>
        <p>Customers shop like Amazon. Every piece carries the artisan’s story, GI tag where it applies, and a fair split that keeps 70–80% with the maker. We ship plastic-free from 29 states to your door.</p>
        <div className="flex gap-3">
          <Link href="/shop" className="px-5 py-2.5 rounded-full bg-maroon-700 text-cream-50">Shop the house</Link>
          <Link href="/seller" className="px-5 py-2.5 rounded-full border border-maroon-300">Become a seller</Link>
        </div>
      </article>
    </StoreShell>
  );
}
