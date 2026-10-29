import StoreShell from "@/components/StoreShell";
import Link from "next/link";

export default function Atelier() {
  return (
    <StoreShell>
      <div className="bg-gradient-to-r from-[#131921] to-maroon-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[#febd69]">Features 18 · 19</p>
          <h1 className="text-4xl font-semibold mt-2">INDIVA Atelier</h1>
          <p className="mt-3 text-gray-200 max-w-xl">Not a coupon club. Early festival drops, free festive shipping, and artisan stories a week before the floor. Unlocks on orders over ₹2,999.</p>
          <Link href="/register" className="inline-block mt-6 px-6 py-2 rounded-full bg-[#ffd814] text-ink font-medium">Join Atelier</Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-4">
        {[
          ["Cultural tokens", "Earn on every GI purchase"],
          ["Member previews", "State-of-the-month 7 days early"],
          ["Festival shipping", "Free on Atelier weeks"],
        ].map(([t, d]) => (
          <div key={t} className="bg-white border rounded p-4">
            <h3 className="font-semibold">{t}</h3>
            <p className="text-sm text-gray-600 mt-1">{d}</p>
          </div>
        ))}
      </div>
    </StoreShell>
  );
}
