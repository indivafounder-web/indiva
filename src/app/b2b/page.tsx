"use client";
import { useState } from "react";
import ClientShell from "@/components/ClientShell";
import { toast } from "@/components/Experience";

export default function B2B() {
  const [ok, setOk] = useState("");
  function send(e: React.FormEvent) {
    e.preventDefault();
    setOk("Wholesale desk received your request. A buyer will write within 2 business days.");
    toast("B2B enquiry sent");
  }
  return (
    <ClientShell>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-xs uppercase tracking-widest text-[#c45500]">Features 56 · 96</p>
        <h1 className="text-3xl font-semibold">Wholesale & partner API</h1>
        <p className="text-gray-600 mt-2">Boutiques, museums, spas, hotel chains and luxury curators. MOQ and HS codes included.</p>
        <form onSubmit={send} className="mt-6 bg-white border rounded p-6 grid sm:grid-cols-2 gap-3">
          {["House / brand", "Country", "Email", "Category interest"].map((l) => (
            <label key={l} className="text-sm">{l}
              <input required className="mt-1 w-full border rounded px-3 py-2" />
            </label>
          ))}
          <label className="text-sm sm:col-span-2">Notes
            <textarea className="mt-1 w-full border rounded px-3 py-2 h-24" />
          </label>
          <button className="sm:col-span-2 py-2 rounded-full bg-[#ffd814] font-medium">Request a line sheet</button>
          {ok ? <p className="sm:col-span-2 text-green-700 text-sm">{ok}</p> : null}
        </form>
      </div>
    </ClientShell>
  );
}
