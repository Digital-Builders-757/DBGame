# Digital Builders – Project Context Prompt

> **Read this file before touching any code, tests, docs, or database objects.**  
> It collects the non‑negotiable rules, common pitfalls, and references you must revisit before every change.

---

## 1. Mandatory Pre-Work Checklist

1. **Open `docs/DOCUMENTATION_INDEX.md`.**  
   - Identify every doc relevant to the feature (auth, game logic, admin, etc.).  
   - Read or refresh those docs before writing code.
2. **Review the single source of truth for data:**  
   - `database_schema_audit.md` (root)  
   - Recent files in `supabase/migrations/` that relate to your area  
   - `types/database.ts` + `@/types/supabase` imports (never hand-edit generated types)
3. **Reconfirm security + auth expectations:**  
   - `docs/AUTH_DATABASE_TRIGGER_CHECKLIST.md` for *any* auth/profile work  
   - `docs/SECURITY_CONFIGURATION.md` + `docs/SQL_RLS_POLICY_CREATION_GUIDE.md` when modifying queries, policies, or storage paths
4. **Scan quick references:**  
   - `docs/COMMON_ERRORS_QUICK_REFERENCE.md` (import paths, `.maybeSingle()`, etc.)  
   - `docs/PRE_PUSH_CHECKLIST.md` (schema + build + lint requirements)  
   - Feature-specific docs (e.g., `docs/digital-builders/ARCHITECTURE.md`)
5. **Clarify scope.** Define what documents need updating once work is finished (MVP status, feature guides, troubleshooting notes).
6. **Before touching `main` / production:**  
   - Set `SUPABASE_PROJECT_ID` to your Digital Builders project ID
   - Set `SUPABASE_INTERNAL_NO_DOTENV=1` so Supabase CLI doesn't try to parse `.env.local`.  
   - Apply pending migrations to production (`npx supabase@2.34.3 db push`)  
   - Run `npm run types:regen:prod` so `types/database.ts` matches the live schema before merging.

---

## 2. Architecture & Data Access Rules

- **App Router + React Server Components:** Fetch data in server components/actions, pass props into presentational client components.  
- **Supabase Clients:**  
  - `@/lib/supabase/supabase-browser.ts` for client-side access (respecting RLS)  
  - `@/lib/supabase/supabase-server.ts` for server-side access
  - `@/lib/supabase-admin-client.ts` for trusted server-only logic (never import client-side)  
  - Do **not** instantiate Supabase directly.  
- **Type Imports:** Always `import type { Database } from '@/types/supabase'`; never from the generated file path. No `any` for DB responses.  
- **Query Style:** Explicit column selections (`.select('id, handle')`). `select('*')` is allowed only in vetted admin scripts.  
- **Security:** RLS is always on. Use `auth.uid()` (via Supabase helpers) for filters. No service-role keys in browser bundles.  
- **Component Boundaries:** Presentational components have zero side effects, zero fetches, and receive typed props.  
- **Server Actions & Mutations:** Wrap in `try/catch`, log to `lib/error-logger`, return typed results.
- **Game Logic:** All game logic (timers, calculations, interactions) must be server-side only. Never put game logic in React components.

---

## 3. Database & Schema Guardrails

- `database_schema_audit.md` must mirror reality **before** migrations run. Never alter DB without updating this doc.  
- All schema changes go through new timestamped files in `supabase/migrations/`. No edits to applied migrations.  
- After migrations: run the pinned Supabase CLI (`npx supabase@2.34.3 gen types typescript --project-id <PROJECT_ID> --schema public`) and re-run `scripts/prepend-autogen-banner.mjs` if needed.  
- Ensure `types/database.ts`, `types/supabase.ts`, and the schema audit are in sync (use `npm run schema:verify:comprehensive`).  
- Production sync: each time you regenerate types or link via CLI for production, set `SUPABASE_PROJECT_ID` (and `SUPABASE_INTERNAL_NO_DOTENV=1`) so Supabase CLI targets the correct project without parsing `.env.local`; otherwise schema drift will block merges to `main`.  
- Treat enums and views as code: update audit + docs whenever they change.

---

## 4. Authentication & Authorization

- **Profile creation**: Follow `ensureProfileExists` patterns; check `docs/AUTH_STRATEGY.md`.  
- **Game-based routing**: Middleware + server actions must redirect by character existence:
  - Has character → `/dashboard`
  - No character → `/character/create`
  - Not authenticated → `/login`
- **maybeSingle() everywhere** a row might not exist; never check for `PGRST116` when using it.  
- **Signup/Login flows**: Mirror trigger logic in `docs/AUTH_DATABASE_TRIGGER_CHECKLIST.md` before editing Supabase functions or triggers.  
- **Admin tasks**: Only on secure server routes using the admin client; verify RLS and logging.

---

## 5. Type Safety & Common Pitfalls

- **Imports:**  
  - ✅ `@/lib/supabase-admin-client`  
  - ✅ `@/types/supabase`  
  - ❌ `@/lib/supabase/supabase-admin-client`  
  - ❌ `@/types/database`  
- **null vs undefined:** Convert `.find()` results with `?? null`; prefer `Type | null`.  
- **Profile data:** Never fetch profiles in client components—use `useAuth()` context data.  
- **Utility functions:** Confirm imports for helpers like `createSlug`, `formatDate`, etc.  
- **Playwright:** Avoid deprecated APIs (e.g., `page.emulate`). Use typed contexts/devices.  
- **Docs & status updates:** `MVP_STATUS_NOTION.md` must reflect every meaningful change.

---

## 6. Game-Specific Rules

- **Game Logic Location:** All game logic must be in `lib/game/` modules:
  - `lib/game/conflict.ts` - PVP-lite/interaction resolution (server-side only)
  - `lib/game/jobs.ts` - Job timer logic
  - `lib/game/actions.ts` - Action timer logic
  - `lib/game/progression.ts` - XP and leveling logic
- **Timers:** All timers tracked server-side. Never trust client-side timers for game state.
- **DB Cred:** Off-chain ledger for v1 MVP. Future v2+ will migrate to Solana SPL tokens.
- **No Wallet Required:** v1 MVP is Web2-only. Do not require Solana wallet connection for core flows.

---

## 7. Testing & Verification

- Minimum commands before pushing (and often before committing):  
  - `npm run schema:verify:comprehensive`  
  - `npm run build`  
  - `npm run lint`  
  - Targeted Playwright/spec scripts when touching related features
- Rerun relevant scripts after modifying docs or context (pre-commit hook depends on them).  
- Capture any manual testing notes in the corresponding doc or troubleshooting section.

---

## 8. Documentation Expectations

- All new/updated guidance lives in `docs/` (except the root files listed in `docs/DOCUMENTATION_INDEX.md`).  
- Update the index whenever you add a doc or materially change categories.  
- Large features or bug fixes require a short entry in `PAST_PROGRESS_HISTORY.md` and, when applicable, feature-specific guides.  
- Keep `MVP_STATUS_NOTION.md` current—pre-commit checks fail otherwise.

---

## 9. Quick Reference Links

- **Docs Index:** `docs/DOCUMENTATION_INDEX.md`  
- **Schema Truth:** `database_schema_audit.md`, `supabase/migrations/`, `SCHEMA_TYPES_VERIFICATION.md`  
- **Common Errors:** `docs/COMMON_ERRORS_QUICK_REFERENCE.md`, `docs/TYPESCRIPT_COMMON_ERRORS.md`  
- **Type Safety:** `docs/TYPE_SAFETY_IMPROVEMENTS.md`, `TYPE_SAFETY_COMPLETE.md`  
- **Security/Auth:** `docs/SECURITY_CONFIGURATION.md`, `docs/AUTH_STRATEGY.md`, `docs/AUTH_DATABASE_TRIGGER_CHECKLIST.md`  
- **Game Architecture:** `docs/digital-builders/ARCHITECTURE.md`, `docs/digital-builders/MVP_ROADMAP.md`

---

## 10. Final Reminder

- If anything in this prompt conflicts with another doc, resolve the conflict **before** proceeding.  
- When you discover new pitfalls, update this file and the relevant references immediately so the next contributor benefits.  
- Treat this prompt as a go/no-go gate: if you can't check every box above, pause and gather the missing context first.

