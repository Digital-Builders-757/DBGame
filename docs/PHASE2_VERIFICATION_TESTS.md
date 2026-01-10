# Phase 2 Verification Tests

**Date:** January 2026  
**Status:** Pre-Migration Verification Plan

---

## 🎯 Goal

Verify that Phase 2 role migration works correctly before proceeding to Phase 3.

---

## 📋 Pre-Migration Checks

### **1. Verify Mentor → Client Mapping**

**Check:** Are there any existing `mentor` accounts?

```sql
-- Run this query BEFORE migration
SELECT COUNT(*) as mentor_count, role 
FROM profiles 
WHERE role = 'mentor' 
GROUP BY role;
```

**Decision Matrix:**
- **If `mentor_count = 0`:** ✅ Safe to migrate (no impact)
- **If `mentor_count > 0`:** 
  - **If mentors were event organizers:** ✅ Migrate to `client`
  - **If mentors were helpers/advisors:** ⚠️ Consider migrating to `admin` or keeping `mentor` temporarily

**Action:** Document decision in migration notes.

---

### **2. Verify Ownership Fields**

**Check:** Does `events.created_by` exist and is it populated?

```sql
-- Check if created_by column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' AND column_name = 'created_by';

-- Check if any events have NULL created_by
SELECT COUNT(*) as null_created_by_count 
FROM events 
WHERE created_by IS NULL;
```

**Action:** If `created_by` is NULL for existing events, decide:
- Option A: Set `created_by` to admin user (if admin created them)
- Option B: Leave NULL and update RLS to handle NULL (admins only)

---

## 🚀 Migration Execution

### **Step 1: Local Testing**

```bash
# 1. Start local Supabase (if using local)
supabase start

# 2. Apply migration
supabase db push

# 3. Verify migration applied
supabase db diff

# 4. Regenerate types
npm run types:regen

# 5. Build and type check
npm run build
npm run typecheck
```

**Expected Results:**
- ✅ Migration applies without errors
- ✅ Types regenerate successfully
- ✅ Build passes
- ✅ No TypeScript errors

---

### **Step 2: Create Test Accounts**

**Manual Creation (via Supabase Dashboard or SQL):**

```sql
-- Create test user account (role = user)
-- Use Supabase Auth UI or:
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('user_test@vibe.test', crypt('testpassword123', gen_salt('bf')), now())
RETURNING id;

-- Then create profile:
INSERT INTO profiles (id, display_name, role)
VALUES ('<user_id_from_above>', 'Test User', 'user');

-- Repeat for client_test@vibe.test (role = client)
-- Repeat for admin_test@vibe.test (role = admin)
```

**Or use admin API route:**
```bash
# POST /api/admin/create-user
{
  "email": "user_test@vibe.test",
  "password": "testpassword123",
  "firstName": "Test",
  "lastName": "User",
  "role": "user"
}
```

---

### **Step 3: Create Test Events**

**As Client Test Account:**

```sql
-- Login as client_test, then:
INSERT INTO events (
  slug, title, description, city, start_at, 
  is_public, status, created_by
)
VALUES (
  'test-event-a',
  'Test Event A',
  'Created by client_test',
  'Virginia',
  now() + interval '7 days',
  true,
  'published',
  '<client_test_user_id>'
);
```

**As Admin Test Account:**

```sql
-- Login as admin_test, then:
INSERT INTO events (
  slug, title, description, city, start_at,
  is_public, status, created_by
)
VALUES (
  'test-event-b',
  'Test Event B',
  'Created by admin_test',
  'Virginia',
  now() + interval '14 days',
  true,
  'published',
  '<admin_test_user_id>'
);
```

---

## 🧪 Test Execution

### **Test Suite A: User Role (`user_test@vibe.test`)**

**Setup:**
1. Login as `user_test@vibe.test`
2. Navigate to `/events`

**Test 1.1: View Events List**
- [ ] `/events` page loads
- [ ] Both Event A and Event B are visible
- [ ] Can click on Event A to view details

**Test 1.2: RSVP to Event**
- [ ] Navigate to `/events/test-event-a`
- [ ] Click "RSVP" button
- [ ] Ticket is created in database:
  ```sql
  SELECT * FROM tickets 
  WHERE user_id = '<user_test_id>' 
  AND event_id = '<event_a_id>';
  ```
- [ ] Should return 1 ticket

**Test 1.3: View Own Tickets**
- [ ] Navigate to profile/dashboard (if exists)
- [ ] Can see own ticket for Event A
- [ ] Cannot see tickets for other users

**Test 1.4: Cancel RSVP**
- [ ] Click "Cancel RSVP" on Event A
- [ ] Ticket is deleted or status updated
- [ ] Verify in database:
  ```sql
  SELECT * FROM tickets 
  WHERE user_id = '<user_test_id>' 
  AND event_id = '<event_a_id>';
  ```
- [ ] Should return 0 tickets (or status = 'cancelled')

**Test 1.5: View Event Pass**
- [ ] Navigate to `/event-pass`
- [ ] Page loads without errors
- [ ] Shows user identity
- [ ] Shows attendance history (if any)

**Test 1.6: Negative - Cannot Access Admin**
- [ ] Try to navigate to `/admin/users`
- [ ] Should be redirected to `/events` (or 403)
- [ ] Try to navigate to `/admin/check-in`
- [ ] Should be redirected to `/events` (or 403)

**Test 1.7: Negative - Cannot Create Event**
- [ ] If event creation UI exists, try to create event
- [ ] Should be denied (UI should hide button or show error)

**Test 1.8: Negative - Cannot Edit Event**
- [ ] Try to edit Event A via API or direct DB:
  ```sql
  -- As user_test, try:
  UPDATE events SET title = 'Hacked' WHERE id = '<event_a_id>';
  ```
- [ ] Should fail with RLS error (permission denied)

**Test 1.9: Negative - Cannot View Other Users' Tickets**
- [ ] Try to query tickets for Event A (not own):
  ```sql
  -- As user_test, try:
  SELECT * FROM tickets 
  WHERE event_id = '<event_a_id>' 
  AND user_id != '<user_test_id>';
  ```
- [ ] Should return empty (RLS blocks)

**Test 1.10: Negative - Cannot Check-In Tickets**
- [ ] Try to update any ticket status:
  ```sql
  -- As user_test, try:
  UPDATE tickets SET status = 'checked_in' WHERE id = '<any_ticket_id>';
  ```
- [ ] Should fail with RLS error (unless it's own ticket)

---

### **Test Suite B: Client Role (`client_test@vibe.test`)**

**Setup:**
1. Login as `client_test@vibe.test`
2. Navigate to `/events`

**Test 2.1: View Events List**
- [ ] `/events` page loads
- [ ] Both Event A and Event B are visible

**Test 2.2: Create Event**
- [ ] Navigate to event creation page (if exists)
- [ ] Create Event C:
  - Title: "Test Event C"
  - Slug: "test-event-c"
  - Set `created_by = client_test.id`
- [ ] Event is created successfully
- [ ] Verify in database:
  ```sql
  SELECT * FROM events WHERE created_by = '<client_test_id>';
  ```
- [ ] Should include Event A and Event C

**Test 2.3: Edit Own Event**
- [ ] Navigate to Event C edit page (if exists)
- [ ] Update title to "Test Event C Updated"
- [ ] Save changes
- [ ] Verify in database:
  ```sql
  SELECT title FROM events WHERE id = '<event_c_id>';
  ```
- [ ] Should return "Test Event C Updated"

**Test 2.4: View Tickets for Own Event**
- [ ] Navigate to Event C tickets page (if exists)
- [ ] Can see all tickets for Event C
- [ ] Verify via query:
  ```sql
  -- As client_test:
  SELECT * FROM tickets 
  WHERE event_id IN (
    SELECT id FROM events WHERE created_by = '<client_test_id>'
  );
  ```
- [ ] Should return tickets for Event A and Event C

**Test 2.5: Check-In Tickets for Own Event**
- [ ] Find a ticket for Event C (created by user_test)
- [ ] Update ticket status to 'checked_in':
  ```sql
  -- As client_test:
  UPDATE tickets 
  SET status = 'checked_in', checked_in_at = now()
  WHERE event_id = '<event_c_id>' AND id = '<ticket_id>';
  ```
- [ ] Should succeed
- [ ] Verify:
  ```sql
  SELECT status FROM tickets WHERE id = '<ticket_id>';
  ```
- [ ] Should return 'checked_in'

**Test 2.6: RSVP as Attendee**
- [ ] Navigate to `/events/test-event-b`
- [ ] Click "RSVP" (client can also attend events)
- [ ] Ticket is created with `user_id = client_test.id`

**Test 2.7: Negative - Cannot Edit Other Events**
- [ ] Try to edit Event B (created by admin_test):
  ```sql
  -- As client_test, try:
  UPDATE events SET title = 'Hacked' WHERE id = '<event_b_id>';
  ```
- [ ] Should fail with RLS error

**Test 2.8: Negative - Cannot View Tickets for Other Events**
- [ ] Try to query tickets for Event B:
  ```sql
  -- As client_test, try:
  SELECT * FROM tickets WHERE event_id = '<event_b_id>';
  ```
- [ ] Should return empty (RLS blocks, unless client_test RSVP'd)

**Test 2.9: Negative - Cannot Check-In Tickets for Other Events**
- [ ] Try to check-in a ticket for Event B:
  ```sql
  -- As client_test, try:
  UPDATE tickets 
  SET status = 'checked_in' 
  WHERE event_id = '<event_b_id>' AND id != '<client_test_ticket_id>';
  ```
- [ ] Should fail with RLS error

**Test 2.10: Negative - Cannot Access Admin Routes**
- [ ] Try to navigate to `/admin/users`
- [ ] Should be redirected to `/events` (or 403)

---

### **Test Suite C: Admin Role (`admin_test@vibe.test`)**

**Setup:**
1. Login as `admin_test@vibe.test`
2. Navigate to `/admin/dashboard`

**Test 3.1: Access Admin Routes**
- [ ] Can navigate to `/admin/users`
- [ ] Can navigate to `/admin/check-in`
- [ ] Can navigate to `/admin/dashboard`

**Test 3.2: View All Events**
- [ ] Navigate to `/events`
- [ ] Can see all events (Event A, B, C)
- [ ] Can view details for any event

**Test 3.3: Edit Any Event**
- [ ] Edit Event A (created by client_test):
  ```sql
  -- As admin_test:
  UPDATE events SET title = 'Admin Updated' WHERE id = '<event_a_id>';
  ```
- [ ] Should succeed
- [ ] Verify:
  ```sql
  SELECT title FROM events WHERE id = '<event_a_id>';
  ```
- [ ] Should return "Admin Updated"

**Test 3.4: View All Tickets**
- [ ] Navigate to admin check-in page
- [ ] Can see all tickets for all events
- [ ] Verify via query:
  ```sql
  -- As admin_test:
  SELECT COUNT(*) FROM tickets;
  ```
- [ ] Should return all tickets

**Test 3.5: Check-In Any Ticket**
- [ ] Find any ticket (for any event)
- [ ] Update status to 'checked_in':
  ```sql
  -- As admin_test:
  UPDATE tickets 
  SET status = 'checked_in', checked_in_at = now()
  WHERE id = '<any_ticket_id>';
  ```
- [ ] Should succeed

**Test 3.6: Create Event**
- [ ] Create Event D via admin UI or SQL
- [ ] Event is created successfully
- [ ] `created_by` is set to `admin_test.id`

**Test 3.7: View All Users**
- [ ] Navigate to `/admin/users`
- [ ] Can see all users (user_test, client_test, admin_test)
- [ ] Can filter by role

**Test 3.8: Modify User Roles (if feature exists)**
- [ ] Try to change user_test role to 'client'
- [ ] Should succeed (if admin UI supports this)
- [ ] Verify:
  ```sql
  SELECT role FROM profiles WHERE id = '<user_test_id>';
  ```
- [ ] Should return 'client'

---

## 🔍 RLS Query Verification

### **Run These Queries as Each Role**

**As User (`user_test`):**

```sql
-- Should return: own tickets only
SELECT COUNT(*) FROM tickets WHERE user_id = auth.uid();
-- Expected: 1 (if RSVP'd to Event A)

-- Should return: empty (no events created)
SELECT COUNT(*) FROM events WHERE created_by = auth.uid();
-- Expected: 0

-- Should return: empty (cannot see other users' tickets)
SELECT COUNT(*) FROM tickets 
WHERE event_id IN (
  SELECT id FROM events WHERE created_by != auth.uid()
) AND user_id != auth.uid();
-- Expected: 0
```

**As Client (`client_test`):**

```sql
-- Should return: own tickets + tickets for own events
SELECT COUNT(*) FROM tickets 
WHERE user_id = auth.uid() 
   OR event_id IN (SELECT id FROM events WHERE created_by = auth.uid());
-- Expected: >= 1 (own RSVP + tickets for Event A and C)

-- Should return: events created by this client
SELECT COUNT(*) FROM events WHERE created_by = auth.uid();
-- Expected: >= 1 (Event A and C)

-- Should return: empty (cannot see tickets for events they don't own)
SELECT COUNT(*) FROM tickets 
WHERE event_id IN (
  SELECT id FROM events WHERE created_by != auth.uid()
) AND user_id != auth.uid();
-- Expected: 0
```

**As Admin (`admin_test`):**

```sql
-- Should return: all tickets
SELECT COUNT(*) FROM tickets;
-- Expected: >= 1 (all tickets)

-- Should return: all events
SELECT COUNT(*) FROM events;
-- Expected: >= 3 (Event A, B, C, D)

-- Should return: all profiles
SELECT COUNT(*) FROM profiles;
-- Expected: >= 3 (all test users)
```

---

## ✅ Verification Checklist

### **Pre-Migration**
- [ ] Checked for existing `mentor` accounts
- [ ] Verified `events.created_by` field exists
- [ ] Documented mentor → client decision

### **Migration Execution**
- [ ] Migration applied locally (`supabase db push`)
- [ ] Types regenerated (`npm run types:regen`)
- [ ] Build passes (`npm run build`)
- [ ] Type check passes (`npm run typecheck`)

### **Test Account Setup**
- [ ] `user_test@vibe.test` created (role = user)
- [ ] `client_test@vibe.test` created (role = client)
- [ ] `admin_test@vibe.test` created (role = admin)

### **Test Event Setup**
- [ ] Event A created by client_test
- [ ] Event B created by admin_test

### **User Role Tests**
- [ ] Test 1.1: View events list ✅
- [ ] Test 1.2: RSVP to event ✅
- [ ] Test 1.3: View own tickets ✅
- [ ] Test 1.4: Cancel RSVP ✅
- [ ] Test 1.5: View event-pass ✅
- [ ] Test 1.6: Cannot access admin ✅
- [ ] Test 1.7: Cannot create event ✅
- [ ] Test 1.8: Cannot edit event ✅
- [ ] Test 1.9: Cannot view other tickets ✅
- [ ] Test 1.10: Cannot check-in tickets ✅

### **Client Role Tests**
- [ ] Test 2.1: View events list ✅
- [ ] Test 2.2: Create event ✅
- [ ] Test 2.3: Edit own event ✅
- [ ] Test 2.4: View tickets for own event ✅
- [ ] Test 2.5: Check-in tickets for own event ✅
- [ ] Test 2.6: RSVP as attendee ✅
- [ ] Test 2.7: Cannot edit other events ✅
- [ ] Test 2.8: Cannot view tickets for other events ✅
- [ ] Test 2.9: Cannot check-in tickets for other events ✅
- [ ] Test 2.10: Cannot access admin routes ✅

### **Admin Role Tests**
- [ ] Test 3.1: Access admin routes ✅
- [ ] Test 3.2: View all events ✅
- [ ] Test 3.3: Edit any event ✅
- [ ] Test 3.4: View all tickets ✅
- [ ] Test 3.5: Check-in any ticket ✅
- [ ] Test 3.6: Create event ✅
- [ ] Test 3.7: View all users ✅
- [ ] Test 3.8: Modify user roles ✅ (if feature exists)

### **RLS Query Verification**
- [ ] User role queries return expected results ✅
- [ ] Client role queries return expected results ✅
- [ ] Admin role queries return expected results ✅

### **Post-Migration Verification**
- [ ] Zero `'builder'` roles in database
- [ ] Zero `'mentor'` roles in database
- [ ] All existing users migrated successfully
- [ ] No broken RLS policies

---

## 🚨 If Tests Fail

### **Common Issues & Fixes**

**Issue 1: RLS Policy Not Enforcing**
- **Symptom:** User can see tickets they shouldn't
- **Fix:** Check policy USING clause, verify `auth.uid()` is correct

**Issue 2: Client Cannot Edit Own Event**
- **Symptom:** Client gets permission denied when editing
- **Fix:** Verify `events.created_by` is set correctly, check UPDATE policy

**Issue 3: Migration Fails**
- **Symptom:** `supabase db push` errors
- **Fix:** Check for existing policies with same name, use `DROP POLICY IF EXISTS`

**Issue 4: Types Don't Match**
- **Symptom:** TypeScript errors after migration
- **Fix:** Regenerate types: `npm run types:regen`, check `types/database.ts`

---

*Last Updated: January 2026*  
*Status: Ready for Execution*
