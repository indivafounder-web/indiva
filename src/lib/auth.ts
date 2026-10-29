import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "indiva-dev-secret-change-in-production-2026"
);

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "customer" | "seller" | "admin";
};

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function signToken(user: SessionUser) {
  return new SignJWT(user as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret);
}

export async function readToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get("indiva_session")?.value;
  if (!token) return null;
  return readToken(token);
}

export function sidFromCookies() {
  return cookies().get("indiva_sid")?.value || "";
}
