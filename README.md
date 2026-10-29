# INDIVA

**One India. One Store. One Experience.**

Luxury marketplace + Super Admin + artisan Seller app for authentic crafts from all 29 Indian states.

This is a production-shaped Next.js app designed to run on **GitHub** (source), **Render** (hosting) and **Turso** (libSQL database).

## What you get

| Surface | Route | Who |
| --- | --- | --- |
| Amazon-style storefront (PWA / app) | `/` `/shop` `/product/[slug]` `/cart` `/checkout` | Customers |
| Shop by 29 states | `/states` | Customers |
| Artisan + QR product passport | `/artisan/[id]` `/passport/[sku]` | Customers |
| Super Admin | `/admin` | House operators |
| Seller app (income, listings, SOS, savings) | `/seller` | Artisans |

### Demo logins

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `admin@indiva.in` | `Indiva@2026` |
| Seller (Meera Devi) | `seller@indiva.in` | `Seller@2026` |
| Customer | `customer@indiva.in` | `Customer@2026` |

## Stack

- **App:** Next.js 14 (App Router) + Tailwind — installs as a PWA
- **Database:** [Turso](https://turso.tech) (libSQL). Falls back to a local SQLite file at `data/indiva.db` when Turso env vars are absent
- **Hosting:** [Render](https://render.com) via `render.yaml`
- **Source:** GitHub, with `.github/workflows/ci.yml`

## Local

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open http://localhost:3000

## Turso

1. Create a database in the Turso dashboard (or `turso db create indiva`).
2. Copy the `libsql://…` URL and auth token.
3. Set:

```
TURSO_DATABASE_URL=libsql://indiva-xxxx.turso.io
TURSO_AUTH_TOKEN=…
JWT_SECRET=long-random-string
```

On first boot the app creates tables and seeds catalogue, artisans, warehouses and demo orders.

## GitHub

```bash
git init
git add .
git commit -m "INDIVA: store, super admin, seller app"
git remote add origin git@github.com:YOUR_ORG/indiva.git
git push -u origin main
```

## Render

1. New → Blueprint, point at this repo (`render.yaml`), **or** New Web Service from the repo.
2. Build: `npm install && npm run build`
3. Start: `npm start` (binds `0.0.0.0` and `$PORT`)
4. Add env vars: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`
5. Health check: `/api/health`

Render’s disk is ephemeral — **use Turso** in production so catalogue and orders survive deploys.

## Brand

Maroon + gold + cream. Lotus mark. Direct-to-artisan (70–80% to the maker), GI tags, plastic-free packing, three quality tiers, export desk for US/UK/UAE and friends.

INDIVA is a movement to make India’s culture global, accessible, and aspirational.
