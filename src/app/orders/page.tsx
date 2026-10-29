"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ClientShell from "@/components/ClientShell";
import { inr } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

function Inner() {
  const [orders, setOrders] = useState<any[]>([]);
  const placed = useSearchParams().get("placed");
  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then((d) => setOrders(d.orders || []));
  }, []);
  return (
    <ClientShell>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl">Your orders</h1>
        {placed ? <p className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3">Order <b>{placed}</b> placed. A QR passport travels with every parcel.</p> : null}
        <div className="mt-6 space-y-4">
          {orders.length === 0 ? <p className="text-maroon-600">No orders yet. <Link href="/shop" className="underline">Shop INDIVA</Link></p> : orders.map((o) => (
            <article key={o.id} className="bg-white border border-maroon-100 rounded-2xl p-5">
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <p>Order <b>{o.order_no}</b></p>
                <p className="uppercase tracking-wider text-maroon-700">{o.status}</p>
              </div>
              <p className="text-xs text-maroon-500 mt-1">{o.created_at} · {o.country} · {o.tracking}</p>
              <ul className="mt-3 space-y-2">
                {(o.items || []).map((i: any) => (
                  <li key={i.id} className="flex gap-3 items-center">
                    <img src={i.image} alt="" className="w-12 h-12 object-cover rounded" />
                    <span className="flex-1 text-sm">{i.name} × {i.qty}</span>
                    <span className="text-sm">{inr(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-right font-semibold mt-3">{inr(o.total)}</p>
            </article>
          ))}
        </div>
      </div>
    </ClientShell>
  );
}

export default function Orders() {
  return <Suspense><Inner /></Suspense>;
}
