import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { q, one, run } from "@/lib/db";

async function seller() {
  const s = await getSession();
  if (!s || (s.role !== "seller" && s.role !== "admin")) return null;
  return s;
}

export async function GET() {
  const s = await seller();
  if (!s) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let artisan = await one<any>("SELECT * FROM artisans WHERE user_id=?", [s.id]);
  if (!artisan && s.role === "admin") artisan = await one<any>("SELECT * FROM artisans ORDER BY id LIMIT 1");
  if (!artisan) return NextResponse.json({ error: "No artisan profile" }, { status: 404 });
  const listings = await q("SELECT * FROM products WHERE artisan_id=? ORDER BY id DESC", [artisan.id]);
  const orders = await q(
    `SELECT oi.*, o.order_no, o.status, o.created_at, o.country FROM order_items oi
     JOIN orders o ON o.id=oi.order_id WHERE oi.artisan_id=? ORDER BY oi.id DESC`,
    [artisan.id]
  );
  const savings = await q("SELECT * FROM savings_tx WHERE artisan_id=? ORDER BY id DESC", [artisan.id]);
  const sos = await q("SELECT * FROM sos_alerts WHERE artisan_id=? ORDER BY id DESC", [artisan.id]);
  return NextResponse.json({ artisan, listings, orders, savings, sos });
}

export async function POST(req: Request) {
  const s = await seller();
  if (!s) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const artisan = await one<any>("SELECT * FROM artisans WHERE user_id=?", [s.id]);
  const b = await req.json();
  if (b.action === "sos") {
    await run("INSERT INTO sos_alerts (artisan_id,user_id,message,status) VALUES (?,?,?,?)", [
      artisan?.id, s.id, b.message || "Need help from INDIVA team", "open",
    ]);
  }
  if (b.action === "save") {
    const amt = Number(b.amount || 0);
    if (amt > 0 && artisan) {
      await run("UPDATE artisans SET savings=savings+? WHERE id=?", [amt, artisan.id]);
      await run("INSERT INTO savings_tx (artisan_id,amount,note) VALUES (?,?,?)", [artisan.id, amt, b.note || "Manual save"]);
    }
  }
  return NextResponse.json({ ok: true });
}
