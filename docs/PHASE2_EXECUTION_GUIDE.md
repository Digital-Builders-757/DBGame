# Phase 2 Execution Guide - Quick Reference

**Date:** January 2026  
**Status:** Ready for Execution

---

## 🚀 Quick Start

### **Step 1: Pre-Migration Checks (5 minutes)**

```bash
# 1. Check for mentor accounts
supabase db execute "
  SELECT COUNT(*) as mentor_count 
  FROM profiles 
  WHERE role = 'mentor';
"

# 2. Verify created_by field
supabase db execute "
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'events' AND column_name = 'created_by';
"

# 3. Check for NULL created_by
supabase db execute "
  SELECT COUNT(*) as null_count 
  FROM events 
  WHERE created_by IS NULL;
"
```

**Decision:** If mentor_count > 0, verify mentor → client mapping is correct.

---

### **Step 2: Apply Migration (2 minutes)**

```bash
# Apply migration
supabase db push

# Verify migration applied
supabase migration list
```

**Expected:** Migration `20260109213941_migrate_role_system` shows as applied.

---

### **Step 3: Regenerate Types & Build (1 minute)**

```bash
# Regenerate types
npm run types:regen

# Build and type check
npm run build
npm run typecheck
```

**Expected:** ✅ Build passes, ✅ No TypeScript errors.

---

### **Step 4: Verify Data Migration (1 minute)**

```bash
# Check role migration
supabase db execute "
  SELECT role, COUNT(*) as count 
  FROM profiles 
  GROUP BY role;
"
```

**Expected:**
- ✅ No `'builder'` roles (all migrated to `'user'`)
- ✅ No `'mentor'` roles (all migrated to `'client'`)
- ✅ Only `'user'`, `'client'`, `'admin'` roles exist

---

### **Step 5: Quick Smoke Test (5 minutes)**

**Test 1: User Role**
1. Login as user account
2. Navigate to `/events` ✅
3. Try to access `/admin/users` → Should redirect ✅

**Test 2: Client Role**
1. Login as client account
2. Try to create event (if UI exists) ✅
3. Try to access `/admin/users` → Should redirect ✅

**Test 3: Admin Role**
1. Login as admin account
2. Navigate to `/admin/users` ✅
3. Can see all users ✅

---

## 📋 Full Verification

**For complete test suite, see:** `docs/PHASE2_VERIFICATION_TESTS.md`

**For role permissions reference, see:** `docs/ROLE_TRUTH_TABLE.md`

---

## 🚨 If Something Goes Wrong

### **Migration Fails**

```bash
# Revert migration
supabase migration repair --status reverted 20260109213941_migrate_role_system

# Restore data (if migration partially ran)
supabase db execute "
  UPDATE profiles SET role = 'builder' WHERE role = 'user';
  UPDATE profiles SET role = 'mentor' WHERE role = 'client';
"
```

### **Build Fails After Migration**

```bash
# Regenerate types
npm run types:regen

# Check for import errors
npm run typecheck

# Fix any type errors manually
```

### **RLS Not Enforcing**

```bash
# Verify RLS is enabled
supabase db execute "
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public';
"

# All should show rowsecurity = true
```

---

## ✅ Success Criteria

- [ ] Migration applied without errors
- [ ] Types regenerated successfully
- [ ] Build passes
- [ ] Zero `'builder'` roles in database
- [ ] Zero `'mentor'` roles in database
- [ ] User role tests pass
- [ ] Client role tests pass
- [ ] Admin role tests pass

---

*Last Updated: January 2026*  
*Status: Ready for Execution*
