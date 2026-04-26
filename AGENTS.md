# AGENTS

## Command Rules
- Prefix shell commands with `rtk` (required by `C:\Users\muham\.codex\RTK.md`), e.g. `rtk npm run dev`.
- Main checks: `rtk npm run lint` -> `rtk npm run typecheck` -> `rtk npm run build`.
- No test runner is configured in `package.json`; do not assume Jest/Vitest exists.

## Stack and Entry Points
- Single-package Next.js 16 App Router app (not a monorepo).
- Route protection lives in `proxy.ts` (Next 16 proxy), not `middleware.ts`.
- Auth API entrypoint: `app/api/auth/[...all]/route.ts` using Better Auth.
- Main feature routes: `app/admin/*` (admin) and `app/cashier/*` (cashier POS flow).

## Auth and Access Model
- Better Auth is configured in `lib/auth.ts` with role field (`admin` | `cashier`) and admin plugin RBAC from `lib/permissions.ts`.
- Path authorization logic is centralized in `lib/auth-routes.ts` and enforced by `proxy.ts`.
- API handlers typically gate access with `auth.api.getSession({ headers: await headers() })`; keep this pattern when adding protected routes.

## Prisma and Environment Gotchas
- Prisma 7 uses `prisma.config.ts` + `@prisma/adapter-pg`; CLI datasource URL is `DIRECT_URL`.
- Runtime Prisma client in `lib/prisma.ts` prefers `DIRECT_URL`, falls back to `DATABASE_URL`.
- `postinstall` runs `npm run db:generate`; missing DB env values can break fresh installs.
- DB scripts: `db:push`, `db:migrate`, `db:seed` (seed data is in `prisma/seed.ts`, upsert-style for categories/products).

## UI/Assets Notes
- Shadcn is configured via `components.json` (`radix-maia`, Tailwind v4, aliases enabled).
- UploadThing router is in `app/api/uploadthing/core.ts`; required envs are in `.env.example`.
- Remote images are whitelisted only for `https://utfs.io` in `next.config.mjs`.

## Commit Convention
- Follow existing history style: short Conventional Commit subjects (`feat: ...`, `fix: ...`).
