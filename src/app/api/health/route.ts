import { NextResponse } from "next/server";
import { ensureDb, getDbInfo } from "@/lib/db";

export async function GET() {
  await ensureDb();
  const db = getDbInfo();
  return NextResponse.json({
    ok: true,
    brand: "INDIVA",
    time: new Date().toISOString(),
    database: { engine: db.engine, label: db.label, persistent: db.persistent },
  });
}
