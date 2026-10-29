import StoreShell from "@/components/StoreShell";
import Link from "next/link";

export default function AR() {
  return (
    <StoreShell>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-xs uppercase tracking-widest text-[#c45500]">Features 04 · 22</p>
        <h1 className="text-3xl font-semibold">AR heritage studio</h1>
        <p className="text-gray-600 mt-2">Place pottery on your floor. Drape a shawl. Try temple jewelry. Camera permission stays on your device.</p>
        <div className="mt-6 aspect-video rounded-xl bg-gradient-to-br from-[#131921] to-maroon-700 text-white flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-8 border border-white/20 rounded-lg" />
          <p className="relative text-center px-6">Point your phone at a room. Choose a SKU from Fashion, Décor or Jewelry to preview at true scale.</p>
        </div>
        <div className="mt-4 flex gap-3">
          <Link href="/shop?category=decor" className="px-5 py-2 rounded-full bg-[#ffd814] font-medium">Preview décor</Link>
          <Link href="/shop?category=lifestyle" className="px-5 py-2 rounded-full border">Preview jewelry</Link>
        </div>
      </div>
    </StoreShell>
  );
}
