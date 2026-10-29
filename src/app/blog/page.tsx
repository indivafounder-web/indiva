import StoreShell from "@/components/StoreShell";
import Link from "next/link";

const POSTS = [
  { t: "Why a Kolhapuri is not a luxury-house sandal", d: "The last, the stitch, the GI — and the people Prada did not name." },
  { t: "How bandhani is tied", d: "Four thousand knots in Bhuj, opened like a night sky." },
  { t: "First flush, not dust", d: "Darjeeling lots you can QR to the garden." },
  { t: "The pit loom of Kanchi", d: "Twenty-two days, real zari, one family." },
];

export default function Blog() {
  return (
    <StoreShell>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-xs uppercase tracking-widest text-[#c45500]">Features 17 · 99</p>
        <h1 className="text-3xl font-semibold">Heritage journal</h1>
        <div className="mt-6 space-y-4">
          {POSTS.map((p) => (
            <article key={p.t} className="bg-white border rounded p-5">
              <h2 className="text-xl font-semibold">{p.t}</h2>
              <p className="text-gray-600 mt-1">{p.d}</p>
              <Link href="/shop" className="text-sm text-[#0066c0] mt-2 inline-block">Shop the craft →</Link>
            </article>
          ))}
        </div>
      </div>
    </StoreShell>
  );
}
