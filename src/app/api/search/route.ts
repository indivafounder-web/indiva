import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") || "").trim();
  if (!query) return NextResponse.json({ products: [] });
  const like = `%${query}%`;
  const products = await q(
    `SELECT p.id,p.name,p.slug,p.price,p.image FROM products p
     LEFT JOIN states s ON s.id=p.state_id
     LEFT JOIN categories c ON c.id=p.category_id
     WHERE p.status='active' AND (p.name LIKE ? OR p.sku LIKE ? OR s.name LIKE ? OR c.name LIKE ? OR p.gi_name LIKE ?)
     LIMIT 10`,
    [like, like, like, like, like]
  );
  return NextResponse.json({ products });
}
