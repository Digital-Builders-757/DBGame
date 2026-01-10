# Phase 2 Migration - Unified Security Patches

**Date:** January 2026  
**Status:** All Security Fixes Applied

---

## 🔒 Security Patches Applied to Migration

The migration file `20260109213941_migrate_role_system.sql` has been updated with all security fixes. Below is the unified diff showing all changes.

---

## Unified Diff: `supabase/migrations/20260109213941_migrate_role_system.sql`

### **Fix 1: Prevent Role Self-Assignment on Insert**

**Location:** Lines 49-59

```sql
-- Users (including transitional 'builder') can insert their own profile
-- SECURITY: Users can only self-insert role NULL or 'user' (prevents self-assignment of admin/client)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id
    AND (
      role IS NULL
      OR role = 'user'
      OR role = 'builder'  -- Transitional support during migration
    )
  );
```

**Change:** Restricted `role IN ('user', 'builder', 'client', 'admin')` → `role IS NULL OR role = 'user' OR role = 'builder'`

---

### **Fix 2: Prevent Role Self-Assignment on Update**

**Location:** Lines 286-330

```sql
-- ============================================
-- SECURITY: PREVENT ROLE SELF-ASSIGNMENT
-- ============================================
-- Trigger function to prevent users from changing their own role
-- Only admins (via service role or admin UI) can change roles

CREATE OR REPLACE FUNCTION public.prevent_role_self_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- If role is being changed
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Check if user is trying to change their own role
    IF auth.uid() = NEW.id THEN
      -- Allow if changing from 'builder' to 'user' (migration case)
      IF OLD.role = 'builder' AND NEW.role = 'user' THEN
        RETURN NEW;
      END IF;
      
      -- Allow if changing from 'mentor' to 'client' (migration case)
      IF OLD.role = 'mentor' AND NEW.role = 'client' THEN
        RETURN NEW;
      END IF;
      
      -- Block all other role changes by users
      RAISE EXCEPTION 'Users cannot change their own role. Role changes must be done by an admin.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS prevent_role_self_assignment_trigger ON public.profiles;
CREATE TRIGGER prevent_role_self_assignment_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_assignment();
```

**Change:** Added trigger function and trigger to prevent role self-assignment.

---

### **Fix 3: Fix Events INSERT Policy Bypass**

**Location:** Lines 99-110

```sql
-- Clients and admins can insert events
-- SECURITY: Require role check AND created_by match (removed bypass)
CREATE POLICY "Clients and admins can insert events"
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'client')
    )
    AND created_by = auth.uid()
  );
```

**Change:** Changed `OR created_by = auth.uid()` → `AND created_by = auth.uid()`

**Before (VULNERABLE):**
```sql
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'client'))
  OR created_by = auth.uid()  -- BYPASS!
);
```

**After (SECURE):**
```sql
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'client'))
  AND created_by = auth.uid()  -- REQUIRED
);
```

---

### **Fix 4: Add Events SELECT Policies**

**Location:** Lines 76-97

```sql
-- Clients can view their own events (including drafts)
CREATE POLICY "Clients can view own events"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'client'
    )
    AND created_by = auth.uid()
  );

-- Admins can view all events
CREATE POLICY "Admins can view all events"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

**Change:** Added two new SELECT policies for clients and admins.

---

## ✅ Verification Checklist

- [x] Fix 1: Role self-assignment on insert prevented
- [x] Fix 2: Role self-assignment on update prevented (trigger)
- [x] Fix 3: Events INSERT policy bypass fixed
- [x] Fix 4: Events SELECT policies added
- [x] Migration applied successfully
- [x] Types regenerated
- [x] Build passes
- [x] Type check passes

---

## 📋 Recommended PR Structure

### **PR #1: Phase 2 Migration + Security Patches (HOTFIX)**

**Files:**
- `supabase/migrations/20260109213941_migrate_role_system.sql`
- `supabase/migrations/20260109214941_patch_role_security_fixes.sql` (redundant but safe)

**Description:**
```
Phase 2: Role System Migration + Security Patches

- Migrates roles: builder → user, mentor → client
- Updates all RLS policies for new role system
- Adds security fixes:
  - Prevents role self-assignment (insert + update)
  - Fixes events INSERT policy bypass
  - Adds events SELECT policies for clients/admins
```

**Testing:**
- [ ] Migration applies without errors
- [ ] Types regenerate successfully
- [ ] Build passes
- [ ] Security tests pass (see verification report)

---

### **PR #2: Code Updates (CLEANUP)**

**Files:**
- `components/command-palette.tsx` (removed builder/mentor references)
- `components/ui/status-badge.tsx` (fixed type reference)
- `lib/actions/auth-actions.ts` (updated default role)
- `middleware.ts` (removed transitional logic)
- `components/auth/auth-provider.tsx` (updated types)
- `app/admin/users/admin-users-client.tsx` (updated to new roles)
- `lib/constants/user-roles.ts` (added client role)

**Description:**
```
Phase 2: Code Updates for New Role System

- Updated all role references from builder/mentor to user/client/admin
- Removed transitional role support
- Updated UI components
```

---

*Last Updated: January 2026*  
*Status: All Security Fixes Applied*
