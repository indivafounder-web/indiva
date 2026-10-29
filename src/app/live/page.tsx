import StoreShell from "@/components/StoreShell";

const STREAMS = [
  { t: "Meera Devi · Kanjivaram pit loom", loc: "Kanchipuram", live: true },
  { t: "Parvati Ben · Bandhani knots", loc: "Bhuj", live: true },
  { t: "Lakshmi Patil · Kolhapuri last", loc: "Kolhapur", live: false },
  { t: "Anjali Das · Madhubani dye", loc: "Mithila", live: false },
];

export default function Live() {
  return (
    <StoreShell>
      <div className="bg-[#232f3e] text-white">
        <div className="max-w-[1500px] mx-auto px-6 py-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#febd69]">Features 05 · 16</p>
          <h1 className="text-4xl font-semibold">Artisan workshop streams</h1>
        </div>
      </div>
      <div className="max-w-[1500px] mx-auto px-4 py-8 grid md:grid-cols-2 gap-4">
        {STREAMS.map((s) => (
          <article key={s.t} className="bg-black text-white rounded-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-maroon-800 to-black relative">
              {s.live ? <span className="absolute top-3 left-3 bg-red-600 text-xs px-2 py-0.5 rounded">LIVE</span> : null}
              <p className="font-display text-2xl px-6 text-center">{s.t}</p>
            </div>
            <div className="p-3 text-sm text-gray-300">{s.loc} · Story vault + live loom</div>
          </article>
        ))}
      </div>
    </StoreShell>
  );
}
