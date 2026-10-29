"use client";
import type { Feature } from "@/lib/features";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/components/Experience";

export default function Module({ feature }: { feature: Feature }) {
  const [v, setV] = useState("");
  const [ok, setOk] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOk("Recorded in the INDIVA ledger. A coordinator will follow up.");
    toast("Saved · " + feature.title);
  }

  if (feature.widget === "search") {
    return (
      <form action="/shop" className="flex gap-2">
        <input name="q" placeholder="Try ‘kolhapuri’, ‘madhubani’, ‘GI silk’…" className="flex-1 border rounded px-3 py-2" />
        <button className="px-5 rounded-full bg-[#ffd814] font-medium">Search</button>
      </form>
    );
  }
  if (feature.widget === "map") {
    return (
      <p className="text-sm">
        Open the <Link className="text-[#0066c0]" href="/map">29-state cultural atlas</Link> to shop by region.
      </p>
    );
  }
  if (feature.widget === "video") {
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        {["Kanchipuram pit loom", "Bhuj bandhani knots", "Kolhapur leather last", "Madhubani natural dye"].map((t) => (
          <div key={t} className="aspect-video bg-gray-900 text-white rounded flex items-center justify-center text-sm">{t} · Live</div>
        ))}
      </div>
    );
  }
  if (feature.widget === "ar") {
    return (
      <div className="text-center">
        <div className="aspect-[4/3] bg-gradient-to-br from-cream-200 to-maroon-200 rounded-lg flex items-center justify-center">
          <p className="max-w-sm">Point your camera at the floor. Pottery, rugs and temple jewelry scale to your room. Open <Link href="/ar" className="underline">AR studio</Link>.</p>
        </div>
      </div>
    );
  }
  if (feature.widget === "dash") {
    return (
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Live", "On"], ["Coverage", "29 states"], ["Artisans", "10,000+"], ["Export desks", "12"]].map(([k, val]) => (
          <div key={k} className="border rounded p-3">
            <dt className="text-xs text-gray-500">{k}</dt>
            <dd className="text-xl font-semibold">{val}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (feature.widget === "track") {
    return (
      <ol className="grid grid-cols-4 gap-2 text-center text-xs uppercase">
        {["Logged", "Verified", "In motion", "Complete"].map((s, i) => (
          <li key={s} className={`py-2 rounded ${i < 3 ? "bg-[#232f3e] text-[#febd69]" : "bg-gray-100"}`}>{s}</li>
        ))}
      </ol>
    );
  }
  if (feature.widget === "chat") {
    return (
      <div>
        <p className="text-sm mb-3">Use the gold concierge button, or leave a brief:</p>
        <form onSubmit={submit} className="flex gap-2">
          <input value={v} onChange={(e) => setV(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="How can INDIVA help?" />
          <button className="px-4 bg-[#ffd814] rounded-full">Send</button>
        </form>
        {ok ? <p className="text-green-700 text-sm mt-2">{ok}</p> : null}
      </div>
    );
  }
  if (feature.widget === "shop") {
    return (
      <p className="text-sm">
        Continue in the store: <Link href="/shop" className="text-[#0066c0]">Browse catalogue</Link>
      </p>
    );
  }
  if (feature.widget === "doc") {
    return (
      <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
        <li>Document pack generated for {feature.title}.</li>
        <li>Aligned with IEC, EPCH, APEDA and EU Green Deal notes in the export desk.</li>
        <li>Available to Super Admin under Analytics and to partners on request.</li>
      </ul>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-3 max-w-md">
      <label className="text-sm block">Your note
        <textarea value={v} onChange={(e) => setV(e.target.value)} className="mt-1 w-full border rounded px-3 py-2 h-24" />
      </label>
      <button className="px-5 py-2 rounded-full bg-[#ffd814] font-medium">Submit to INDIVA</button>
      {ok ? <p className="text-green-700 text-sm">{ok}</p> : null}
    </form>
  );
}
