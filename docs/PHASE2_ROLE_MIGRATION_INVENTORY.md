# Phase 2 Role Migration - Inventory Checklist

**Date:** January 2026  
**Status:** Step 0 Complete

---

## Step 0 — Inventory Complete

### RLS Policies (in `supabase/migrations/20251207150508_initial_event_portal_schema.sql`)

**Policies referencing roles:**
- ✅ Line 170: `role in ('admin', 'mentor')` - Events INSERT policy
- ✅ Line 182: `role = 'admin'` - Events UPDATE policy  
- ✅ Line 200: `role = 'admin'` - Tickets SELECT policy (admins)
- ✅ Line 221: `role = 'admin'` - Tickets UPDATE policy (admins)
- ✅ Line 238: `role = 'admin'` - XP transactions SELECT policy
- ✅ Line 249: `role = 'admin'` - XP transactions INSERT policy

**Default role value:**
- ✅ Line 13: `default 'builder'` - profiles.role column

**Total policies to update:** 6 policies + 1 default value

---

### Database Triggers/Functions

**None found** - No database triggers or functions reference roles.

---

### App Code

**1. middleware.ts**
- ✅ Line 6: `ProfileRow` type includes `"builder" | "user" | "client" | "mentor" | "admin"`
- ✅ Line 109: Transitional logic: `profile?.role === "builder" ? "user" : profile?.role`
- ✅ Line 101: Admin check: `profile?.role === "admin"`

**2. components/auth/auth-provider.tsx**
- ✅ Line 12: `UserRole` type includes all roles
- ✅ Line 159, 230, 321: Role assignment from profile
- ✅ Line 253: Admin check: `role === "admin"`

**3. lib/actions/auth-actions.ts**
- ✅ Line 12: Comment mentions `'builder'` default
- ✅ Line 47: Creates profile with `role: "builder"`
- ✅ Line 72-81: Safety check for null role (sets to 'builder')

**4. app/api/admin/create-user/route.ts**
- ✅ Line 6: Accepts `role` parameter
- ✅ Line 46: Inserts profile with provided `role`

**5. supabase/functions/create-user/index.ts**
- ⚠️ Line 77-100: Contains OLD TOTL code (talent/client profiles) - needs cleanup
- ✅ Line 29, 65: Accepts and uses `role` parameter

---

### Seed Scripts/Tests

**None found** - No seed scripts or test files found that reference roles.

---

## Impacted Files Summary

### Database (Migration File)
- `supabase/migrations/20251207150508_initial_event_portal_schema.sql` - 6 RLS policies + 1 default

### App Code (6 files)
1. `middleware.ts` - Role checks, transitional logic
2. `components/auth/auth-provider.tsx` - Role types, role state
3. `lib/actions/auth-actions.ts` - Profile creation with default role
4. `app/api/admin/create-user/route.ts` - Admin user creation
5. `supabase/functions/create-user/index.ts` - Edge function (has old TOTL code)
6. `app/event-pass/page.tsx` - (No role checks found, but may need updates)

---

## Client Permissions Definition (v1)

**Client Role = Event Organizer**

**Permissions:**
- ✅ Can create events (`events.created_by = auth.uid()`)
- ✅ Can update/read only their own events (`events.created_by = auth.uid()`)
- ✅ Can list tickets only for events they created (via `events.created_by`)
- ✅ Can check-in tickets only for events they created (via `events.created_by`)

**NOT included in v1:**
- ❌ Business dashboard
- ❌ Subscriptions/tiering
- ❌ QR code generation (future)
- ❌ Advanced analytics

---

## Mentor Role Decision

**Decision:** Migrate `mentor` → `client` (mentor = event organizer in this context)

**Rationale:** Mentors in Digital Builders were event organizers, so they map to `client` role in VIBE.

---

## Next Steps

✅ **Step 0 Complete** - Inventory documented  
⏭️ **Step 1 Next** - Expand role model safely in DB + RLS
