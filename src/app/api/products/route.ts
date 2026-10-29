import { NextResponse } from "next/server";
import { q, one, run } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const where = ["p.status = 'active'"];
  const args: any[] = [];
  if (sp.get("q")) {
    where.push("(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)");
    const like = `%${sp.get("q")}%`;
    args.push(like, like, like);
  }
  if (sp.get("category")) {
    where.push("c.slug = ?");
    args.push(sp.get("category"));
  }
  if (sp.get("state")) {
    where.push("s.slug = ?");
    args.push(sp.get("state"));
  }
  if (sp.get("gi") === "1") where.push("p.gi_tagged = 1");
  if (sp.get("tier")) {
    where.push("p.quality_tier = ?");
    args.push(Number(sp.get("tier")));
  }
  if (sp.get("featured") === "1") where.push("p.featured = 1");
  if (sp.get("min")) {
    where.push("p.price >= ?");
    args.push(Number(sp.get("min")));
  }
  if (sp.get("max")) {
    where.push("p.price <= ?");
    args.push(Number(sp.get("max")));
  }
  const sort = sp.get("sort") || "featured";
  const order =
    sort === "price_asc" ? "p.price ASC" :
    sort === "price_desc" ? "p.price DESC" :
    sort === "rating" ? "p.rating DESC" :
    sort === "new" ? "p.id DESC" :
    "p.featured DESC, p.sold DESC";
  const page = Math.max(1, Number(sp.get("page") || 1));
  const limit = Math.min(48, Number(sp.get("limit") || 24));
  const offset = (page - 1) * limit;

  const countRow = await one<any>(
    `SELECT COUNT(*) AS c FROM products p
     LEFT JOIN categories c ON c.id=p.category_id
     LEFT JOIN states s ON s.id=p.state_id
     WHERE ${where.join(" AND ")}`,
    args
  );
  const products = await q(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
            s.name AS state_name, s.slug AS state_slug,
            a.name AS artisan_name
     FROM products p
     LEFT JOIN categories c ON c.id=p.category_id
     LEFT JOIN states s ON s.id=p.state_id
     LEFT JOIN artisans a ON a.id=p.artisan_id
     WHERE ${where.join(" AND ")}
     ORDER BY ${order}
     LIMIT ? OFFSET ?`,
    [...args, limit, offset]
  );
  return NextResponse.json({ products, total: Number(countRow?.c || 0), page, limit });
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || (s.role !== "admin" && s.role !== "seller")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const b = await req.json();
  const name = String(b.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const slug = slugify(name) + "-" + Math.floor(Math.random() * 999);
  const sku = "IND-" + Date.now().toString(36).toUpperCase();
  const status = s.role === "admin" ? "active" : "pending";
  let artisanId = b.artisan_id || null;
  if (s.role === "seller") {
    const a = await one<any>("SELECT id FROM artisans WHERE user_id=?", [s.id]);
    artisanId = a?.id || null;
  }
  const r = await run(
    `INSERT INTO products (sku,name,slug,description,story,price,export_price,mrp,category_id,state_id,artisan_id,image,images,stock,quality_tier,gi_tagged,gi_name,material,origin_village,making_process,status,featured)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      sku, name, slug, b.description || "", b.story || "",
      Number(b.price || 0), Number(b.export_price || 0), Number(b.mrp || b.price || 0),
      Number(b.category_id || 1), Number(b.state_id || 1), artisanId,
      b.image || "/brand/store.jpg", JSON.stringify([b.image || "/brand/store.jpg"]),
      Number(b.stock || 10), Number(b.quality_tier || 2), b.gi_tagged ? 1 : 0, b.gi_name || "",
      b.material || "", b.origin_village || "", b.making_process || "", status, 0,
    ]
  );
  return NextResponse.json({ id: Number(r.lastInsertRowid), sku, slug, status });
}
