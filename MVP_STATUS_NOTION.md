# 🎮 Digital Builders - Current MVP Status

> **What is Digital Builders?**
>
> **Digital Builders World – v1: Event Portal + Builder Card**
>
> v1 lets people:
> - create an account,
> - RSVP to Digital Builders events,
> - get checked in at the door,
> - and see a simple Builder Card with XP/badges.
>
> **If it's not in that sentence, it's not in v1.**

---

## 🎯 **THE PIVOT: Event Portal + Builder Card**

**We're not building "a cool future game" anymore — we're building the thing you actually need this month to run your world.**

### **The Law: Social Rule of the House**

> "If you want to attend Digital Builders events, pitch, or get funds… you must make a Builder account."

That one rule makes this MVP powerful even before you add any fancy game systems.

---

## 🚀 **CURRENT STATUS: MVP IN PROGRESS**

**MVP DEFINITION** - December 2025

- ✅ MVP scope locked: Event Portal + Builder Card
- ✅ Schema designed: profiles, events, tickets, xp_transactions
- ✅ Core entities defined
- ✅ Implementation plan ready
- ✅ Database schema migrated (initial_event_portal_schema)
- ✅ Types regenerated (Supabase CLI)
- ✅ Type generation scripts stabilized (simplified, removed formatting hacks)
- ✅ Project references updated (migrated from old project to new Digital Builders project)
- ✅ CI workflows updated to use secrets (no hardcoded credentials)
- ✅ Schema truth check workflow fixed (now compares against types/supabase.ts, uses branch-aware ref)
- ✅ Auth screens rebranded (login/create-account)
- ✅ Signup page toast provider error fixed (standardized on shadcn/ui global state pattern)
- ✅ Code cleanup and refactoring: updated UI components, admin pages, dashboard, auth components, and documentation (20 files, ~367 insertions, ~327 deletions)
- 🔄 Events/Check-in/Builder Card UI pending

---

## 🎯 **MVP Roadmap**

### **Phase 1: Database Schema (Week 1)**

- [ ] Create `profiles` table (Builder profiles)
- [ ] Create `events` table (Event listings)
- [ ] Create `tickets` table (RSVP/attendance)
- [ ] Create `xp_transactions` table (XP log)
- [ ] Create `builder_cards` view (Builder Card query)
- [ ] Set up RLS policies
- [ ] Generate TypeScript types

### **Phase 2: Auth Shell (Week 1)**

- [ ] `/` → If not logged in, show "Sign in to enter Digital Builders World"
- [ ] If logged in, redirect to `/events`
- [ ] Supabase Auth integration

### **Phase 3: Events Portal (Week 2)**

- [ ] `/events` - List upcoming events
- [ ] `/events/[id]` - Event details page
- [ ] RSVP functionality (create ticket)
- [ ] Cancel RSVP functionality
- [ ] Event creation (admin only)

### **Phase 4: Check-In System (Week 2)**

- [ ] `/admin/check-in` - Admin check-in page
- [ ] Search by email/name
- [ ] List tickets for specific event
- [ ] Check-in button (update status + timestamp)
- [ ] Guard by `role = 'admin'`

### **Phase 5: Builder Card (Week 2)**

- [ ] `/builder-card` - Builder Card page
- [ ] Query `builder_cards` view
- [ ] Display:
  - Name/handle
  - Region
  - XP total
  - Level (fake formula for now)
  - Last event attended
  - Basic badges (fake/manual at first)

---

## 📊 **Current MVP Completion Status**

| Category               | Status        | Completion |
| ---------------------- | ------------- | ---------- |
| **MVP Definition**     | ✅ Complete   | 100%       |
| **Schema Design**      | ✅ Complete   | 100%       |
| **Database Schema**    | ✅ Done       | 100%       |
| **Authentication**     | ✅ Branded    | 100%       |
| **Events Portal**      | ✅ In Progress| 25%        |
| **Check-In System**    | 🔄 Pending    | 0%         |
| **Builder Card**       | 🔄 Pending    | 0%         |
| **Testing**            | 🔄 Pending    | 0%         |

---

## 🎯 **Immediate Next Steps**

### **Priority 1: Events Portal**
1. ✅ Build `/events` list (server component) pulling `events` (RLS-safe).
2. 🔄 Build `/events/[slug]` detail; include RSVP/Cancel actions (tickets insert/delete).
3. 🔄 Redirect after login → `/events`.

### **Priority 2: Check-In System**
1. `/admin/check-in`: search by email/name for a specific `event_id`.
2. Action: set `tickets.status = 'checked_in'` + `checked_in_at = now()`.
3. Guard by `role = 'admin'`.

### **Priority 3: Builder Card**
1. `/builder-card`: query `builder_cards` view (or profiles + xp sum fallback).
2. Show name/handle, region, XP total, level (fake), last event attended, badges (manual).

### **Priority 4: Cleanups / Hardening**
1. Remove temporary `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` once code is clean.
2. Keep Next.js 15.5.7 / React 19.2.1 (patched CVE-2025-66478).
3. Verify Resend domain/DNS; use `lib/email/resend.ts` with `EMAIL_FROM=admin@digitalbuilders757.com`.
4. Ensure Supabase pages/actions run on Node runtime (avoid Edge warnings with supabase-js).

---

## 🛠️ **Technical Stack**

- **Frontend:** Next.js 15.5.4 + App Router + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Real-time)
- **Styling:** TailwindCSS + shadcn/ui
- **Email:** Resend (optional, for verification emails)
- **Future v2+:** Solana integration (optional)

---

## 📋 **Core Entities**

### **profiles**
- Builder profiles (one per auth user)
- Fields: username, display_name, role, bio, avatar_url, region, xp_total, level

### **events**
- Events people can attend
- Fields: slug, title, subtitle, description, venue, city, start_at, end_at, capacity, status, price_cents

### **tickets**
- RSVP/attendance records
- Fields: event_id, user_id, status, checked_in_at, payment_provider, payment_reference

### **xp_transactions**
- XP earning log
- Fields: user_id, source_type, source_id, amount, description, created_by

---

## 🚨 **Important Notes**

**v1 MVP Requirements:**

- ✅ Email/password auth (Supabase)
- ✅ Event Portal (RSVP, check-in)
- ✅ Builder Card (XP, badges)
- ✅ No wallet connection required
- ✅ No Solana dependencies in core flows
- ✅ No PVP, no crypto yet

**v2+ Future Integration:**

- ⏳ Solana wallet connection (optional)
- ⏳ On-chain tokens (DB Cred → SPL token, Builder Power → governance token)
- ⏳ NFT achievements
- ⏳ Game systems (jobs, actions, PVP-lite)

---

## 📚 **Documentation**

- **`README.md`** - Project overview and quick start
- **`database_schema_audit.md`** - Database schema single source of truth
- **`DIGITAL_BUILDERS_PROJECT_CONTEXT_PROMPT.md`** - Project context and rules
- **`docs/digital-builders/MVP_ROADMAP.md`** - Detailed MVP roadmap
- **`docs/digital-builders/PROJECT_SPEC.md`** - Complete project specification

---

## 🎯 **Next Session Priorities**

### **Immediate Actions (This Week):**

1. ✅ **MVP scope locked** - Event Portal + Builder Card
2. ✅ **Schema designed** - profiles, events, tickets, xp_transactions
3. 🔄 **Create database schema migrations** for Event Portal tables
4. 🔄 **Generate TypeScript types** from new schema: `npm run types:regen`
5. 🔄 **Build auth shell** (redirect logic)
6. 🔄 **Build events portal** (list, detail, RSVP)

### **Short-term (Weeks 2-3):**

1. **Implement check-in system** (admin page)
2. **Create Builder Card page** (display XP, badges)
3. **Add basic badge system** (fake/manual at first)
4. **Test end-to-end flow** (signup → RSVP → check-in → Builder Card)

---

## 🎉 **Recent Accomplishments (December 2025)**

### **Project Migration & Cleanup**

- ✅ Migrated all scripts from TOTL Agency to Digital Builders
- ✅ Updated all SQL scripts to match Digital Builders schema (profiles, events, tickets, xp_transactions)
- ✅ Updated test scripts for Digital Builders roles (builder/mentor/admin)
- ✅ Removed legacy TOTL-specific files and references
- ✅ Updated all project references from "TOTL Agency" to "Digital Builders"
- ✅ Fixed database type checks in verification scripts
- ✅ Updated code comments and documentation references

### **Scripts Updated**

- ✅ `cleanup-test-data.sql` - Now uses Digital Builders tables
- ✅ `update-missing-profile-names.sql` - New script for Digital Builders profile structure
- ✅ `apply_linter_fixes.sql` - Updated for Digital Builders RLS policies
- ✅ `test-signup-flow.ts` - Rewritten for builder/mentor/admin roles
- ✅ All PowerShell scripts updated with Digital Builders branding
- ✅ Pre-commit checks updated for Digital Builders schema

### **MVP Pivot**

- ✅ Pivoted from complex game to Event Portal + Builder Card
- ✅ Defined clear MVP scope
- ✅ Designed schema for Event Portal
- ✅ Created implementation plan

### **Documentation**

- ✅ Updated all documentation with new MVP plan
- ✅ Schema audit file ready
- ✅ MVP roadmap updated
- ✅ All scripts documented and aligned with Digital Builders

### **Deployment Fixes**

- ✅ Fixed Vercel deployment error: Removed unused `vaul` package incompatible with React 19
- ✅ Verified build passes without vaul dependency
- ✅ Updated error reference documentation for peer dependency conflicts

### **Events Portal Implementation (December 2025)**

- ✅ Implemented `/events` list page with server component data fetching
- ✅ Created reusable `EventsPageShell` component to eliminate duplication
- ✅ Centralized `EventListItem` type in `components/events/types.ts` for type safety
- ✅ Built `EventCard` component with RSVP button linking to detail page
- ✅ Added loading state with skeleton UI
- ✅ Implemented proper error handling and empty states
- ✅ Fixed types generation pipeline: migrated to `types/supabase.ts` with UTF-8 encoding
- ✅ Updated Supabase CLI from 2.34.3 to 2.67.1 across all scripts
- ✅ Fixed types check stale issue with improved normalization logic

### **Infrastructure Improvements**

- ✅ Fixed types generation encoding corruption (Windows `cmd >` → PowerShell UTF-8)
- ✅ Updated all scripts to use Supabase CLI 2.67.1
- ✅ Improved types verification to handle formatting differences
- ✅ Added `.env.local` auto-loading to `verify-types-fresh.mjs`

### **Homepage Messaging Refactor (January 2025)**

- ✅ Complete homepage copy rewrite with regional/cultural positioning (757/Hampton Roads focus)
- ✅ Changed hero from rule-focused ("You Must Have A Builder Account") to benefit-focused ("The Best Tech & Creative Events in the 757")
- ✅ Removed fake/inflated stats section
- ✅ Added mission section reframing 757 narrative
- ✅ Updated feature cards: "Account = Access" → "Your Builder Card" (perk-focused)
- ✅ De-gamified language: removed XP/badges emphasis from homepage
- ✅ Events-first CTAs: "See Upcoming Events" (primary), "Join the Builders" (secondary)
- ✅ Brand name consistency: "Digital Builders World" → "Digital Builders"
- ✅ Fixed spacing: added proper padding between hero and mission sections

### **Authentication System Fix (January 2025)**

- ✅ Fixed broken auth flow: removed all TOTL Agency references (`talent`/`client` roles, `/talent/*`, `/client/*` routes)
- ✅ Created functional signup form (`/signup`) with email, password, optional display_name
- ✅ Fixed profile creation: `ensureProfileExists()` now uses `maybeSingle()`, defaults `role='builder'`
- ✅ Fixed auth callback: redirects to `/events` after email verification (removed TOTL routes)
- ✅ Fixed login redirect: `handleLoginRedirect()` redirects to `/events` for builders/mentors
- ✅ Fixed middleware: removed `account_type`, `/choose-role`, `/onboarding` checks; simplified redirect logic
- ✅ Fixed auth provider: removed `AccountType`, `account_type` queries; updated `UserRole` to `"builder" | "mentor" | "admin"`
- ✅ Homepage remains public (no forced redirect) for marketing purposes
- ✅ All auth success redirects now consistently go to `/events` (single source of truth)

---

### **Code Cleanup & Refactoring (January 2025)**

- ✅ Updated admin users client component with improved functionality
- ✅ Refactored dashboard components (client and talent data)
- ✅ Updated auth components (auth-action, require-auth, sign-in-gate)
- ✅ Improved UI components (badge, status-badge, profile-completion-banner, background-paths, command-palette)
- ✅ Updated documentation (terminology, status badges, developer reference, beta testing checklist)
- ✅ Styling improvements (globals.css)
- ✅ Code cleanup across 20 files (367 insertions, 327 deletions)

---

_Last Updated: January 2025  
_Current Status: ✅ Authentication Flow Fixed - Signup/Login Working, Redirects to /events | Code Cleanup Complete_  
_Next Review: After `/events/[slug]` detail page implementation_
