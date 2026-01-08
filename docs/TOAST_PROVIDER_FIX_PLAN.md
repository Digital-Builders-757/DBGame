# Toast Provider Fix Plan - Signup Page Error

**Feature:** Fix `/signup` page crash due to missing ToastProvider  
**Error:** `Error: useToast must be used within a ToastProvider`  
**Status:** DESIGN ONLY - Awaiting implementation approval

---

## STEP 0 — MANDATORY CONTEXT

### Core Documents Reviewed
- ✅ `database_schema_audit.md` - No database changes required
- ✅ `docs/DOCUMENTATION_INDEX.md` - Referenced troubleshooting patterns
- ✅ `app/layout.tsx` - Root layout structure
- ✅ `app/providers.tsx` - Provider tree structure
- ✅ `components/ui/toaster.tsx` - Toaster implementation
- ✅ `components/ui/use-toast.ts` - Global state toast hook
- ✅ `hooks/use-toast.ts` - Context-based toast hook
- ✅ `components/auth/builder-signup-form.tsx` - Signup form using toast

### Mental Model Applied
**No Airport Model diagrams required** - This is a pure UI/provider tree fix, not touching:
- Security/middleware
- Database/RLS
- Server actions
- Authentication flow
- Business logic

This is a **Terminal zone** (UI) issue only - fixing provider tree structure.

---

## STEP 1 — CONSTITUTION INVARIANTS

### 5 Most Relevant Non-Negotiables

1. **Component Boundaries** (from `.cursorrules`)
   - Presentational components: no data fetching
   - Server components/actions do all data I/O
   - **Impact:** Toast is UI-only, no data fetching involved. Fix must stay in UI layer.

2. **Type Safety** (from `.cursorrules`)
   - Use Generated Types: Only source of TypeScript types is `types/database.ts`
   - No `any` for DB Data
   - **Impact:** Toast hooks use React types only, no DB types. Must maintain TypeScript safety.

3. **Security Best Practices** (from `.cursorrules`)
   - Never expose service keys in client code
   - Always validate user permissions before data access
   - **Impact:** Toast is client-side only, no security implications. Must not introduce security risks.

4. **Documentation-First Approach** (from `.cursorrules`)
   - Check Documentation FIRST before changes
   - Update documentation after significant changes
   - **Impact:** Must document which toast implementation is canonical.

5. **Import Path Standards** (from `.cursorrules`)
   - Use correct import paths (`@/components/ui/...`, `@/hooks/...`)
   - **Impact:** Must ensure consistent import paths across toast usage.

### RED ZONE INVOLVED: **NO**

This fix does NOT touch:
- ❌ middleware
- ❌ auth/callback
- ❌ profile bootstrap
- ❌ Stripe webhooks
- ❌ RLS / triggers / policies

This is a **pure client-side UI provider tree fix**.

---

## STEP 2 — AIRPORT MAP (ARCHITECTURAL ZONES)

### Zones Touched

**Terminal (UI Pages & Components)** ✅
- **Why:** Signup page (`app/signup/page.tsx`) and form component (`components/auth/builder-signup-form.tsx`) are UI
- **Responsibility:** Display signup form, handle user input, show toast notifications
- **Must Stay Out:** No database calls, no auth logic (delegated to `useAuth`)

**Provider Tree (Root Layout)** ✅
- **Why:** Toast provider must be mounted at root level to be available to all components
- **Responsibility:** Mount `<Toaster />` component that provides toast context
- **Must Stay Out:** No business logic, just provider mounting

### Zones NOT Touched

- ❌ **Security (middleware/routing gates)** - No route protection changes
- ❌ **Staff (server actions/API routes)** - No server-side changes
- ❌ **Ticketing (Stripe/billing)** - No payment changes
- ❌ **Announcements (email/notifications)** - No email changes
- ❌ **Baggage (storage/uploads)** - No file upload changes
- ❌ **Locks (RLS/DB constraints)** - No database changes
- ❌ **Control Tower (admin tools)** - No admin changes

### Zone Violations to Avoid

⚠️ **DO NOT:**
- Add database queries to toast components
- Move toast logic to server actions
- Create new API routes for toast
- Modify middleware for toast
- Change authentication flow

---

## STEP 3 — DESIGN PROPOSALS

### Problem Analysis

**Root Cause Identified:**
1. **Two different toast implementations exist:**
   - `components/ui/use-toast.ts` - Global state pattern (no provider needed)
   - `hooks/use-toast.ts` - Context pattern (requires `ToastProvider`)

2. **Current usage mismatch:**
   - `builder-signup-form.tsx` imports `useToast` from `@/hooks/use-toast` (requires provider)
   - `components/ui/toaster.tsx` imports `useToast` from `@/components/ui/use-toast` (no provider needed)
   - `toaster.tsx` renders Radix UI's `ToastProvider`, but that's NOT the provider `hooks/use-toast.ts` expects

3. **Provider tree issue:**
   - `app/providers.tsx` mounts `<Toaster />` correctly
   - But `Toaster` component uses global state version, not context version
   - Signup form needs context version's `ToastProvider` from `hooks/use-toast.ts`

### Approach A: Standardize on Global State Pattern (RECOMMENDED)

**High-level description:**
- Change `builder-signup-form.tsx` to use `@/components/ui/use-toast` (global state version)
- Keep existing `<Toaster />` in `providers.tsx` (already correct)
- Remove or deprecate `hooks/use-toast.ts` to prevent future confusion

**Files expected to change:**
- `components/auth/builder-signup-form.tsx` - Change import from `@/hooks/use-toast` to `@/components/ui/use-toast`
- `components/auth/auth-action.tsx` - Already uses `@/components/ui/use-toast` ✅
- `hooks/use-toast.ts` - Mark as deprecated or delete (if no other usages)

**Data model impact:** None

**Key risks:**
- ✅ **Low risk:** Only import path change
- ✅ **No redirect loops:** Not touching routing
- ✅ **No profile bootstrap gaps:** Not touching auth
- ✅ **No RLS enforcement issues:** No database changes
- ✅ **No Stripe/webhook issues:** Not touching payments

**Why this respects Constitution:**
- ✅ Maintains component boundaries (UI-only change)
- ✅ Preserves type safety (same TypeScript types)
- ✅ Follows import path standards (`@/components/ui/...`)
- ✅ Minimal diff (one import change)

**Why this respects Airport boundaries:**
- ✅ Stays in Terminal zone (UI only)
- ✅ No cross-zone violations
- ✅ Provider tree remains simple

---

### Approach B: Standardize on Context Pattern

**High-level description:**
- Update `components/ui/toaster.tsx` to use `@/hooks/use-toast` (context version)
- Ensure `ToastProvider` from `hooks/use-toast.ts` wraps the app
- Update all components using `@/components/ui/use-toast` to use `@/hooks/use-toast`

**Files expected to change:**
- `components/ui/toaster.tsx` - Change to use context-based hook and render `ToastProvider` from `hooks/use-toast.ts`
- `app/providers.tsx` - Wrap children with `ToastProvider` from `hooks/use-toast.ts` BEFORE `<Toaster />`
- `components/auth/auth-action.tsx` - Change import to `@/hooks/use-toast`
- `components/ui/email-verification-reminder.tsx` - Change import to `@/hooks/use-toast`
- `components/ui/use-toast.ts` - Mark as deprecated or delete

**Data model impact:** None

**Key risks:**
- ⚠️ **Medium risk:** Multiple file changes, more surface area for errors
- ⚠️ **Provider nesting:** Must ensure `ToastProvider` wraps `<Toaster />` correctly
- ✅ **No redirect loops:** Not touching routing
- ✅ **No profile bootstrap gaps:** Not touching auth
- ✅ **No RLS enforcement issues:** No database changes

**Why this respects Constitution:**
- ✅ Maintains component boundaries
- ✅ Preserves type safety
- ✅ Follows import path standards (but requires more changes)

**Why this respects Airport boundaries:**
- ✅ Stays in Terminal zone
- ⚠️ More complex provider tree (but still acceptable)

---

### Approach C: Hybrid - Keep Both, Fix Provider Tree

**High-level description:**
- Keep both implementations (global state for most, context for specific needs)
- Add `ToastProvider` from `hooks/use-toast.ts` to `app/providers.tsx`
- Update `components/ui/toaster.tsx` to work with context version when needed
- Document which to use when

**Files expected to change:**
- `app/providers.tsx` - Add `ToastProvider` from `hooks/use-toast.ts` wrapping children
- `components/ui/toaster.tsx` - Potentially update to support both patterns
- Documentation - Add guide on when to use which toast implementation

**Data model impact:** None

**Key risks:**
- ⚠️ **High risk:** Maintaining two implementations increases complexity
- ⚠️ **Confusion:** Developers may use wrong implementation
- ⚠️ **Technical debt:** Two ways to do the same thing
- ✅ **No redirect loops:** Not touching routing

**Why this respects Constitution:**
- ⚠️ Violates "single source of truth" principle
- ⚠️ Increases maintenance burden

**Why this respects Airport boundaries:**
- ✅ Stays in Terminal zone
- ⚠️ More complex provider tree

---

## STEP 4 — ACCEPTANCE CRITERIA (DEFINITION OF DONE)

### UI Behavior
- ✅ `/signup` page loads without errors (no 500, no black screen)
- ✅ Signup form displays correctly
- ✅ Toast notifications appear when:
  - Form validation fails
  - Signup API returns error
  - Unexpected errors occur
- ✅ Toast notifications have correct styling (variant colors, icons)
- ✅ Toast notifications auto-dismiss after appropriate delay
- ✅ No console errors related to `useToast` or `ToastProvider`

### Data Correctness
- ✅ No data changes required (toast is UI-only)
- ✅ Signup functionality remains unchanged (still calls `signUp` from `useAuth`)
- ✅ Form validation logic unchanged

### Permissions & Access Control
- ✅ No authentication changes
- ✅ No authorization changes
- ✅ Toast is available to all users (no permission checks needed)

### Failure Cases (What Must NOT Happen)
- ❌ `/signup` page must NOT return 500 error
- ❌ Browser console must NOT show "useToast must be used within a ToastProvider"
- ❌ Toast notifications must NOT fail to display
- ❌ Other pages using toast must NOT break
- ❌ No new TypeScript errors introduced
- ❌ No build failures

---

## STEP 5 — TEST PLAN

### Manual Test Steps

#### Happy Path
1. Navigate to `/signup`
2. Verify page loads without errors
3. Fill out form with valid email/password
4. Submit form
5. Verify toast appears on success/error (if applicable)
6. Verify no console errors

#### Edge Cases
1. **Empty form submission:**
   - Submit form with empty fields
   - Verify validation errors display (may use Alert component, not toast)
   - Verify no toast-related errors

2. **Invalid email format:**
   - Enter invalid email (e.g., "notanemail")
   - Submit form
   - Verify validation error displays
   - Verify no toast-related errors

3. **Short password:**
   - Enter password < 6 characters
   - Submit form
   - Verify validation error displays
   - Verify no toast-related errors

4. **API error:**
   - Submit form with valid data but trigger API error (e.g., duplicate email)
   - Verify toast notification appears with error message
   - Verify toast has correct styling (destructive variant)

5. **Unexpected error:**
   - Simulate unexpected error (if possible)
   - Verify toast notification appears
   - Verify no crash

#### Regression Checks
1. **Other pages using toast:**
   - Navigate to `/login` (if it uses toast)
   - Navigate to `/settings` (if it uses toast)
   - Verify toasts still work on those pages
   - Verify no console errors

2. **Provider tree:**
   - Verify `<Toaster />` is mounted in `app/providers.tsx`
   - Verify provider tree structure is correct
   - Verify no duplicate providers

### Automated Tests (If Applicable)

**Unit Tests:**
- Test `builder-signup-form.tsx` renders without errors
- Test toast hook can be called without provider error
- Test toast notifications display correctly

**Integration Tests:**
- Test signup flow end-to-end
- Test toast appears on error states
- Test toast appears on success states (if applicable)

**E2E Tests (Playwright):**
- Navigate to `/signup`
- Verify page loads
- Submit form with invalid data
- Verify toast/error messages appear
- Verify no console errors

### RED ZONE Regression Checks

**N/A** - This fix does not touch RED ZONE areas:
- ✅ No middleware changes
- ✅ No auth/callback changes
- ✅ No profile bootstrap changes
- ✅ No Stripe/webhook changes
- ✅ No RLS/trigger changes

**However, verify:**
- ✅ Signup still creates user correctly (auth flow unchanged)
- ✅ Profile creation still works (if applicable)
- ✅ Redirects after signup still work

---

## RECOMMENDATION

**Approach A (Standardize on Global State Pattern)** is recommended because:

1. **Minimal diff:** Only one import path change
2. **Low risk:** Single file modification
3. **Consistent with existing code:** Most components already use `@/components/ui/use-toast`
4. **Simpler architecture:** One toast implementation to maintain
5. **Follows shadcn/ui pattern:** Global state is standard for shadcn toast

**Implementation steps for Approach A:**
1. Change `components/auth/builder-signup-form.tsx` line 11:
   - From: `import { useToast } from "@/hooks/use-toast";`
   - To: `import { useToast } from "@/components/ui/use-toast";`
2. Verify no other files import from `@/hooks/use-toast`
3. Optionally delete or deprecate `hooks/use-toast.ts` to prevent future confusion
4. Test signup page loads and toasts work
5. Verify other pages still work

---

## STOP AND WAIT

**Which approach should I implement (A / B / C), and are there any constraints or adjustments before coding?**

---

**Document Status:** DESIGN ONLY - Awaiting approval  
**Created:** January 2025  
**Related Issues:** `/signup` page 500 error, ToastProvider missing
