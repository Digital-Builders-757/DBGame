# Event Creation Ownership Verification

**Date:** January 2026  
**Status:** Phase 2 - Ownership Field Requirements

---

## 🎯 Requirement

**All event creation MUST set `created_by = auth.uid()`**

This field drives client permissions:
- Clients can edit events where `created_by = auth.uid()`
- Clients can view tickets for events where `created_by = auth.uid()`
- Clients can check-in tickets for events where `created_by = auth.uid()`

---

## ✅ Current Schema Status

**Field Exists:** ✅
- `events.created_by` (uuid, references `profiles(id)`, `on delete set null`)
- Defined in `supabase/migrations/20251207150508_initial_event_portal_schema.sql` line 59

**RLS Policies Use It:** ✅
- Events INSERT policy checks `created_by = auth.uid()`
- Events UPDATE policy checks `created_by = auth.uid()` (for clients)
- Tickets SELECT policy uses `events.created_by` (for clients)

---

## ⚠️ Code Verification Needed

**Current Status:** Event creation code not found in codebase search.

**This means:**
- Event creation UI may not be implemented yet (acceptable for v1 MVP)
- OR event creation happens via admin/Supabase dashboard

**Action Required:**

### **When Event Creation is Implemented:**

**Server Action Pattern:**
```typescript
"use server";

import { createSupabaseServer } from "@/lib/supabase/supabase-server";

export async function createEvent(eventData: EventFormData) {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // CRITICAL: Always set created_by
  const { data, error } = await supabase
    .from("events")
    .insert({
      ...eventData,
      created_by: user.id,  // ← MUST SET THIS
      status: "draft",      // Default to draft
    })
    .select("id, slug, title")
    .single();

  if (error) return { error: error.message };
  return { success: true, event: data };
}
```

**API Route Pattern:**
```typescript
import { createSupabaseServer } from "@/lib/supabase/supabase-server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const eventData = await request.json();

  // CRITICAL: Always set created_by
  const { data, error } = await supabase
    .from("events")
    .insert({
      ...eventData,
      created_by: user.id,  // ← MUST SET THIS
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data });
}
```

---

## 🔍 Verification Checklist

**Before Phase 2 Migration:**
- [ ] Verify `events.created_by` column exists ✅ (confirmed)
- [ ] Verify RLS policies use `created_by` ✅ (confirmed)
- [ ] Check for NULL `created_by` values:
  ```sql
  SELECT COUNT(*) FROM events WHERE created_by IS NULL;
  ```

**After Event Creation is Implemented:**
- [ ] Event creation code sets `created_by = auth.uid()`
- [ ] Test: Create event as client, verify `created_by` is set
- [ ] Test: Client can edit own event
- [ ] Test: Client cannot edit other events
- [ ] Test: Client can view tickets for own events
- [ ] Test: Client cannot view tickets for other events

---

## 🚨 If `created_by` is NULL

**For Existing Events:**

**Option A: Set to Admin User**
```sql
-- Set NULL created_by to admin user (if you have one)
UPDATE events 
SET created_by = '<admin_user_id>'
WHERE created_by IS NULL;
```

**Option B: Leave NULL, Update RLS**
```sql
-- Update RLS to allow admins to edit NULL-owned events
-- (Already handled: admins can edit any event)
```

**Recommendation:** Option B (leave NULL, admins handle)

---

## 📝 Future Event Creation Requirements

**When implementing event creation UI:**

1. **Always set `created_by`:**
   ```typescript
   created_by: user.id  // or auth.uid()
   ```

2. **Verify in tests:**
   ```typescript
   const event = await createEvent(eventData);
   expect(event.created_by).toBe(user.id);
   ```

3. **Document in code:**
   ```typescript
   /**
    * Creates a new event.
    * @param eventData - Event data (title, description, etc.)
    * @returns Created event with id, slug, title
    * 
    * CRITICAL: Always sets created_by = auth.uid() for client permissions
    */
   ```

---

*Last Updated: January 2026*  
*Status: Schema Ready — Code Implementation Pending*
