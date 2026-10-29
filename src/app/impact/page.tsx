import StoreShell from "@/components/StoreShell";

export default function Impact() {
  return (
    <StoreShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-xs uppercase tracking-widest text-[#c45500]">Features 20 · 64 · 91 · 97</p>
        <h1 className="text-3xl font-semibold">Impact, carbon & ESG</h1>
        <p className="text-gray-600 mt-2">Every order publishes its footprint. Investors and buyers see the same ledger.</p>
        <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            ["Families supported", "10,000+"],
            ["Avg. artisan share", "75%"],
            ["Plastic in packs", "0 g"],
            ["Trees pledged / parcel", "1"],
            ["Women-led SHGs", "64%"],
            ["GI SKUs", "18"],
            ["Export corridors", "12 countries"],
            ["Child-labour incidents", "0"],
          ].map(([k, v]) => (
            <div key={k} className="bg-white border rounded p-4">
              <dt className="text-xs text-gray-500">{k}</dt>
              <dd className="text-2xl font-semibold mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </StoreShell>
  );
}
