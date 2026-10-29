"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, MapPin, ChevronDown, Menu, X, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

const DEPTS = [
  { href: "/shop", label: "All" },
  { href: "/shop?category=fashion", label: "Fashion" },
  { href: "/shop?category=decor", label: "Home & Décor" },
  { href: "/shop?category=gourmet", label: "Gourmet" },
  { href: "/shop?category=wellness", label: "Wellness" },
  { href: "/shop?category=lifestyle", label: "Jewelry" },
  { href: "/map", label: "29 States" },
  { href: "/shop?gi=1", label: "GI Tagged" },
  { href: "/hampers", label: "Hampers" },
  { href: "/live", label: "Live workshops" },
  { href: "/export", label: "Export" },
  { href: "/b2b", label: "B2B" },
  { href: "/atelier", label: "Atelier" },
  { href: "/features", label: "All 100 features" },
];

export default function Header({
  user,
  cartCount = 0,
}: {
  user: { name: string; role: string } | null;
  cartCount?: number;
}) {
  const [q, setQ] = useState("");
  const [sug, setSug] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dept, setDept] = useState("All");
  const box = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!q.trim()) {
      setSug([]);
      return;
    }
    const t = setTimeout(async () => {
      const r = await fetch("/api/search?q=" + encodeURIComponent(q));
      const d = await r.json();
      setSug(d.products || []);
      setOpen(true);
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", on);
    return () => window.removeEventListener("click", on);
  }, []);

  function listen() {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      router.push("/discover/voice-search");
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setQ(text);
      router.push("/shop?q=" + encodeURIComponent(text));
    };
    rec.start();
  }

  return (
    <header className="sticky top-0 z-50 text-white">
      <div className="bg-[#131921]">
        <div className="max-w-[1500px] mx-auto px-2 h-[60px] flex items-center gap-2">
          <button className="md:hidden p-2" onClick={() => setMenu(true)} aria-label="Open menu">
            <Menu />
          </button>
          <Link href="/" className="px-2 py-1 border border-transparent hover:border-white rounded-sm shrink-0">
            <Logo light size={26} />
          </Link>
          <Link href="/map" className="hidden lg:flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm min-w-[140px]">
            <MapPin size={16} />
            <span className="leading-tight">
              <span className="block text-[11px] text-gray-300">Deliver to</span>
              <span className="text-sm font-bold">India · 29 states</span>
            </span>
          </Link>
          <form
            ref={box}
            className="relative flex-1 min-w-0"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              router.push("/shop?q=" + encodeURIComponent(q));
            }}
          >
            <div className="flex h-10 rounded overflow-hidden">
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="hidden sm:block bg-[#e6e6e6] text-ink text-xs px-2 border-r border-gray-400"
              >
                {DEPTS.slice(0, 8).map((d) => (
                  <option key={d.label}>{d.label}</option>
                ))}
              </select>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search INDIVA — kanjivaram, pashmina, GI crafts, artisans"
                className="flex-1 px-3 text-ink text-sm"
              />
              <button type="button" onClick={listen} className="px-2 bg-white text-maroon-800" aria-label="Voice search">
                <Mic size={16} />
              </button>
              <button className="px-3 bg-[#febd69] text-ink" aria-label="Search">
                <Search size={20} />
              </button>
            </div>
            {open && sug.length > 0 ? (
              <ul className="absolute z-50 mt-1 w-full bg-white text-ink rounded-b shadow-lift overflow-hidden">
                {sug.slice(0, 8).map((p) => (
                  <li key={p.id}>
                    <Link href={`/product/${p.slug}`} className="flex items-center gap-3 px-3 py-2 hover:bg-[#eee] text-sm" onClick={() => setOpen(false)}>
                      <img src={p.image} alt="" className="w-9 h-9 object-cover rounded" />
                      <span className="flex-1 truncate">{p.name}</span>
                      <span className="text-xs">₹{p.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </form>
          <Link href="/export" className="hidden xl:block px-2 py-1 border border-transparent hover:border-white rounded-sm text-sm leading-tight">
            <span className="block text-[11px] text-gray-300">Language</span>
            <span className="font-bold">EN · INR</span>
          </Link>
          <Link href={user ? "/account" : "/login"} className="hidden md:block px-2 py-1 border border-transparent hover:border-white rounded-sm leading-tight min-w-[120px]">
            <span className="block text-[11px] text-gray-300">Hello, {user ? user.name.split(" ")[0] : "sign in"}</span>
            <span className="font-bold text-sm flex items-center">Account & Lists <ChevronDown size={12} /></span>
          </Link>
          <Link href="/orders" className="hidden md:block px-2 py-1 border border-transparent hover:border-white rounded-sm leading-tight">
            <span className="block text-[11px] text-gray-300">Returns</span>
            <span className="font-bold text-sm">& Orders</span>
          </Link>
          <Link href="/cart" className="relative flex items-end gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm">
            <ShoppingCart size={28} />
            <span className="absolute top-0 left-5 text-[#f08804] font-bold text-sm">{cartCount}</span>
            <span className="font-bold hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>
      <div className="bg-[#232f3e] text-sm">
        <div className="max-w-[1500px] mx-auto px-2 h-9 flex items-center gap-4 overflow-x-auto hide-scroll">
          <button onClick={() => setMenu(true)} className="flex items-center gap-1 font-bold shrink-0">
            <Menu size={16} /> All
          </button>
          {DEPTS.map((d) => (
            <Link key={d.href} href={d.href} className="shrink-0 hover:underline">
              {d.label}
            </Link>
          ))}
          {user?.role === "admin" ? <Link href="/admin" className="shrink-0 text-[#febd69]">Super Admin</Link> : null}
          {user?.role === "seller" ? <Link href="/seller" className="shrink-0 text-[#febd69]">Seller</Link> : null}
        </div>
      </div>

      {menu ? (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenu(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-white text-ink overflow-y-auto">
            <div className="bg-[#232f3e] text-white px-4 py-4 flex justify-between items-center">
              <p className="font-bold">Hello, {user ? user.name : "sign in"}</p>
              <button onClick={() => setMenu(false)}><X /></button>
            </div>
            <nav className="p-4 text-sm">
              <p className="font-bold mb-2">Shop by Department</p>
              {DEPTS.map((d) => (
                <Link key={d.href} href={d.href} onClick={() => setMenu(false)} className="block py-2 border-b border-gray-100">
                  {d.label}
                </Link>
              ))}
              <p className="font-bold mt-4 mb-2">Programmes</p>
              {[
                ["/features", "100 future-ready features"],
                ["/seller", "Sell on INDIVA"],
                ["/impact", "Impact & ESG"],
                ["/about", "Our movement"],
              ].map(([h, l]) => (
                <Link key={h} href={h} onClick={() => setMenu(false)} className="block py-2 border-b border-gray-100">{l}</Link>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
