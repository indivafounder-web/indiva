"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { inr, deliveryEta } from "@/lib/utils";
import { Heart, ShieldCheck, Truck } from "lucide-react";

export default function BuyBox({ p }: { p: any }) {
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function add() {
    setBusy(true);
    const r = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: p.id, qty }),
    });
    setBusy(false);
    if (r.ok) {
      setMsg("Added to cart");
      router.refresh();
    } else setMsg("Could not add");
  }

  async function buy() {
    await add();
    router.push("/cart");
  }

  async function wish() {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: p.id }),
    });
    setMsg("Saved to wishlist");
  }

  return (
    <aside className="border border-maroon-200 rounded-2xl p-4 bg-white h-fit lg:sticky lg:top-28">
      <p className="text-2xl font-semibold">{inr(p.price)}</p>
      <p className="text-sm text-emerald-700 mt-1">FREE delivery {deliveryEta(5)} on orders over ₹1,999</p>
      <p className="text-sm mt-1">{p.stock > 0 ? <span className="text-emerald-800">In stock ({p.stock})</span> : <span className="text-red-700">Currently unavailable</span>}</p>
      <p className="text-xs text-maroon-600 mt-2">Ships from & sold by INDIVA · Fulfilled from {p.warehouse}</p>
      <label className="block text-sm mt-4">
        Quantity
        <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="mt-1 w-full border border-maroon-200 rounded-lg px-2 py-2 bg-cream-50">
          {Array.from({ length: Math.min(10, p.stock || 1) }, (_, i) => i + 1).map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <button onClick={add} disabled={busy} className="mt-4 w-full py-2.5 rounded-full bg-gold-400 text-maroon-900 font-semibold">
        Add to Cart
      </button>
      <button onClick={buy} className="mt-2 w-full py-2.5 rounded-full bg-orange-500 text-white font-semibold">
        Buy Now
      </button>
      <button onClick={wish} className="mt-2 w-full py-2 rounded-full border border-maroon-200 text-sm flex items-center justify-center gap-2">
        <Heart size={16} /> Add to wishlist
      </button>
      {msg ? <p className="text-xs text-emerald-800 mt-2">{msg}</p> : null}
      <ul className="mt-4 space-y-2 text-xs text-maroon-700">
        <li className="flex gap-2"><Truck size={14} /> Metro 5–7 days · Global 7–14 days</li>
        <li className="flex gap-2"><ShieldCheck size={14} /> 7-day easy returns on unused goods</li>
        <li>70–80% of this price is credited to {p.artisan_name || "the artisan"}</li>
      </ul>
    </aside>
  );
}
