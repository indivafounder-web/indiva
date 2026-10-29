"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import StoreHeader from "@/components/ClientShell";
import { inr } from "@/lib/utils";

export default function CartPage() {
  const [data, setData] = useState<any>({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);

  async function load() {
    const r = await fetch("/api/cart");
    setData(await r.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setQty(id: number, qty: number) {
    await fetch("/api/cart", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, qty }) });
    load();
  }

  const shipping = data.subtotal >= 1999 || data.subtotal === 0 ? 0 : 80;
  const tax = Math.round(data.subtotal * 0.05);
  const total = data.subtotal + shipping + tax;

  return (
    <StoreHeader>
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_320px] gap-8">
        <section className="bg-white border border-maroon-100 rounded-2xl p-5">
          <h1 className="font-display text-3xl">Shopping Cart</h1>
          <div className="gold-line my-4" />
          {loading ? <p>Loading…</p> : data.items.length === 0 ? (
            <p className="py-12 text-center text-maroon-600">
              Your cart is empty. <Link href="/shop" className="underline">Continue shopping</Link>
            </p>
          ) : (
            <ul className="divide-y divide-maroon-100">
              {data.items.map((i: any) => (
                <li key={i.id} className="py-4 flex gap-4">
                  <img src={i.image} alt="" className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <Link href={`/product/${i.slug}`} className="font-medium">{i.name}</Link>
                    <p className="text-sm text-emerald-700 mt-1">In stock</p>
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <select value={i.qty} onChange={(e) => setQty(i.id, Number(e.target.value))} className="border rounded px-2 py-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n}>{n}</option>)}
                      </select>
                      <button onClick={() => setQty(i.id, 0)} className="text-maroon-600">Delete</button>
                    </div>
                  </div>
                  <p className="font-semibold">{inr(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside className="bg-white border border-maroon-100 rounded-2xl p-5 h-fit">
          <p className="text-sm">Subtotal ({data.items.length} items)</p>
          <p className="text-2xl font-semibold">{inr(data.subtotal)}</p>
          <p className="text-sm mt-2">Shipping {shipping ? inr(shipping) : "FREE"}</p>
          <p className="text-sm">GST (est.) {inr(tax)}</p>
          <p className="text-xl font-semibold mt-3">Order total {inr(total)}</p>
          <Link href="/checkout" className={`mt-4 block text-center py-2.5 rounded-full bg-gold-400 text-maroon-900 font-semibold ${data.items.length ? "" : "pointer-events-none opacity-50"}`}>
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </StoreHeader>
  );
}
