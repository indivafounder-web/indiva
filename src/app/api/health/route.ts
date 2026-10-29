import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";

export async function GET() {
  await ensureDb();
  return NextResponse.json({ ok: true, brand: "INDIVA", time: new Date().toISOString() });
}
