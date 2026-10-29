import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { q, one, run } from "@/lib/db";
import { orderNo } from "@/lib/utils";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ orders: [] });
  const orders = await q("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC", [s.id]);
  for (const o of orders as any[]) {
    o.items = await q("SELECT * FROM order_items WHERE order_id=?", [o.id]);
  }
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Please sign in to checkout" }, { status: 401 });
  const body = await req.json();
  const sid = cookies().get("indiva_sid")?.value || "";
  let items = await q<any>(
    `SELECT ci.qty, p.* FROM cart_items ci JOIN products p ON p.id=ci.product_id WHERE ci.user_id=?`,
    [s.id]
  );
  if (!items.length && sid) {
    items = await q<any>(
      `SELECT ci.qty, p.* FROM cart_items ci JOIN products p ON p.id=ci.product_id WHERE ci.session_id=?`,
      [sid]
    );
  }
  if (!items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const isExport = body.country && body.country !== "India";
  const shipping = isExport ? 1200 : subtotal >= 1999 ? 0 : 80;
  const tax = isExport ? 0 : Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;
  const no = orderNo();
  const addr = {
    name: body.name || s.name,
    phone: body.phone || "",
    line1: body.line1 || "",
    city: body.city || "",
    state: body.state || "",
    pincode: body.pincode || "",
    country: body.country || "India",
  };
  const r = await run(
    `INSERT INTO orders (order_no,user_id,status,total,shipping,tax,address_json,payment_method,payment_status,is_export,country,tracking)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [no, s.id, "confirmed", total, shipping, tax, JSON.stringify(addr), body.payment_method || "UPI", "paid", isExport ? 1 : 0, addr.country, "INDIVA-" + no.slice(-6)]
  );
  const oid = Number(r.lastInsertRowid);
  for (const i of items) {
    await run(
      "INSERT INTO order_items (order_id,product_id,name,price,qty,artisan_id,image) VALUES (?,?,?,?,?,?,?)",
      [oid, i.id, i.name, i.price, i.qty, i.artisan_id, i.image]
    );
    await run("UPDATE products SET stock=MAX(stock-?,0), sold=sold+? WHERE id=?", [i.qty, i.qty, i.id]);
    if (i.artisan_id) {
      const credit = Math.round(i.price * i.qty * 0.75);
      await run("UPDATE artisans SET income_total=income_total+?, savings=savings+? WHERE id=?", [credit, Math.round(credit * 0.08), i.artisan_id]);
      await run("INSERT INTO savings_tx (artisan_id,amount,note) VALUES (?,?,?)", [i.artisan_id, Math.round(credit * 0.08), "Auto-save 8% of order " + no]);
    }
  }
  await run("DELETE FROM cart_items WHERE user_id=?", [s.id]);
  if (sid) await run("DELETE FROM cart_items WHERE session_id=?", [sid]);
  return NextResponse.json({ order_no: no, id: oid, total });
}
