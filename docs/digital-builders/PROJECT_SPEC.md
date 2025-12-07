# Digital Builders World – v1: Event Portal + Builder Card

**Project Name:** Digital Builders World  
**Version:** v1 – Event Portal + Builder Card  
**Status:** Ready for Implementation

---

## 🎯 High-Level Concept

**Digital Builders World – v1: Event Portal + Builder Card**

v1 lets people:
- create an account,
- RSVP to Digital Builders events,
- get checked in at the door,
- and see a simple Builder Card with XP/badges.

**If it's not in that sentence, it's not in v1.**

### **The Law: Social Rule of the House**

> "If you want to attend Digital Builders events, pitch, or get funds… you must make a Builder account."

That one rule makes this MVP powerful even before you add any fancy game systems.

---

## 🌍 What This Is

**We're not building "a cool future game" anymore — we're building the thing you actually need this month to run your world.**

This is the entry point to Digital Builders. If you want to touch Digital Builders, you go through this door.

---

## 👤 Core User Flow

### 1. Account Creation

- User signs up with email/password (Supabase Auth)
- Profile created automatically (or via trigger)
- User redirected to `/events`

### 2. Browse Events

- User sees list of upcoming events
- Each event shows: title, date, venue, "RSVP" button
- User clicks event to see details

### 3. RSVP to Event

- User clicks "RSVP" button
- Ticket created with status 'reserved'
- User can cancel RSVP before event

### 4. Check-In at Event

- Admin opens `/admin/check-in` page
- Admin selects event
- Admin searches by email/name
- Admin clicks "Check In" button
- Ticket status updated to 'checked_in'
- `checked_in_at` timestamp set

### 5. View Builder Card

- User visits `/builder-card`
- Sees: name, XP total, level, badges, last event
- XP comes from admin grants (event attendance, speaking, etc.)

---

## 📊 Core Entities

### **profiles**

Each auth user gets a Builder profile.

**Fields:**
- `id` (uuid, PK) - References `auth.users(id)`
- `username` (text, unique) - Builder handle
- `display_name` (text) - Display name
- `role` (text) - 'builder' | 'mentor' | 'admin'
- `bio` (text) - Optional bio
- `avatar_url` (text) - Profile picture
- `region` (text) - "Hampton Roads", "Atlanta", etc.
- `xp_total` (integer) - Total XP (default 0)
- `level` (integer) - Builder level (default 1)
- `created_at`, `updated_at` (timestamptz)

### **events**

Events people can attend.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique) - URL-friendly identifier
- `title` (text) - Event title
- `subtitle` (text) - Optional subtitle
- `description` (text) - Event description
- `venue_name` (text) - Venue name
- `venue_address` (text) - Venue address
- `city` (text) - City name
- `start_at` (timestamptz) - Event start time
- `end_at` (timestamptz) - Event end time
- `capacity` (integer) - Max attendees
- `is_public` (boolean) - Public visibility
- `status` (text) - 'draft' | 'published' | 'archived'
- `price_cents` (integer) - Price in cents (0 = free)
- `currency` (char(3)) - Currency code (default 'USD')
- `created_by` (uuid) - References `profiles(id)`
- `created_at`, `updated_at` (timestamptz)

**MVP Behavior:**
- All events are free (price_cents = 0) for now
- Can display "$X" on UI and manually collect via Eventbrite/Posh/CashApp
- Stripe integration comes later

### **tickets**

RSVP / attendance records.

**Fields:**
- `id` (uuid, PK)
- `event_id` (uuid) - References `events(id)`
- `user_id` (uuid) - References `auth.users(id)`
- `status` (text) - 'reserved' | 'confirmed' | 'checked_in' | 'cancelled' | 'refunded'
- `checked_in_at` (timestamptz) - Check-in timestamp
- `payment_provider` (text) - 'stripe' | 'cash' | 'free'
- `payment_reference` (text) - Payment reference
- `notes` (text) - Admin notes
- `created_at` (timestamptz)

**Unique Constraint:**
- One ticket per event/user (prevent duplicate RSVPs)

**MVP Check-In Flow:**
- Admin opens `/admin/check-in`
- Searches by email/name
- Clicks "Check In"
- Sets `status = 'checked_in'` and `checked_in_at = now()`
- QR codes come later (encode `ticket.id`)

### **xp_transactions**

XP earning log.

**Fields:**
- `id` (uuid, PK)
- `user_id` (uuid) - References `auth.users(id)`
- `source_type` (text) - 'event_attendance' | 'speaking' | 'volunteering' | 'referral' | 'manual'
- `source_id` (uuid) - Optional: event id, ticket id, etc.
- `amount` (integer) - XP amount (can be negative)
- `description` (text) - Transaction description
- `created_by` (uuid) - References `profiles(id)` (admin)
- `created_at` (timestamptz)

**MVP Behavior:**
- Admin-only XP grants in v1
- Don't auto-update `profiles.xp_total` (sum in query)
- Later: trigger to keep `xp_total` in sync

---

## 🎴 Builder Card

Simple display of Builder info.

**Shows:**
- Name/handle
- XP total (sum of xp_transactions)
- Level (simple formula: floor(xp_total / 100) + 1)
- Region
- Last event attended
- Basic badges (fake/manual at first)

**Badges (v1: manual/fake):**
- "First Event" - Attended 1+ events
- "Regular" - Attended 5+ events
- "Veteran" - Attended 10+ events
- More badges added manually by admin

---

## 🏗️ Architecture & Stack

- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind, shadcn/ui
- **Backend:** Supabase (Postgres + Auth + Realtime)
- **Hosting:** Vercel
- **AI & Dev:** Cursor IDE with `.cursorrules`

---

## 📋 MVP Scope

### **Included:**
- ✅ Email/password auth (Supabase)
- ✅ Event Portal (browse, RSVP, cancel)
- ✅ Check-in system (admin at door)
- ✅ Builder Card (XP, badges)
- ✅ XP tracking (admin-only grants)

### **Not Included (v2+):**
- ❌ PVP systems
- ❌ Crypto/wallet integration
- ❌ Game systems (jobs, actions, timers)
- ❌ Character creation
- ❌ City/district system
- ❌ DB Cred economy
- ❌ Solana integration

---

## 🚀 Implementation Plan

### **Phase 1: Database Schema**
- Create tables: profiles, events, tickets, xp_transactions
- Create view: builder_cards
- Set up RLS policies

### **Phase 2: Auth Shell**
- Update `/` page (auth prompt or redirect)
- Test Supabase Auth flow

### **Phase 3: Events Portal**
- `/events` - List events
- `/events/[id]` - Event details + RSVP
- RSVP server actions

### **Phase 4: Check-In System**
- `/admin/check-in` - Admin check-in page
- Check-in server action

### **Phase 5: Builder Card**
- `/builder-card` - Builder Card page
- Display XP, badges, last event

### **Phase 6: Testing & Polish**
- End-to-end testing
- UI/UX polish
- Documentation

---

## 📝 Frontend Map

**Routes:**
- `/` - Auth prompt or redirect to `/events`
- `/events` - List upcoming events
- `/events/[id]` - Event details + RSVP
- `/admin/check-in` - Admin check-in (guarded)
- `/builder-card` - Builder Card display

**Server Actions:**
- `rsvpToEvent(eventId)` - Create ticket
- `cancelRSVP(ticketId)` - Cancel ticket
- `checkInUser(ticketId)` - Check in user (admin)
- `grantXP(userId, amount, description)` - Grant XP (admin)

---

## 🔒 Security

**RLS Policies:**
- `profiles`: Everyone can read, owner can update
- `events`: Everyone can read published, admin/creator can write
- `tickets`: User can see/update own, admin can see all
- `xp_transactions`: User can see own, admin can create/read all

**Admin Guards:**
- `/admin/check-in` - Check `role = 'admin'` in middleware or server component
- XP grants - Admin-only server actions

---

## 🎯 Success Criteria

**v1 MVP is done when:**
- ✅ User can sign up and log in
- ✅ User can browse events
- ✅ User can RSVP to events
- ✅ Admin can check in users at events
- ✅ User can view Builder Card with XP and badges
- ✅ All flows work end-to-end

---

**Ready to build? Start with Phase 1: Database Schema!** 🚀

*Last Updated: December 2025*
