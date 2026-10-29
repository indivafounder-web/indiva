import { createClient, type Client } from "@libsql/client";
import fs from "fs";
import path from "path";
import { seedIfEmpty } from "./seed";

function resolveUrl() {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return "file:" + path.join(dir, "indiva.db");
}

export const db: Client = createClient({
  url: resolveUrl(),
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

export async function q<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  await ensureDb();
  const res = await db.execute({ sql, args });
  return res.rows as unknown as T[];
}

export async function run(sql: string, args: any[] = []) {
  await ensureDb();
  return db.execute({ sql, args });
}

export async function one<T = any>(sql: string, args: any[] = []): Promise<T | null> {
  const rows = await q<T>(sql, args);
  return rows[0] || null;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  phone TEXT,
  city TEXT,
  state TEXT,
  avatar TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS artisans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT NOT NULL,
  village TEXT,
  state TEXT,
  craft TEXT,
  bio TEXT,
  photo TEXT,
  gi_certified INTEGER DEFAULT 0,
  women_led INTEGER DEFAULT 0,
  shg_name TEXT,
  years_experience INTEGER DEFAULT 10,
  income_total INTEGER DEFAULT 0,
  savings INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  icon TEXT
);
CREATE TABLE IF NOT EXISTS states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  region TEXT,
  tagline TEXT,
  story TEXT,
  image TEXT,
  featured INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  story TEXT,
  price INTEGER NOT NULL,
  export_price INTEGER,
  mrp INTEGER,
  category_id INTEGER,
  state_id INTEGER,
  artisan_id INTEGER,
  image TEXT,
  images TEXT,
  stock INTEGER DEFAULT 20,
  quality_tier INTEGER DEFAULT 1,
  gi_tagged INTEGER DEFAULT 0,
  gi_name TEXT,
  rating REAL DEFAULT 4.6,
  reviews_count INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  hs_code TEXT,
  weight_grams INTEGER DEFAULT 400,
  material TEXT,
  care TEXT,
  origin_village TEXT,
  making_process TEXT,
  eco_impact TEXT,
  status TEXT DEFAULT 'active',
  warehouse TEXT DEFAULT 'Mumbai Hub',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  user_id INTEGER,
  rating INTEGER,
  title TEXT,
  body TEXT,
  author TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  session_id TEXT,
  product_id INTEGER NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS wishlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  session_id TEXT,
  product_id INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  phone TEXT,
  line1 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India'
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE NOT NULL,
  user_id INTEGER,
  status TEXT DEFAULT 'confirmed',
  total INTEGER,
  shipping INTEGER,
  tax INTEGER,
  address_json TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'paid',
  is_export INTEGER DEFAULT 0,
  country TEXT DEFAULT 'India',
  tracking TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  product_id INTEGER,
  name TEXT,
  price INTEGER,
  qty INTEGER,
  artisan_id INTEGER,
  image TEXT
);
CREATE TABLE IF NOT EXISTS sos_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artisan_id INTEGER,
  user_id INTEGER,
  message TEXT,
  status TEXT DEFAULT 'open',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS warehouses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  city TEXT,
  type TEXT
);
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  warehouse_id INTEGER,
  qty INTEGER
);
CREATE TABLE IF NOT EXISTS savings_tx (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artisan_id INTEGER,
  amount INTEGER,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
`;

let boot: Promise<void> | null = null;

async function init() {
  const statements = SCHEMA.split(";").map((s) => s.trim()).filter(Boolean);
  for (const sql of statements) {
    await db.execute(sql);
  }
  await seedIfEmpty(db);
}

export function ensureDb() {
  if (!boot) boot = init();
  return boot;
}
