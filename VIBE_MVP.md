# 🌊 VIBE — MVP STATUS

**Virginia Isn't Boring Platform**

> **What is VIBE?**
>
> **VIBE v1: Event Discovery + Event Pass**
>
> v1 lets people:
>
> * create a VIBE account,
> * discover and RSVP to local events,
> * get checked in at the door,
> * and view a simple Event Pass tied to their activity.
>
> **If it's not in that sentence, it's not in v1.**

---

## 🎯 THE FOCUS: Event Discovery + Event Pass

**We are not building a "social network" or a super-app.**
We are building the **fastest, cleanest way to turn attention into attendance.**

VIBE exists to convert:

* short-form content views
* into real-world event participation
* with a lightweight account system that unlocks access

---

## 📜 The Core Rule (MVP Law)

> **"If you want to attend events featured on VIBE, you need a VIBE account."**

That's it.
No gamification required.
No community features required.
No complexity required.

This rule alone gives the MVP leverage.

---

## 🚀 CURRENT STATUS: MVP IN PROGRESS

**MVP DEFINITION — VIBE v1**

* ✅ MVP scope locked: Event Discovery + Event Pass
* ✅ Core entities defined
* ✅ Schema designed (users, events, tickets, activity)
* ✅ Auth system working (Supabase)
* ✅ Event list page implemented
* 🔄 Event detail, RSVP, and check-in flows pending
* 🔄 Event Pass UI pending

---

## 🧭 MVP ROADMAP

### Phase 1: Database Schema (Week 1)

* [ ] `profiles` — VIBE user profiles
* [ ] `events` — featured events
* [ ] `tickets` — RSVP & attendance records
* [ ] `activity_log` (formerly XP) — attendance & engagement history
* [ ] `event_pass_view` — unified Event Pass query
* [ ] RLS policies
* [ ] Generate TypeScript types

---

### Phase 2: Auth Shell (Week 1)

* `/`

  * Public marketing page
* If not logged in:

  * CTA → "Create an account to attend events"
* If logged in:

  * Redirect → `/events`
* Supabase email/password auth only

---

### Phase 3: Events Portal (Week 2)

* `/events`

  * List upcoming events
* `/events/[slug]`

  * Event details
  * RSVP / Cancel RSVP
* Admin-only:

  * Create / manage events

---

### Phase 4: Check-In System (Week 2)

* `/admin/check-in`
* Search attendees by name or email
* Filter by event
* Check-in action:

  * Update ticket status
  * Save timestamp
* Guarded by `role = 'admin'`

---

### Phase 5: Event Pass (Week 2)

* `/event-pass`
* Displays:

  * Name / handle
  * Location / region
  * Events attended
  * Last event checked in
* **No levels, no points, no gamification in v1**
  *(Those are future-compatible, not user-facing yet.)*

---

## 📊 MVP COMPLETION STATUS

| Category            | Status        | Completion |
| ------------------- | ------------- | ---------- |
| MVP Definition      | ✅ Complete    | 100%       |
| Schema Design       | ✅ Complete    | 100%       |
| Authentication      | ✅ Working     | 100%       |
| Events List         | ✅ In Progress | 25%        |
| Event Detail + RSVP | 🔄 Pending    | 0%         |
| Check-In System     | 🔄 Pending    | 0%         |
| Event Pass          | 🔄 Pending    | 0%         |
| End-to-End Testing  | 🔄 Pending    | 0%         |

---

## 🎯 IMMEDIATE NEXT STEPS

### Priority 1: Events

1. Finish `/events/[slug]`
2. RSVP → insert ticket
3. Cancel RSVP → delete ticket
4. Post-login redirect → `/events`

---

### Priority 2: Check-In

1. Build `/admin/check-in`
2. Search by email/name
3. Update:

   * `tickets.status = 'checked_in'`
   * `checked_in_at = now()`

---

### Priority 3: Event Pass

1. Create `/event-pass`
2. Query `event_pass_view`
3. Display:

   * User identity
   * Attendance history

---

## 🛠 TECH STACK (UNCHANGED)

* **Frontend:** Next.js 15 + App Router + TypeScript
* **Backend:** Supabase (Postgres, Auth, RLS)
* **UI:** TailwindCSS + shadcn/ui
* **Email:** Resend (optional)
* **Mobile:** Web-first (native later)

---

## 🧱 CORE ENTITIES (RENAMED, SAME POWER)

### profiles

* One per user
* Fields:

  * display_name
  * role (`user | client | admin`)
  * region
  * created_at

### events

* Featured events
* Fields:

  * slug
  * title
  * description
  * venue
  * city
  * start_at
  * end_at
  * capacity
  * status

### tickets

* RSVP + attendance
* Fields:

  * event_id
  * user_id
  * status (`rsvp | checked_in`)
  * checked_in_at

### activity_log (internal)

* Tracks attendance
* Not user-facing yet
* Future-compatible

---

## 🚨 IMPORTANT MVP CONSTRAINTS

**VIBE v1 explicitly does NOT include:**

* Social feeds
* Messaging
* Groups
* Reviews
* Creator profiles
* Gamification (XP, levels, badges)
* Wallets / crypto
* Native apps

If it's not **event → RSVP → check-in → pass**, it's not v1.

---

## 📚 DOCUMENTATION PLAN (NEXT)

We will create these **as we convert the repo**, not before:

* `README.md` — VIBE overview
* `VIBE_MVP.md` — this document (source of truth)
* `DATABASE_SCHEMA.md`
* `ADMIN_OPERATIONS.md`
* `DEPLOYMENT_NOTES.md`

---

## 🔑 STRATEGIC NOTE (Important)

You did something *very* right here:

* You didn't throw away working code
* You didn't overcorrect into "social app" thinking
* You're converting **identity**, not mechanics

That's how real platforms are born.

---

### Next step (recommended)

If you want, next we should:
**Rename + remap the database entities cleanly**
*(profiles/events/tickets → VIBE naming)*
before touching UI.

Just say:
**"Let's convert the schema next."**

I'll walk you through it safely, step by step.

---

*Last Updated: January 2026*  
*Status: MVP Definition Complete — Ready for Implementation*
