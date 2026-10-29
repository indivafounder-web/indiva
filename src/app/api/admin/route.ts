import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { q, one, run, getDbInfo, getSettings } from "@/lib/db";

async function admin() {
  const s = await getSession();
  if (!s || s.role !== "admin") return null;
  return s;
}

export async function GET() {
  if (!(await admin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const stats = {
    products: (await one<any>("SELECT COUNT(*) c FROM products"))?.c || 0,
    orders: (await one<any>("SELECT COUNT(*) c FROM orders"))?.c || 0,
    revenue: (await one<any>("SELECT COALESCE(SUM(total),0) c FROM orders"))?.c || 0,
    customers: (await one<any>("SELECT COUNT(*) c FROM users WHERE role='customer'"))?.c || 0,
    artisans: (await one<any>("SELECT COUNT(*) c FROM artisans"))?.c || 0,
    pending: (await one<any>("SELECT COUNT(*) c FROM products WHERE status='pending'"))?.c || 0,
    sos: (await one<any>("SELECT COUNT(*) c FROM sos_alerts WHERE status='open'"))?.c || 0,
    exportOrders: (await one<any>("SELECT COUNT(*) c FROM orders WHERE is_export=1"))?.c || 0,
  };
  const recentOrders = await q("SELECT * FROM orders ORDER BY id DESC LIMIT 8");
  const topProducts = await q("SELECT id,name,sold,price,image FROM products ORDER BY sold DESC LIMIT 6");
  const artisans = await q("SELECT * FROM artisans ORDER BY income_total DESC");
  const sos = await q(
    `SELECT so.*, a.name AS artisan_name FROM sos_alerts so LEFT JOIN artisans a ON a.id=so.artisan_id ORDER BY so.id DESC`
  );
  const products = await q(
    `SELECT p.*, c.name AS category_name, s.name AS state_name, a.name AS artisan_name
     FROM products p LEFT JOIN categories c ON c.id=p.category_id LEFT JOIN states s ON s.id=p.state_id
     LEFT JOIN artisans a ON a.id=p.artisan_id ORDER BY p.id DESC`
  );
  const orders = await q("SELECT o.*, u.name AS customer FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.id DESC");
  for (const o of orders as any[]) o.items = await q("SELECT * FROM order_items WHERE order_id=?", [o.id]);
  const customers = await q("SELECT id,name,email,phone,city,state,role,created_at FROM users ORDER BY id DESC");
  const warehouses = await q("SELECT * FROM warehouses");
  const inventory = await q(
    `SELECT i.*, p.name AS product_name, p.sku, w.name AS warehouse_name
     FROM inventory i JOIN products p ON p.id=i.product_id JOIN warehouses w ON w.id=i.warehouse_id ORDER BY p.name`
  );
  const categories = await q("SELECT * FROM categories");
  const states = await q("SELECT * FROM states ORDER BY name");
  const salesByDay = await q(
    `SELECT substr(created_at,1,10) AS d, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
     FROM orders GROUP BY substr(created_at,1,10) ORDER BY d DESC LIMIT 14`
  );
  return NextResponse.json({
    stats, recentOrders, topProducts, artisans, sos, products, orders, customers,
    warehouses, inventory, categories, states, salesByDay, db: getDbInfo(), settings: await getSettings(),
  });
}

export async function POST(req: Request) {
  if (!(await admin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const { action } = b;
  if (action === "order_status") {
    await run("UPDATE orders SET status=? WHERE id=?", [b.status, b.id]);
  } else if (action === "product_status") {
    await run("UPDATE products SET status=? WHERE id=?", [b.status, b.id]);
  } else if (action === "product_update") {
    await run(
      "UPDATE products SET name=?, price=?, mrp=?, stock=?, quality_tier=?, featured=?, gi_tagged=?, status=? WHERE id=?",
      [b.name, b.price, b.mrp, b.stock, b.quality_tier, b.featured ? 1 : 0, b.gi_tagged ? 1 : 0, b.status, b.id]
    );
  } else if (action === "product_delete") {
    await run("DELETE FROM products WHERE id=?", [b.id]);
  } else if (action === "sos") {
    await run("UPDATE sos_alerts SET status=? WHERE id=?", [b.status, b.id]);
  } else if (action === "verify_artisan") {
    await run("UPDATE artisans SET verified=? WHERE id=?", [b.verified ? 1 : 0, b.id]);
  } else if (action === "inventory") {
    await run("UPDATE inventory SET qty=? WHERE id=?", [b.qty, b.id]);
  } else if (action === "user_role") {
    await run("UPDATE users SET role=? WHERE id=?", [b.role, b.id]);
  } else if (action === "setting") {
    await run("UPDATE company_settings SET value=? WHERE key=?", [String(b.value ?? ""), b.key]);
  } else if (action === "broadcast") {
    await run("UPDATE company_settings SET value=? WHERE key=?", [b.message || "", "announcement"]);
  }
  return NextResponse.json({ ok: true });
}
