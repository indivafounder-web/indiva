"use client";
import { useEffect, useState } from "react";
import ClientShell from "@/components/ClientShell";
import ProductCard from "@/components/ProductCard";

export default function Wishlist() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/wishlist").then((r) => r.json()).then((d) => setItems(d.items || []));
  }, []);
  return (
    <ClientShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl mb-6">Wishlist</h1>
        {items.length === 0 ? <p className="text-maroon-600">Nothing saved yet.</p> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </ClientShell>
  );
}
