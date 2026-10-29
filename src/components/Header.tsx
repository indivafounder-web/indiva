"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, User, Heart, MapPin, ChevronDown, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

const CATS = [
  { href: "/shop?category=fashion", label: "Fashion & Textiles" },
  { href: "/shop?category=decor", label: "Home & Décor" },
  { href: "/shop?category=gourmet", label: "Gourmet" },
  { href: "/shop?category=wellness", label: "Wellness" },
  { href: "/shop?category=lifestyle", label: "Jewelry & Lifestyle" },
  { href: "/states", label: "Shop by State" },
  { href: "/shop?gi=1", label: "GI Tagged" },
  { href: "/shop?tier=1", label: "Tier 1 Luxury" },
  { href: "/export", label: "Export Desk" },
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

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-maroon-800 text-gold-200 text-[11px] tracking-wide overflow-hidden">
        <div className="h-8 flex items-center">
          <div className="ticker-track gap-10 px-4">
            {[0, 1].flatMap((n) => [
              <span key={n + "a"}>✦ INDIVA Authentic · GI tagged · Digital passport on every SKU</span>,
              <span key={n + "b"}>Free delivery over ₹1,999 · Plastic-free packing</span>,
              <span key={n + "c"}>70–80% to the artisan · No middlemen</span>,
              <span key={n + "d"}>Export ready · US · UK · UAE · EU · JP</span>,
              <span key={n + "e"}>This month: Gujarat — Threads & Thalis</span>,
            ])}
          </div>
        </div>
      </div>
      <div className="bg-maroon-700 text-cream-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center gap-3">
          <button className="md:hidden p-1" onClick={() => setMenu(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
          <Link href="/" className="shrink-0">
            <Logo light size={30} />
          </Link>
          <form
            ref={box}
            className="relative flex-1 max-w-3xl mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              router.push("/shop?q=" + encodeURIComponent(q));
            }}
          >
            <div className="flex rounded-md overflow-hidden bg-white text-ink">
              <span className="hidden sm:flex items-center px-3 text-xs bg-cream-300 text-maroon-800 border-r border-maroon-100">
                All
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search kanjivaram, pashmina, saffron, kolhapuri…"
                className="flex-1 px-3 py-2 text-sm bg-transparent"
              />
              <button className="px-3 bg-gold-400 text-maroon-900" aria-label="Search">
                <Search size={18} />
              </button>
            </div>
            {open && sug.length > 0 ? (
              <ul className="absolute z-50 mt-1 w-full bg-white text-ink rounded-md shadow-lift border border-maroon-100 overflow-hidden">
                {sug.slice(0, 7).map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-cream-200 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      <img src={p.image} alt="" className="w-9 h-9 object-cover rounded" />
                      <span className="flex-1 truncate">{p.name}</span>
                      <span className="text-maroon-600 text-xs">₹{p.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </form>
          <div className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/account" className="px-2 py-1 hover:bg-white/10 rounded leading-tight">
              <span className="block text-[11px] text-gold-200">Hello, {user ? user.name.split(" ")[0] : "sign in"}</span>
              <span className="font-semibold flex items-center gap-1">
                Account <ChevronDown size={12} />
              </span>
            </Link>
            <Link href="/orders" className="px-2 py-1 hover:bg-white/10 rounded leading-tight">
              <span className="block text-[11px] text-gold-200">Returns</span>
              <span className="font-semibold">& Orders</span>
            </Link>
            <Link href="/wishlist" className="p-2 hover:bg-white/10 rounded" aria-label="Wishlist">
              <Heart size={22} />
            </Link>
            <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded flex items-end gap-1">
              <ShoppingCart size={24} />
              <span className="absolute top-0.5 left-5 min-w-[18px] h-[18px] rounded-full bg-gold-400 text-maroon-900 text-[11px] font-bold flex items-center justify-center cart-pop">
                {cartCount}
              </span>
              <span className="font-semibold hidden lg:inline">Cart</span>
            </Link>
          </div>
          <Link href="/cart" className="md:hidden relative p-1">
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-gold-400 text-maroon-900 text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
      <div className="bg-maroon-800 text-cream-100 text-sm">
        <div className="max-w-7xl mx-auto px-3 h-10 hidden md:flex items-center gap-5 overflow-x-auto hide-scroll">
          <span className="flex items-center gap-1 text-gold-200 shrink-0">
            <MapPin size={14} /> Deliver to India
          </span>
          {CATS.map((c) => (
            <Link key={c.href} href={c.href} className="shrink-0 hover:text-white">
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {menu ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenu(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[82%] max-w-xs bg-cream-50 text-ink p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button onClick={() => setMenu(false)}><X /></button>
            </div>
            <p className="text-sm text-maroon-600 mb-3">{user ? `Hello, ${user.name}` : "Hello, guest"}</p>
            <nav className="flex flex-col gap-1 text-[15px]">
              {[{ href: "/", label: "Home" }, ...CATS, { href: "/about", label: "About INDIVA" }, { href: "/account", label: "Account" }, { href: "/seller", label: "Seller app" }].map((c) => (
                <Link key={c.href} href={c.href} onClick={() => setMenu(false)} className="py-2 border-b border-maroon-100">
                  {c.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
