import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { one } from "@/lib/db";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ user: null });
  const user = await one<any>("SELECT id,name,email,role,phone,city,state FROM users WHERE id=?", [s.id]);
  return NextResponse.json({ user });
}
