import { NextResponse } from "next/server";
import { one, run } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");
  const role = body.role === "seller" ? "seller" : "customer";
  if (!name || !email || password.length < 6) {
    return NextResponse.json({ error: "Name, email and a 6+ character password are required" }, { status: 400 });
  }
  const exists = await one("SELECT id FROM users WHERE email=?", [email]);
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const hash = await hashPassword(password);
  const r = await run(
    "INSERT INTO users (name,email,password_hash,role,phone,city,state) VALUES (?,?,?,?,?,?,?)",
    [name, email, hash, role, body.phone || "", body.city || "", body.state || ""]
  );
  const id = Number(r.lastInsertRowid);
  if (role === "seller") {
    await run(
      "INSERT INTO artisans (user_id,name,village,state,craft,bio,photo,women_led,verified) VALUES (?,?,?,?,?,?,?,?,?)",
      [id, name, body.city || "", body.state || "", body.craft || "Heritage craft", "New INDIVA artisan.", "/brand/artisan.jpg", 1, 0]
    );
  }
  const token = await signToken({ id, name, email, role });
  const res = NextResponse.json({ user: { id, name, email, role } });
  res.cookies.set("indiva_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
