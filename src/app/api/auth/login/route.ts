import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import { signToken, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await one<any>("SELECT * FROM users WHERE email=?", [String(email || "").toLowerCase().trim()]);
  if (!user || !(await verifyPassword(password || "", user.password_hash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  const token = await signToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set("indiva_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
