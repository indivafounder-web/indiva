# INDIVA

**One India. One Store. One Experience.**

Luxury marketplace + Super Admin + artisan Seller app. Host the **website on Render**, keep **code on GitHub**, store **data on any SQL service** (Turso, Postgres, MySQL).

Step-by-step: **[DEPLOY.md](./DEPLOY.md)**

## Surfaces

| App | Route |
| --- | --- |
| Amazon-style store / PWA | `/` `/shop` `/product/[slug]` `/cart` `/checkout` |
| 29 states | `/states` |
| Artisan + QR passport | `/artisan/[id]` `/passport/[sku]` |
| Super Admin | `/admin` |
| Seller app | `/seller` |

### Demo logins

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `admin@indiva.in` | `Indiva@2026` |
| Seller | `seller@indiva.in` | `Seller@2026` |
| Customer | `customer@indiva.in` | `Customer@2026` |

## SQL backends (auto-detected)

Set **one** of these. The app creates tables and seeds on first boot.

```
DATABASE_URL=postgres://…          # Render Postgres, Neon, Supabase, Railway, RDS
DATABASE_URL=mysql://…             # PlanetScale, TiDB, RDS MySQL
TURSO_DATABASE_URL=libsql://…      # Turso + TURSO_AUTH_TOKEN
(none)                             # local SQLite at data/indiva.db
```

Priority: `DATABASE_URL` → `TURSO_DATABASE_URL` → local file.

**On Render always use Turso or Postgres.** The web-service disk is ephemeral.

## Local

```bash
npm install
npm run dev
```

http://localhost:3000

## GitHub → Render

```bash
git remote add origin https://github.com/YOUR_USER/indiva.git
git push -u origin main
```

Then on Render: New Web Service from that repo. Paste SQL env vars. Full click-path in [DEPLOY.md](./DEPLOY.md).

`render.yaml` and `Dockerfile` are included for Render, Railway, Fly, Cloud Run.
