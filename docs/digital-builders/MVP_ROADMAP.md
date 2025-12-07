# Digital Builders - MVP Roadmap

**Status:** Ready for Implementation  
**Purpose:** Phased implementation checklist for Event Portal + Builder Card MVP

---

## 🎯 Overview

**Digital Builders World – v1: Event Portal + Builder Card**

v1 lets people:
- create an account,
- RSVP to Digital Builders events,
- get checked in at the door,
- and see a simple Builder Card with XP/badges.

**If it's not in that sentence, it's not in v1.**

---

## 📋 MVP Scope

### **What's Included:**
- ✅ Account creation (Supabase Auth)
- ✅ Event Portal (browse, RSVP, cancel)
- ✅ Check-in system (admin at door)
- ✅ Builder Card (name, XP, badges)
- ✅ XP tracking (admin-only grants)

### **What's NOT Included:**
- ❌ PVP systems
- ❌ Crypto/wallet integration
- ❌ Game systems (jobs, actions, timers)
- ❌ Character creation
- ❌ City/district system
- ❌ DB Cred economy

---

## 🏗️ Phase 1: Database Schema (Week 1)

**Goal:** Set up Event Portal database schema

### **Tasks:**
- [ ] Create migration: `supabase migration new initial_event_portal_schema`
- [ ] Create `profiles` table
  - [ ] Columns: id, username, display_name, role, bio, avatar_url, region, xp_total, level, created_at, updated_at
  - [ ] Foreign key to `auth.users(id)`
  - [ ] Updated_at trigger
- [ ] Create `events` table
  - [ ] Columns: id, slug, title, subtitle, description, venue_name, venue_address, city, start_at, end_at, capacity, is_public, status, price_cents, currency, created_by, created_at, updated_at
  - [ ] Updated_at trigger
- [ ] Create `tickets` table
  - [ ] Columns: id, event_id, user_id, status, checked_in_at, payment_provider, payment_reference, notes, created_at
  - [ ] Unique index on (event_id, user_id)
- [ ] Create `xp_transactions` table
  - [ ] Columns: id, user_id, source_type, source_id, amount, description, created_by, created_at
- [ ] Create `builder_cards` view
  - [ ] Query profiles + xp_transactions + tickets + events
- [ ] Set up RLS policies
  - [ ] profiles: public read, owner write, admin full
  - [ ] events: public read published, admin/creator write
  - [ ] tickets: user own, admin full
  - [ ] xp_transactions: user own, admin full
- [ ] Run migration: `supabase db push`
- [ ] Generate types: `npm run types:regen`

---

## 🔐 Phase 2: Auth Shell (Week 1)

**Goal:** Basic authentication and routing

### **Tasks:**
- [ ] Update `/` page
  - [ ] If not logged in: show "Sign in to enter Digital Builders World"
  - [ ] If logged in: redirect to `/events`
- [ ] Test Supabase Auth flow
  - [ ] Sign up works
  - [ ] Sign in works
  - [ ] Profile creation on signup (trigger or server action)

---

## 📅 Phase 3: Events Portal (Week 2)

**Goal:** Browse and RSVP to events

### **Tasks:**
- [ ] Create `/events` page
  - [ ] List upcoming events (status = 'published', is_public = true)
  - [ ] Display: title, date, venue, "RSVP" button
  - [ ] Filter by date (upcoming only)
- [ ] Create `/events/[id]` page
  - [ ] Event details (title, description, venue, date/time)
  - [ ] RSVP button (if not already RSVP'd)
  - [ ] Cancel RSVP button (if RSVP'd)
  - [ ] Show ticket status
- [ ] Create RSVP server action
  - [ ] Check if ticket already exists
  - [ ] Create ticket with status 'reserved'
  - [ ] Handle duplicate RSVP attempts
- [ ] Create cancel RSVP server action
  - [ ] Update ticket status to 'cancelled'
  - [ ] Allow cancellation before event starts
- [ ] Test RSVP flow end-to-end

---

## ✅ Phase 4: Check-In System (Week 2)

**Goal:** Admin check-in at events

### **Tasks:**
- [ ] Create `/admin/check-in` page
  - [ ] Guard by `role = 'admin'` (middleware or server component check)
  - [ ] Event selector dropdown
  - [ ] Search by email/name input
  - [ ] List tickets for selected event
- [ ] Create check-in server action
  - [ ] Update ticket status to 'checked_in'
  - [ ] Set checked_in_at timestamp
  - [ ] Handle already checked-in tickets
- [ ] Display check-in status
  - [ ] Show checked-in vs not checked-in
  - [ ] Show check-in timestamp
- [ ] Test admin check-in flow

---

## 🎴 Phase 5: Builder Card (Week 2)

**Goal:** Display Builder Card with XP and badges

### **Tasks:**
- [ ] Create `/builder-card` page
  - [ ] Query `builder_cards` view (or profiles + xp_transactions)
  - [ ] Display current user's Builder Card
- [ ] Builder Card display
  - [ ] Name/handle
  - [ ] Region
  - [ ] XP total (sum of xp_transactions)
  - [ ] Level (simple formula: floor(xp_total / 100) + 1)
  - [ ] Last event attended
  - [ ] Basic badges (fake/manual at first)
- [ ] Badge system (v1: manual/fake)
  - [ ] Hardcode badge list
  - [ ] Display badges based on XP thresholds
  - [ ] Example: "First Event" (1+ events), "Regular" (5+ events), "Veteran" (10+ events)
- [ ] Test Builder Card display

---

## 🧪 Phase 6: Testing & Polish (Week 3)

**Goal:** End-to-end testing and polish

### **Tasks:**
- [ ] Test complete user flow
  - [ ] Sign up → RSVP → Check-in → Builder Card
- [ ] Test admin flow
  - [ ] Create event → Check-in users → View attendance
- [ ] Test edge cases
  - [ ] Duplicate RSVP prevention
  - [ ] Cancel RSVP before event
  - [ ] Check-in already checked-in user
- [ ] UI/UX polish
  - [ ] Error messages
  - [ ] Loading states
  - [ ] Success feedback
- [ ] Documentation
  - [ ] Update README
  - [ ] Create user guide
  - [ ] Create admin guide

---

## 📊 Phase Summary

| Phase | Focus | Duration | Key Deliverables |
|-------|-------|----------|------------------|
| **1** | Database Schema | 1 week | profiles, events, tickets, xp_transactions tables + RLS |
| **2** | Auth Shell | 1 week | Login, signup, routing |
| **3** | Events Portal | 1 week | Browse events, RSVP, cancel |
| **4** | Check-In System | 1 week | Admin check-in page |
| **5** | Builder Card | 1 week | Builder Card display |
| **6** | Testing & Polish | 1 week | End-to-end testing, polish |

**Total MVP Timeline: 3-4 weeks**

---

## ✅ Definition of Done

**Phase 1:**
- [ ] Database schema created and migrated
- [ ] RLS policies set up
- [ ] TypeScript types generated

**Phase 2:**
- [ ] User can sign up/login
- [ ] Routing works (logged in → `/events`)

**Phase 3:**
- [ ] User can browse events
- [ ] User can RSVP to events
- [ ] User can cancel RSVP

**Phase 4:**
- [ ] Admin can check in users at events
- [ ] Check-in status tracked correctly

**Phase 5:**
- [ ] User can view Builder Card
- [ ] Builder Card shows XP and badges

**Phase 6:**
- [ ] End-to-end flow works
- [ ] All edge cases handled
- [ ] UI/UX polished

---

## 🚀 Next Steps After MVP

**v2+ Future Features:**
- Game systems (jobs, actions, timers)
- PVP-lite interactions
- City/district system
- Character creation
- DB Cred economy
- Solana integration (optional)

---

**Ready to start Phase 1? Let's build the Event Portal!** 🚀

*Last Updated: December 2025*
