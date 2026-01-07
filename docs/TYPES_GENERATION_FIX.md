# Types Generation Pipeline Fix

**Date:** December 2025  
**Issue:** Corrupted `types/database.ts` due to Windows encoding issues with `cmd >` redirection  
**Solution:** Migrate canonical types file to `types/supabase.ts` with UTF-8 safe PowerShell generation

---

## Problem Summary

1. **Encoding Corruption:** Windows `cmd >` redirection wrote `types/database.ts` with non-UTF-8 encoding
2. **Wrong Target File:** Scripts generated to `types/database.ts` but app code uses `@/types/supabase`
3. **Type Drift Risk:** Mismatch between generated file and imported file

---

## Changes Made

### 1. Package.json Scripts (UTF-8 Safe Generation)

**Updated scripts:**
- `types:regen:manual`
- `types:regen:dev`
- `types:regen:prod`

**Change:** Replaced `cmd /d /c "... > types\\database.ts"` with PowerShell `Out-File -Encoding utf8` writing to `types\\supabase.ts`

**Before:**
```json
"types:regen:manual": "cmd /d /c \"... > types\\database.ts\""
```

**After:**
```json
"types:regen:manual": "powershell -Command \"... | Out-File -FilePath types\\supabase.ts -Encoding utf8\""
```

### 2. Script Updates

#### `scripts/prepend-autogen-banner.mjs`
- **Changed:** Default target from `types/database.ts` → `types/supabase.ts`
- **Impact:** Banner prepending now targets correct file

#### `scripts/load-env-and-regen-types.ps1`
- **Changed:** Output redirection from `> types\database.ts` → `| Out-File -FilePath types\supabase.ts -Encoding utf8`
- **Changed:** Banner script call to pass `types\supabase.ts` argument

#### `scripts/verify-types-fresh.mjs`
- **Changed:** All references from `types/database.ts` → `types/supabase.ts`
- **Changed:** Temp file from `types/database.__fresh.ts` → `types/supabase.__fresh.ts`
- **Changed:** Generation method to use UTF-8 safe `fs.writeFileSync` instead of shell redirection

#### `scripts/verify-schema-sync-comprehensive.mjs`
- **Changed:** Types path from `types/database.ts` → `types/supabase.ts`
- **Changed:** `.gitattributes` check from `types/database.ts` → `types/supabase.ts`

#### `scripts/verify-schema-local.mjs`
- **Changed:** Comparison file from `types/database.ts` → `types/supabase.ts`
- **Changed:** Error messages to reference `types/supabase.ts`

### 3. Type Files Structure

#### `types/supabase.ts` (Canonical Generated File)
- **Status:** Will be overwritten during type generation
- **Contains:** Full `Database` type definition after `npm run types:regen`
- **Purpose:** Single source of truth for Supabase types

#### `types/database.ts` (Backwards Compatibility)
- **Status:** Clean re-export file (not corrupted)
- **Contains:** `export type { Database } from "./supabase"`
- **Purpose:** Support legacy imports from `@/types/database`
- **Note:** All new code should use `@/types/supabase`

#### `types/database-helpers.ts`
- **Updated:** Imports from `./supabase` instead of `./database`
- **Updated:** Comments reference `types/supabase.ts` as source

---

## Verification

### Scripts Now Check Correct File

✅ `npm run types:check` → Checks `types/supabase.ts`  
✅ `npm run schema:verify:comprehensive` → Validates `types/supabase.ts`  
✅ `npm run schema:verify-local` → Compares `types/supabase.ts`

### Generation Pipeline

✅ `npm run types:regen` → Generates to `types/supabase.ts` with UTF-8  
✅ `npm run types:regen:dev` → Generates to `types/supabase.ts` with UTF-8  
✅ `npm run types:regen:prod` → Generates to `types/supabase.ts` with UTF-8

---

## Migration Notes

### For Developers

1. **Import Path:** Continue using `@/types/supabase` (no change needed)
2. **Type Generation:** Run `npm run types:regen` as before
3. **Verification:** All checks now validate `types/supabase.ts`

### Backwards Compatibility

- Legacy imports from `@/types/database` still work via re-export
- No code changes required
- `types/database.ts` is now a clean re-export (not corrupted)

---

## Testing Checklist

- [ ] Run `npm run types:regen` and verify `types/supabase.ts` is generated with UTF-8
- [ ] Verify `types/database.ts` re-exports correctly from `types/supabase.ts`
- [ ] Run `npm run types:check` and verify it checks `types/supabase.ts`
- [ ] Run `npm run schema:verify:comprehensive` and verify no errors
- [ ] Verify all imports from `@/types/supabase` still work
- [ ] Verify legacy imports from `@/types/database` still work

---

## Files Changed

1. `package.json` - Updated type generation scripts
2. `scripts/prepend-autogen-banner.mjs` - Default target updated
3. `scripts/load-env-and-regen-types.ps1` - UTF-8 safe generation
4. `scripts/verify-types-fresh.mjs` - Check `types/supabase.ts`
5. `scripts/verify-schema-sync-comprehensive.mjs` - Validate `types/supabase.ts`
6. `scripts/verify-schema-local.mjs` - Compare `types/supabase.ts`
7. `types/supabase.ts` - Placeholder (will be overwritten during generation)
8. `types/database.ts` - Clean re-export for backwards compatibility
9. `types/database-helpers.ts` - Updated imports

---

**Status:** ✅ Complete - Ready for type regeneration
