"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, ArrowUp, Sparkles } from "lucide-react";

type Toast = { id: number; text: string };
const listeners = new Set<(t: Toast) => void>();
let nid = 1;

export function toast(text: string) {
  const t = { id: nid++, text };
  listeners.forEach((fn) => fn(t));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("indiva-toast"));
  }
}

export function remember(p: { id: number; name: string; slug: string; image: string; price: number }) {
  if (typeof window === "undefined") return;
  const key = "indiva_viewed";
  const prev = JSON.parse(localStorage.getItem(key) || "[]").filter((x: any) => x.id !== p.id);
  localStorage.setItem(key, JSON.stringify([{ ...p }, ...prev].slice(0, 10)));
}

export function viewed(): any[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("indiva_viewed") || "[]");
  } catch {
    return [];
  }
}

export async function addToCart(product_id: number, qty = 1) {
  const r = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, qty }),
  });
  if (r.ok) toast("Added to cart · Fulfilled by INDIVA");
  else toast("Could not add — try signing in");
  window.dispatchEvent(new Event("indiva-cart"));
  return r.ok;
}

const FAQ: Array<[string[], string]> = [
  [["order", "track", "where"], "Open Account → Your Orders. Every parcel has live status and a tracking id like INDIVA-XXXX."],
  [["gi", "authentic", "fake", "original"], "GI-tagged pieces carry a digital passport. Open the product → Product passport, or scan the QR in the box."],
  [["return", "refund"], "Unused goods can be returned in 7 days. Start a return from Your Orders."],
  [["export", "usa", "uk", "ship", "international"], "We ship to US, UK, UAE, Canada, Singapore, Australia, EU and Japan. Checkout → change country. Global 7–14 days."],
  [["artisan", "seller", "earn"], "70–80% of every sale goes to the maker. Artisans use /seller for income, listings and SOS."],
  [["plus", "prime", "membership"], "INDIVA Atelier is our membership — free festival shipping, early access to state-of-the-month, and artisan stories first."],
  [["pay", "upi", "card"], "UPI, cards, net banking and COD in India. International cards on export checkout."],
];

function answer(q: string) {
  const s = q.toLowerCase();
  for (const [keys, a] of FAQ) if (keys.some((k) => s.includes(k))) return a;
  return "I am the INDIVA atelier concierge. Ask me about orders, GI authenticity, export shipping, returns, or artisans. For a human, sellers can tap SOS; shoppers can write hello@indiva.in.";
}

export default function Experience() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [chat, setChat] = useState(false);
  const [msgs, setMsgs] = useState<Array<{ me?: boolean; t: string }>>([
    { t: "Namaste. I am your INDIVA concierge — crafts, orders, GI passports, export. How may I help?" },
  ]);
  const [input, setInput] = useState("");
  const [top, setTop] = useState(false);

  useEffect(() => {
    const add = (t: Toast) => {
      setToasts((x) => [...x, t]);
      setTimeout(() => setToasts((x) => x.filter((i) => i.id !== t.id)), 3200);
    };
    listeners.add(add);
    const onScroll = () => setTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      listeners.delete(add);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    setMsgs((m) => [...m, { me: true, t: q }, { t: answer(q) }]);
  }

  return (
    <>
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="toast-in bg-maroon-800 text-cream-50 px-4 py-2.5 rounded-full shadow-lift text-sm max-w-xs">
            {t.text}
          </div>
        ))}
        {top ? (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-11 h-11 rounded-full bg-maroon-800 text-gold-200 flex items-center justify-center shadow-lift"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </button>
        ) : null}
        <button
          onClick={() => setChat((c) => !c)}
          className="w-14 h-14 rounded-full bg-gold-400 text-maroon-900 flex items-center justify-center shadow-lift btn-pulse"
          aria-label="Concierge"
        >
          {chat ? <X /> : <MessageCircle />}
        </button>
      </div>
      {chat ? (
        <div className="fixed bottom-36 md:bottom-24 right-4 z-50 w-[min(100%-2rem,360px)] bg-cream-50 border border-maroon-200 rounded-3xl shadow-lift overflow-hidden toast-in">
          <div className="bg-maroon-800 text-cream-50 px-4 py-3 flex items-center gap-2">
            <Sparkles size={16} className="text-gold-200" />
            <div>
              <p className="font-medium text-sm">INDIVA Concierge</p>
              <p className="text-[11px] text-gold-200">Always on · 29 states</p>
            </div>
          </div>
          <div className="h-64 overflow-y-auto p-3 space-y-2 text-sm">
            {msgs.map((m, i) => (
              <p key={i} className={`px-3 py-2 rounded-2xl ${m.me ? "bg-maroon-700 text-cream-50 ml-8" : "bg-white border border-maroon-100 mr-6"}`}>
                {m.t}
              </p>
            ))}
          </div>
          <form onSubmit={send} className="flex border-t border-maroon-100">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about orders, GI, export…" className="flex-1 px-3 py-2 bg-transparent text-sm" />
            <button className="px-4 text-sm font-semibold text-maroon-800">Send</button>
          </form>
          <div className="px-3 pb-3 flex gap-2 text-[11px]">
            <Link href="/orders" className="underline" onClick={() => setChat(false)}>Orders</Link>
            <Link href="/export" className="underline" onClick={() => setChat(false)}>Export</Link>
            <Link href="/states" className="underline" onClick={() => setChat(false)}>States</Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function RecentlyViewed() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => setItems(viewed()), []);
  if (!items.length) return null;
  return (
    <section className="max-w-7xl mx-auto px-6 pb-14">
      <h2 className="font-display text-2xl mb-4">Inspired by your browsing</h2>
      <div className="flex gap-4 overflow-x-auto hide-scroll pb-2">
        {items.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="min-w-[160px] w-40 bg-white border border-maroon-100 rounded-xl overflow-hidden card-lift">
            <img src={p.image} alt="" className="h-32 w-full object-cover" />
            <p className="p-2 text-xs line-clamp-2">{p.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function DealClock() {
  const [left, setLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      const end = new Date();
      end.setHours(23, 59, 59, 0);
      const ms = end.getTime() - Date.now();
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-maroon-800 bg-gold-200 px-2 py-0.5 rounded tracking-wider">{left || "—"}</span>
  );
}
