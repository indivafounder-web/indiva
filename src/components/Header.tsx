"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, MapPin, Menu, X, Mic, UserRound, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

const DEPTS = [
  { href: "/shop", label: "All" },
  { href: "/shop?category=fashion", label: "Fashion" },
  { href: "/shop?category=decor", label: "Home & Décor" },
  { href: "/shop?category=gourmet", label: "Gourmet" },
  { href: "/shop?category=wellness", label: "Wellness" },
  { href: "/shop?category=lifestyle", label: "Jewelry" },
  { href: "/map", label: "Shop by State" },
  { href: "/shop?gi=1", label: "GI Tagged" },
  { href: "/hampers", label: "Gift hampers" },
  { href: "/live", label: "Live workshops" },
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
  const [scrolled, setScrolled] = useState(false);
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("click", on);
      window.removeEventListener("scroll", onScroll);
    };
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
    <header className={`sticky top-0 z-50 transition-shadow ${scrolled ? "shadow-lift" : ""}`}>
      <div className="bg-maroon-900 text-gold-200 text-[11px] tracking-[0.28em] uppercase text-center py-1.5">
        Essence of Every State · Elegance for the World
      </div>
      <div className="bg-cream-50/92 backdrop-blur-md border-b border-gold-200/70">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 h-[74px] flex items-center gap-3">
          <button className="md:hidden p-2 text-maroon-800" onClick={() => setMenu(true)} aria-label="Open menu">
            <Menu />
          </button>
          <Link href="/" className="shrink-0">
            <Logo size={30} />
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
            <div className="flex h-11 rounded-full overflow-hidden border border-gold-300 bg-white shadow-soft">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search kanjivaram, pashmina, GI crafts, artisans…"
                className="flex-1 px-4 text-ink text-sm bg-transparent"
              />
              <button type="button" onClick={listen} className="px-3 text-maroon-700" aria-label="Voice search">
                <Mic size={16} />
              </button>
              <button className="px-4 bg-maroon-700 text-gold-200" aria-label="Search">
                <Search size={18} />
              </button>
            </div>
            {open && sug.length > 0 ? (
              <ul className="absolute z-50 mt-2 w-full bg-cream-50 border border-gold-200 rounded-2xl shadow-lift overflow-hidden">
                {sug.slice(0, 8).map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gold-50 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                      <span className="flex-1 truncate">{p.name}</span>
                      <span className="text-xs text-maroon-700">₹{p.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </form>
          <Link href="/map" className="hidden lg:flex items-center gap-1.5 px-2 text-maroon-800 hover:text-maroon-600">
            <MapPin size={16} />
            <span className="leading-tight">
              <span className="block text-[10px] uppercase tracking-wider text-maroon-500">Deliver across</span>
              <span className="text-sm font-medium">29 states</span>
            </span>
          </Link>
          <Link href={user ? "/account" : "/login"} className="hidden md:flex items-center gap-1.5 px-2 text-maroon-800">
            <UserRound size={18} />
            <span className="leading-tight">
              <span className="block text-[10px] uppercase tracking-wider text-maroon-500">{user ? "Welcome" : "Sign in"}</span>
              <span className="text-sm font-medium">{user ? user.name.split(" ")[0] : "Account"}</span>
            </span>
          </Link>
          <Link href="/orders" className="hidden md:flex items-center gap-1.5 px-2 text-maroon-800">
            <Package size={18} />
            <span className="text-sm font-medium">Orders</span>
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1 px-2 text-maroon-800">
            <ShoppingCart size={22} />
            {cartCount > 0 ? (
              <span className="absolute -top-1.5 left-5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold-400 text-maroon-900 text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            ) : null}
            <span className="font-medium hidden sm:inline text-sm">Bag</span>
          </Link>
        </div>
      </div>
      <div className="bg-maroon-800 text-cream-50 text-[13px]">
        <div className="max-w-7xl mx-auto px-3 h-10 flex items-center gap-5 overflow-x-auto hide-scroll">
          <button onClick={() => setMenu(true)} className="flex items-center gap-1 font-medium shrink-0 text-gold-200">
            <Menu size={14} /> Menu
          </button>
          {DEPTS.map((d) => (
            <Link key={d.href} href={d.href} className="shrink-0 hover:text-gold-200 tracking-wide">
              {d.label}
            </Link>
          ))}
        </div>
      </div>

      {menu ? (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-maroon-900/50 backdrop-blur-sm" onClick={() => setMenu(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-cream-50 text-ink overflow-y-auto">
            <div className="bg-maroon-800 text-cream-50 px-5 py-5 flex justify-between items-center">
              <div>
                <p className="font-display tracking-[0.2em] text-lg">INDIVA</p>
                <p className="text-xs text-gold-200 mt-1">{user ? `Namaste, ${user.name}` : "Sign in to the house"}</p>
              </div>
              <button onClick={() => setMenu(false)} aria-label="Close"><X /></button>
            </div>
            <nav className="p-5 text-sm">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold-600 mb-2">Departments</p>
              {DEPTS.map((d) => (
                <Link key={d.href} href={d.href} onClick={() => setMenu(false)} className="block py-2.5 border-b border-maroon-100">
                  {d.label}
                </Link>
              ))}
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold-600 mt-6 mb-2">Help</p>
              {[
                ["/about", "Our story"],
                ["/impact", "Sustainability"],
                ["/tracking", "Track a parcel"],
                ["/orders", "Your orders"],
              ].map(([h, l]) => (
                <Link key={h} href={h} onClick={() => setMenu(false)} className="block py-2.5 border-b border-maroon-100">
                  {l}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
