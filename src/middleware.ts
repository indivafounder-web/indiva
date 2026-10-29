import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.get("indiva_sid")) {
    const sid = crypto.randomUUID();
    res.cookies.set("indiva_sid", sid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|icons).*)"] };
