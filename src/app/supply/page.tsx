import StoreShell from "@/components/StoreShell";

export default function Supply() {
  const steps = [
    ["Cluster", "Artisan SHG, village, GI"],
    ["Curation", "Regional team, quality tier 1–3"],
    ["Hub", "Mumbai / Delhi warehouse"],
    ["Pack", "Plastic-free, QR passport"],
    ["Lane", "Domestic or export (DHL / Shiprocket)"],
    ["Door", "You — and 70–80% already with the maker"],
  ];
  return (
    <StoreShell>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-xs uppercase tracking-widest text-[#c45500]">Feature 25</p>
        <h1 className="text-3xl font-semibold">From village to door</h1>
        <ol className="mt-8 space-y-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-[#232f3e] text-[#febd69] flex items-center justify-center text-sm font-bold">{i + 1}</span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-sm text-gray-600">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </StoreShell>
  );
}
