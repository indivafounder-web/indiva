export function inr(n: number | null | undefined) {
  const v = Number(n || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
}

export function usd(n: number | null | undefined) {
  const v = Number(n || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
}

export function slugify(s: string) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function deliveryEta(days = 5) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function orderNo() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.floor(Math.random() * 900 + 100);
  return `IN${t}${r}`;
}

export function stars(n: number) {
  const full = Math.round(n);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export function plain<T = any>(row: T): T {
  return JSON.parse(JSON.stringify(row));
}

export function parseJson<T>(s: any, fallback: T): T {
  try {
    if (!s) return fallback;
    if (typeof s === "object") return s as T;
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}
