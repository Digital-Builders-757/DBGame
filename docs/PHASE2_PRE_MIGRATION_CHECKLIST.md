# Phase 2 Pre-Migration Safety Checklist

**Date:** January 2026  
**Status:** Pre-Migration Verification

---

## 🚨 CRITICAL: Verify Before Migration

### **1. Mentor → Client Mapping Verification**

**⚠️ IMPORTANT:** Verify that migrating `mentor` → `client` is correct.

**Check Existing Mentor Accounts:**

```sql
-- Run this query BEFORE migration
SELECT 
  id, 
  display_name, 
  role, 
  created_at 
FROM profiles 
WHERE role = 'mentor';
```

**Decision Matrix:**

| Scenario | Count | Action | Notes |
|----------|-------|--------|-------|
| **No mentors exist** | 0 | ✅ Safe to migrate | No impact |
| **Mentors were event organizers** | > 0 | ✅ Migrate to `client` | Correct mapping |
| **Mentors were helpers/advisors** | > 0 | ⚠️ **STOP** | Consider migrating to `admin` or keeping `mentor` temporarily |

**If mentors exist and were NOT organizers:**
- Option A: Migrate `mentor` → `admin` (if they had admin-like permissions)
- Option B: Keep `mentor` temporarily, migrate later after clarifying role
- Option C: Migrate `mentor` → `user` (if they were just helpers)

**Action Required:**
- [ ] Run mentor count query
- [ ] Document decision in migration notes
- [ ] Update migration SQL if needed

---

### **2. Ownership Field Verification**

**Check `events.created_by` Field:**

```sql
-- Verify column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'events' AND column_name = 'created_by';

-- Check for NULL values
SELECT COUNT(*) as null_created_by_count 
FROM events 
WHERE created_by IS NULL;
```

**Expected Results:**
- ✅ Column exists: `created_by uuid references profiles(id)`
- ✅ Column allows NULL: `is_nullable = true` (for `on delete set null`)

**If NULL values exist:**
- [ ] Decide: Set `created_by` to admin user for existing events?
- [ ] Or: Leave NULL and ensure RLS handles NULL correctly (admins only)

**Code Verification:**
- [ ] Check event creation code sets `created_by = auth.uid()`
- [ ] If event creation UI doesn't exist yet, document that it MUST set `created_by`

**Current Status:**
- ✅ `events.created_by` field exists in schema
- ✅ RLS policies use `created_by` for ownership checks
- ⚠️ Event creation code not found (may not be implemented yet)
- **Action:** Ensure future event creation always sets `created_by`

---

### **3. Builder Role Count**

**Check Existing Builder Accounts:**

```sql
-- Count existing builder accounts
SELECT COUNT(*) as builder_count 
FROM profiles 
WHERE role = 'builder';
```

**Expected:** Any number (will be migrated to `user`)

**Action:**
- [ ] Document count for verification after migration
- [ ] Verify all migrated after migration completes

---

### **4. Database Backup**

**Before Migration:**
- [ ] Create database backup (if production/staging)
- [ ] Document backup location
- [ ] Verify backup is restorable

**For Local Development:**
- [ ] `supabase db reset` is safe (recreates from migrations)
- [ ] No backup needed for local

---

### **5. Migration File Review**

**Verify Migration SQL:**
- [ ] All policies use `DROP POLICY IF EXISTS` (safe for re-runs)
- [ ] Data migration comes AFTER policy updates (correct order)
- [ ] No hardcoded UUIDs or user IDs
- [ ] Comments explain each step

**Current Migration:** ✅ Follows correct order (policies first, then data)

---

## ✅ Pre-Migration Checklist

- [ ] Mentor count checked and decision documented
- [ ] `events.created_by` field verified
- [ ] Builder role count documented
- [ ] Database backup created (if production/staging)
- [ ] Migration file reviewed
- [ ] Team notified (if applicable)
- [ ] Rollback plan documented

---

## 🚀 Migration Execution Order

1. **Run Pre-Migration Checks** (this document)
2. **Apply Migration Locally:**
   ```bash
   supabase db push
   ```
3. **Verify Migration:**
   ```bash
   npm run types:regen
   npm run build
   npm run typecheck
   ```
4. **Run Verification Tests** (see `PHASE2_VERIFICATION_TESTS.md`)
5. **Apply to Staging/Production** (if local passes)

---

## 🔄 Rollback Plan

**If Migration Fails:**

1. **Revert Migration:**
   ```bash
   supabase migration repair --status reverted 20260109213941_migrate_role_system
   ```

2. **Restore Data (if needed):**
   ```sql
   -- Restore old roles (if data migration ran)
   UPDATE profiles SET role = 'builder' WHERE role = 'user';
   UPDATE profiles SET role = 'mentor' WHERE role = 'client';
   ```

3. **Restore Old Policies:**
   - Re-run previous migration or restore from backup

---

*Last Updated: January 2026*  
*Status: Ready for Pre-Migration Checks*
