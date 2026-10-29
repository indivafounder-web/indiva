import Link from "next/link";
import Logo from "./Logo";
import { FEATURES } from "@/lib/features";

export default function Footer() {
  const pillars = ["Customer", "Artisan", "Export", "Intelligence"] as const;
  return (
    <footer className="mt-10 bg-[#232f3e] text-gray-200 text-sm">
      <a href="#top" className="block text-center py-3 bg-[#37475a] hover:bg-[#485769] text-white text-sm">
        Back to top
      </a>
      <div className="max-w-[1500px] mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Logo light />
          <p className="mt-3 text-[#febd69] italic">One India. One Store. One Experience.</p>
          <p className="mt-2 text-gray-400">Luxury crafts from 29 states. Direct from the maker. GI tagged. Export ready.</p>
          <div className="mt-4 flex flex-col gap-1">
            <Link href="/about">About INDIVA</Link>
            <Link href="/features">100 future-ready features</Link>
            <Link href="/impact">Impact & ESG</Link>
            <Link href="/seller">Sell on INDIVA</Link>
          </div>
        </div>
        {pillars.map((p) => (
          <div key={p}>
            <h4 className="font-bold text-white mb-3">{p}</h4>
            <ul className="space-y-1 text-gray-300">
              {FEATURES.filter((f) => f.pillar === p).slice(0, 8).map((f) => (
                <li key={f.n}><Link href={f.href} className="hover:underline">{f.title}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} INDIVA · Essence of Every State. Elegance for the World.
      </div>
    </footer>
  );
}
