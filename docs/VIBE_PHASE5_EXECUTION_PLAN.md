# Phase 5: Product Polish & Identity — Execution Plan

**Date:** January 2026  
**Feature:** Complete ViBE brand consistency across all user-facing code  
**Mode:** DESIGN & PLANNING

---

## STEP 0 — MANDATORY CONTEXT

### Documents Reviewed

**Core Documents:**
- ✅ `docs/VIBE_CURRENT_STATE.md` — Confirms Phases 1-4 complete
- ✅ `docs/VIBE_PHASES_5_9_EXECUTION_PLAN.md` — High-level phase plan
- ✅ `docs/VIBE_REBRAND_AUDIT.md` — Comprehensive audit of remaining work
- ✅ `database_schema_audit.md` — Database schema (no changes needed)
- ✅ `README.md` — Updated with ViBE branding

**Architecture Documents:**
- ⚠️ `docs/ARCHITECTURE_CONSTITUTION.md` — **NOT FOUND** (not required for copy changes)
- ⚠️ `docs/diagrams/airport-model.md` — **NOT FOUND** (not required for copy changes)

**Current State Analysis:**
- ✅ Phases 1-4 complete: Roles, XP removal, Event Pass, brand colors/fonts
- ✅ Core functionality working: Auth, events, RSVP, check-in
- ⚠️ **47 user-facing files** still contain "Digital Builders" references
- ⚠️ **2 critical pages** need complete rewrite (`about`, `project-overview`)
- ⚠️ Inconsistent capitalization ("VIBE" vs "ViBE")

**Why Architecture Diagrams Not Needed:**
This phase is **copy/text changes only**. No database changes, no RLS changes, no route changes, no component structure changes. Only string replacements and copy updates.

---

## STEP 1 — CONSTITUTION INVARIANTS

### 5 Most Relevant Non-Negotiables

**1. No Database Schema Changes**
- **Rule:** This phase is copy-only. No migrations, no schema updates.
- **Limitation:** We cannot change database column names or table names. Only user-facing text.

**2. No Route Path Changes**
- **Rule:** Keep all existing routes. Only update page content and metadata.
- **Limitation:** Cannot rename routes (e.g., `/builder-card` redirect stays, but page content updates).

**3. No Component API Changes**
- **Rule:** Only update props values (strings), not prop names or component structure.
- **Limitation:** Cannot change component interfaces or function signatures.

**4. Type Safety Must Be Maintained**
- **Rule:** All TypeScript types remain unchanged. Only string literals updated.
- **Limitation:** Cannot change type definitions, only string values.

**5. Build Must Pass**
- **Rule:** After all changes, build must pass without errors.
- **Limitation:** Must verify build after each batch of changes.

### RED ZONE INVOLVED: **NO**

This phase touches:
- ❌ **NOT** middleware (no route changes)
- ❌ **NOT** auth/callback (no auth flow changes)
- ❌ **NOT** profile bootstrap (no data changes)
- ❌ **NOT** RLS/triggers/policies (no database changes)
- ❌ **NOT** webhooks (no integration changes)

**This is a SAFE ZONE operation:** Copy/text updates only.

---

## STEP 2 — AIRPORT MAP (ARCHITECTURAL ZONES)

### Zones Touched

**Terminal Zone (UI Pages & Components)** ✅
- **Why:** Primary target for brand copy updates
- **What changes:** Page titles, descriptions, button text, alt text, tooltips
- **What stays OUT:** Component structure, props interfaces, routing logic

**Staff Zone (Server Actions / API Routes)** ⚠️
- **Why:** Error messages and API responses may contain brand references
- **What changes:** Error message text, API response messages
- **What stays OUT:** API contracts, response structures, business logic

**Announcements Zone (Email Templates)** ✅
- **Why:** Email from names and templates need brand updates
- **What changes:** Email from names, template copy
- **What stays OUT:** Email delivery logic, template structure

### Zones NOT Touched

**Security Zone** ❌
- No middleware changes
- No route protection changes

**Locks Zone** ❌
- No RLS policy changes
- No database constraint changes

**Control Tower** ❌
- No admin tool changes (except copy)
- No automation changes

**Baggage Zone** ❌
- No storage/upload changes

**Ticketing Zone** ❌
- No billing/payment changes

---

## STEP 3 — DESIGN PROPOSALS

### Approach A: Systematic Batch Updates (RECOMMENDED)

**High-Level Description:**
Update files in prioritized batches: Critical pages first, then components, then lib files, then comments. Use grep to find all instances, create checklist, update systematically.

**Files Expected to Change:**
1. **Batch 1 (Critical Pages):** `app/about/page.tsx`, `app/project-overview/page.tsx`
2. **Batch 2 (User-Facing Components):** `components/navbar.tsx`, `components/admin/admin-header.tsx`, `components/auth/sign-in-gate.tsx`
3. **Batch 3 (Lib Files):** `lib/email/resend.ts`
4. **Batch 4 (Code Comments):** All files with "Digital Builders" in comments
5. **Batch 5 (Configuration):** `package.json`, `next.config.mjs` (document)

**Data Model Impact:** None

**Key Risks:**
- **Missing references:** Mitigated by comprehensive grep before starting
- **Breaking changes:** Mitigated by only changing strings, not code structure
- **Inconsistency:** Mitigated by checklist and verification steps

**Why This Respects:**
- ✅ Constitution: No schema/route/API changes
- ✅ Airport boundaries: Only Terminal/Staff/Announcements zones
- ✅ Safety: Copy-only changes, easily reversible

---

### Approach B: File-by-File Complete Update

**High-Level Description:**
Update each file completely before moving to next. More thorough but slower.

**Files Expected to Change:** Same as Approach A, but one file at a time

**Data Model Impact:** None

**Key Risks:**
- **Slower:** Takes more time
- **Less systematic:** May miss patterns

**Why This Respects:**
- ✅ Constitution: Same as Approach A
- ✅ Airport boundaries: Same as Approach A
- ⚠️ Less efficient than batch approach

---

### Approach C: Automated Find-Replace (NOT RECOMMENDED)

**High-Level Description:**
Use automated find-replace across entire codebase. Fast but risky.

**Files Expected to Change:** All files

**Data Model Impact:** None (if careful)

**Key Risks:**
- **Too aggressive:** May replace in wrong contexts
- **Hard to verify:** Difficult to review all changes
- **May break code:** Could replace in code strings/comments incorrectly

**Why This Respects:**
- ⚠️ Too risky for production codebase
- ⚠️ May introduce errors

---

## STEP 4 — ACCEPTANCE CRITERIA (DEFINITION OF DONE)

### UI Behavior
- ✅ All pages display "ViBE" branding (not "Digital Builders")
- ✅ All buttons, links, labels use events-first language
- ✅ No "builder", "community", "XP", "badges" language in user-facing text
- ✅ Consistent "ViBE" capitalization everywhere

### Data Correctness
- ✅ No database changes (schema unchanged)
- ✅ No data migration needed
- ✅ All existing data remains valid

### Permissions & Access Control
- ✅ No RLS changes (policies unchanged)
- ✅ No route protection changes
- ✅ All existing permissions remain valid

### Failure Cases (What Must NOT Happen)
- ❌ Build must not break
- ❌ TypeScript errors must not be introduced
- ❌ Routes must not change
- ❌ Component APIs must not change
- ❌ Database schema must not change
- ❌ User flows must not break

### Verification Checklist
- [ ] Zero "Digital Builders" in user-facing code (grep verification)
- [ ] Zero "TOTL" in user-facing code (grep verification)
- [ ] Consistent "ViBE" capitalization (grep verification)
- [ ] Build passes (`npm run build`)
- [ ] TypeScript checks pass (`npm run typecheck`)
- [ ] Manual QA: All pages reviewed
- [ ] Critical pages (`about`, `project-overview`) fixed or removed

---

## STEP 5 — TEST PLAN

### Manual Test Steps

**Happy Path:**
1. Start dev server (`npm run dev`)
2. Navigate to homepage → Verify "ViBE" branding
3. Navigate to `/events` → Verify "ViBE Events" branding
4. Navigate to `/about` → Verify rewritten content OR verify redirect
5. Navigate to `/project-overview` → Verify rebranded content
6. Navigate to `/login` → Verify "ViBE" in copy
7. Navigate to `/signup` → Verify "ViBE" in copy
8. Navigate to `/admin/dashboard` → Verify "ViBE Admin" title
9. Check navbar → Verify logo alt text updated
10. Check email templates → Verify from name updated

**Edge Cases:**
1. Test error messages → Verify no "Digital Builders" references
2. Test toast notifications → Verify "ViBE" branding
3. Test form labels → Verify events-first language
4. Test button text → Verify no builder language
5. Test console logs (user-facing) → Verify "ViBE" branding

**Regression Checks:**
1. Verify all routes still work
2. Verify authentication flow unchanged
3. Verify event RSVP flow unchanged
4. Verify check-in flow unchanged
5. Verify Event Pass page unchanged (functionality)

### Automated Tests

**Build Verification:**
```bash
npm run build        # Must pass
npm run typecheck    # Must pass
npm run lint         # Should pass (warnings OK)
```

**Grep Verification:**
```bash
# Should return 0 results for user-facing files
grep -r "Digital Builders" app/ components/ lib/ --exclude-dir=node_modules
grep -r "TOTL" app/ components/ lib/ --exclude-dir=node_modules
```

**Capitalization Verification:**
```bash
# Check for wrong capitalization (user-facing only)
grep -r "VIBE" app/ components/ --exclude-dir=node_modules | grep -v "ViBE"
```

### RED ZONE Regression Checks

**N/A** — No RED ZONE changes in this phase.

---

## 🎯 RECOMMENDATION

**Proceed with Approach A: Systematic Batch Updates**

**Rationale:**
1. **Fastest path to completion** (1-2 days)
2. **Lowest risk** (copy-only changes)
3. **Easiest to verify** (systematic checklist)
4. **Respects all constraints** (no schema/route/API changes)

**Execution Order:**
1. **Batch 1:** Critical pages (`about`, `project-overview`) — 2-3 hours
2. **Batch 2:** User-facing components — 2-3 hours
3. **Batch 3:** Lib files (email) — 30 min
4. **Batch 4:** Code comments — 1-2 hours
5. **Batch 5:** Configuration — 30 min
6. **Verification:** 1 hour

**Total Estimated Time:** 1-2 days

---

## 🛑 STOP AND WAIT

**Which approach should I implement (A / B / C), and are there any constraints or adjustments before coding?**

**Recommended:** Approach A (Systematic Batch Updates)

**Ready to proceed when approved.**

---

*Last Updated: January 2026*
