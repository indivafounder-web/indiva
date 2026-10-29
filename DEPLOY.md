# Deploy INDIVA — GitHub + Render + any SQL database

You can host the **website on Render**, keep **source on GitHub**, and store **all data on any SQL service** (Turso, Render Postgres, Neon, Supabase, Railway, RDS, PlanetScale…). Switch backends by changing one environment variable. Tables are created and seeded automatically on first boot.

---

## 1. Put the code on GitHub

```bash
cd indiva
git remote add origin https://github.com/YOUR_USER/indiva.git
git branch -M main
git push -u origin main
```

(Create the empty repo on GitHub first. Do not upload `node_modules` or `data/` — they are gitignored.)

---

## 2. Pick a SQL database (one is enough)

| Service | Free? | Env vars to set on Render |
| --- | --- | --- |
| **Turso** (libSQL) | Yes | `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` |
| **Neon** Postgres | Yes | `DATABASE_URL=postgres://…neon.tech/…?sslmode=require` |
| **Supabase** Postgres | Yes | `DATABASE_URL=postgres://…supabase.co:5432/postgres` |
| **Render Postgres** | Paid | `DATABASE_URL` (link the database in the Render dashboard) |
| **Railway / RDS / Aiven** | Varies | `DATABASE_URL=postgres://…` |
| **PlanetScale / TiDB** | Yes/varies | `DATABASE_URL=mysql://…` |
| Local laptop | — | nothing — uses `data/indiva.db` |

### Turso (recommended with Render free web)

1. Sign up at [turso.tech](https://turso.tech)
2. `turso db create indiva`
3. `turso db show indiva --url` → `TURSO_DATABASE_URL`
4. `turso db tokens create indiva` → `TURSO_AUTH_TOKEN`

### Neon

1. [console.neon.tech](https://console.neon.tech) → New project `indiva`
2. Copy the connection string → `DATABASE_URL`

### Supabase

1. New project → Settings → Database → Connection string (URI)
2. Paste as `DATABASE_URL`

The app looks at `DATABASE_URL` first, then `TURSO_DATABASE_URL`, then local SQLite. **Never use the local file on Render** — that disk is wiped on every deploy.

---

## 3. Host the website on Render

1. [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint**
   or **New → Web Service** → connect the GitHub repo
2. Settings:
   - **Build:** `npm install && npm run build`
   - **Start:** `npm start`
   - **Health:** `/api/health`
   - Node 20
3. Environment:

```
JWT_SECRET=<long random string>
NEXT_PUBLIC_SITE_URL=https://YOUR-SERVICE.onrender.com

# either Turso
TURSO_DATABASE_URL=libsql://….turso.io
TURSO_AUTH_TOKEN=…

# or any Postgres / MySQL
DATABASE_URL=postgres://…
```

4. Deploy. Open the URL. Sign in:

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | admin@indiva.in | Indiva@2026 |
| Seller | seller@indiva.in | Seller@2026 |
| Customer | customer@indiva.in | Customer@2026 |

Super Admin → Overview shows **which SQL engine is live**.

---

## 4. Other platforms (same SQL)

The repo includes a `Dockerfile`.

- **Railway / Fly.io / Cloud Run / Azure / Google Cloud Run** — deploy the Docker image, set the same env vars.
- **Vercel** — import the GitHub repo, set env vars (Turso or Neon work well here).

---

## Switching SQL later

1. Create the new database.
2. Change `DATABASE_URL` / Turso vars on Render.
3. Redeploy. Empty database → schema + demo catalogue are seeded. Existing data is left untouched.
