"use client";
import { useState } from "react";
import ClientShell from "@/components/ClientShell";
import { addToCart, toast } from "@/components/Experience";

const ITEMS = [
  { id: 16, name: "Darjeeling First Flush", price: 890 },
  { id: 18, name: "Malabar Pepper", price: 420 },
  { id: 23, name: "Ayurvedic Hair Oil", price: 680 },
  { id: 24, name: "Sandalwood Soap Trio", price: 240 },
  { id: 36, name: "Onam Wellness Hamper", price: 1890 },
  { id: 4, name: "Bandhani Odhani", price: 4500 },
];

export default function Hampers() {
  const [sel, setSel] = useState<number[]>([16, 18]);
  const [note, setNote] = useState("");
  const chosen = ITEMS.filter((i) => sel.includes(i.id));
  const total = chosen.reduce((a, i) => a + i.price, 0);

  function toggle(id: number) {
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function addAll() {
    for (const i of chosen) await addToCart(i.id, 1);
    toast("Hamper in cart" + (note ? " · note attached" : ""));
  }

  return (
    <ClientShell>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-xs uppercase tracking-widest text-[#c45500]">Features 08–10</p>
        <h1 className="text-3xl font-semibold">Festive hamper builder</h1>
        <p className="text-gray-600 mt-1">Compose a gift. Add a handwritten note. 70–80% still reaches each maker.</p>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-2">
            {ITEMS.map((i) => (
              <label key={i.id} className={`flex justify-between border rounded p-3 cursor-pointer ${sel.includes(i.id) ? "border-[#c45500] bg-orange-50" : "border-gray-200"}`}>
                <span>
                  <input type="checkbox" className="mr-2" checked={sel.includes(i.id)} onChange={() => toggle(i.id)} />
                  {i.name}
                </span>
                <span>₹{i.price}</span>
              </label>
            ))}
          </div>
          <div className="bg-white border rounded p-5">
            <h2 className="font-semibold">Your box</h2>
            <ul className="mt-2 text-sm space-y-1">
              {chosen.map((i) => <li key={i.id}>{i.name}</li>)}
            </ul>
            <label className="block text-sm mt-4">Handwritten / voice note
              <textarea value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full border rounded px-3 py-2 h-24" placeholder="For Amma, with love from London…" />
            </label>
            <p className="text-xl font-semibold mt-3">₹{total}</p>
            <button onClick={addAll} className="mt-3 w-full py-2 rounded-full bg-[#ffd814] font-medium">Add hamper to cart</button>
          </div>
        </div>
      </div>
    </ClientShell>
  );
}
