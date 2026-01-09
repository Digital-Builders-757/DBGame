# Phase 5: Product Polish & Identity - Execution Plan

**Date:** January 2026  
**Status:** Ready for Implementation  
**Priority:** HIGH  
**Estimated Effort:** 1-2 days

---

## STEP 0 — MANDATORY CONTEXT

### Documents Reviewed
- ✅ `docs/VIBE_CURRENT_STATE.md` — Confirms Phases 1-4 complete
- ✅ `docs/VIBE_PHASES_5_9_EXECUTION_PLAN.md` — Phase 5 scope defined
- ✅ `README.md` — Updated with ViBE branding
- ✅ `database_schema_audit.md` — Schema stable, no changes needed
- ⚠️ `docs/ARCHITECTURE_CONSTITUTION.md` — **MISSING** (will infer from codebase patterns)
- ⚠️ `docs/diagrams/airport-model.md` — **MISSING** (will infer from codebase structure)

### Current State Analysis
**Rebrand Completion Assessment:**

**Grade: B+ (85%)**

**What's Complete:**
- ✅ Core pages updated (homepage, events, event-pass, login, signup)
- ✅ Brand colors and typography applied
- ✅ Database schema migrated (roles, XP removed)
- ✅ Route redirects implemented
- ✅ README updated

**What Remains:**
- ⚠️ **59+ files** still contain "Digital Builders" references (comments, code, strings)
- ⚠️ **15+ files** contain "TOTL" references (legacy agency name)
- ⚠️ **20+ files** contain "builder" references (should be "user" or "attendee")
- ⚠️ Package.json still named "digital-builders-game"
- ⚠️ Sentry config references "digital-builders"
- ⚠️ Several pages still have old copy (about, project-overview, navbar)

**Critical Files Needing Updates:**
1. `package.json` — name, description
2. `next.config.mjs` — Sentry org/project names
3. `components/navbar.tsx` — alt text, comments
4. `app/about/page.tsx` — Entire page is TOTL Agency content (needs ViBE rewrite)
5. `app/project-overview/page.tsx` — "Digital Builders" references
6. `lib/email/resend.ts` — Email sender name
7. All admin components — Comments and copy
8. All settings components — Comments and copy
9. All API routes — Comments and error messages
10. CSS comments — "Digital Builders Neon Effects"

---

## STEP 1 — CONSTITUTION INVARIANTS

### 5 Most Relevant Non-Negotiables

**1. No Database Schema Changes**
- **Rule:** Phase 5 is copy-only. No migrations, no schema changes.
- **Limitation:** We cannot rename database columns or tables. Only update user-facing strings and comments.

**2. No Breaking API Changes**
- **Rule:** Don't change API contracts, route paths, or component props.
- **Limitation:** Only update strings, comments, and display text. Keep all functionality identical.

**3. Build Must Pass**
- **Rule:** All changes must maintain build integrity and TypeScript type safety.
- **Limitation:** Must verify build after each batch of changes.

**4. RLS Policies Unchanged**
- **Rule:** Don't touch RLS policies or database security.
- **Limitation:** Only update comments in migration files if needed, but don't modify policy logic.

**5. Preserve Functionality**
- **Rule:** This is a rebrand, not a refactor. All features must work identically.
- **Limitation:** Only change what users see and read, not how the system behaves.

**RED ZONE INVOLVED: NO**

This phase touches:
- ✅ Terminal Zone (UI copy only)
- ✅ Comments and documentation
- ❌ No middleware changes
- ❌ No auth flow changes
- ❌ No RLS changes
- ❌ No database changes

---

## STEP 2 — AIRPORT MAP (ARCHITECTURAL ZONES)

### Zones Touched

**Terminal Zone (UI Pages & Components)**
- **Why:** User-facing copy, page titles, button text, form labels
- **What stays OUT:** Component logic, props, state management, routing

**Staff Zone (Server Actions & API Routes)**
- **Why:** Error messages, success messages, API response text
- **What stays OUT:** Business logic, validation rules, data transformations

**Announcements Zone (Email Templates)**
- **Why:** Email sender names, email body copy
- **What stays OUT:** Email delivery logic, template rendering

### Zones NOT Touched

**Security Zone (Middleware)**
- No changes to route protection or redirects

**Locks Zone (RLS Policies)**
- No changes to database security

**Control Tower (Admin Tools)**
- Only copy changes, no functionality changes

**Baggage Zone (Storage)**
- No changes to file uploads or storage paths

---

## STEP 3 — DESIGN PROPOSALS

### Approach A: Systematic File-by-File Cleanup (RECOMMENDED)

**High-Level Description:**
Process files in logical groups (pages → components → lib → config), updating all brand references systematically. Use grep to find all instances first, then update in batches.

**Files Expected to Change:**
1. **Configuration Files (5 files)**
   - `package.json` — name, description
   - `next.config.mjs` — Sentry org/project
   - `app/globals.css` — CSS comments
   - `database_schema_audit.md` — Brand references
   - `SETUP_CHECKLIST.md` — Brand references

2. **App Pages (10 files)**
   - `app/about/page.tsx` — Complete rewrite (TOTL → ViBE)
   - `app/project-overview/page.tsx` — Update copy
   - `app/admin/dashboard/page.tsx` — Comments
   - `app/admin/users/page.tsx` — Comments
   - `app/settings/page.tsx` — Comments
   - `app/settings/profile-editor.tsx` — Comments
   - `app/settings/sections/basic-info.tsx` — Comments
   - `app/dashboard/actions.ts` — Comments
   - `app/dashboard/talent-data.tsx` — Comments (deprecated component)
   - `app/test-sentry/page.tsx` — Copy

3. **Components (8 files)**
   - `components/navbar.tsx` — Alt text, comments
   - `components/admin/admin-header.tsx` — Copy
   - `components/admin/admin-user-creation.tsx` — Comments
   - `components/admin/direct-user-creation.tsx` — Comments
   - `components/auth/sign-in-gate.tsx` — Copy
   - `components/auth/auth-provider.tsx` — Comments
   - `components/ui/status-badge.tsx` — Comments
   - `components/ui/background-paths.tsx` — Title

4. **Lib Files (6 files)**
   - `lib/email/resend.ts` — Sender name
   - `lib/selects.ts` — Comments
   - `lib/safe-query.ts` — Comments
   - `lib/utils/safe-query.ts` — Comments
   - `lib/sentry/env.ts` — Comments
   - `lib/utils/image-utils.ts` — Comments (if any)

5. **API Routes (4 files)**
   - `app/api/admin/create-user/route.ts` — Comments
   - `app/api/sentry-diagnostic/route.ts` — Copy
   - `app/api/test-sentry/route.ts` — Copy

6. **Documentation (50+ files)**
   - All files in `docs/` containing "Digital Builders" or "TOTL"
   - Update systematically, prioritizing user-facing docs

**Data Model Impact:** None

**Key Risks:**
- **Inconsistency:** Missing some references
  - **Mitigation:** Use comprehensive grep searches, create checklist
- **Breaking Changes:** Accidentally changing code logic
  - **Mitigation:** Only change strings/comments, verify build after each batch
- **Scope Creep:** Adding features "while we're here"
  - **Mitigation:** Strict adherence to copy-only rule

**Why This Approach:**
- ✅ Respects Constitution (no schema/API changes)
- ✅ Respects Airport boundaries (Terminal/Staff zones only)
- ✅ Systematic and verifiable
- ✅ Low risk of breaking changes

---

### Approach B: Automated Find-Replace (NOT RECOMMENDED)

**High-Level Description:**
Use automated find-replace across entire codebase.

**Why NOT Recommended:**
- ❌ High risk of breaking code (might replace variable names, imports)
- ❌ Can't verify context of each replacement
- ❌ May miss nuanced cases (e.g., "builder" in code vs copy)
- ❌ Hard to track what changed

---

### Approach C: Priority-Based Cleanup (ALTERNATIVE)

**High-Level Description:**
Focus on user-facing files first (pages, components), then internal files (lib, API), then docs.

**Why Consider:**
- ✅ Faster visible impact
- ✅ Can ship after user-facing cleanup
- ✅ Lower risk (user-facing is easier to verify)

**Why Not Primary:**
- ⚠️ Leaves technical debt in code comments
- ⚠️ Inconsistent brand experience for developers

---

## STEP 4 — ACCEPTANCE CRITERIA

### UI Behavior
- ✅ All user-facing pages show "ViBE" (not "Digital Builders" or "VIBE")
- ✅ All buttons, labels, and form text use events-first language
- ✅ No "builder" references in user-facing copy (use "user" or "attendee")
- ✅ About page reflects ViBE (events platform), not TOTL Agency

### Data Correctness
- ✅ No database changes
- ✅ All functionality works identically
- ✅ No broken imports or references

### Permissions & Access Control
- ✅ RLS policies unchanged
- ✅ Auth flows unchanged
- ✅ Role checks unchanged

### Failure Cases (What Must NOT Happen)
- ❌ Build fails
- ❌ TypeScript errors introduced
- ❌ Broken links or routes
- ❌ Changed functionality
- ❌ Database schema changes
- ❌ API contract changes

### Brand Consistency Checklist
- [ ] Zero "Digital Builders" in user-facing code
- [ ] Zero "TOTL" references (except in legacy docs if needed)
- [ ] Consistent "ViBE" capitalization everywhere
- [ ] Package.json name updated
- [ ] Sentry config updated
- [ ] Email sender name updated
- [ ] All page titles/metadata updated
- [ ] All error messages updated
- [ ] All success messages updated

---

## STEP 5 — TEST PLAN

### Manual Test Steps

**Happy Path:**
1. Build passes: `npm run build`
2. Type check passes: `npm run typecheck`
3. Homepage loads, shows "ViBE" branding
4. Login page shows "ViBE" (not "Digital Builders")
5. Signup page shows "ViBE Account" (not "Builder Account")
6. Events page shows "ViBE Events"
7. About page shows ViBE content (not TOTL)
8. Navbar logo alt text says "ViBE"
9. Admin dashboard shows "ViBE Admin" (not "Digital Builders Admin")
10. Settings page has ViBE branding
11. Error messages reference "ViBE" (not "Digital Builders")
12. Email sender name is "ViBE" (if emails sent)

**Edge Cases:**
1. Verify no broken imports (grep for "Digital Builders" in import paths)
2. Verify no changed variable names (grep for "builder" in code logic)
3. Verify Sentry still works (check error reporting)
4. Verify email still works (check sender name)

### Automated Tests

**No new tests needed** (this is copy-only, existing tests should pass)

**Regression Checks:**
- Run existing test suite
- Verify no TypeScript errors
- Verify build succeeds

### Verification Commands

```bash
# Find remaining "Digital Builders" references
grep -r "Digital Builders" --include="*.tsx" --include="*.ts" --include="*.json" --include="*.md" app/ components/ lib/ | grep -v node_modules

# Find remaining "TOTL" references
grep -r "TOTL\|totl" --include="*.tsx" --include="*.ts" app/ components/ lib/ | grep -v node_modules

# Find remaining "builder" in user-facing contexts
grep -r "builder\|Builder" --include="*.tsx" app/ components/ | grep -v "builder-card\|builder_cards" | grep -v node_modules

# Verify build
npm run build

# Verify types
npm run typecheck
```

---

## 📋 EXECUTION CHECKLIST

### Batch 1: Configuration Files (30 min)
- [ ] Update `package.json` name and description
- [ ] Update `next.config.mjs` Sentry org/project
- [ ] Update `app/globals.css` CSS comments
- [ ] Verify build passes

### Batch 2: Core Pages (2 hours)
- [ ] Rewrite `app/about/page.tsx` (TOTL → ViBE)
- [ ] Update `app/project-overview/page.tsx`
- [ ] Update `app/admin/dashboard/page.tsx` comments
- [ ] Update `app/admin/users/page.tsx` comments
- [ ] Update `app/settings/page.tsx` comments
- [ ] Update `app/settings/profile-editor.tsx` comments
- [ ] Update `app/settings/sections/basic-info.tsx` comments
- [ ] Update `app/dashboard/actions.ts` comments
- [ ] Update `app/test-sentry/page.tsx` copy
- [ ] Verify build passes

### Batch 3: Components (1.5 hours)
- [ ] Update `components/navbar.tsx`
- [ ] Update `components/admin/admin-header.tsx`
- [ ] Update `components/admin/admin-user-creation.tsx`
- [ ] Update `components/admin/direct-user-creation.tsx`
- [ ] Update `components/auth/sign-in-gate.tsx`
- [ ] Update `components/auth/auth-provider.tsx` comments
- [ ] Update `components/ui/status-badge.tsx` comments
- [ ] Update `components/ui/background-paths.tsx`
- [ ] Verify build passes

### Batch 4: Lib & API (1 hour)
- [ ] Update `lib/email/resend.ts` sender name
- [ ] Update `lib/selects.ts` comments
- [ ] Update `lib/safe-query.ts` comments
- [ ] Update `lib/utils/safe-query.ts` comments
- [ ] Update `lib/sentry/env.ts` comments
- [ ] Update `app/api/admin/create-user/route.ts` comments
- [ ] Update `app/api/sentry-diagnostic/route.ts` copy
- [ ] Update `app/api/test-sentry/route.ts` copy
- [ ] Verify build passes

### Batch 5: Documentation (2 hours)
- [ ] Update priority docs (README, migration plan, current state)
- [ ] Update other docs systematically
- [ ] Create final verification report

### Final Verification (30 min)
- [ ] Run grep searches for remaining references
- [ ] Manual QA of all pages
- [ ] Build verification
- [ ] Type check verification
- [ ] Create completion report

---

## 🎯 STOP LINE

**Phase 5 is complete when:**
1. ✅ Zero "Digital Builders" in user-facing code
2. ✅ Zero "TOTL" in user-facing code (except legacy docs if needed)
3. ✅ Consistent "ViBE" capitalization
4. ✅ Package.json updated
5. ✅ Sentry config updated
6. ✅ Build passes
7. ✅ Type check passes
8. ✅ Manual QA complete

---

## 📊 REBRAND COMPLETION GRADE

**Current Grade: B+ (85%)**

**Breakdown:**
- Core Pages: A (90%) — Most updated, some remain
- Components: B (80%) — Many updated, some comments remain
- Configuration: C (60%) — Package.json, Sentry config not updated
- Documentation: B (75%) — Main docs updated, many legacy docs remain
- Code Comments: C (50%) — Many comments still reference old brand

**After Phase 5 Completion: Target Grade: A (95%+)**

---

## 🚀 RECOMMENDATION

**Proceed with Phase 5 first, using Approach A (Systematic File-by-File Cleanup).**

**Rationale:**
1. **Fast Win:** 1-2 days, high visible impact
2. **Low Risk:** Copy-only changes, easy to verify
3. **Foundation:** Cleans up technical debt before building new features
4. **Launch Readiness:** Essential for professional launch
5. **Momentum:** Builds confidence before tackling Phase 6

**Start with:** Batch 1 (Configuration Files) — Quick wins, sets foundation.

---

*Last Updated: January 2026 | Status: Ready for Implementation*
