"use client";
import { useState } from "react";
import ClientShell from "@/components/ClientShell";

export default function Tracking() {
  const [id, setId] = useState("");
  const [show, setShow] = useState(false);
  return (
    <ClientShell>
      <div className="max-w-xl mx-auto px-4 py-10">
        <p className="text-xs uppercase tracking-widest text-[#c45500]">Features 84 · 85</p>
        <h1 className="text-3xl font-semibold">Track a parcel</h1>
        <form onSubmit={(e) => { e.preventDefault(); setShow(true); }} className="mt-4 flex gap-2">
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Order no. or INDIVA-XXXX" className="flex-1 border rounded px-3 py-2" />
          <button className="px-5 bg-[#ffd814] rounded-full font-medium">Track</button>
        </form>
        {show ? (
          <ol className="mt-6 space-y-3">
            {[
              ["Mumbai Hub", "Packed · QR passport sealed"],
              ["Delhi gateway", "Export docs · HS code attached"],
              ["In flight / road", "DHL / Shiprocket"],
              ["Out for delivery", "Predictive window tomorrow 2–6pm"],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className={`w-3 h-3 rounded-full mt-1 ${i < 3 ? "bg-green-600" : "bg-gray-300"}`} />
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="text-sm text-gray-600">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </ClientShell>
  );
}
