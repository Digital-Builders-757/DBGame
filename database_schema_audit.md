# VIBE Database Schema Audit

**Audit Date:** January 2026  
**Database:** Supabase PostgreSQL  
**Schema:** public  
**Status:** Migration in Progress (Phase 3 - XP Removal)

---

## 🎯 Overview

This document is the **single source of truth** for the VIBE database schema.

**⚠️ IMPORTANT:** This file must be updated **before** creating any database migrations. Never alter the database without first updating this audit file.

---

## 📋 MVP: Event Discovery + Event Pass

**v1 MVP Scope:**
- Event Portal: RSVP to events, check-in at door
- Event Pass: Display name, attendance history, last event attended
- No XP, no levels, no badges in v1

**Core Entities:**
- `profiles` - VIBE user profiles (one per auth user)
- `events` - Featured events
- `tickets` - RSVP/attendance records
- `event_pass_view` - View for Event Pass display

---

## 🔒 Custom Types (Enums)

```sql
-- No custom enums needed for MVP v1
-- Using text fields with default values for simplicity
```

---

## 📊 Table Details

### **profiles**

Each auth user gets a Builder profile.

**Columns:**
- `id` (uuid, PK) - References `auth.users(id)` on delete cascade
- `username` (text, unique) - Builder handle
- `display_name` (text) - Display name
- `role` (text, not null, default 'user') - 'user' | 'client' | 'admin' (migrated from 'builder' | 'mentor' | 'admin')
- `bio` (text) - Optional bio
- `avatar_url` (text) - Profile picture URL
- `region` (text) - "Hampton Roads", "Atlanta", etc.
- ~~`xp_total` (integer, not null, default 0) - Total XP earned~~ **REMOVED in Phase 3**
- ~~`level` (integer, not null, default 1) - Builder level~~ **REMOVED in Phase 3**
- `created_at` (timestamptz, not null, default now())
- `updated_at` (timestamptz, not null, default now())

**RLS Policies:**
- Everyone can `select` any profile (public directory)
- Users can `update` only where `id = auth.uid()`
- Admins can `update` any profile (role management, etc.)
- Admins can `insert`/`delete` any profile (via service role)

---

### **events**

Events people can attend.

**Columns:**
- `id` (uuid, PK, default gen_random_uuid())
- `slug` (text, unique) - URL-friendly identifier
- `title` (text, not null) - Event title
- `subtitle` (text) - Optional subtitle
- `description` (text) - Event description
- `venue_name` (text) - Venue name
- `venue_address` (text) - Venue address
- `city` (text) - City name
- `start_at` (timestamptz, not null) - Event start time
- `end_at` (timestamptz) - Event end time
- `capacity` (integer) - Max attendees
- `is_public` (boolean, not null, default true) - Public visibility
- `status` (text, not null, default 'draft') - 'draft' | 'published' | 'archived'
- `price_cents` (integer, not null, default 0) - Price in cents (0 = free)
- `currency` (char(3), not null, default 'USD') - Currency code
- `created_by` (uuid) - References `profiles(id)` on delete set null
- `created_at` (timestamptz, not null, default now())
- `updated_at` (timestamptz, not null, default now())

**RLS Policies:**
- Everyone can `select` where `is_public = true` and `status = 'published'`
- Admins can `insert`/`update`/`delete` any event
- Event creators can `update` their own events

---

### **tickets**

RSVP / attendance records.

**Columns:**
- `id` (uuid, PK, default gen_random_uuid())
- `event_id` (uuid, not null) - References `events(id)` on delete cascade
- `user_id` (uuid, not null) - References `auth.users(id)` on delete cascade
- `status` (text, not null, default 'reserved') - 'reserved' | 'confirmed' | 'checked_in' | 'cancelled' | 'refunded'
- `checked_in_at` (timestamptz) - Check-in timestamp
- `payment_provider` (text) - 'stripe' | 'cash' | 'free'
- `payment_reference` (text) - Payment reference (stripe session id, etc.)
- `notes` (text) - Admin notes
- `created_at` (timestamptz, not null, default now())

**Indexes:**
- Unique index on `(event_id, user_id)` to prevent duplicate tickets

**RLS Policies:**
- Users can `select`/`insert` where `user_id = auth.uid()`
- Users can `update` their own tickets (status changes, cancellation)
- Admins can `select`/`update`/`delete` any ticket
- Event creators can `select` tickets for their events

---

### ~~**xp_transactions**~~ **REMOVED in Phase 3**

~~XP earning log.~~ **Table dropped - VIBE v1 has no XP system.**

~~**Columns:**~~
~~- `id` (uuid, PK, default gen_random_uuid())~~
~~- `user_id` (uuid, not null) - References `auth.users(id)` on delete cascade~~
~~- `source_type` (text, not null) - 'event_attendance' | 'speaking' | 'volunteering' | 'referral' | 'manual'~~
~~- `source_id` (uuid) - Optional: event id, ticket id, etc.~~
~~- `amount` (integer, not null) - XP amount (can be negative for corrections)~~
~~- `description` (text) - Transaction description~~
~~- `created_by` (uuid) - References `profiles(id)` - Admin who created this~~
~~- `created_at` (timestamptz, not null, default now())~~

~~**RLS Policies:**~~
~~- Users can `select` their own transactions~~
~~- Admins can `insert`/`select`/`update` any transaction~~
~~- No user-initiated XP transactions in v1 (admin-only)~~

---

## 🔄 Views

### **event_pass_view**

Clean query view for Event Pass display (replaces builder_cards).

**Columns:**
- `profile_id` (uuid)
- `username` (text)
- `display_name` (text)
- `avatar_url` (text)
- `region` (text)
- `events_attended_count` (bigint) - Count of distinct events with checked_in status
- `last_event_at` (timestamptz) - Last checked-in event start time

**Query:**
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

### ~~**builder_cards**~~ **REPLACED in Phase 3**

~~Clean query view for Builder Card display.~~ **Replaced with event_pass_view. Temporary compatibility view exists until Phase 4.**

~~**Columns:**~~
~~- `profile_id` (uuid)~~
~~- `username` (text)~~
~~- `display_name` (text)~~
~~- `avatar_url` (text)~~
~~- `region` (text)~~
~~- `xp_total` (integer) - Sum of xp_transactions~~
~~- `level` (integer)~~
~~- `last_event_at` (timestamptz) - Last checked-in event~~

**Note:** `builder_cards` view temporarily exists with non-XP fields for compatibility. Will be fully dropped in Phase 4.

---

## 🔐 Row-Level Security (RLS)

**All tables have RLS enabled** with appropriate policies:

- **profiles**: Public read, owner write, admin update any profile
- **events**: Public read for published events, admin/creator write
- **tickets**: User can see/update own tickets, admin full access
- ~~**xp_transactions**: User can see own transactions, admin full access~~ **REMOVED in Phase 3**

---

## 📝 Migration History

Migrations will be tracked here as they are created.

**Next Migration:** `YYYYMMDDHHMMSS_initial_event_portal_schema.sql`

---

## 🚀 Next Steps

1. Create initial migration: `supabase migration new initial_event_portal_schema`
2. Define schema in migration file (copy from this audit)
3. Run migration: `supabase db push`
4. Generate types: `npm run types:regen`
5. Update this audit file with any changes

---

## 📋 Schema Creation SQL

See migration file for complete SQL. Key components:

1. **profiles table** with updated_at trigger
2. **events table** with updated_at trigger
3. **tickets table** with unique constraint
4. **xp_transactions table**
5. **builder_cards view**
6. **RLS policies** for all tables

---

**This file will be updated as the schema evolves.**

*Last Updated: December 2025*
