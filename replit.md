# AesthTech Solutions

A full-stack production-ready website for AesthTech Solutions — a modern Indian technology startup — featuring a corporate landing page, mobile app showcases, and the MindMap Career Compass EdTech platform.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/aesthetech-website run dev` — run the frontend (port 18971, proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion + shadcn/ui + Wouter routing
- API: Express 5 + Pino logger
- DB: PostgreSQL + Drizzle ORM
- Auth: JWT (bcryptjs + jsonwebtoken), stored in localStorage
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec) — React Query hooks + Zod schemas
- Payments: Razorpay (demo mode if env not set)
- Email: Resend (demo mode if env not set)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/aesthetech-website/` — React+Vite frontend
  - `src/pages/` — all page components (home, about, apps, contact, mindmap/*)
  - `src/hooks/` — useAuth, useRazorpay, useToast
  - `src/components/` — shared UI components, layout, navbar, footer
  - `src/types/razorpay.d.ts` — Razorpay Window type declaration
- `artifacts/api-server/src/routes/` — Express route handlers (auth, users, assessments, challenges, payments, contact, admin)
- `artifacts/api-server/src/middlewares/auth.ts` — JWT middleware (requireAuth, requireAdmin, signToken)
- `lib/api-spec/openapi.yaml` — OpenAPI 3.0 spec (source of truth for all API contracts)
- `lib/api-spec/orval.config.ts` — Orval codegen config
- `lib/api-client-react/src/generated/api.ts` — Generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — Generated Zod schemas
- `lib/db/src/schema/` — Drizzle schema (users, assessments, challenges, payments, contact)
- `lib/db/src/index.ts` — DB connection + all table exports

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval generates type-safe hooks and Zod schemas; server validates with the same Zod types.
- JWT auth stored in localStorage; token sent via `Authorization: Bearer` header using a custom Orval fetcher that reads from localStorage.
- Razorpay and Resend operate in "demo mode" (log-only) when their API keys are not set, so the app is fully usable without payment/email credentials during development.
- `lib/api-spec/package.json` codegen script patches `lib/api-zod/src/index.ts` after orval runs to remove a spurious `api.schemas` re-export — do not remove this patch.
- esbuild bundles the API server as a single CJS file for fast startup; the dev workflow rebuilds on every start.

## Product

- **Corporate site** (`/`, `/about`, `/apps`, `/contact`): Landing page, about AesthTech, mobile app showcases (Mantra Guide, WhatsToday, LifeLens), contact form.
- **MindMap Career Compass** (`/mindmap`): EdTech platform with user auth, career assessments, timed interview challenges, leaderboard, and Razorpay subscription payments.
- **Admin panel** (`/mindmap/admin`): User management, payment tracking, and platform stats (admin role required).

## User preferences

- JWT secret defaults to `"aesthetech-secret-2024"` if `JWT_SECRET` env not set.
- To enable real payments: set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` secrets.
- To enable real email: set `RESEND_API_KEY` secret.

## Gotchas

- After adding new DB schema files, run `pnpm run typecheck:libs` to rebuild the composite lib before typechecking the API server.
- The Orval codegen `schemas` option is intentionally removed from `orval.config.ts` to avoid naming conflicts; do not add it back.
- Vite HMR may show stale errors from the previous file state; the server picks up changes within seconds.
- Never run `pnpm dev` at workspace root — use `restart_workflow` or the individual filter commands.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
- Seeded data: 3 assessments (Career Aptitude, Technology Stream, Management & Leadership) and 4 challenges (JS Fundamentals, DSA, System Design, HR Interview Prep).
