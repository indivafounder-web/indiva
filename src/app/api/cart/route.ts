import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { q, one, run } from "@/lib/db";

function owner() {
  const user = null as any;
  return user;
}

async function who() {
  const s = await getSession();
  const sid = cookies().get("indiva_sid")?.value || "anon";
  return { s, sid };
}

export async function GET() {
  const { s, sid } = await who();
  const items = s
    ? await q(
        `SELECT ci.id, ci.qty, p.id AS product_id, p.name, p.slug, p.price, p.mrp, p.image, p.stock
         FROM cart_items ci JOIN products p ON p.id=ci.product_id WHERE ci.user_id=?`,
        [s.id]
      )
    : await q(
        `SELECT ci.id, ci.qty, p.id AS product_id, p.name, p.slug, p.price, p.mrp, p.image, p.stock
         FROM cart_items ci JOIN products p ON p.id=ci.product_id WHERE ci.session_id=?`,
        [sid]
      );
  const subtotal = items.reduce((a: number, i: any) => a + i.price * i.qty, 0);
  return NextResponse.json({ items, subtotal });
}

export async function POST(req: Request) {
  const { s, sid } = await who();
  const { product_id, qty = 1 } = await req.json();
  const pid = Number(product_id);
  const n = Math.max(1, Number(qty));
  const existing = s
    ? await one<any>("SELECT id, qty FROM cart_items WHERE user_id=? AND product_id=?", [s.id, pid])
    : await one<any>("SELECT id, qty FROM cart_items WHERE session_id=? AND product_id=?", [sid, pid]);
  if (existing) {
    await run("UPDATE cart_items SET qty=? WHERE id=?", [existing.qty + n, existing.id]);
  } else if (s) {
    await run("INSERT INTO cart_items (user_id, product_id, qty) VALUES (?,?,?)", [s.id, pid, n]);
  } else {
    await run("INSERT INTO cart_items (session_id, product_id, qty) VALUES (?,?,?)", [sid, pid, n]);
  }
  return GET();
}

export async function PATCH(req: Request) {
  const { id, qty } = await req.json();
  if (Number(qty) <= 0) await run("DELETE FROM cart_items WHERE id=?", [id]);
  else await run("UPDATE cart_items SET qty=? WHERE id=?", [Number(qty), id]);
  return GET();
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const all = searchParams.get("all");
  const { s, sid } = await who();
  if (all) {
    if (s) await run("DELETE FROM cart_items WHERE user_id=?", [s.id]);
    else await run("DELETE FROM cart_items WHERE session_id=?", [sid]);
  } else if (id) {
    await run("DELETE FROM cart_items WHERE id=?", [id]);
  }
  return GET();
}
