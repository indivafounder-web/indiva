import StoreShell from "@/components/StoreShell";
import { bySlug, FEATURES } from "@/lib/features";
import { notFound } from "next/navigation";
import Link from "next/link";
import Module from "./Module";

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export default function Discover({ params }: { params: { slug: string } }) {
  const f = bySlug(params.slug);
  if (!f) notFound();
  return (
    <StoreShell>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-xs uppercase tracking-widest text-[#c45500]">{f.pillar} · Feature {f.n} / 100</p>
        <h1 className="text-3xl font-semibold mt-1">{f.title}</h1>
        <p className="text-gray-600 mt-2">{f.blurb}</p>
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <Module feature={f} />
        </div>
        <p className="mt-6 text-sm">
          <Link href="/features" className="text-[#0066c0]">← All 100 features</Link>
        </p>
      </div>
    </StoreShell>
  );
}
