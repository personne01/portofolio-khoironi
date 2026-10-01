# Khoironi Portfolio

Personal portfolio and content-management backend. Public visitors read the site;
the owner edits content through a password-protected admin panel backed by
PostgreSQL.

The app is a single Next.js service that serves both the UI and its own JSON API,
so there is no separate backend to deploy.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.1.4 (App Router, React 19) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Prisma 7.10 (`@prisma/adapter-pg`, driver-adapter based) |
| Auth | Hand-rolled session cookies (`lib/admin/`) — no third-party auth provider |
| Tests | Vitest 5 |
| CORS | Handled in `proxy.ts` |

Runtime database access goes through `@prisma/adapter-pg` rather than Prisma's
Rust query engine, which keeps the deployment footprint JavaScript-only.

## Prerequisites

- **Node.js 22** — Next.js 16 requires `>=20.9.0`. Node 20 is end-of-life as of
  April 2026, so use 22 or newer.
- **PostgreSQL 14+** running locally (or a managed instance you can reach).
- npm.

## Quick start

```bash
# 1. Install exactly what the lockfile pins
npm ci

# 2. Create your env file
cp .env.example .env
#    then edit DATABASE_URL to point at your local database, e.g.
#    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/portfolio?schema=public"

# 3. Generate the Prisma client (not committed — it is built on demand)
npx prisma generate

# 4. Create the tables
npx prisma migrate deploy

# 5. Optional: load demo content (destructive — see "Seeding" below)
ALLOW_DESTRUCTIVE_SEED=1 npx prisma db seed

# 6. Optional: create a login for /admin/login
npm run admin:create

# 7. Start the dev server
npm run dev
```

Then verify the whole stack end to end:

```bash
curl http://localhost:3000/api/health    # {"status":"ok"} — liveness only
curl http://localhost:3000/api/v1/profile # 200 with real rows — proves DB works
```

Open <http://localhost:3000> for the site and <http://localhost:3000/admin/login>
for the panel.

**If `/api/health` returns 200 but `/api/v1/profile` fails, your database
connection or migrations are the problem** — the health route deliberately does
not touch the database.

## Environment variables

Only `DATABASE_URL` is required. Everything else has a working default.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | **yes** | — | Runtime connection used by `lib/db.ts`. |
| `DIRECT_URL` | no | falls back to `DATABASE_URL` | Unpooled connection for Prisma CLI only. See the warning below. |
| `API_BASE_URL` | no | `http://127.0.0.1:3000` | Absolute base URL the server uses to call its own API. No trailing slash. |
| `CORS_ALLOWED_ORIGINS` | no | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated allowlist. Empty disables CORS headers. |
| `ADMIN_SESSION_TTL_DAYS` | no | `30` | Admin session lifetime, floored at 1 day. |
| `ALLOW_DESTRUCTIVE_SEED` | no | unset | Must be exactly `1` to permit the seed. Never set in production. |
| `TEST_DATABASE_URL` | no | unset | Reserved for DB-backed tests. **No test currently reads it** — the suite is unit-level and needs no live database. |

### ⚠️ `DIRECT_URL` wins over `DATABASE_URL` for Prisma CLI commands

`prisma7.config.ts` resolves the CLI datasource as
`DIRECT_URL ?? DATABASE_URL`. If your `.env` defines `DIRECT_URL`, then setting
`DATABASE_URL` inline on the command line has **no effect** — the CLI silently
uses `DIRECT_URL` instead.

```bash
# This does what you expect
DIRECT_URL="postgresql://...:5432/postgres" npx prisma migrate deploy

# This silently migrates the DIRECT_URL host instead
DATABASE_URL="postgresql://...:5432/postgres" npx prisma migrate deploy
```

This is deliberate: a transaction-mode pooler cannot run DDL, so migrations need
an unpooled connection.

## Repository structure

```
app/
  (public pages)      /  ·  /about  ·  /projects  ·  /services
  admin/
    login/            login screen
    (panel)/          authenticated panel
                      ├── articles/ · experience/ · projects/ · skills/
                      ├── profile/
                      └── settings/  (nav links + social links)
  api/
    health/           liveness probe, no database access
    v1/               public read-only content API
    v1/admin/         authenticated CRUD (+ soft-delete restore routes)

components/
  ui/                 shared primitives
  Home/  Helper/      section + layout components
  admin/              panel forms, tables, editors

lib/
  db.ts               Prisma client (driver adapter, dev connection caching)
  api.ts  api-client.ts  repositories.ts  dto.ts  errors.ts  utils.ts
  admin/              auth, session, csrf, password, schemas, admin-repositories
  generated/prisma/   generated client — gitignored, rebuilt by `prisma generate`

proxy.ts              CORS handling for API routes
constant/portfolio.ts canonical portfolio content used by the seed
context/              React contexts
prisma/
  schema.prisma       16 models: 14 content tables + admin_users + admin_sessions
  migrations/         append-only SQL migrations
  seed.ts             destructive demo-content seed
  seed-guard.ts       safety gate for the seed
prisma7.config.ts     Prisma CLI config (datasource, migrations, seed)
scripts/
  admin-create.ts     interactive admin bootstrap
  deploy/
    export-content.sh exports the 14 content tables between databases
tests/                Vitest unit tests
```

### Data model

`prisma/schema.prisma` defines 16 tables, mapped to snake_case via `@@map`:

- **Content (14):** `profiles`, `contact_infos`, `nav_links`, `social_links`,
  `skill_categories`, `skills`, `project_categories`, `projects`,
  `project_technologies`, `services`, `service_features`, `experiences`,
  `experience_technologies`, `articles`
- **Admin (2):** `admin_users`, `admin_sessions`

Content tables carry `created_at` / `updated_at`. Deletes are soft on the admin-
editable tables, which is why each `[id]/restore` route exists.

## Database and migrations

Migrations are append-only SQL in `prisma/migrations/`. Never edit a migration
that has been applied — add a new one instead.

```bash
npx prisma migrate status            # what is applied / pending
npx prisma migrate deploy            # apply pending migrations
npx prisma migrate dev --name <slug> # create a new migration from schema changes
```

Deploy with `migrate deploy` (applies only pending, never resets). Never use
`migrate dev` or `db push` outside local development — they can drop data.

## Seeding

`prisma/seed.ts` **deletes every row in all 14 content tables** and re-inserts
demo content from `constant/portfolio.ts`. It does not touch `admin_users` or
`admin_sessions`.

Because it is registered as the Prisma seed, the routine `npx prisma db seed`
command is enough to wipe all live content. `prisma/seed-guard.ts` therefore
refuses the run unless **all four** gates pass:

1. `DATABASE_URL` is set and parseable.
2. `NODE_ENV` is not `production`.
3. `ALLOW_DESTRUCTIVE_SEED` is exactly `1`.
4. The hostname does not look like production — a managed-provider suffix
   (`.supabase.co`, `.neon.tech`, `.rds.amazonaws.com`, `.database.windows.net`)
   or a `prod` / `production` hostname label.

Gate 4 exists because `NODE_ENV` is often unset in a local shell, so gates 2–3
alone would not stop a seeded production database.

```bash
ALLOW_DESTRUCTIVE_SEED=1 npx prisma db seed
```

If the seed refuses, that is the guard working — read the message, it tells you
which gate tripped.

**Never seed production.** To move curated content into a database, export and
restore the content tables instead (pure inserts, nothing is deleted):

```bash
# From a machine holding the source database
./scripts/deploy/export-content.sh "postgresql://.../source" ./content.sql

# Into an already-migrated target
psql "postgresql://.../target" -v ON_ERROR_STOP=1 -f ./content.sql
```

The script dumps the 14 content tables only — admin tables are excluded — and
strips `transaction_timeout` and `\restrict`/`\unrestrict`, which `pg_dump`
emits for managed Postgres and which abort a restore on a plain PostgreSQL
server.

## Creating an admin user

```bash
npm run admin:create
```

Prompts for a username (3–64 chars, letters/digits/`.`/`-`/`_`) and a password
(minimum 12 characters, entered invisibly). The password is hashed and salted via
`lib/admin/password.ts` — it is never stored or logged in plain text.

The command only **inserts** one row, so it is safe to run once against a
production database:

```bash
DATABASE_URL="postgresql://.../postgres" npm run admin:create
```

Remember the `DIRECT_URL` precedence rule if you ever need a different target.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server on port 3000. |
| `npm run build` | `prisma generate && next build`. |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint. |
| `npm run test` | Vitest, single run. |
| `npm run admin:create` | Interactive admin bootstrap. |

## Testing

```bash
npm run test
```

The suite is unit-level: no live database, no network. Modules marked
`server-only` are replaced by the stub in `tests/stubs/server-only.ts`.

Before opening a pull request:

```bash
npx tsc --noEmit && npm run lint && npm run test
```

## Deployment (Netlify + Supabase)

1. **Supabase** — reset the database password, then copy two connection strings
   from the dashboard: the **transaction pooler** (port `6543`) for runtime, and
   the **direct** connection (port `5432`, host `db.<ref>.supabase.co`) for
   migrations. Do not substitute the pooler host into the direct URL.

   Both need `?sslmode=require`. URL-encode the password if it contains reserved
   characters. Do not add `?pgbouncer=true` — this app uses `@prisma/adapter-pg`,
   not Prisma's pooled engine.

2. **Netlify** — *Site configuration → Build & deploy → Environment → Environment
   variables*, scope `Production`:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | pooler, port `6543`, `?sslmode=require` |
   | `DIRECT_URL` | direct host, port `5432`, `?sslmode=require` |
   | `API_BASE_URL` | production origin, no trailing slash |
   | `CORS_ALLOWED_ORIGINS` | production origin |
   | `NODE_VERSION` | `22` |

   Leave `ALLOW_DESTRUCTIVE_SEED` unset. Only add database variables to preview
   or branch contexts if those builds genuinely need a database — and never let a
   preview deploy connect to production.

3. **Migrate once**, from your machine:

   ```bash
   DIRECT_URL="postgresql://...:5432/postgres?sslmode=require" npx prisma migrate deploy
   ```

4. **Deploy.** Netlify detects Next.js automatically and runs `npm run build`.
   `prisma generate` is part of that script, so no `postinstall` hook is needed.

5. **Verify:**

   ```bash
   curl https://<your-domain>/api/health
   curl https://<your-domain>/api/v1/profile
   ```

   Then sign in at `/admin/login`.

## Security notes

- `.env*` is gitignored (`.env.example` excepted). Never commit credentials.
- Admin passwords are salted and hashed, never stored or logged in plain text.
- Admin routes are session-authenticated with CSRF protection
  (`lib/admin/csrf.ts`).
- `.gitignore` excludes `/lib/generated/prisma`; the client is regenerated at
  build time.
