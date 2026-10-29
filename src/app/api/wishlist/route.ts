import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { q, one, run } from "@/lib/db";

async function who() {
  const s = await getSession();
  const sid = cookies().get("indiva_sid")?.value || "anon";
  return { s, sid };
}

export async function GET() {
  const { s, sid } = await who();
  const items = s
    ? await q(
        `SELECT p.*, s.name AS state_name, a.name AS artisan_name FROM wishlists w
         JOIN products p ON p.id=w.product_id LEFT JOIN states s ON s.id=p.state_id
         LEFT JOIN artisans a ON a.id=p.artisan_id WHERE w.user_id=?`,
        [s.id]
      )
    : await q(
        `SELECT p.*, st.name AS state_name, a.name AS artisan_name FROM wishlists w
         JOIN products p ON p.id=w.product_id LEFT JOIN states st ON st.id=p.state_id
         LEFT JOIN artisans a ON a.id=p.artisan_id WHERE w.session_id=?`,
        [sid]
      );
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const { s, sid } = await who();
  const { product_id } = await req.json();
  const existing = s
    ? await one("SELECT id FROM wishlists WHERE user_id=? AND product_id=?", [s.id, product_id])
    : await one("SELECT id FROM wishlists WHERE session_id=? AND product_id=?", [sid, product_id]);
  if (existing) {
    await run("DELETE FROM wishlists WHERE id=?", [(existing as any).id]);
    return NextResponse.json({ saved: false });
  }
  if (s) await run("INSERT INTO wishlists (user_id, product_id) VALUES (?,?)", [s.id, product_id]);
  else await run("INSERT INTO wishlists (session_id, product_id) VALUES (?,?)", [sid, product_id]);
  return NextResponse.json({ saved: true });
}
