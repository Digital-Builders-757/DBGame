# VIBE Role Truth Table

**Date:** January 2026  
**Status:** Phase 2 Complete — Role System Migrated

---

## 🎯 Role Definitions

| Role | Description | Use Case |
|------|-------------|----------|
| **user** | Event attendee | Regular users who RSVP and attend events |
| **client** | Event organizer | Businesses/organizations that create and manage events |
| **admin** | Internal team | Full system access, can manage users/clients/events |

---

## 📋 Permission Matrix

### **User Role (`user`)**

| Action | Allowed | Notes |
|--------|---------|-------|
| View events list (`/events`) | ✅ Yes | Public events visible to all |
| View event details (`/events/[slug]`) | ✅ Yes | Public events visible to all |
| RSVP to event | ✅ Yes | Creates ticket with `user_id = auth.uid()` |
| Cancel RSVP | ✅ Yes | Can update own tickets |
| View own tickets | ✅ Yes | Can see tickets where `user_id = auth.uid()` |
| View own event-pass (`/event-pass`) | ✅ Yes | Can view own profile and attendance |
| Create events | ❌ No | Only clients and admins |
| Edit events | ❌ No | Only event creator (client) or admin |
| View tickets for events | ❌ No | Only own tickets, or tickets for events they created (if client) |
| Check-in tickets | ❌ No | Only admins and event creators (clients) |
| Access `/admin/*` routes | ❌ No | Admin only |
| Update own profile | ✅ Yes | Can update own profile |

---

### **Client Role (`client`)**

| Action | Allowed | Notes |
|--------|---------|-------|
| View events list (`/events`) | ✅ Yes | Public events visible to all |
| View event details (`/events/[slug]`) | ✅ Yes | Public events visible to all |
| RSVP to event | ✅ Yes | Clients can also attend events |
| Cancel RSVP | ✅ Yes | Can update own tickets |
| View own tickets | ✅ Yes | Can see tickets where `user_id = auth.uid()` |
| View own event-pass (`/event-pass`) | ✅ Yes | Can view own profile and attendance |
| **Create events** | ✅ **Yes** | **Can insert events** |
| **Edit own events** | ✅ **Yes** | **Can update events where `created_by = auth.uid()`** |
| Edit events they don't own | ❌ No | Only admins can edit any event |
| **View tickets for own events** | ✅ **Yes** | **Can see tickets for events where `created_by = auth.uid()`** |
| View tickets for other events | ❌ No | Only own events |
| **Check-in tickets for own events** | ✅ **Yes** | **Can update tickets for events where `created_by = auth.uid()`** |
| Check-in tickets for other events | ❌ No | Only own events |
| Access `/admin/*` routes | ❌ No | Admin only (except ticket scanner for own events) |
| Update own profile | ✅ Yes | Can update own profile |

---

### **Admin Role (`admin`)**

| Action | Allowed | Notes |
|--------|---------|-------|
| View events list (`/events`) | ✅ Yes | Public events visible to all |
| View event details (`/events/[slug]`) | ✅ Yes | Public events visible to all |
| RSVP to event | ✅ Yes | Admins can also attend events |
| Cancel RSVP | ✅ Yes | Can update own tickets |
| View own tickets | ✅ Yes | Can see tickets where `user_id = auth.uid()` |
| View own event-pass (`/event-pass`) | ✅ Yes | Can view own profile and attendance |
| Create events | ✅ Yes | Full access |
| Edit any event | ✅ Yes | Full access |
| View all tickets | ✅ Yes | Can see all tickets |
| Check-in any ticket | ✅ Yes | Can update any ticket |
| Access `/admin/*` routes | ✅ Yes | Full admin access |
| Update any profile | ✅ Yes | Can update any profile (via admin UI) |
| Ban/suspend users | ✅ Yes | If feature exists |
| Modify roles | ✅ Yes | If feature exists |

---

## 🔒 RLS Policy Summary

### **Profiles Table**

| Policy | User | Client | Admin |
|--------|------|--------|-------|
| SELECT (view profiles) | ✅ All | ✅ All | ✅ All |
| UPDATE own profile | ✅ Yes | ✅ Yes | ✅ Yes |
| INSERT own profile | ✅ Yes | ✅ Yes | ✅ Yes |
| UPDATE any profile | ❌ No | ❌ No | ✅ Yes (via admin) |

### **Events Table**

| Policy | User | Client | Admin |
|--------|------|--------|-------|
| SELECT (published events) | ✅ Yes | ✅ Yes | ✅ Yes |
| INSERT events | ❌ No | ✅ Own | ✅ Any |
| UPDATE events | ❌ No | ✅ Own | ✅ Any |
| DELETE events | ❌ No | ❌ No | ✅ Yes (if policy exists) |

**Ownership:** `events.created_by = auth.uid()`

### **Tickets Table**

| Policy | User | Client | Admin |
|--------|------|--------|-------|
| SELECT own tickets | ✅ Yes | ✅ Yes | ✅ Yes |
| SELECT tickets for own events | ❌ No | ✅ Yes | ✅ Yes |
| SELECT all tickets | ❌ No | ❌ No | ✅ Yes |
| INSERT (RSVP) | ✅ Yes | ✅ Yes | ✅ Yes |
| UPDATE own tickets | ✅ Yes | ✅ Yes | ✅ Yes |
| UPDATE tickets for own events | ❌ No | ✅ Yes | ✅ Yes |
| UPDATE any ticket | ❌ No | ❌ No | ✅ Yes |

**Ownership:** 
- User tickets: `tickets.user_id = auth.uid()`
- Event tickets: `events.created_by = auth.uid()` (for clients)

---

## 🧪 Verification Test Matrix

### **Test Account Setup**

Create 3 test accounts:
- `user_test@vibe.test` (role = `user`)
- `client_test@vibe.test` (role = `client`)
- `admin_test@vibe.test` (role = `admin`)

### **Test Event Setup**

Create 2 test events:
- Event A: Created by `client_test` (`created_by = client_test.id`)
- Event B: Created by `admin_test` (`created_by = admin_test.id`)

---

### **User Role Tests**

**Positive Tests:**
- [ ] Can view `/events` list
- [ ] Can view `/events/[slug]` for Event A
- [ ] Can RSVP to Event A (creates ticket)
- [ ] Can view own ticket for Event A
- [ ] Can cancel RSVP (delete ticket)
- [ ] Can view `/event-pass`

**Negative Tests:**
- [ ] Cannot access `/admin/users` (redirected)
- [ ] Cannot access `/admin/check-in` (redirected)
- [ ] Cannot create event (if UI exists, should deny)
- [ ] Cannot edit Event A (should fail RLS)
- [ ] Cannot view tickets for Event A (except own)
- [ ] Cannot check-in any ticket

---

### **Client Role Tests**

**Positive Tests:**
- [ ] Can view `/events` list
- [ ] Can view `/events/[slug]` for Event A
- [ ] Can RSVP to Event B (as attendee)
- [ ] Can create Event C (`created_by = client_test.id`)
- [ ] Can edit Event C (own event)
- [ ] Can view tickets for Event C (own event)
- [ ] Can check-in tickets for Event C (own event)
- [ ] Can view `/event-pass`

**Negative Tests:**
- [ ] Cannot edit Event B (not owner)
- [ ] Cannot view tickets for Event B (not owner)
- [ ] Cannot check-in tickets for Event B (not owner)
- [ ] Cannot access `/admin/users` (redirected)
- [ ] Cannot access `/admin/check-in` (redirected, unless it's for own events)

---

### **Admin Role Tests**

**Positive Tests:**
- [ ] Can view `/events` list
- [ ] Can view `/events/[slug]` for any event
- [ ] Can create Event D
- [ ] Can edit Event A (any event)
- [ ] Can edit Event B (any event)
- [ ] Can view all tickets (any event)
- [ ] Can check-in any ticket
- [ ] Can access `/admin/users`
- [ ] Can access `/admin/check-in`
- [ ] Can view `/event-pass`

**Negative Tests:**
- [ ] (None - admin has full access)

---

## 🔍 RLS Query Verification

### **Test Queries (Run as each role)**

**As User:**
```sql
-- Should return: own tickets only
SELECT * FROM tickets WHERE user_id = auth.uid();

-- Should return: empty (no events created)
SELECT * FROM events WHERE created_by = auth.uid();

-- Should return: empty (cannot see other users' tickets)
SELECT * FROM tickets WHERE event_id IN (
  SELECT id FROM events WHERE created_by != auth.uid()
);
```

**As Client:**
```sql
-- Should return: own tickets + tickets for own events
SELECT * FROM tickets 
WHERE user_id = auth.uid() 
   OR event_id IN (SELECT id FROM events WHERE created_by = auth.uid());

-- Should return: events created by this client
SELECT * FROM events WHERE created_by = auth.uid();

-- Should return: empty (cannot see tickets for events they don't own)
SELECT * FROM tickets WHERE event_id IN (
  SELECT id FROM events WHERE created_by != auth.uid()
) AND user_id != auth.uid();
```

**As Admin:**
```sql
-- Should return: all tickets
SELECT * FROM tickets;

-- Should return: all events
SELECT * FROM events;

-- Should return: all profiles
SELECT * FROM profiles;
```

---

## 📝 Ownership Field Verification

### **Events Ownership**

**Field:** `events.created_by` (uuid, references `profiles.id`)

**Verification:**
- [ ] Event creation code always sets `created_by = auth.uid()`
- [ ] RLS policies use `created_by` for client permissions
- [ ] No events exist with `created_by = NULL` (unless intentional)

**Code Check:**
```typescript
// Event creation should always include:
{
  ...eventData,
  created_by: user.id  // or auth.uid()
}
```

---

## 🚨 Edge Cases to Test

1. **Client creates event, then role changes to user:**
   - Event should remain accessible to original creator?
   - Or should access be revoked?
   - **Decision:** Keep access (historical ownership)

2. **User RSVPs, then role changes to client:**
   - Ticket should remain accessible
   - User can now create events, but ticket remains tied to user_id

3. **Event created_by is NULL:**
   - Should clients be able to edit?
   - **Decision:** Only admins can edit NULL-owned events

4. **Multiple clients for same event:**
   - Not possible (single `created_by` field)
   - If needed, use junction table in future

---

## ✅ Phase 2 Verification Checklist

- [ ] Migration applied successfully (`supabase db push`)
- [ ] Types regenerated (`npm run types:regen`)
- [ ] Build passes (`npm run build`)
- [ ] Type check passes (`npm run typecheck`)
- [ ] All 3 test accounts created
- [ ] Test events created
- [ ] User role tests pass (positive + negative)
- [ ] Client role tests pass (positive + negative)
- [ ] Admin role tests pass
- [ ] RLS query verification passes
- [ ] Ownership field verification passes
- [ ] Edge cases tested
- [ ] Zero `'builder'` roles in database (verify)
- [ ] Zero `'mentor'` roles in database (verify)

---

*Last Updated: January 2026*  
*Status: Phase 2 Complete — Ready for Phase 3*
