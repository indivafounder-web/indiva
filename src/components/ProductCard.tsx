"use client";
import Link from "next/link";
import { inr, deliveryEta } from "@/lib/utils";
import { addToCart, toast } from "./Experience";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

export type ProductLite = {
  id: number;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string;
  rating: number;
  reviews_count: number;
  gi_tagged: number;
  quality_tier: number;
  state_name?: string;
  artisan_name?: string;
  stock?: number;
};

export default function ProductCard({ p, compact = false }: { p: ProductLite; compact?: boolean }) {
  const off = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
  const [busy, setBusy] = useState(false);

  async function quick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    await addToCart(p.id, 1);
    setBusy(false);
  }

  async function wish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: p.id }),
    });
    toast("Saved to wishlist");
  }

  return (
    <Link
      href={`/product/${p.slug}`}
      className="group flex flex-col bg-white border border-maroon-100 rounded-xl overflow-hidden card-lift gold-sheen"
    >
      <div className="relative aspect-square bg-cream-200 overflow-hidden">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {p.gi_tagged ? (
          <span className="absolute top-2 left-2 text-[10px] tracking-wider uppercase bg-maroon-700 text-gold-200 px-2 py-1 rounded">
            GI Tagged
          </span>
        ) : null}
        {p.quality_tier === 1 ? (
          <span className="absolute top-2 right-2 text-[10px] tracking-wider uppercase bg-gold-400 text-maroon-900 px-2 py-1 rounded">
            Tier 1
          </span>
        ) : null}
        {off > 0 ? (
          <span className="absolute bottom-2 left-2 text-[11px] font-semibold bg-red-700 text-white px-2 py-0.5 rounded-full">
            −{off}%
          </span>
        ) : null}
        <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <button onClick={quick} disabled={busy} className="flex-1 py-2 rounded-full bg-gold-400 text-maroon-900 text-xs font-semibold flex items-center justify-center gap-1">
            <ShoppingCart size={14} /> {busy ? "Adding…" : "Add to cart"}
          </button>
          <button onClick={wish} className="w-9 h-9 rounded-full bg-white text-maroon-800 flex items-center justify-center" aria-label="Wishlist">
            <Heart size={14} />
          </button>
        </div>
      </div>
      <div className={`flex flex-col gap-1 ${compact ? "p-2.5" : "p-3.5"}`}>
        <p className="text-[11px] uppercase tracking-wider text-maroon-500">
          {p.state_name || "India"} {p.artisan_name ? `· ${p.artisan_name}` : ""}
        </p>
        <h3 className={`font-medium text-ink leading-snug ${compact ? "text-sm line-clamp-2 min-h-[2.5rem]" : "text-[15px] line-clamp-2 min-h-[2.7rem]"}`}>
          {p.name}
        </h3>
        <p className="stars text-[13px]">
          {"★".repeat(Math.round(p.rating || 0))}
          {"☆".repeat(5 - Math.round(p.rating || 0))}
          <span className="text-maroon-500 font-body text-xs ml-1">({p.reviews_count || 0})</span>
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-semibold">{inr(p.price)}</span>
          {off > 0 ? (
            <>
              <span className="text-xs text-maroon-400 line-through">{inr(p.mrp)}</span>
              <span className="text-xs text-emerald-700">{off}% off</span>
            </>
          ) : null}
        </div>
        {!compact ? (
          <>
            <p className="text-[11px] text-maroon-600">Fulfilled by INDIVA · Get it by {deliveryEta(5)}</p>
            <p className="text-[11px] text-maroon-700">70–80% goes to the artisan</p>
          </>
        ) : null}
      </div>
    </Link>
  );
}
