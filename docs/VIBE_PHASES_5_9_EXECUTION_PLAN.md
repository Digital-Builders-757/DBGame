# ViBE Phases 5-9 Execution Plan

**Date:** January 2026  
**Status:** Planning Phase  
**Product:** ViBE (Virginia Isn't Boring Experiences)

---

## 🎯 Product Direction

**ViBE IS:**
- A clean events discovery + attendance platform
- Focused on *what's happening in Virginia*
- Optimized for:
  - Discovering events
  - Attending events
  - Organizers posting events
  - Clear user value immediately

**ViBE IS NOT:**
- A social network
- Gamified (no XP, points, badges)
- A builder community
- Over-engineered

---

## ✅ Completed Phases (DO NOT REDO)

### Phase 1-2: Role System Migration ✅
- Roles: `user` (attendee), `client` (event organizer), `admin`
- RLS policies updated and verified
- Data migration complete

### Phase 3: XP System Removal ✅
- `xp_transactions` table dropped
- `xp_total` / `level` removed from profiles
- `builder_cards` view removed

### Phase 4: Event Pass Implementation ✅
- `event_pass_view` is the canonical view
- `/event-pass` page wired and working
- Attendance tracking functional

### Brand Migration ✅
- ViBE brand identity applied
- Colors, typography, naming updated
- Build passes, types regenerated

---

## 🔜 Next Phases: 5-9 Execution Plan

---

## Phase 5: Product Polish & Identity

### Goal
Final brand copy cleanup and consistent naming across the entire platform. Ensure UX language matches an events-first platform (not a builder community).

### Scope

**INCLUDED:**
- ✅ Replace all remaining "Digital Builders" references with "ViBE"
- ✅ Standardize capitalization: "ViBE" (not "VIBE" or "Vibe")
- ✅ Update all user-facing copy to events-first language
- ✅ Remove builder/community language from:
  - Error messages
  - Success messages
  - Form labels
  - Button text
  - Page titles/descriptions
- ✅ Update email templates (if any)
- ✅ Update metadata (SEO titles, descriptions)
- ✅ Update documentation files
- ✅ Verify brand consistency in:
  - Components
  - API responses
  - Console logs (user-facing only)

**EXCLUDED:**
- ❌ Database schema changes
- ❌ Feature additions
- ❌ UI redesigns (only copy changes)

### Key Files Likely to Change

```
app/
├── **/*.tsx                    # All pages
components/
├── **/*.tsx                    # All components
lib/
├── actions/*.ts                # Server actions (error messages)
├── constants/*.ts               # Constants with brand names
docs/
├── *.md                        # All documentation
�upabase/
├── migrations/                 # Migration comments (if any)
```

**Specific Files to Audit:**
- `components/navbar.tsx`
- `components/auth/*.tsx`
- `app/dashboard/*.tsx`
- `app/admin/*.tsx`
- `lib/constants/*.ts`
- `lib/actions/*.ts`
- All error messages and toast notifications

### Risks to Avoid

1. **Breaking Changes**
   - ⚠️ Don't change API contracts or database column names
   - ⚠️ Don't change route paths (only copy/text)
   - ⚠️ Don't change component props/types

2. **Over-Scoping**
   - ⚠️ Don't add new features "while we're here"
   - ⚠️ Don't redesign UI (only text updates)
   - ⚠️ Don't refactor code structure

3. **Inconsistency**
   - ⚠️ Use grep/search to find ALL instances before changing
   - ⚠️ Create a checklist of all files touched
   - ⚠️ Verify build passes after changes

### Acceptance Criteria

- [ ] Zero "Digital Builders" references in user-facing code
- [ ] Consistent "ViBE" capitalization everywhere
- [ ] All copy uses events-first language
- [ ] Build passes
- [ ] No TypeScript errors
- [ ] Manual QA: All pages reviewed for brand consistency

### Estimated Effort
**1-2 days** (mostly find/replace + verification)

---

## Phase 6: Event Discovery MVP

### Goal
Enhance homepage and events list with simple, effective discovery features. Make it easy to find events in Virginia.

### Scope

**INCLUDED:**
- ✅ Homepage event discovery logic
  - Show featured/upcoming events on homepage
  - Simple "View All Events" CTA
- ✅ Region-based filtering (simple dropdown or tabs)
  - Virginia regions: Northern VA, Central VA, Hampton Roads, etc.
  - Filter events by region
- ✅ Date-based filtering
  - "This Week", "This Month", "Upcoming"
  - Simple date range picker (optional)
- ✅ Event categories (lightweight)
  - Tech, Creative, Networking, etc.
  - Simple tags/filters
  - No complex taxonomy yet
- ✅ Search functionality (basic)
  - Search by event name, venue, city
  - Simple text search, no fuzzy matching yet

**EXCLUDED:**
- ❌ Recommendation engine
- ❌ Complex filtering (multiple AND/OR conditions)
- ❌ Event ranking algorithms
- ❌ User preferences/saved searches
- ❌ Map view (future)
- ❌ Advanced search operators

### Key Files Likely to Change

```
app/
├── page.tsx                    # Homepage with featured events
├── events/
│   ├── page.tsx                # Events list with filters
│   └── [slug]/page.tsx        # Event detail (minor updates)
components/
├── events/
│   ├── events-list-client.tsx  # Add filtering logic
│   ├── event-filters.tsx       # NEW: Filter component
│   └── event-search.tsx       # NEW: Search component
lib/
├── actions/
│   └── events-actions.ts       # Add filter/search queries
└── constants/
    └── regions.ts              # NEW: Virginia regions list
```

### Database Considerations

**NO NEW TABLES REQUIRED** (use existing `events` table)

**Optional Enhancements:**
- Add `region` column to `events` table (if not exists)
- Add `category` column to `events` table (simple text, not FK)
- Add indexes on `region`, `category`, `start_at` for performance

**Migration Required:**
```sql
-- Only if columns don't exist
ALTER TABLE events ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT;
CREATE INDEX IF NOT EXISTS idx_events_region ON events(region);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
```

### Risks to Avoid

1. **Over-Engineering**
   - ⚠️ Don't build complex filtering UI
   - ⚠️ Don't add recommendation logic
   - ⚠️ Keep filters simple (dropdowns, checkboxes)

2. **Performance**
   - ⚠️ Use database indexes
   - ⚠️ Limit results (pagination)
   - ⚠️ Don't load all events at once

3. **Scope Creep**
   - ⚠️ No map view
   - ⚠️ No saved searches
   - ⚠️ No user preferences

### Acceptance Criteria

- [ ] Homepage shows featured/upcoming events
- [ ] Region filter works (if region data exists)
- [ ] Date filter works ("This Week", "This Month")
- [ ] Category filter works (if categories exist)
- [ ] Search works (basic text search)
- [ ] Filters can be combined (AND logic)
- [ ] Results are paginated (if >20 events)
- [ ] Build passes
- [ ] RLS policies still enforced

### Estimated Effort
**3-5 days** (includes database migration if needed, UI components, testing)

---

## Phase 7: Organizer (Client) Experience

### Goal
Make it easy and clear for clients to create, manage, and check-in attendees for their events.

### Scope

**INCLUDED:**
- ✅ Event creation flow (basic but solid)
  - Form with required fields: title, date/time, venue, city, capacity
  - Optional: description, category, region
  - Status: draft → published
  - Client can only create events they own (`created_by`)
- ✅ Event management
  - Edit own events (clients)
  - Publish/unpublish toggle
  - Delete own events (with confirmation)
  - View own events list
- ✅ Ticket visibility for own events
  - View all RSVPs for own events
  - Export list (CSV, optional)
  - Filter by status (RSVP, checked-in)
- ✅ Check-in UX clarity
  - Clear check-in page for clients
  - Search by name/email
  - Bulk check-in (optional, simple)
  - Visual confirmation of check-in status

**EXCLUDED:**
- ❌ Payment integration
- ❌ Ticket pricing/tiers
- ❌ QR code scanning (future)
- ❌ Advanced analytics
- ❌ Email notifications to attendees
- ❌ Event templates

### Key Files Likely to Change

```
app/
├── dashboard/
│   └── client.tsx              # Client dashboard (enhance)
├── events/
│   ├── create/
│   │   └── page.tsx            # NEW: Event creation page
│   └── [slug]/
│       └── edit/
│           └── page.tsx        # NEW: Event edit page
├── admin/
│   └── check-in/
│       └── page.tsx            # Enhance for client access
components/
├── events/
│   ├── event-form.tsx          # NEW: Create/edit form
│   ├── event-management.tsx    # NEW: Client event list
│   └── ticket-list.tsx        # NEW: View RSVPs for event
lib/
├── actions/
│   └── events-actions.ts       # Add create/update/delete actions
```

### Database Considerations

**NO NEW TABLES REQUIRED** (use existing `events` and `tickets`)

**RLS Verification:**
- Ensure clients can only create events with `created_by = auth.uid()`
- Ensure clients can only edit/delete own events
- Ensure clients can only view tickets for own events

### Risks to Avoid

1. **Security**
   - ⚠️ Verify RLS policies prevent clients from editing others' events
   - ⚠️ Verify `created_by` is always set correctly
   - ⚠️ Don't allow clients to change `created_by` after creation

2. **UX Confusion**
   - ⚠️ Clear distinction between client and admin views
   - ⚠️ Clear "Create Event" CTA for clients
   - ⚠️ Don't hide event management behind complex navigation

3. **Over-Scoping**
   - ⚠️ No payment integration yet
   - ⚠️ No advanced features
   - ⚠️ Keep forms simple

### Acceptance Criteria

- [ ] Clients can create events
- [ ] Clients can edit own events
- [ ] Clients can publish/unpublish own events
- [ ] Clients can view RSVPs for own events
- [ ] Clients can check-in attendees for own events
- [ ] RLS prevents clients from accessing others' events
- [ ] Build passes
- [ ] Manual QA: Full client flow tested

### Estimated Effort
**5-7 days** (includes forms, validation, RLS verification, testing)

---

## Phase 8: Trust & Safety (Lightweight)

### Goal
Add basic trust and safety features without heavy enforcement. Focus on reporting and moderation basics.

### Scope

**INCLUDED:**
- ✅ Report event functionality
  - Simple form: "Report this event"
  - Reason dropdown: Spam, Inappropriate, Misleading, Other
  - Optional text field for details
  - Store reports in database (simple table)
- ✅ Event moderation basics (admin-only)
  - Admin can view reported events
  - Admin can hide/unhide events
  - Admin can delete events (with reason)
  - Simple admin moderation dashboard
- ✅ Soft guardrails
  - Rate limiting on event creation (prevent spam)
  - Basic validation (no profanity filter yet)
  - Event approval workflow (optional, simple)

**EXCLUDED:**
- ❌ User reporting (only event reporting)
- ❌ Automated moderation
- ❌ Complex moderation workflows
- ❌ User bans/suspensions (keep existing system)
- ❌ Content filtering/AI moderation

### Key Files Likely to Change

```
app/
├── events/
│   └── [slug]/
│       └── report/
│           └── page.tsx        # NEW: Report event page
├── admin/
│   └── moderation/
│       └── page.tsx            # NEW: Moderation dashboard
components/
├── events/
│   └── report-event-form.tsx   # NEW: Report form
lib/
├── actions/
│   └── moderation-actions.ts   # NEW: Moderation actions
```

### Database Considerations

**NEW TABLE REQUIRED:**

```sql
CREATE TABLE event_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, resolved
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE event_reports ENABLE ROW LEVEL SECURITY;

-- Users can report events
CREATE POLICY "Users can report events"
  ON event_reports FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

-- Users can view own reports
CREATE POLICY "Users can view own reports"
  ON event_reports FOR SELECT
  USING (auth.uid() = reported_by);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports"
  ON event_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_event_reports_event_id ON event_reports(event_id);
CREATE INDEX idx_event_reports_status ON event_reports(status);
```

**Optional Enhancement:**
- Add `is_hidden` column to `events` table (if not exists)
- Add `hidden_reason` column to `events` table

### Risks to Avoid

1. **Over-Engineering**
   - ⚠️ Don't build complex moderation workflows
   - ⚠️ Don't add automated filtering
   - ⚠️ Keep it simple: report → admin reviews → action

2. **Abuse Prevention**
   - ⚠️ Rate limit event creation (e.g., 5 events/day per client)
   - ⚠️ Prevent duplicate reports from same user
   - ⚠️ Don't expose reporter identity to event creator

3. **Scope Creep**
   - ⚠️ No user reporting yet
   - ⚠️ No automated actions
   - ⚠️ No complex rules engine

### Acceptance Criteria

- [ ] Users can report events
- [ ] Reports are stored in database
- [ ] Admins can view all reports
- [ ] Admins can hide/unhide events
- [ ] Admins can delete events with reason
- [ ] Rate limiting prevents spam event creation
- [ ] Build passes
- [ ] RLS policies prevent unauthorized access

### Estimated Effort
**3-4 days** (includes database migration, UI, basic rate limiting)

---

## Phase 9: Metrics & Readiness

### Goal
Add basic analytics hooks and prepare for future partnerships/sponsorships. No ads yet.

### Scope

**INCLUDED:**
- ✅ Basic analytics hooks
  - Event views (track when event detail page is viewed)
  - RSVP clicks (track RSVP button clicks)
  - Check-in completions (already tracked)
  - Simple event popularity metrics
- ✅ Analytics storage
  - Simple `event_analytics` table (views, RSVPs)
  - Aggregate queries for admin dashboard
  - No real-time dashboards yet
- ✅ Prep for partnerships/sponsorships
  - Add `sponsor` or `partner` field to events (optional, simple)
  - Add `featured` flag to events (for homepage)
  - Simple admin controls for featured events
- ✅ Basic admin dashboard enhancements
  - Show event popularity (views, RSVPs)
  - Show recent activity
  - Simple metrics overview

**EXCLUDED:**
- ❌ Real-time analytics dashboards
- ❌ Advanced analytics (funnels, cohorts)
- ❌ Third-party analytics integration (Google Analytics, etc.)
- ❌ Ad system
- ❌ Sponsorship payment integration
- ❌ Complex reporting

### Key Files Likely to Change

```
app/
├── admin/
│   └── dashboard/
│       └── page.tsx            # Add metrics overview
components/
├── admin/
│   └── metrics-overview.tsx   # NEW: Simple metrics component
lib/
├── actions/
│   └── analytics-actions.ts   # NEW: Analytics tracking
└── utils/
    └── analytics.ts            # NEW: Analytics helpers
```

### Database Considerations

**NEW TABLE REQUIRED:**

```sql
CREATE TABLE event_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'view', 'rsvp_click', 'rsvp_complete', 'check_in'
  metadata JSONB, -- Optional: additional data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can insert analytics (public events)
CREATE POLICY "Public can track analytics"
  ON event_analytics FOR INSERT
  WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view analytics"
  ON event_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_event_analytics_event_id ON event_analytics(event_id);
CREATE INDEX idx_event_analytics_action ON event_analytics(action);
CREATE INDEX idx_event_analytics_created_at ON event_analytics(created_at);
```

**Optional Enhancements:**
- Add `sponsor` column to `events` table (TEXT, nullable)
- Add `is_featured` column to `events` table (BOOLEAN, default false)

### Risks to Avoid

1. **Privacy**
   - ⚠️ Don't track PII unnecessarily
   - ⚠️ Anonymize user data in analytics
   - ⚠️ Comply with privacy regulations

2. **Performance**
   - ⚠️ Don't slow down page loads with analytics
   - ⚠️ Use async tracking
   - ⚠️ Batch analytics writes if needed

3. **Over-Scoping**
   - ⚠️ No complex dashboards
   - ⚠️ No real-time updates
   - ⚠️ Keep metrics simple

### Acceptance Criteria

- [ ] Event views are tracked
- [ ] RSVP clicks are tracked
- [ ] Analytics data is stored
- [ ] Admin can view basic metrics
- [ ] Featured events can be set
- [ ] Build passes
- [ ] No performance degradation

### Estimated Effort
**2-3 days** (includes database migration, tracking hooks, simple admin UI)

---

## 🛑 MVP Completion Line

**ViBE v1 MVP is COMPLETE after Phase 4.**

**Phases 5-9 are "MVP+ Enhancements"** — they improve the product but are not required for launch.

**Recommended Launch Readiness:**
- ✅ **Minimum:** Phases 1-4 (already complete)
- ✅ **Recommended:** Phases 1-5 (brand polish)
- ✅ **Ideal:** Phases 1-6 (with event discovery)
- ⏳ **Future:** Phases 7-9 (organizer tools, safety, metrics)

---

## 📦 Execution Recommendation

### **BUILD NEXT (Priority Order):**

1. **Phase 5** (1-2 days) — **HIGH PRIORITY**
   - Quick win
   - Improves brand consistency
   - Low risk
   - **RECOMMENDED TO DO FIRST**

2. **Phase 6** (3-5 days) — **HIGH PRIORITY**
   - Core product feature
   - Improves user experience significantly
   - **RECOMMENDED FOR MVP+**

3. **Phase 7** (5-7 days) — **MEDIUM PRIORITY**
   - Important for client adoption
   - But can launch without it (admin can create events)
   - **BUILD IF CLIENTS ARE READY**

4. **Phase 8** (3-4 days) — **MEDIUM PRIORITY**
   - Important for trust
   - But can launch with manual moderation
   - **BUILD BEFORE SCALE**

5. **Phase 9** (2-3 days) — **LOW PRIORITY**
   - Nice to have
   - Can add later
   - **BUILD WHEN READY FOR PARTNERSHIPS**

### **PARK FOR LATER:**

- Advanced event discovery (recommendations, maps)
- Payment integration
- Email notifications
- Mobile app
- Social features
- Complex analytics

---

## 📋 Summary

| Phase | Goal | Effort | Priority | Status |
|-------|------|--------|----------|--------|
| **Phase 5** | Brand polish | 1-2 days | HIGH | Ready |
| **Phase 6** | Event discovery | 3-5 days | HIGH | Ready |
| **Phase 7** | Organizer tools | 5-7 days | MEDIUM | Ready |
| **Phase 8** | Trust & safety | 3-4 days | MEDIUM | Ready |
| **Phase 9** | Metrics | 2-3 days | LOW | Ready |

**Total Estimated Effort:** 14-23 days

**Recommended Next Steps:**
1. ✅ Complete Phase 5 (brand polish)
2. ✅ Then Phase 6 (event discovery)
3. ⏳ Then assess: Do we need Phase 7 before launch?

---

*Last Updated: January 2026 | Status: Ready for Execution*
