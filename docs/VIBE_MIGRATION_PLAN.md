# 🌊 ViBE Migration Plan: Digital Builders → ViBE Platform

**Date:** January 2026  
**Status:** Phases 1-4 COMPLETE ✅ | Phases 5-9 PLANNED 📋  
**From:** Digital Builders (DB 757)  
**To:** ViBE (Virginia Isn't Boring Experiences)
**Team:** CEO Elaine, CTO Lionel

> **📋 Next Steps:** See [`docs/VIBE_PHASES_5_9_EXECUTION_PLAN.md`](./VIBE_PHASES_5_9_EXECUTION_PLAN.md) for Phases 5-9 execution plan.

---

## 📋 EXECUTIVE SUMMARY

This document provides a **safe, phased migration plan** to convert the existing "Digital Builders" Next.js + Supabase application into **VIBE v1** — an event discovery and Event Pass platform.

**Core Principle:** We are **converting identity and branding**, not rebuilding mechanics. The working infrastructure (auth, events, tickets, RLS) remains intact.

**Key Changes:**
- Role system: `admin` (internal team), `client` (businesses/organizers), `user` (attendees, replaces "builder")
- Remove XP entirely: Drop `xp_transactions` table, remove XP/levels/badges from UI
- Rename Builder Card → Event Pass (`/builder-card` → `/event-pass` with temporary redirect)
- Database migrations: Role enum updates, RLS policy updates, data migration for existing users

**Migration Strategy:** Small, testable phases with checkpoints. Each phase is shippable and reversible.

---

# 🎯 PLAN STRUCTURE (Following `/plan` Command Format)

---

## STEP 0 — MANDATORY CONTEXT

### Documents Reviewed

**Core Documents:**
- ✅ `database_schema_audit.md` — Current schema (profiles, events, tickets, xp_transactions)
- ✅ `supabase/migrations/20251207150508_initial_event_portal_schema.sql` — Migration history
- ✅ `README.md` — Current project overview
- ✅ `docs/DOCUMENTATION_INDEX.md` — Documentation structure
- ✅ `.cursorrules` — Project rules and conventions

**Architecture Documents (Not Found — Will Create):**
- ⚠️ `docs/ARCHITECTURE_CONSTITUTION.md` — **MISSING** (will create during migration)
- ⚠️ `docs/diagrams/airport-model.md` — **MISSING** (will create during migration)

**Current State Analysis:**
- ✅ Auth system working (Supabase email/password)
- ✅ Events list page (`/events`) implemented
- ✅ Builder Card page (`/builder-card`) placeholder exists
- ✅ Admin routes (`/admin/*`) exist
- ✅ Middleware protects routes correctly
- ✅ RLS policies enforced on all tables

**Why These Diagrams Are Relevant:**

Since architecture diagrams don't exist yet, I'm inferring the Airport Model zones from the codebase:

1. **Security Zone** (middleware.ts) — Route protection, auth checks
2. **Terminal Zone** (app/*) — UI pages and components
3. **Staff Zone** (lib/actions, server components) — Business logic
4. **Locks Zone** (RLS policies, database constraints) — Data security
5. **Control Tower** (admin routes, API routes) — Admin operations

**What We ARE Changing:**
- Role system: Add `client` role, migrate `builder` → `user`, update all RLS policies
- Database schema: Remove `xp_transactions` table, remove XP-related columns from `profiles`
- Views: Rename `builder_cards` → `event_pass_view` (without XP fields)
- Routes: `/builder-card` → `/event-pass` (with redirect)

**What We're NOT Touching (Out of Scope):**
- Core table structures (profiles, events, tickets remain structurally similar)
- Auth flow mechanics (Supabase Auth unchanged)
- Supabase project configuration (env vars remain same)

---

## STEP 1 — CONSTITUTION INVARIANTS

### 5 Most Relevant Non-Negotiables

**1. Database Schema Single Source of Truth**
- **Rule:** `database_schema_audit.md` is the ONLY source of truth. Never change DB without updating it first.
- **Limitation:** We cannot rename database tables/columns without careful migration planning. Must use views/aliases for backward compatibility.

**2. Type Safety Enforcement**
- **Rule:** `types/database.ts` is auto-generated. Never hand-edit. Must regenerate after schema changes.
- **Limitation:** Any DB renames require type regeneration, which breaks existing code until imports are updated.

**3. RLS Policies Must Remain Enforced**
- **Rule:** All tables have RLS enabled. Policies enforce access control.
- **Limitation:** We cannot change RLS logic during migration. Only policy names/comments can be updated safely.

**4. Migration-First Database Changes**
- **Rule:** All schema changes must go through Supabase migrations. Never edit DB directly.
- **Limitation:** Database renames require new migrations, which must be tested and reversible.

**5. No Service Keys in Client Code**
- **Rule:** Service role keys only in server-side code (API routes, server actions).
- **Limitation:** Migration doesn't affect this, but we must verify no new violations are introduced.

### RED ZONE INVOLVED: **YES**

**Red Zones Touched:**
- ✅ **middleware** — Route names, redirects, role checks (`builder` → `user`, add `client`)
- ✅ **auth/callback** — Profile creation logic (role assignment: `user` default, `client` option)
- ✅ **profile bootstrap** — Default role values (`builder` → `user`), data migration for existing users
- ✅ **RLS / triggers / policies** — Policy logic updates for new role system (`admin`, `client`, `user`)
- ✅ **database migrations** — Role enum changes, RLS policy updates, data migration scripts

**Red Zones NOT Touched:**
- ❌ Stripe webhooks (not in scope for VIBE v1)

---

## STEP 2 — AIRPORT MAP (ARCHITECTURAL ZONES)

### Zones This Feature Touches

**1. Security Zone (middleware.ts)**
- **Why:** Route protection logic references roles (`builder`, `mentor`, `admin`)
- **What Must Stay OUT:** Core auth flow mechanics
- **Changes:** Role system update (`builder` → `user`, add `client`), route name updates (`/builder-card` → `/event-pass`), redirect logic

**2. Terminal Zone (app/*, components/*)**
- **Why:** All UI copy, page titles, component names reference "Digital Builders" / "Builder"
- **What Must Stay OUT:** Database query logic, auth flows
- **Changes:** Branding text, route names, component names, metadata

**3. Staff Zone (lib/actions.ts, server components)**
- **Why:** Server actions and queries may reference "Builder" terminology in comments/logs
- **What Must Stay OUT:** Database schema, RLS policies
- **Changes:** Function names, comments, log messages, error messages

**4. Locks Zone (RLS policies, database)**
- **Why:** Policy logic references roles (`builder`, `mentor`, `admin`), view names reference "Builder"
- **What Must Stay OUT:** Core security principles (RLS must remain enforced)
- **Changes:** Policy logic updates for new roles (`admin`, `client`, `user`), policy names, SQL comments, view names (`builder_cards` → `event_pass_view`), drop `xp_transactions` table

**5. Control Tower (admin routes, API routes)**
- **Why:** Admin UI and API responses contain branding
- **What Must Stay OUT:** Admin permission checks, API security
- **Changes:** UI copy, API response messages, route names

### Zone Violations to Avoid

❌ **DO NOT:** Change core auth flow mechanics (Supabase Auth unchanged)  
❌ **DO NOT:** Bypass middleware security checks  
❌ **DO NOT:** Hardcode new role values without updating all references  
❌ **DO NOT:** Remove RLS enforcement (policies must remain active)  
❌ **DO NOT:** Break existing user sessions during migration

---

## STEP 3 — DESIGN PROPOSALS

### Approach A: **Branding-Only First, Schema Later** (RECOMMENDED)

**High-Level Description:**
Convert all user-facing branding and copy first (UI, routes, metadata), then tackle database naming in a separate phase. This minimizes risk and allows incremental testing.

**Files Expected to Change:**
- `app/page.tsx` — Homepage copy
- `app/builder-card/page.tsx` → `app/event-pass/page.tsx` — Route rename
- `components/*` — All component files with "Builder" references
- `app/layout.tsx` — Metadata, title tags
- `middleware.ts` — Role checks (`builder` → `user`)
- `README.md`, `docs/*` — Documentation updates
- Database: Only comments, view names (`builder_cards` → `event_pass_view`)

**Data Model Impact:**
- **Phase 1:** None (branding only)
- **Phase 2:** View rename (`builder_cards` → `event_pass_view`)
- **Phase 3+:** Optional table/column renames (deferred)

**Key Risks:**
- ✅ **Low risk:** Branding changes don't affect data
- ✅ **Reversible:** Easy to rollback copy changes
- ⚠️ **Medium risk:** Route renames break bookmarks (acceptable)
- ⚠️ **Medium risk:** Role name changes require careful middleware updates

**Why This Respects:**
- ✅ Constitution: No DB changes without audit file updates
- ✅ Airport boundaries: UI changes stay in Terminal zone
- ✅ Diagrams: Clear separation of concerns

---

### Approach B: **Full Rename in One Phase** (NOT RECOMMENDED)

**High-Level Description:**
Rename everything at once: routes, components, database tables, columns, policies, types.

**Files Expected to Change:**
- Everything in Approach A, PLUS:
- `supabase/migrations/*` — New migration to rename tables
- `types/database.ts` — Regenerated types
- All imports across codebase

**Data Model Impact:**
- Table renames (`profiles.role` values, `builder_cards` view)
- Column renames (if any)
- Policy renames
- Type regeneration breaks all imports

**Key Risks:**
- 🔴 **High risk:** Breaking changes across entire codebase
- 🔴 **High risk:** Type errors cascade through imports
- 🔴 **High risk:** Difficult to test incrementally
- 🔴 **High risk:** Rollback requires full database restore

**Why This Violates:**
- ❌ Constitution: Changes too many things at once
- ❌ Airport boundaries: Touches all zones simultaneously
- ❌ Best practices: No incremental testing possible

---

### Approach C: **Hybrid: Critical Path First** (ALTERNATIVE)

**High-Level Description:**
Rename critical user-facing elements first (routes, homepage), then do database view rename, then finish branding.

**Files Expected to Change:**
- Phase 1: Routes (`/builder-card` → `/event-pass`), homepage
- Phase 2: Database view (`builder_cards` → `event_pass_view`)
- Phase 3: Remaining branding

**Data Model Impact:**
- View rename in Phase 2
- Table/column renames deferred

**Key Risks:**
- ✅ **Low-Medium risk:** Incremental but requires view migration
- ⚠️ **Medium risk:** View rename requires code updates immediately

**Why This Respects:**
- ✅ Constitution: Incremental changes
- ✅ Airport boundaries: Phased approach
- ⚠️ More complex than Approach A

---

## STEP 4 — ACCEPTANCE CRITERIA (DEFINITION OF DONE)

### UI Behavior

**Homepage (`/`):**
- ✅ Displays "VIBE" branding, not "Digital Builders"
- ✅ Copy references "Virginia Is Not Boring"
- ✅ CTAs say "Create VIBE account" / "Attend Events"
- ✅ No references to "Builder" or "757" (unless region-specific)

**Events Pages:**
- ✅ `/events` list page works identically
- ✅ `/events/[slug]` detail page works identically
- ✅ RSVP flow unchanged (functionality preserved)

**Event Pass:**
- ✅ `/event-pass` route exists (renamed from `/builder-card`)
- ✅ `/builder-card` redirects to `/event-pass` (temporary, 1-2 releases)
- ✅ Displays user identity, attendance history
- ✅ No "Builder Card", "XP", "levels", or "badges" terminology
- ✅ Shows "Events Attended" count
- ✅ Shows last attended event (checked_in status)

**Admin:**
- ✅ `/admin/check-in` works identically
- ✅ Admin UI references "VIBE" not "Digital Builders"

**Auth:**
- ✅ Signup/login flows work identically
- ✅ Post-login redirects to `/events` (unchanged)
- ✅ Profile creation assigns `role = 'user'` by default (not `'builder'`)
- ✅ Existing users with `role = 'builder'` migrated to `role = 'user'`
- ✅ `client` role can be assigned (for businesses/organizers)

### Data Correctness

**Database:**
- ✅ All existing user/event/ticket data preserved
- ✅ RLS policies updated and enforce correctly for new roles
- ✅ `xp_transactions` table dropped
- ✅ `profiles.xp_total` and `profiles.level` columns removed
- ✅ View `event_pass_view` returns: user identity + events attended count + last attended event (no XP fields)

**Types:**
- ✅ `types/database.ts` regenerated and matches schema
- ✅ No TypeScript errors after regeneration
- ✅ All imports resolve correctly

### Permissions & Access Control

**RLS:**
- ✅ `user` role: Can read own profile, RSVP to events, view event-pass
- ✅ `client` role: Can create/manage events (if in v1), access ticket scanner, manage own events
- ✅ `admin` role: Can approve/ban users/clients, check-in users, full system access
- ✅ Public events still visible to all (authenticated and unauthenticated)
- ✅ Role boundaries enforced correctly (users can't access admin routes, etc.)

**Middleware:**
- ✅ Route protection works identically
- ✅ Role checks use `'user'` instead of `'builder'`
- ✅ Admin routes still protected

### Failure Cases (What Must NOT Happen)

❌ **Must NOT:** Break existing user sessions  
❌ **Must NOT:** Lose any user data  
❌ **Must NOT:** Break RLS enforcement  
❌ **Must NOT:** Introduce TypeScript errors  
❌ **Must NOT:** Break production builds  
❌ **Must NOT:** Create redirect loops  
❌ **Must NOT:** Break admin functionality

---

## STEP 5 — TEST PLAN

### Manual Test Steps

**Happy Path:**
1. **Homepage Load**
   - Navigate to `/`
   - Verify "VIBE" branding visible
   - Verify no "Digital Builders" references
   - Click "Create VIBE account" → should go to `/signup`

2. **Signup Flow**
   - Create new account
   - Verify profile created with `role = 'user'`
   - Verify redirect to `/events` after signup

3. **Events List**
   - Navigate to `/events`
   - Verify events display correctly
   - Click event → should go to `/events/[slug]`

4. **RSVP Flow**
   - RSVP to an event
   - Verify ticket created in database
   - Verify can cancel RSVP

5. **Event Pass**
   - Navigate to `/event-pass`
   - Verify displays user info
   - Verify shows attendance history
   - Verify no "Builder Card" references

6. **Admin Check-In**
   - Login as admin
   - Navigate to `/admin/check-in`
   - Search for user
   - Check in user
   - Verify ticket status updated

**Role-Specific Testing:**
1. **User Role (`user`)**
   - Can view events list
   - Can RSVP to events
   - Can view own event-pass
   - Cannot access `/admin/*` routes
   - Cannot create events (unless client)

2. **Client Role (`client`)**
   - Can create/manage events (if in v1)
   - Can access ticket scanner
   - Can view own event-pass
   - Cannot access admin-only routes

3. **Admin Role (`admin`)**
   - Can access `/admin/*` routes
   - Can check-in users
   - Can approve/ban users/clients
   - Full system access

**Edge Cases:**
1. **Existing User Login (Migration)**
   - Login with existing account (role = 'builder')
   - Verify data migration converts `'builder'` → `'user'`
   - Verify middleware handles transition gracefully
   - Verify can access all routes after migration

2. **Route Redirects**
   - Navigate to `/builder-card` (old route)
   - Verify redirects to `/event-pass` (temporary, 1-2 releases)
   - Verify redirect doesn't create loops

3. **XP Removal**
   - Verify no XP references in UI
   - Verify `xp_transactions` table dropped
   - Verify `profiles.xp_total` and `profiles.level` removed
   - Verify Event Pass shows attendance count (not XP)

4. **Database Queries**
   - Verify all queries still work after role migration
   - Verify RLS policies enforce correctly for new roles
   - Verify no broken foreign keys
   - Verify `event_pass_view` returns correct structure (no XP fields)

### Automated Tests to Add/Update

**Unit Tests:**
- [ ] Test role assignment on signup (`'user'` not `'builder'`)
- [ ] Test middleware role checks
- [ ] Test route redirects

**Integration Tests:**
- [ ] Test RSVP flow end-to-end
- [ ] Test admin check-in flow
- [ ] Test Event Pass data display

**E2E Tests (Playwright):**
- [ ] Homepage displays VIBE branding
- [ ] Signup → Events redirect works
- [ ] RSVP → Check-in → Event Pass flow

### RED ZONE Regression Checks

**Middleware:**
- [ ] Verify route protection still works
- [ ] Verify role checks don't break
- [ ] Verify redirects don't loop

**Auth/Callback:**
- [ ] Verify profile creation still works
- [ ] Verify role assignment correct
- [ ] Verify session management unchanged

**RLS Policies:**
- [ ] Verify `user` role can read own data, RSVP, view event-pass
- [ ] Verify `client` role can create/manage events, scan tickets
- [ ] Verify `admin` role can check-in, approve/ban, full access
- [ ] Verify public events visible to all
- [ ] Verify role boundaries enforced (users can't access admin routes)

---

# 🗺️ DETAILED MIGRATION BLUEPRINT

---

## HIGH-LEVEL ROADMAP (Phases 0–5)

### **Phase 0: Preparation & Documentation** (January 2026, Week 1, Days 1–2)
**Goal:** Set up migration infrastructure, create VIBE_MVP.md FIRST, establish baseline.

**Deliverables:**
- ✅ Create `VIBE_MVP.md` in root (source of truth) — **FIRST PRIORITY**
- ✅ Create `docs/VIBE_MIGRATION_PLAN.md` (this document)
- ✅ Create rename map table
- ✅ Audit all "Digital Builders" / "Builder" / "XP" references
- ✅ Create `docs/ARCHITECTURE_CONSTITUTION.md` (if missing)
- ✅ Create `docs/diagrams/airport-model.md` (if missing)

**Checkpoint:** VIBE_MVP.md complete, migration plan ready, rename map documented.

**Rollback:** Delete new docs, keep existing structure.

---

### **Phase 1: Branding & Routes (Non-DB)** (January 2026, Week 1, Days 3–5)
**Goal:** Convert all user-facing branding and route names without touching database.

**Deliverables:**
- Update homepage copy (`app/page.tsx`) — VIBE branding
- Rename route `/builder-card` → `/event-pass`
- Add redirect: `/builder-card` → `/event-pass` (temporary, 1-2 releases)
- Update all component copy (remove "Digital Builders" / "Builder" references)
- Update metadata (title tags, descriptions) — VIBE branding
- Update `README.md` — Project name, description
- Update Sentry project references (if applicable)
- Update Supabase project name verification (env vars unchanged)

**Checkpoint:** All UI shows "VIBE" branding, routes work, redirect functional, no database changes.

**Rollback:** Revert route rename, restore copy, remove redirect.

---

### **Phase 2: Role System Migration (DB + Code)** (January 2026, Week 2, Days 1–3)
**Goal:** Migrate role system: `builder` → `user`, add `client` role, update all RLS policies.

**Deliverables:**
- Update `database_schema_audit.md` — Document role changes
- Create migration: `YYYYMMDDHHMMSS_migrate_role_system.sql`
  - Update `profiles.role` default from `'builder'` to `'user'`
  - Add `'client'` as valid role value
  - Data migration: `UPDATE profiles SET role = 'user' WHERE role = 'builder'`
  - Update all RLS policies to use new roles (`admin`, `client`, `user`)
  - Update policy logic for `client` role (can create/manage events, scan tickets)
- Update `middleware.ts` — Role checks (`user`, `client`, `admin`)
- Update `components/auth/auth-provider.tsx` — Type definitions
- Update profile creation logic — Default `role = 'user'`
- Update seed scripts/tests — Use new roles
- Regenerate types: `npm run types:regen`

**Transitional Compatibility:**
- Support both `'builder'` and `'user'` in middleware during transition (OR perform data migration first)
- After data migration, code can assume `'user'` only

**Checkpoint:** Role system migrated, RLS policies updated, data migrated, types regenerated.

**Rollback:** Revert migration, restore old role values, restore old RLS policies.

---

### **Phase 3: Remove XP (DB + Code)** (January 2026, Week 2, Days 4–5)
**Goal:** Remove XP system entirely: drop table, remove columns, remove UI references.

**Deliverables:**
- Update `database_schema_audit.md` — Document XP removal
- Create migration: `YYYYMMDDHHMMSS_remove_xp_system.sql`
  - Drop `xp_transactions` table (if exists)
  - Remove `profiles.xp_total` column
  - Remove `profiles.level` column
  - Update any views/queries that reference XP
- Update code:
  - Remove XP references from UI components
  - Remove XP/badges/levels copy from all pages
  - Update Event Pass to show attendance count (not XP)
- Update `builder_cards` view (if still exists) — Remove XP fields
- Regenerate types: `npm run types:regen`

**Checkpoint:** XP system removed, no XP references in code/UI, types regenerated.

**Rollback:** Revert migration, restore XP columns/table, restore UI references.

---

### **Phase 4: View Rename + Event Pass Wiring** (January 2026, Week 2, Days 6–7)
**Goal:** Rename `builder_cards` → `event_pass_view`, wire Event Pass page.

**Deliverables:**
- Update `database_schema_audit.md` — Document view rename
- Create migration: `YYYYMMDDHHMMSS_rename_builder_cards_to_event_pass_view.sql`
  - Create new view `event_pass_view`:
    ```sql
    CREATE OR REPLACE VIEW public.event_pass_view AS
    SELECT
      p.id as profile_id,
      p.username,
      p.display_name,
      p.avatar_url,
      p.region,
      COUNT(DISTINCT CASE WHEN t.status = 'checked_in' THEN t.event_id END) as events_attended_count,
      MAX(CASE WHEN t.status = 'checked_in' THEN e.start_at END) as last_event_at
    FROM public.profiles p
    LEFT JOIN public.tickets t ON t.user_id = p.id
    LEFT JOIN public.events e ON e.id = t.event_id
    GROUP BY p.id;
    ```
  - Drop old view: `DROP VIEW IF EXISTS public.builder_cards;`
- Update `app/event-pass/page.tsx` — Use `event_pass_view`
- Update any components using `builder_cards`
- Test Event Pass page — Verify data displays correctly
- Regenerate types: `npm run types:regen`

**Checkpoint:** Event Pass page uses new view, displays attendance count + last event, no XP fields.

**Rollback:** Revert migration, restore old view name in code.

---

### **Phase 5: Documentation Migration & Final Polish** (January 2026, Week 3, Days 1–3)
**Goal:** Migrate all documentation LAST, final testing, polish.

**Deliverables:**
- Rename docs files (`docs/digital-builders/*` → `docs/vibe/*`) — if applicable
- Update `docs/DOCUMENTATION_INDEX.md` — Remove DB references, add VIBE docs
- Update `database_schema_audit.md` — Final VIBE terminology pass
- Update `README.md` — Final polish
- Create `docs/VIBE_ADMIN_OPERATIONS.md` — Admin guide (if needed)
- Create `docs/VIBE_DEPLOYMENT_NOTES.md` — Deployment guide (if needed)
- Update Notion (if applicable):
  - Copy `VIBE_MVP.md` to Notion
  - Archive old DB 757 docs
- Final end-to-end testing:
  - Signup → Events → RSVP → Check-in → Event Pass
  - Admin check-in flow
  - Client role flow (if in v1)
  - All routes work
- Update deployment docs (Vercel, env vars, etc.)

**Checkpoint:** All documentation migrated, tests pass, ready for production.

**Rollback:** Revert doc changes, restore old file names.

---

## DETAILED CHECKLIST PER PHASE

### **Phase 0: Preparation & Documentation**

**Tasks:**
- [ ] Create `VIBE_MVP.md` in root (source of truth)
- [ ] Create `docs/VIBE_MIGRATION_PLAN.md` (this file)
- [ ] Create `docs/ARCHITECTURE_CONSTITUTION.md` (if missing)
- [ ] Create `docs/diagrams/airport-model.md` (if missing)
- [ ] Run grep: `grep -r "Digital Builders" . --exclude-dir=node_modules`
- [ ] Run grep: `grep -r "Builder" . --exclude-dir=node_modules --exclude="*.md"`
- [ ] Create rename map table (see below)
- [ ] Create branch: `git checkout -b vibe/migration-phase-0-prep`

**Acceptance Criteria:**
- ✅ All "Digital Builders" references documented
- ✅ Rename map complete
- ✅ Documentation structure ready

**Rollback Strategy:**
- Delete new docs, keep existing structure

---

### **Phase 1: Branding & Routes (Non-DB)**

**Tasks:**
- [ ] Update `app/page.tsx` — Homepage copy (VIBE branding)
- [ ] Rename `app/builder-card/` → `app/event-pass/`
- [ ] Add redirect in `middleware.ts`: `/builder-card` → `/event-pass` (temporary, 1-2 releases)
- [ ] Update `app/event-pass/page.tsx` — Remove "Builder Card" references, add VIBE branding
- [ ] Update `components/navbar.tsx` — Link text, route references
- [ ] Update `app/layout.tsx` — Metadata (title, description) — VIBE branding
- [ ] Update `README.md` — Project name, description
- [ ] Update `package.json` — Name, description (if applicable)
- [ ] Update Sentry project references (if applicable):
  - [ ] Check `sentry.properties` for project name
  - [ ] Update Sentry dashboard project name (if needed)
  - [ ] Verify DSN still works
- [ ] Update Supabase project name verification:
  - [ ] Verify env vars unchanged (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - [ ] Update project display name in Supabase dashboard (if needed)
  - [ ] Document that env vars remain the same
- [ ] Test: Homepage displays VIBE branding
- [ ] Test: `/event-pass` route works
- [ ] Test: Old `/builder-card` redirects to `/event-pass`
- [ ] Test: Redirect doesn't create loops

**Files to Change:**
```
app/page.tsx
app/builder-card/page.tsx → app/event-pass/page.tsx (rename directory)
components/navbar.tsx
app/layout.tsx
middleware.ts
components/auth/auth-provider.tsx
README.md
package.json (if applicable)
```

**Acceptance Criteria:**
- ✅ Homepage shows "VIBE" branding
- ✅ `/event-pass` route works
- ✅ No "Digital Builders" or "Builder Card" in UI
- ✅ Signup assigns `role = 'user'`
- ✅ All routes still work

**Rollback Strategy:**
- Revert route rename: `git mv app/event-pass app/builder-card`
- Revert copy changes: `git checkout HEAD -- app/page.tsx app/layout.tsx`
- Revert middleware: `git checkout HEAD -- middleware.ts`

---

### **Phase 2: Role System Migration (DB + Code)**

**Strategy: Data Migration First (Option A)**

**Execution Order:**
1. **Step 1:** Migrate all existing `'builder'` → `'user'` in database FIRST
2. **Step 2:** Then update code to assume `'user'` only (no transitional support)

**Tasks:**
- [ ] Update `database_schema_audit.md` — Document role changes
- [ ] Create migration: `supabase migration new migrate_role_system`
- [ ] Write migration SQL:
  ```sql
  -- ============================================
  -- STEP 1: DATA MIGRATION FIRST (before code changes)
  -- ============================================
  -- Convert all existing 'builder' users to 'user'
  UPDATE public.profiles SET role = 'user' WHERE role = 'builder';

  -- Update default role value
  ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

  -- ============================================
  -- STEP 2: UPDATE RLS POLICIES FOR NEW ROLE SYSTEM
  -- ============================================
  -- Drop old policies that reference 'builder' or 'mentor'
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Admins and creators can insert events" ON public.events;
  DROP POLICY IF EXISTS "Admins and creators can update events" ON public.events;
  -- (Continue for all policies that reference old roles)

  -- Create new policies for admin, client, user roles
  -- Profiles policies
  CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

  -- Events policies (client can create/manage own events)
  CREATE POLICY "Clients and admins can insert events"
    ON public.events FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'client')
      )
      OR created_by = auth.uid()
    );

  CREATE POLICY "Clients and admins can update events"
    ON public.events FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
      )
      OR created_by = auth.uid()
    );

  -- Tickets policies (client can scan tickets for their events)
  CREATE POLICY "Clients can view tickets for their events"
    ON public.tickets FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.events e
        JOIN public.profiles p ON p.id = e.created_by
        WHERE e.id = tickets.event_id
        AND p.id = auth.uid()
        AND p.role = 'client'
      )
    );

  -- (Continue updating all RLS policies)
  ```
- [ ] **After data migration completes:** Update code to assume `'user'` only
- [ ] Update `middleware.ts` — Remove transitional `'builder'` support, use `'user' | 'client' | 'admin'`
- [ ] Update `components/auth/auth-provider.tsx` — Type definitions (`UserRole = 'user' | 'client' | 'admin'`)
- [ ] Update profile creation logic — Default `role = 'user'`
- [ ] Update seed scripts/tests — Use new roles
- [ ] Test: New signups get `role = 'user'`
- [ ] Test: Existing users migrated to `role = 'user'` (verify in DB)
- [ ] Test: RLS policies enforce correctly for all roles
- [ ] Test: Client role can create events (if in v1)
- [ ] Test: Admin role can check-in users
- [ ] Regenerate types: `npm run types:regen`

**Files to Change:**
```
supabase/migrations/YYYYMMDDHHMMSS_migrate_role_system.sql (NEW)
database_schema_audit.md
middleware.ts
components/auth/auth-provider.tsx
lib/supabase/* (profile creation logic)
supabase/seed.sql (if exists)
types/database.ts (regenerated)
```

**Acceptance Criteria:**
- ✅ All existing `'builder'` users migrated to `'user'`
- ✅ New signups get `role = 'user'` by default
- ✅ `client` role can be assigned
- ✅ RLS policies updated for new roles
- ✅ Role boundaries enforced correctly
- ✅ Types regenerated successfully

**Rollback Strategy:**
- Revert migration: `supabase migration repair --status reverted YYYYMMDDHHMMSS_migrate_role_system`
- Restore old role values: `UPDATE profiles SET role = 'builder' WHERE role = 'user'`
- Restore old RLS policies
- Regenerate types

**Transitional Compatibility Plan:**

**DECISION: Option A (Data Migration First) - RECOMMENDED**

**Rationale:** Cleaner migration path, no transitional code needed.

**Execution:**
1. **Phase 2 Step 1:** Create migration that converts all `'builder'` → `'user'` in database FIRST
2. **Phase 2 Step 2:** Then update code to assume `'user'` only (no transitional support needed)
3. **Result:** Code never needs to handle both roles simultaneously

**Alternative (NOT USING):** Option B would require middleware/RLS to accept both `'builder'` and `'user'` temporarily, then migrate data later. This adds complexity and transitional code that must be removed later.

---

### **Phase 3: Remove XP (DB + Code) - DELIBERATE DELETE PHASE**

**Goal:** Remove ALL XP references, even unused ones. This is a deliberate cleanup phase.

**Tasks:**
- [ ] Update `database_schema_audit.md` — Document XP removal
- [ ] Create migration: `supabase migration new remove_xp_system`
- [ ] Write migration SQL:
  ```sql
  -- Step 1: Drop xp_transactions table (even if unused)
  DROP TABLE IF EXISTS public.xp_transactions CASCADE;

  -- Step 2: Remove XP-related columns from profiles (even if unused)
  ALTER TABLE public.profiles DROP COLUMN IF EXISTS xp_total;
  ALTER TABLE public.profiles DROP COLUMN IF EXISTS level;

  -- Step 3: Drop builder_cards view if it still exists (will be replaced in Phase 4)
  DROP VIEW IF EXISTS public.builder_cards;
  ```
- [ ] **Deliberate Code Cleanup:**
  - [ ] Search codebase: `grep -r "xp" . --exclude-dir=node_modules --exclude="*.md"` (case-insensitive)
  - [ ] Remove XP references from `app/event-pass/page.tsx`
  - [ ] Remove XP/badges/levels copy from all pages (`app/page.tsx`, etc.)
  - [ ] Remove XP references from components (search `components/` directory)
  - [ ] Remove unused XP-related components (if any exist)
  - [ ] Remove XP-related types/interfaces (if any exist)
  - [ ] Remove XP-related utility functions (if any exist)
  - [ ] Update Event Pass to show attendance count (not XP)
- [ ] **Deliberate UI Cleanup:**
  - [ ] Remove any "XP", "level", "badge" terminology from UI
  - [ ] Remove any XP-related UI components
  - [ ] Remove any XP-related icons/images
- [ ] Test: No XP references in UI (grep verification)
- [ ] Test: Event Pass shows attendance count
- [ ] Test: All queries still work (no broken references)
- [ ] Regenerate types: `npm run types:regen`

**Files to Change:**
```
supabase/migrations/YYYYMMDDHHMMSS_remove_xp_system.sql (NEW)
database_schema_audit.md
app/event-pass/page.tsx
components/event-pass/* (if any)
components/events/* (if XP references exist)
app/page.tsx (remove XP mentions)
types/database.ts (regenerated)
```

**Acceptance Criteria:**
- ✅ `xp_transactions` table dropped (even if unused)
- ✅ `profiles.xp_total` and `profiles.level` removed (even if unused)
- ✅ `builder_cards` view dropped (if still exists)
- ✅ **Zero XP references in codebase** (verified via grep)
- ✅ No XP-related UI components remain
- ✅ No XP-related types/interfaces remain
- ✅ Event Pass shows attendance count (not XP)
- ✅ Types regenerated successfully

**Rollback Strategy:**
- Revert migration
- Restore XP columns/table
- Restore UI references

---

### **Phase 4: View Rename + Event Pass Wiring**

**Tasks:**
- [ ] Update `database_schema_audit.md` — Document view rename
- [ ] Create migration: `supabase migration new rename_builder_cards_to_event_pass_view`
- [ ] Write migration SQL:
  ```sql
  -- Create new view without XP fields
  CREATE OR REPLACE VIEW public.event_pass_view AS
  SELECT
    p.id as profile_id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.region,
    COUNT(DISTINCT CASE WHEN t.status = 'checked_in' THEN t.event_id END) as events_attended_count,
    MAX(CASE WHEN t.status = 'checked_in' THEN e.start_at END) as last_event_at
  FROM public.profiles p
  LEFT JOIN public.tickets t ON t.user_id = p.id
  LEFT JOIN public.events e ON e.id = t.event_id
  GROUP BY p.id;

  -- Drop old view
  DROP VIEW IF EXISTS public.builder_cards;
  ```
- [ ] Update `app/event-pass/page.tsx` — Use `event_pass_view`
- [ ] Update any components using `builder_cards`
- [ ] Test: Event Pass page loads data correctly
- [ ] Test: Event Pass displays attendance count + last event
- [ ] Test: No XP fields in view
- [ ] Regenerate types: `npm run types:regen`

**Files to Change:**
```
supabase/migrations/YYYYMMDDHHMMSS_rename_builder_cards_to_event_pass_view.sql (NEW)
database_schema_audit.md
app/event-pass/page.tsx
components/event-pass/* (if any)
types/database.ts (regenerated)
```

**Acceptance Criteria:**
- ✅ New view `event_pass_view` exists
- ✅ Event Pass page uses new view
- ✅ View returns: user identity + events_attended_count + last_event_at
- ✅ No XP fields in view
- ✅ Old view removed
- ✅ Types regenerated successfully

**Rollback Strategy:**
- Revert migration: `supabase migration repair --status reverted YYYYMMDDHHMMSS_rename_builder_cards_to_event_pass_view`
- Restore old view name in code
- Regenerate types

---

### **Phase 5: Documentation Migration & Final Polish**

**Tasks:**
- [ ] Rename docs:
  - [ ] `docs/digital-builders/*` → `docs/vibe/*` (if applicable)
  - [ ] Update internal links
- [ ] Update `docs/DOCUMENTATION_INDEX.md` — Remove DB references, add VIBE docs
- [ ] Update `database_schema_audit.md` — Final VIBE terminology pass
- [ ] Update `README.md` — Final polish
- [ ] Create `docs/VIBE_ADMIN_OPERATIONS.md` — Admin guide (if needed)
- [ ] Create `docs/VIBE_DEPLOYMENT_NOTES.md` — Deployment guide (if needed)
- [ ] Update Notion (if applicable):
  - [ ] Copy `VIBE_MVP.md` to Notion
  - [ ] Archive old DB 757 docs
- [ ] Final end-to-end testing:
  - [ ] Signup → Events → RSVP → Check-in → Event Pass
  - [ ] Admin check-in flow
  - [ ] All routes work
- [ ] Update deployment docs (Vercel, env vars, etc.)

**Files to Change:**
```
docs/DOCUMENTATION_INDEX.md
database_schema_audit.md
README.md
docs/vibe/* (NEW - if created)
docs/VIBE_ADMIN_OPERATIONS.md (NEW - if created)
docs/VIBE_DEPLOYMENT_NOTES.md (NEW - if created)
```

**Acceptance Criteria:**
- ✅ All documentation uses VIBE terminology
- ✅ Documentation index updated
- ✅ All tests pass
- ✅ Ready for production deployment

**Rollback Strategy:**
- Revert doc changes
- Restore old file names

---

## RENAME MAP TABLE

| Old Term | New Term | Scope | Phase | Notes |
|----------|----------|-------|-------|-------|
| **Digital Builders** | **VIBE** | Copy, branding | 1 | All user-facing text |
| **Builder** | **User** | Role name, copy | 2 | Role value: `'builder'` → `'user'` |
| **Builder Card** | **Event Pass** | Route, component | 1 | Route: `/builder-card` → `/event-pass` |
| **builder_cards** | **event_pass_view** | Database view | 4 | View name in SQL (no XP fields) |
| **DB 757** | **VIBE** | Copy, branding | 1 | Regional reference (optional) |
| **Hampton Roads** | **Virginia** | Copy (optional) | 1 | Only if expanding beyond 757 |
| **XP** | **REMOVED** | Database, UI | 3 | Drop `xp_transactions` table, remove XP columns |
| **profiles.role = 'builder'** | **profiles.role = 'user'** | Database, code | 2 | Data migration + default value |
| **profiles.role** | **profiles.role** | Database | 2 | Add `'client'` role value |
| **xp_transactions** | **REMOVED** | Database | 3 | Drop table entirely |
| **profiles.xp_total** | **REMOVED** | Database | 3 | Drop column |
| **profiles.level** | **REMOVED** | Database | 3 | Drop column |
| **Builder profile** | **VIBE profile** | Comments, copy | 1, 5 | SQL comments, UI copy |

**Scope Legend:**
- **Copy:** User-facing text only
- **Code:** TypeScript/JavaScript code
- **Database:** SQL schema, views, policies
- **Route:** URL paths

---

## RISK LIST + MITIGATIONS

### **Risk 1: Breaking Existing User Sessions**
**Impact:** High  
**Probability:** Medium  
**Mitigation:**
- Perform data migration first (Phase 2): Convert all `'builder'` → `'user'` before code changes
- OR: Support both roles temporarily in middleware, then migrate data
- Test with existing user accounts before deploying

### **Risk 2: Route Rename Breaks Bookmarks**
**Impact:** Low  
**Probability:** High  
**Mitigation:**
- Add redirect from `/builder-card` → `/event-pass` in middleware
- Or return 404 with helpful message

### **Risk 3: Type Errors After Regeneration**
**Impact:** High  
**Probability:** Medium  
**Mitigation:**
- Regenerate types in isolated branch
- Fix all type errors before merging
- Run `npm run typecheck` and `npm run build` before commit

### **Risk 4: RLS Policy Logic Broken**
**Impact:** Critical  
**Probability:** Low  
**Mitigation:**
- Only rename policies, don't change logic
- Test RLS enforcement after each migration
- Keep old policies as backup until verified

### **Risk 5: Database Migration Fails**
**Impact:** Critical  
**Probability:** Low  
**Mitigation:**
- Test migrations on local Supabase first
- Use `supabase migration repair` if needed
- Keep database backups before migrations

### **Risk 6: Import Path Errors**
**Impact:** Medium  
**Probability:** Medium  
**Mitigation:**
- Use find/replace carefully
- Verify imports after each change
- Run build after each phase

---

## FIRST PR SCOPE: PR #1 (Phase 0 + Phase 1 Start)

### **Exact Tasks for PR #1**

**Phase 0 Tasks:**
- [ ] Create `VIBE_MVP.md` in root
- [ ] Create `docs/VIBE_MIGRATION_PLAN.md` (this file)
- [ ] Create rename map table
- [ ] Audit all "Digital Builders" references (grep results)

**Phase 1 Tasks (Start):**
- [ ] Update `app/page.tsx` — Homepage copy (VIBE branding)
- [ ] Update `app/layout.tsx` — Metadata (title, description)
- [ ] Update `README.md` — Project name, description
- [ ] Update `middleware.ts` — Role check: handle both `'builder'` and `'user'` (transitional)

**Testing:**
- [ ] Verify homepage displays VIBE branding
- [ ] Verify metadata updated
- [ ] Verify middleware still works with old roles

**Files Changed:**
```
VIBE_MVP.md (NEW)
docs/VIBE_MIGRATION_PLAN.md (NEW)
app/page.tsx
app/layout.tsx
README.md
middleware.ts
```

**PR Description:**
```
🌊 VIBE Migration - Phase 0 & Phase 1 Start

This PR establishes the migration foundation and begins the branding conversion:

**Phase 0:**
- Created VIBE_MVP.md (source of truth)
- Created migration plan document
- Audited all "Digital Builders" references

**Phase 1 Start:**
- Updated homepage copy to VIBE branding
- Updated metadata (title, description)
- Updated README.md
- Updated middleware to handle role transition (supports both 'builder' and 'user')

**Next Steps:**
- Phase 1 continuation: Route rename `/builder-card` → `/event-pass`
- Phase 2: Database view rename

**Testing:**
- ✅ Homepage displays VIBE branding
- ✅ Metadata updated
- ✅ Middleware handles old roles gracefully
```

---

## BRANCH STRATEGY & PR SLICING

### **Branch Structure**

```
main
├── vibe/migration-phase-0-prep (Phase 0: VIBE_MVP.md + docs)
├── vibe/migration-phase-1-branding (Phase 1: Branding + routes)
├── vibe/migration-phase-2-roles (Phase 2: Role system migration)
├── vibe/migration-phase-3-remove-xp (Phase 3: Remove XP)
├── vibe/migration-phase-4-view-rename (Phase 4: View rename + Event Pass)
└── vibe/migration-phase-5-docs (Phase 5: Documentation migration)
```

### **PR Slicing Plan**

**PR #1:** Phase 0 + Phase 1 Start (VIBE_MVP.md, homepage, metadata, docs)  
**PR #2:** Phase 1 Complete (Route rename, navbar, components, redirect)  
**PR #3:** Phase 2 (Role system migration: DB + code + RLS)  
**PR #4:** Phase 3 (Remove XP: DB + code)  
**PR #5:** Phase 4 (View rename + Event Pass wiring)  
**PR #6:** Phase 5 (Documentation migration, final polish)

**Each PR:**
- ✅ Self-contained and testable
- ✅ Includes acceptance criteria checklist
- ✅ Includes rollback instructions
- ✅ Can be merged independently

---

## RECOMMENDED EXECUTION ORDER

1. **January 2026, Week 1, Day 1:** Create Phase 0 docs (VIBE_MVP.md FIRST), audit references
2. **January 2026, Week 1, Day 2:** Create PR #1 (Phase 0 + Phase 1 start), merge
3. **January 2026, Week 1, Day 3:** Create PR #2 (Phase 1 complete), test, merge
4. **January 2026, Week 2, Day 1:** Create PR #3 (Phase 2: Role migration), test locally, merge
5. **January 2026, Week 2, Day 2:** Create PR #4 (Phase 3: Remove XP), test, merge
6. **January 2026, Week 2, Day 3:** Create PR #5 (Phase 4: View rename), fix type errors, merge
7. **January 2026, Week 3, Day 1:** Create PR #6 (Phase 5: Docs migration), final testing, merge
8. **January 2026, Week 3, Day 2:** Deploy to production, monitor

---

## SENTRY & SUPABASE PROJECT NAMING

### **Sentry Project References**

**Files to Check/Update:**
- `sentry.properties` — Project name, DSN
- `sentry.server.config.ts` — Project name
- `sentry.edge.config.ts` — Project name
- Sentry dashboard — Project display name

**Tasks (Phase 1):**
- [ ] Check `sentry.properties` for project name
- [ ] Update Sentry dashboard project name to "VIBE" (if needed)
- [ ] Verify DSN still works (should not change)
- [ ] Update any hardcoded project names in config files

**Verification:**
- ✅ Sentry error tracking still works
- ✅ DSN unchanged (no env var changes needed)
- ✅ Project name updated in Sentry dashboard

### **Supabase Project Naming**

**Important:** Supabase project name change does NOT affect env vars.

**Files to Check:**
- `.env.local` — Env vars (should remain unchanged)
- `supabase/config.toml` — Project config
- Supabase dashboard — Project display name

**Tasks (Phase 1):**
- [ ] Verify env vars unchanged:
  - `NEXT_PUBLIC_SUPABASE_URL` (unchanged)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (unchanged)
  - `SUPABASE_SERVICE_ROLE_KEY` (unchanged)
- [ ] Update project display name in Supabase dashboard to "VIBE" (optional, cosmetic)
- [ ] Document that env vars remain the same

**Verification Checklist:**
- ✅ All env vars still work
- ✅ Database connection still works
- ✅ Auth still works
- ✅ RLS policies still enforce

---

## TRANSITIONAL COMPATIBILITY PLAN

### **Role Transition Strategy**

**Option A (Recommended):** Data Migration First
1. Phase 2: Migrate all `'builder'` → `'user'` in database first
2. Then update code to assume `'user'` only
3. No transitional support needed in middleware

**Option B:** Dual Support Temporarily
1. Phase 2: Update code to support both `'builder'` and `'user'`
2. Middleware checks: `role === 'builder' || role === 'user'`
3. Later: Migrate data, then remove `'builder'` support

**Recommendation:** Use Option A for cleaner migration.

### **Route Redirect Strategy**

**Temporary Redirect (1-2 releases):**
- Add redirect in `middleware.ts`: `/builder-card` → `/event-pass`
- Keep redirect active for 1-2 releases
- After that, remove redirect (users should have updated bookmarks)

**Implementation:**
```typescript
// In middleware.ts
if (path === '/builder-card') {
  return NextResponse.redirect(new URL('/event-pass', req.url));
}
```

---

## ROLE TESTING PLAN

### **User Role (`user`)**
- ✅ Can view events list (`/events`)
- ✅ Can RSVP to events
- ✅ Can view own event-pass (`/event-pass`)
- ✅ Cannot access `/admin/*` routes (redirected)
- ✅ Cannot create events (unless client)

### **Client Role (`client`)**
- ✅ Can create/manage events (if in v1)
- ✅ Can access ticket scanner (if in v1)
- ✅ Can view own event-pass (`/event-pass`)
- ✅ Cannot access admin-only routes (`/admin/users`, etc.)
- ✅ Can view tickets for own events

### **Admin Role (`admin`)**
- ✅ Can access `/admin/*` routes
- ✅ Can check-in users (`/admin/check-in`)
- ✅ Can approve/ban users/clients
- ✅ Full system access
- ✅ Can manage all events

### **RLS Boundary Testing**
- ✅ Users can only read/update own profile
- ✅ Clients can create/manage own events
- ✅ Admins can read/update all profiles
- ✅ Public events visible to all (authenticated + unauthenticated)
- ✅ Role boundaries enforced in middleware and RLS

---

*Last Updated: January 2026*  
*Status: EXECUTION-READY — Approach A Approved*
