"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { inr } from "@/lib/utils";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Warehouse, Globe2,
  Bell, BarChart3, LogOut, AlertTriangle, Shield, Landmark, SlidersHorizontal, Trash2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const NAV = [
  { id: "command", icon: LayoutDashboard, label: "Command" },
  { id: "takeover", icon: Shield, label: "Takeover" },
  { id: "people", icon: Users, label: "People & roles" },
  { id: "finance", icon: Landmark, label: "Finance" },
  { id: "orders", icon: ShoppingBag, label: "Orders" },
  { id: "export", icon: Globe2, label: "Export & compliance" },
  { id: "sos", icon: Bell, label: "Crisis / SOS" },
  { id: "ops", icon: Warehouse, label: "House ops" },
  { id: "settings", icon: SlidersHorizontal, label: "Company" },
];

export default function Admin() {
  const [tab, setTab] = useState("command");
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  async function load() {
    const me = await fetch("/api/auth/me").then((r) => r.json());
    setUser(me.user);
    if (!me.user) { router.replace("/login?next=/admin"); return; }
    if (me.user.role !== "admin") { setErr("This desk is restricted to the INDIVA Super Admin."); return; }
    const r = await fetch("/api/admin");
    if (!r.ok) { setErr("Could not load admin data"); return; }
    setData(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function act(payload: any) {
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    load();
  }

  if (err) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-8">
        <div className="bg-white border rounded-2xl p-8 max-w-md text-center">
          <p className="font-display text-2xl">INDIVA command</p>
          <p className="mt-3 text-maroon-700">{err}</p>
          <Link href="/login?next=/admin" className="mt-4 inline-block px-5 py-2 rounded-full bg-maroon-700 text-white">Sign in</Link>
        </div>
      </div>
    );
  }
  if (!data) return <div className="min-h-dvh flex items-center justify-center text-maroon-600">Opening the house…</div>;

  const s = data.stats;

  return (
    <div className="min-h-dvh bg-[#1c120c] text-cream-100 flex">
      <aside className="w-56 shrink-0 bg-[#140d09] border-r border-white/10 hidden md:flex flex-col">
        <div className="p-5"><Logo light size={22} /></div>
        <p className="px-5 text-[10px] tracking-[0.25em] uppercase text-gold-300 mb-3">CEO desk</p>
        <nav className="flex-1 px-2 space-y-0.5">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${tab === n.id ? "bg-maroon-700 text-white" : "hover:bg-white/5"}`}>
              <n.icon size={16} /> {n.label}
              {n.id === "sos" && s.sos > 0 ? <span className="ml-auto text-[10px] bg-red-600 px-1.5 rounded-full">{s.sos}</span> : null}
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs">
          <p>{user?.name}</p>
          <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); }} className="mt-2 flex items-center gap-1 text-gold-200">
            <LogOut size={12} /> Sign out
          </button>
          <Link href="/" className="block mt-2 text-cream-300/70">← Storefront</Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto">
        <header className="sticky top-0 z-10 bg-[#1c120c]/90 backdrop-blur border-b border-white/10 px-6 h-14 flex items-center justify-between">
          <h1 className="font-display text-xl capitalize">{tab}</h1>
          <div className="flex gap-2 md:hidden overflow-auto">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => setTab(n.id)} className={`px-2 py-1 rounded text-xs ${tab === n.id ? "bg-maroon-700" : "bg-white/10"}`}>{n.label}</button>
            ))}
          </div>
        </header>
        <div className="p-6">
          {tab === "command" && <Command data={data} />}
          {tab === "takeover" && <Takeover data={data} act={act} />}
          {tab === "people" && <People data={data} act={act} />}
          {tab === "finance" && <Finance data={data} />}
          {tab === "orders" && <Orders data={data} act={act} />}
          {tab === "export" && <Export data={data} act={act} />}
          {tab === "sos" && <Sos data={data} act={act} />}
          {tab === "ops" && <Ops data={data} act={act} />}
          {tab === "settings" && <Company data={data} act={act} />}
        </div>
      </main>
    </div>
  );
}

function Stat({ l, v }: { l: string; v: any }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <p className="text-[11px] uppercase tracking-wider text-gold-300">{l}</p>
      <p className="font-display text-2xl mt-1">{v}</p>
    </div>
  );
}

function Command({ data }: { data: any }) {
  const s = data.stats;
  const db = data.db || {};
  const set = data.settings || {};
  const flags = [
    ["Storefront", set.freeze_store === "1" ? "FROZEN" : "Live"],
    ["Listings", set.pause_listings === "1" ? "Paused" : "Open"],
    ["Payouts", set.lock_payouts === "1" ? "Locked" : "Running"],
    ["Takeover", set.takeover === "1" ? "ACTIVE" : "Standby"],
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold-300">Chief Executive</p>
        <h2 className="font-display text-3xl mt-1">Company command</h2>
        <p className="text-cream-200/80 mt-2 max-w-2xl text-sm">
          This desk is not a catalogue. It is the operating system of INDIVA — freeze the store, lock money, reassign people, and take control of any seller or warehouse in one move.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {flags.map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-gold-300">{l}</p>
            <p className="font-display text-2xl mt-1">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat l="GMV" v={inr(s.revenue)} />
        <Stat l="Open orders" v={s.orders} />
        <Stat l="People on payroll" v={s.artisans} />
        <Stat l="Crisis tickets" v={s.sos} />
      </div>
      {set.announcement ? (
        <div className="rounded-2xl border border-gold-400/40 bg-gold-400/10 p-4 text-sm">
          Live company notice: {set.announcement}
        </div>
      ) : null}
      <div className={`rounded-2xl p-4 border ${db.persistent ? "bg-emerald-900/30 border-emerald-500/30" : "bg-amber-900/30 border-amber-400/40"}`}>
        <p className="text-[11px] uppercase tracking-wider text-gold-300">Treasury database</p>
        <p className="font-display text-xl mt-1">{db.label || "Local SQLite"}</p>
        <p className="text-sm text-cream-200/80 mt-1">{db.host}</p>
        <p className="text-xs mt-2 text-cream-300/80">{db.hint}</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 h-72">
          <p className="text-sm mb-2">Cash in, last 14 days</p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={[...data.salesByDay].reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
              <XAxis dataKey="d" stroke="#e8d5a3" tick={{ fontSize: 10 }} />
              <YAxis stroke="#e8d5a3" tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#c4a35a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm mb-3">Latest money movement</p>
          <ul className="space-y-2 text-sm">
            {data.recentOrders.map((o: any) => (
              <li key={o.id} className="flex justify-between border-b border-white/5 pb-2">
                <span>{o.order_no}</span>
                <span className="text-gold-200">{o.status}</span>
                <span>{inr(o.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Takeover({ data, act }: { data: any; act: any }) {
  const set = data.settings || {};
  const on = (k: string) => set[k] === "1";
  function toggle(k: string) {
    act({ action: "setting", key: k, value: on(k) ? "0" : "1" });
  }
  const levers = [
    { key: "takeover", title: "Full company takeover", copy: "CEO override. Every seller desk, warehouse, and listing answers to this account until you stand down." },
    { key: "freeze_store", title: "Freeze storefront", copy: "Checkout and new orders stop. The public site stays visible as a holding page." },
    { key: "pause_listings", title: "Pause all listings", copy: "No new SKUs go live. Existing catalogue remains until you unpause." },
    { key: "lock_payouts", title: "Lock payouts", copy: "Artisan and seller remittances are held in escrow until you release them." },
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold-300">Emergency powers</p>
        <h2 className="font-display text-3xl mt-1">Takeover</h2>
        <p className="text-cream-200/80 mt-2 max-w-2xl text-sm">
          These switches are company-wide. Use them when a partner, payment rail, or warehouse must be taken off the floor without waiting for anyone else.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {levers.map((l) => (
          <div key={l.key} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-xl">{l.title}</p>
                <p className="text-sm text-cream-200/75 mt-2">{l.copy}</p>
              </div>
              <button
                onClick={() => toggle(l.key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${on(l.key) ? "bg-red-500 text-white" : "bg-emerald-700 text-white"}`}
              >
                {on(l.key) ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="font-display text-xl mb-2">Assume a seller desk</p>
        <p className="text-sm text-cream-200/75 mb-4">Promote or demote any account. Super Admin stays with you.</p>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-gold-200 text-left"><tr><th className="p-2">Person</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {data.customers.map((u: any) => (
                <tr key={u.id} className="border-t border-white/5">
                  <td className="p-2">{u.name}<span className="block text-[11px] text-cream-300/60">{u.email}</span></td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">
                    <select value={u.role} onChange={(e) => act({ action: "user_role", id: u.id, role: e.target.value })} className="bg-transparent border border-white/10 rounded px-1">
                      {["customer", "seller", "admin"].map((r) => <option key={r} className="text-ink" value={r}>{r}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Finance({ data }: { data: any }) {
  const s = data.stats;
  const gmv = Number(s.revenue || 0);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold-300">Treasury</p>
        <h2 className="font-display text-3xl mt-1">Finance</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat l="Gross merchandise" v={inr(gmv)} />
        <Stat l="Platform take (~18%)" v={inr(Math.round(gmv * 0.18))} />
        <Stat l="Artisan share (~70%)" v={inr(Math.round(gmv * 0.7))} />
        <Stat l="Held in escrow" v={data.settings?.lock_payouts === "1" ? inr(Math.round(gmv * 0.7)) : inr(0)} />
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 h-80">
        <p className="text-sm mb-2">Daily GMV</p>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={[...data.salesByDay].reverse()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
            <XAxis dataKey="d" stroke="#e8d5a3" tick={{ fontSize: 10 }} />
            <YAxis stroke="#e8d5a3" tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#c4a35a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Ops({ data, act }: { data: any; act: any }) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold-300">Operations</p>
        <h2 className="font-display text-3xl mt-1 mb-2">House ops</h2>
        <p className="text-sm text-cream-200/75 mb-6">Catalogue, artisans, and warehouses live here — subordinate to Command, not the home screen.</p>
      </div>
      <Products data={data} act={act} />
      <Artisans data={data} act={act} />
      <Inventory data={data} act={act} />
    </div>
  );
}

function Company({ data, act }: { data: any; act: any }) {
  const [msg, setMsg] = useState(data.settings?.announcement || "");
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold-300">Company</p>
        <h2 className="font-display text-3xl mt-1">Broadcast & policy</h2>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
        <p className="text-sm">Company-wide notice (shown on the command desk)</p>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <button onClick={() => act({ action: "broadcast", message: msg })} className="px-4 py-2 rounded-lg bg-gold-400 text-maroon-900 text-sm font-semibold">Publish notice</button>
      </div>
    </div>
  );
}

function Products({ data, act }: { data: any; act: any }) {
  const [q, setQ] = useState("");
  const rows = data.products.filter((p: any) => p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKU or name" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <NewProduct categories={data.categories} states={data.states} artisans={data.artisans} onDone={() => act({ action: "noop" })} />
      </div>
      <div className="overflow-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gold-200 text-left">
            <tr>
              <th className="p-3">Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Tier</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p: any) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="p-3 flex gap-2 items-center">
                  <img src={p.image} alt="" className="w-10 h-10 object-cover rounded" />
                  <span>
                    {p.name}
                    <span className="block text-[11px] text-cream-300/60">{p.state_name} · {p.artisan_name}</span>
                  </span>
                </td>
                <td className="p-3 font-mono text-xs">{p.sku}</td>
                <td className="p-3">{inr(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">T{p.quality_tier} {p.gi_tagged ? "· GI" : ""}</td>
                <td className="p-3">
                  <select value={p.status} onChange={(e) => act({ action: "product_status", id: p.id, status: e.target.value })} className="bg-transparent border border-white/10 rounded px-1">
                    {["active", "pending", "draft"].map((s) => <option key={s} className="text-ink">{s}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => act({ action: "product_update", ...p, featured: p.featured ? 0 : 1 })} className="text-gold-200 mr-2" title="Toggle featured">★</button>
                  <button onClick={() => act({ action: "product_delete", id: p.id })} className="text-red-400"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewProduct({ categories, states, artisans, onDone }: any) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", price: 2000, mrp: 2500, stock: 10, category_id: 1, state_id: 1, artisan_id: 1, description: "", quality_tier: 2 });
  async function save() {
    await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    setOpen(false);
    onDone();
    location.reload();
  }
  if (!open) return <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg bg-gold-400 text-maroon-900 text-sm font-semibold">New SKU</button>;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#1c120c] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-3">
        <h3 className="font-display text-xl">New product</h3>
        {["name", "description"].map((k) => (
          <input key={k} placeholder={k} value={(f as any)[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm" />
        ))}
        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="price" value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm" />
          <input type="number" placeholder="mrp" value={f.mrp} onChange={(e) => setF({ ...f, mrp: Number(e.target.value) })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm" />
          <input type="number" placeholder="stock" value={f.stock} onChange={(e) => setF({ ...f, stock: Number(e.target.value) })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setOpen(false)} className="px-3 py-1">Cancel</button>
          <button onClick={save} className="px-4 py-1.5 rounded bg-gold-400 text-maroon-900">Save</button>
        </div>
      </div>
    </div>
  );
}

function Orders({ data, act }: any) {
  return (
    <div className="space-y-3">
      {data.orders.map((o: any) => (
        <article key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="font-mono">{o.order_no} · {o.customer}</p>
            <select value={o.status} onChange={(e) => act({ action: "order_status", id: o.id, status: e.target.value })} className="bg-maroon-700 rounded px-2 py-1 text-sm">
              {["confirmed", "packed", "shipped", "delivered", "cancelled"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <p className="text-xs text-cream-300/70 mt-1">{o.created_at} · {o.country} · {o.is_export ? "EXPORT" : "DOMESTIC"} · {o.tracking} · {inr(o.total)}</p>
          <ul className="mt-2 text-sm">
            {(o.items || []).map((i: any) => <li key={i.id}>{i.name} × {i.qty}</li>)}
          </ul>
        </article>
      ))}
    </div>
  );
}

function Artisans({ data, act }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {data.artisans.map((a: any) => (
        <div key={a.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
          <img src={a.photo} alt="" className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <p className="font-medium">{a.name} {a.verified ? "✓" : ""}</p>
            <p className="text-xs text-cream-300/70">{a.craft} · {a.village}, {a.state}</p>
            <p className="text-sm mt-1">Income {inr(a.income_total)} · Savings {inr(a.savings)}</p>
            <button onClick={() => act({ action: "verify_artisan", id: a.id, verified: a.verified ? 0 : 1 })} className="mt-2 text-xs px-2 py-1 rounded bg-white/10">
              {a.verified ? "Unverify" : "Verify"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function People({ data, act }: any) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold-300">Directory</p>
      <h2 className="font-display text-3xl mt-1 mb-4">People & roles</h2>
      <p className="text-sm text-cream-200/75 mb-6">Assign who can sell, who can shop, and who sits at this desk. Super Admin is the CEO role.</p>
    <table className="w-full text-sm">
      <thead className="text-gold-200 text-left"><tr><th className="p-2">Name</th><th>Email</th><th>Role</th></tr></thead>
      <tbody>
        {data.customers.map((u: any) => (
          <tr key={u.id} className="border-t border-white/5">
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">
              <select value={u.role} onChange={(e) => act({ action: "user_role", id: u.id, role: e.target.value })} className="bg-transparent border border-white/10 rounded">
                {["customer", "seller", "admin"].map((r) => <option key={r} className="text-ink">{r}</option>)}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

function Inventory({ data, act }: any) {
  return (
    <div>
      <div className="flex gap-3 mb-4 flex-wrap">
        {data.warehouses.map((w: any) => (
          <span key={w.id} className="px-3 py-1 rounded-full bg-white/10 text-sm">{w.name} · {w.city} · {w.type}</span>
        ))}
      </div>
      <table className="w-full text-sm">
        <thead className="text-gold-200 text-left"><tr><th className="p-2">SKU</th><th>Warehouse</th><th>Qty</th></tr></thead>
        <tbody>
          {data.inventory.slice(0, 80).map((i: any) => (
            <tr key={i.id} className="border-t border-white/5">
              <td className="p-2">{i.product_name}</td>
              <td className="p-2">{i.warehouse_name}</td>
              <td className="p-2">
                <input type="number" defaultValue={i.qty} onBlur={(e) => act({ action: "inventory", id: i.id, qty: Number(e.target.value) })} className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Export({ data, act }: any) {
  const rows = data.orders.filter((o: any) => o.is_export);
  return (
    <div>
      <p className="text-sm text-cream-300/80 mb-4">Tier 1 only. IEC · EPCH · HS codes on every SKU. Primary: US, UK, UAE, CA, SG, AU.</p>
      {rows.length === 0 ? <p>No export orders yet.</p> : rows.map((o: any) => (
        <article key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3">
          <div className="flex justify-between">
            <p>{o.order_no} · {o.country}</p>
            <select value={o.status} onChange={(e) => act({ action: "order_status", id: o.id, status: e.target.value })} className="bg-maroon-700 rounded px-2 py-1 text-sm">
              {["confirmed", "packed", "shipped", "delivered"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <p className="text-xs mt-1">{o.tracking} · {inr(o.total)}</p>
        </article>
      ))}
    </div>
  );
}

function Sos({ data, act }: any) {
  return (
    <div className="space-y-3">
      {data.sos.map((s: any) => (
        <article key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between gap-2">
            <p className="font-medium flex items-center gap-2"><AlertTriangle size={16} className="text-gold-400" /> {s.artisan_name}</p>
            <span className="text-xs uppercase">{s.status}</span>
          </div>
          <p className="text-sm mt-2">{s.message}</p>
          <p className="text-xs text-cream-300/60 mt-1">{s.created_at}</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => act({ action: "sos", id: s.id, status: "acknowledged" })} className="px-3 py-1 rounded bg-white/10 text-xs">Acknowledge</button>
            <button onClick={() => act({ action: "sos", id: s.id, status: "resolved" })} className="px-3 py-1 rounded bg-emerald-700 text-xs">Resolve</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Analytics({ data }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="mb-3">Top sellers</p>
        {data.topProducts.map((p: any) => (
          <div key={p.id} className="flex items-center gap-3 mb-2 text-sm">
            <img src={p.image} alt="" className="w-10 h-10 object-cover rounded" />
            <span className="flex-1">{p.name}</span>
            <span>{p.sold} sold</span>
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="mb-3">Artisan payouts</p>
        {data.artisans.slice(0, 8).map((a: any) => (
          <div key={a.id} className="flex justify-between text-sm mb-2">
            <span>{a.name}</span>
            <span>{inr(a.income_total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
