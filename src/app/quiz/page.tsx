"use client";
import { useState } from "react";
import ClientShell from "@/components/ClientShell";
import Link from "next/link";

const Q = [
  { q: "You reach for…", a: ["Heavy silk and zari", "Earth pottery", "Spice and tea", "Quiet silver"] },
  { q: "Holiday mood", a: ["Temple towns", "Desert colour", "Coast and pepper", "Hills and wool"] },
  { q: "Gift for a parent", a: ["A saree they will keep", "A painting for the wall", "A hamper of taste", "Jewelry they will wear"] },
];
const MAP = ["/states/tamil-nadu", "/states/rajasthan", "/states/kerala", "/states/odisha"];

export default function Quiz() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(0);
  if (i >= Q.length) {
    return (
      <ClientShell>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold">Your state match</h1>
          <p className="mt-3 text-gray-600">Based on your answers we opened a department for you.</p>
          <Link href={MAP[pick % 4]} className="inline-block mt-6 px-6 py-2 rounded-full bg-[#ffd814] font-medium">Shop your match</Link>
        </div>
      </ClientShell>
    );
  }
  const cur = Q[i];
  return (
    <ClientShell>
      <div className="max-w-lg mx-auto px-4 py-12">
        <p className="text-xs uppercase tracking-widest text-[#c45500]">Feature 24 · {i + 1}/{Q.length}</p>
        <h1 className="text-2xl font-semibold mt-2">{cur.q}</h1>
        <div className="mt-4 space-y-2">
          {cur.a.map((opt, idx) => (
            <button key={opt} onClick={() => { setPick(idx); setI(i + 1); }} className="block w-full text-left border rounded p-3 hover:bg-orange-50">
              {opt}
            </button>
          ))}
        </div>
      </div>
    </ClientShell>
  );
}
