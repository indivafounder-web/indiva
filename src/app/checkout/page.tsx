"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientShell from "@/components/ClientShell";
import { inr } from "@/lib/utils";

export default function Checkout() {
  const [cart, setCart] = useState<any>({ items: [], subtotal: 0 });
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", phone: "", line1: "", city: "Chennai", state: "Tamil Nadu", pincode: "600001", country: "India", payment_method: "UPI" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart").then((r) => r.json()).then(setCart);
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      setUser(d.user);
      if (d.user) setForm((f) => ({ ...f, name: d.user.name }));
    });
  }, []);

  const shipping = form.country !== "India" ? 1200 : cart.subtotal >= 1999 ? 0 : 80;
  const tax = form.country !== "India" ? 0 : Math.round(cart.subtotal * 0.05);
  const total = cart.subtotal + shipping + tax;

  async function place(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }
    setBusy(true);
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) setErr(d.error || "Failed");
    else router.push("/orders?placed=" + d.order_no);
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <ClientShell>
      <form onSubmit={place} className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <h1 className="font-display text-3xl">Checkout</h1>
          {!user ? <p className="text-sm text-maroon-700">You will be asked to sign in before placing the order.</p> : null}
          <section className="bg-white border border-maroon-100 rounded-2xl p-5">
            <h2 className="font-semibold mb-3">1. Delivery address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[["name", "Full name"], ["phone", "Phone"], ["line1", "Address"], ["city", "City"], ["state", "State"], ["pincode", "PIN / ZIP"]].map(([k, l]) => (
                <label key={k} className="text-sm">
                  {l}
                  <input required value={(form as any)[k]} onChange={(e) => set(k, e.target.value)} className="mt-1 w-full border border-maroon-200 rounded-lg px-3 py-2 bg-cream-50" />
                </label>
              ))}
              <label className="text-sm">
                Country
                <select value={form.country} onChange={(e) => set("country", e.target.value)} className="mt-1 w-full border border-maroon-200 rounded-lg px-3 py-2 bg-cream-50">
                  {["India", "United States", "United Kingdom", "United Arab Emirates", "Canada", "Singapore", "Australia", "Germany", "France", "Japan"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>
          <section className="bg-white border border-maroon-100 rounded-2xl p-5">
            <h2 className="font-semibold mb-3">2. Payment</h2>
            <div className="space-y-2 text-sm">
              {["UPI", "Card", "Net banking", "Cash on delivery"].map((m) => (
                <label key={m} className="flex items-center gap-2 border border-maroon-100 rounded-lg px-3 py-2">
                  <input type="radio" name="pay" checked={form.payment_method === m} onChange={() => set("payment_method", m)} />
                  {m} {m !== "Cash on delivery" ? " · simulated capture for demo" : ""}
                </label>
              ))}
            </div>
          </section>
        </div>
        <aside className="bg-white border border-maroon-100 rounded-2xl p-5 h-fit">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {cart.items.map((i: any) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="truncate">{i.name} × {i.qty}</span>
                <span>{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="gold-line my-3" />
          <p className="flex justify-between text-sm"><span>Shipping</span><span>{shipping ? inr(shipping) : "FREE"}</span></p>
          <p className="flex justify-between text-sm"><span>Tax</span><span>{inr(tax)}</span></p>
          <p className="flex justify-between font-semibold text-lg mt-2"><span>Total</span><span>{inr(total)}</span></p>
          {err ? <p className="text-red-700 text-sm mt-2">{err}</p> : null}
          <button disabled={busy || !cart.items.length} className="mt-4 w-full py-2.5 rounded-full bg-gold-400 text-maroon-900 font-semibold">
            {busy ? "Placing…" : "Place your order"}
          </button>
          <p className="text-[11px] text-maroon-500 mt-2">By placing this order you agree to INDIVA&apos;s fair-trade and plastic-free packing policy.</p>
        </aside>
      </form>
    </ClientShell>
  );
}
