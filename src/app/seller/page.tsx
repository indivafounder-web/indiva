"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inr } from "@/lib/utils";
import { IndianRupee, ClipboardList, Siren, User, Plus, PiggyBank, TrendingUp } from "lucide-react";

export default function SellerApp() {
  const [tab, setTab] = useState<"home" | "orders" | "sos" | "more">("home");
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("Need help with GI paperwork");
  const router = useRouter();

  async function load() {
    const me = await fetch("/api/auth/me").then((r) => r.json());
    if (!me.user) { router.replace("/login?next=/seller"); return; }
    const r = await fetch("/api/seller");
    if (!r.ok) {
      const d = await r.json();
      setErr(d.error || "Seller access only. Use seller@indiva.in");
      return;
    }
    setData(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function sos() {
    await fetch("/api/seller", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sos", message: msg }) });
    setTab("home");
    load();
  }
  async function saveSome() {
    await fetch("/api/seller", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", amount: 200, note: "Manual save" }) });
    load();
  }

  if (err) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-cream-100">
        <div className="bg-white rounded-2xl p-8 max-w-sm text-center border border-maroon-100">
          <p className="font-display text-2xl text-maroon-800">Seller</p>
          <p className="mt-3 text-sm">{err}</p>
          <Link href="/login?next=/seller" className="mt-4 inline-block px-5 py-2 rounded-full bg-maroon-700 text-white">Sign in as seller</Link>
        </div>
      </div>
    );
  }
  if (!data) return <div className="min-h-dvh flex items-center justify-center">Loading seller app…</div>;
  const a = data.artisan;

  return (
    <div className="min-h-dvh bg-cream-100 flex justify-center">
      <div className="w-full max-w-md bg-cream-50 min-h-dvh shadow-lift flex flex-col">
        <header className="px-5 pt-8 pb-4 flex items-center justify-between">
          <h1 className="font-display text-3xl text-maroon-800">Seller</h1>
          <button onClick={() => setTab("sos")} className="w-12 h-12 rounded-full bg-maroon-800 text-gold-200 font-bold text-sm">SOS</button>
        </header>
        <div className="flex-1 overflow-auto pb-24">
          {tab === "home" && (
            <div className="px-4 space-y-3">
              <Row icon={<TrendingUp className="text-emerald-700" />} label="Income" value={inr(a.income_total)} onClick={() => setTab("more")} />
              <Row label="Listings" value={String(data.listings.length)} onClick={() => setTab("more")} />
              <Row label="Tracking" value={`${data.orders.length} Orders`} onClick={() => setTab("orders")} />
              <Row icon={<PiggyBank />} label="Saving" value={inr(a.savings)} onClick={() => setTab("more")} />
              <div className="bg-white rounded-2xl p-4 border border-maroon-100">
                <p className="text-sm text-maroon-600">Namaste, {a.name}</p>
                <p className="font-medium">{a.craft} · {a.village}</p>
                <p className="text-xs mt-1">{a.gi_certified ? "GI certified" : "GI assistance available"} · {a.verified ? "Verified" : "Pending verify"}</p>
              </div>
            </div>
          )}
          {tab === "orders" && (
            <div className="px-4 space-y-3">
              <h2 className="font-display text-xl">Orders</h2>
              {data.orders.length === 0 ? <p className="text-sm">No orders yet.</p> : data.orders.map((o: any) => (
                <div key={o.id} className="bg-white rounded-2xl p-4 border border-maroon-100">
                  <p className="font-medium">{o.name}</p>
                  <p className="text-xs text-maroon-600">{o.order_no} · {o.status} · {o.country}</p>
                  <p className="text-sm mt-1">{inr(o.price)} × {o.qty}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "sos" && (
            <div className="px-4">
              <h2 className="font-display text-xl mb-2">SOS — we are with you</h2>
              <p className="text-sm text-maroon-700 mb-3">Tap send and Super Admin is notified. Use this for delayed materials, GI papers, or safety.</p>
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} className="w-full h-32 border border-maroon-200 rounded-2xl p-3 bg-white" />
              <button onClick={sos} className="mt-3 w-full py-3 rounded-full bg-maroon-800 text-gold-200 font-semibold">Send SOS</button>
              <ul className="mt-4 space-y-2 text-sm">
                {data.sos.map((s: any) => (
                  <li key={s.id} className="bg-white rounded-xl p-3 border border-maroon-100">
                    <span className="uppercase text-[10px] tracking-wider text-maroon-600">{s.status}</span>
                    <p>{s.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === "more" && (
            <div className="px-4 space-y-4">
              <h2 className="font-display text-xl">Listings</h2>
              {data.listings.map((p: any) => (
                <div key={p.id} className="flex gap-3 bg-white rounded-2xl p-3 border border-maroon-100">
                  <img src={p.image} alt="" className="w-14 h-14 object-cover rounded-lg" />
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs">{inr(p.price)} · stock {p.stock} · {p.status}</p>
                  </div>
                </div>
              ))}
              <AddListing onDone={load} />
              <h2 className="font-display text-xl pt-2">Savings</h2>
              <p className="text-3xl font-semibold">{inr(a.savings)}</p>
              <button onClick={saveSome} className="px-4 py-2 rounded-full bg-gold-400 text-maroon-900 text-sm">Save ₹200 more</button>
              <ul className="text-sm space-y-1">
                {data.savings.map((t: any) => (
                  <li key={t.id} className="flex justify-between"><span>{t.note}</span><span>{inr(t.amount)}</span></li>
                ))}
              </ul>
              <Link href="/" className="block text-sm text-maroon-700 pt-4">Open customer store →</Link>
              <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); }} className="text-sm text-maroon-600">Sign out</button>
            </div>
          )}
        </div>
        <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-cream-50 border-t border-maroon-100 grid grid-cols-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {[
            { id: "home", icon: IndianRupee, l: "Income" },
            { id: "orders", icon: ClipboardList, l: "Orders" },
            { id: "sos", icon: Siren, l: "SOS" },
            { id: "more", icon: User, l: "More" },
          ].map((t: any) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center text-[11px] ${tab === t.id ? "text-maroon-800" : "text-maroon-400"}`}>
              <t.icon size={20} />
              {t.l}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Row({ label, value, onClick, icon }: any) {
  return (
    <button onClick={onClick} className="w-full bg-white border border-maroon-100 rounded-2xl px-5 py-4 flex items-center justify-between">
      <span>
        <span className="block text-maroon-600 text-sm">{label}</span>
        <span className="text-2xl font-semibold">{value}</span>
      </span>
      {icon || <span className="text-maroon-300">›</span>}
    </button>
  );
}

function AddListing({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1500);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full py-3 rounded-2xl border border-dashed border-maroon-300 flex items-center justify-center gap-2 text-maroon-700">
      <Plus size={16} /> Add listing
    </button>
  );
  return (
    <div className="bg-white border border-maroon-100 rounded-2xl p-4 space-y-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" className="w-full border rounded-lg px-3 py-2" />
      <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2" />
      <button
        onClick={async () => {
          await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, price, mrp: Math.round(price * 1.3), description: "Listed from seller app" }) });
          setOpen(false); setName(""); onDone();
        }}
        className="w-full py-2 rounded-full bg-maroon-700 text-white"
      >
        Submit for approval
      </button>
    </div>
  );
}
