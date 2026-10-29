import { createClient, type Client } from "@libsql/client";
import fs from "fs";
import path from "path";
import { seedIfEmpty, type SeedDb } from "./seed";

export type SqlEngine = "sqlite" | "turso" | "postgres" | "mysql";

type PgPool = {
  query: (sql: string, args?: any[]) => Promise<{ rows: any[]; rowCount?: number }>;
};
type MysqlPool = {
  execute: (sql: string, args?: any[]) => Promise<any>;
};

let engine: SqlEngine = "sqlite";
let engineLabel = "Local SQLite";
let libsql: Client | null = null;
let pg: PgPool | null = null;
let mysql: MysqlPool | null = null;
let detectedHost = "local file";

function detect() {
  const databaseUrl = (process.env.DATABASE_URL || "").trim();
  const tursoUrl = (process.env.TURSO_DATABASE_URL || "").trim();
  const url = databaseUrl || tursoUrl;

  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
    engine = "postgres";
    engineLabel = hostLabel(url, "PostgreSQL");
    detectedHost = safeHost(url);
    return { url, token: "" };
  }
  if (url.startsWith("mysql://") || url.startsWith("mysql2://")) {
    engine = "mysql";
    engineLabel = hostLabel(url, "MySQL");
    detectedHost = safeHost(url);
    return { url, token: "" };
  }
  if (tursoUrl || url.startsWith("libsql://") || url.startsWith("wss://") || url.startsWith("https://")) {
    engine = "turso";
    engineLabel = "Turso (libSQL)";
    detectedHost = safeHost(tursoUrl || url);
    return { url: tursoUrl || url, token: process.env.TURSO_AUTH_TOKEN || "" };
  }
  engine = "sqlite";
  engineLabel = "Local SQLite";
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "indiva.db");
  detectedHost = file;
  return { url: "file:" + file, token: "" };
}

function safeHost(url: string) {
  try {
    const u = new URL(url.replace(/^libsql:/, "https:").replace(/^mysql2:/, "mysql:"));
    return u.hostname;
  } catch {
    return "configured";
  }
}

function hostLabel(url: string, base: string) {
  const h = safeHost(url);
  if (h.includes("neon.tech")) return "Neon PostgreSQL";
  if (h.includes("supabase")) return "Supabase PostgreSQL";
  if (h.includes("render.com")) return "Render PostgreSQL";
  if (h.includes("railway")) return "Railway PostgreSQL";
  if (h.includes("amazonaws.com")) return "AWS RDS";
  if (h.includes("planetscale")) return "PlanetScale MySQL";
  if (h.includes("tidbcloud")) return "TiDB Cloud";
  return `${base} · ${h}`;
}

function pgPlaceholders(sql: string) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

function dialectSchema(raw: string) {
  if (engine === "postgres") {
    return raw
      .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, "SERIAL PRIMARY KEY")
      .replace(/DEFAULT \(datetime\('now'\)\)/g, "DEFAULT (NOW()::text)")
      .replace(/\bREAL\b/g, "DOUBLE PRECISION");
  }
  if (engine === "mysql") {
    return raw
      .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, "INT AUTO_INCREMENT PRIMARY KEY")
      .replace(/DEFAULT \(datetime\('now'\)\)/g, "DEFAULT (CURRENT_TIMESTAMP)")
      .replace(/\bREAL\b/g, "DOUBLE")
      .replace(/email TEXT UNIQUE NOT NULL/g, "email VARCHAR(191) UNIQUE NOT NULL")
      .replace(/slug TEXT UNIQUE NOT NULL/g, "slug VARCHAR(191) UNIQUE NOT NULL")
      .replace(/sku TEXT UNIQUE NOT NULL/g, "sku VARCHAR(64) UNIQUE NOT NULL")
      .replace(/order_no TEXT UNIQUE NOT NULL/g, "order_no VARCHAR(64) UNIQUE NOT NULL");
  }
  return raw;
}

const SQLITE_SCHEMA = `
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
CREATE TABLE IF NOT EXISTS company_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
`;

async function openConnections() {
  const { url, token } = detect();
  if (engine === "postgres") {
    const { Pool } = await import("pg");
    pg = new Pool({
      connectionString: url,
      ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
      max: 5,
    }) as unknown as PgPool;
    return;
  }
  if (engine === "mysql") {
    const mysql2 = await import("mysql2/promise");
    mysql = (await mysql2.createPool({
      uri: url.replace(/^mysql2:/, "mysql:"),
      ssl: url.includes("localhost") ? undefined : { rejectUnauthorized: false },
    })) as unknown as MysqlPool;
    return;
  }
  libsql = createClient({ url, authToken: token || undefined });
}

async function raw(sql: string, args: any[] = []): Promise<{ rows: any[]; lastInsertRowid: number }> {
  if (!pg && !mysql && !libsql) await openConnections();
  if (engine === "postgres" && pg) {
    let statement = sql;
    if (/^\s*INSERT/i.test(statement) && !/RETURNING/i.test(statement)) {
      statement = statement.replace(/\s*;?\s*$/, "") + " RETURNING id";
    }
    const res = await pg.query(pgPlaceholders(statement), args);
    const rows = res.rows || [];
    return { rows, lastInsertRowid: Number(rows[0]?.id || 0) };
  }
  if (engine === "mysql" && mysql) {
    const [res] = await mysql.execute(sql, args);
    if (Array.isArray(res)) return { rows: res as any[], lastInsertRowid: 0 };
    return { rows: [], lastInsertRowid: Number((res as any).insertId || 0) };
  }
  const res = await libsql!.execute({ sql, args });
  return { rows: res.rows as any[], lastInsertRowid: Number(res.lastInsertRowid || 0) };
}

export async function q<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  await ensureDb();
  const res = await raw(sql, args);
  return res.rows as T[];
}

export async function run(sql: string, args: any[] = []) {
  await ensureDb();
  return raw(sql, args);
}

export async function one<T = any>(sql: string, args: any[] = []): Promise<T | null> {
  const rows = await q<T>(sql, args);
  return rows[0] || null;
}

export function getDbInfo() {
  return {
    engine,
    label: engineLabel,
    host: detectedHost,
    persistent: engine !== "sqlite",
    hint:
      engine === "sqlite"
        ? "Local file only — on Render this disk is wiped on each deploy. Set DATABASE_URL (Postgres) or TURSO_DATABASE_URL."
        : `Writing to ${engineLabel}`,
  };
}

let boot: Promise<void> | null = null;

async function init() {
  await openConnections();
  const schema = dialectSchema(SQLITE_SCHEMA);
  const statements = schema.split(";").map((s) => s.trim()).filter(Boolean);
  for (const sql of statements) {
    await raw(sql);
  }
  const seedClient: SeedDb = {
    execute: async (stmt) => {
      const sql = typeof stmt === "string" ? stmt : stmt.sql;
      const args = typeof stmt === "string" ? [] : stmt.args || [];
      return raw(sql, args);
    },
  };
  await seedIfEmpty(seedClient);
  const defaults: Array<[string, string]> = [
    ["freeze_store", "0"],
    ["pause_listings", "0"],
    ["lock_payouts", "0"],
    ["takeover", "0"],
    ["announcement", ""],
  ];
  for (const [k, v] of defaults) {
    const ex = await raw("SELECT key FROM company_settings WHERE key=?", [k]);
    if (!ex.rows.length) await raw("INSERT INTO company_settings (key,value) VALUES (?,?)", [k, v]);
  }
}

async function ensureSettings() {
  await raw("CREATE TABLE IF NOT EXISTS company_settings (key TEXT PRIMARY KEY, value TEXT)");
  const defaults: Array<[string, string]> = [
    ["freeze_store", "0"],
    ["pause_listings", "0"],
    ["lock_payouts", "0"],
    ["takeover", "0"],
    ["announcement", ""],
  ];
  for (const [k, v] of defaults) {
    const ex = await raw("SELECT key FROM company_settings WHERE key=?", [k]);
    if (!ex.rows.length) await raw("INSERT INTO company_settings (key,value) VALUES (?,?)", [k, v]);
  }
}

export async function getSettings() {
  await ensureDb();
  await ensureSettings();
  const res = await raw("SELECT key, value FROM company_settings");
  const o: Record<string, string> = {};
  for (const r of res.rows) o[r.key] = r.value;
  return o;
}

export function ensureDb() {
  if (!boot) boot = init();
  return boot;
}
