# Phase 5: Product Polish & Identity — Tactical Runbook

**Date:** January 2026  
**Status:** Ready for Execution  
**Estimated Effort:** 1-2 days  
**Priority:** HIGH (Recommended before launch)

---

## 🎯 Goal

Final brand copy cleanup and consistent naming across the entire platform. Ensure UX language matches an events-first platform (not a builder community). Achieve 100% "ViBE" brand consistency in user-facing code.

---

## 📋 Scope

### INCLUDED ✅

**User-Facing Copy:**
- Replace all "Digital Builders" references with "ViBE"
- Standardize capitalization: "ViBE" (not "VIBE" or "Vibe")
- Update all user-facing copy to events-first language
- Remove builder/community language from:
  - Error messages
  - Success messages
  - Form labels
  - Button text
  - Page titles/descriptions
  - Alt text
  - Tooltips

**Code Comments:**
- Update comments that reference "Digital Builders"
- Update placeholder comments to reflect ViBE

**Configuration:**
- Update `package.json` name and description
- Document Sentry config (or update if possible)
- Update email from names

**Critical Pages:**
- `app/about/page.tsx` - Complete rewrite OR remove
- `app/project-overview/page.tsx` - Complete rebrand

### EXCLUDED ❌

- Database schema changes
- Feature additions
- UI redesigns (only copy/text changes)
- Documentation archive (can be done separately)
- Legacy code comments (low priority)

---

## 📁 Files to Change (Prioritized)

### Priority 1: User-Facing (Must Fix)

**Pages:**
1. `app/about/page.tsx` - **COMPLETE REWRITE** (currently TOTL Agency content)
2. `app/project-overview/page.tsx` - **COMPLETE REBRAND**
3. `app/dashboard/talent-data.tsx` - Update copy
4. `app/test-sentry/page.tsx` - Update references
5. `app/admin/dashboard/page.tsx` - Update comments/copy

**Components:**
1. `components/navbar.tsx` - Alt text, comments
2. `components/admin/admin-header.tsx` - Title "ViBE Admin"
3. `components/auth/sign-in-gate.tsx` - Copy update
4. `components/ui/background-paths.tsx` - Title update

**Lib:**
1. `lib/email/resend.ts` - Email from: "ViBE <email>"

### Priority 2: Code Comments (Should Fix)

**App:**
- `app/settings/*.tsx` - Comments
- `app/api/admin/*.ts` - Comments
- `app/dashboard/actions.ts` - Comments
- `app/globals.css` - Comment header

**Components:**
- `components/admin/*.tsx` - Comments
- `components/auth/auth-provider.tsx` - Comments
- `components/ui/status-badge.tsx` - Comments

**Lib:**
- `lib/selects.ts` - Comments
- `lib/safe-query.ts` - Comments
- `lib/utils/safe-query.ts` - Comments
- `lib/sentry/env.ts` - Comments

### Priority 3: Configuration (Nice to Have)

- `package.json` - Name, description
- `next.config.mjs` - Document Sentry config (may need to keep for now)

---

## 🔧 Execution Steps

### Step 1: Audit & Create Checklist (30 min)
1. Run grep for "Digital Builders" across codebase
2. Run grep for "TOTL" across codebase
3. Run grep for "VIBE" (wrong capitalization)
4. Create checklist of all files to update
5. Prioritize by user-facing vs internal

### Step 2: Critical Pages (2-3 hours)
1. **`app/about/page.tsx`**
   - Decision: Rewrite for ViBE OR remove page
   - If rewrite: Create events-focused "About ViBE" page
   - If remove: Add redirect to homepage
2. **`app/project-overview/page.tsx`**
   - Update title: "ViBE Project Overview"
   - Update all card descriptions
   - Remove "Builder Card" → "Event Pass"
   - Remove "XP and badges" references

### Step 3: User-Facing Components (2-3 hours)
1. Update navbar alt text and comments
2. Update admin header title
3. Update sign-in gate copy
4. Update background paths title
5. Update email from name

### Step 4: Code Comments (1-2 hours)
1. Batch update comments in app/ folder
2. Batch update comments in components/ folder
3. Batch update comments in lib/ folder
4. Update globals.css comment

### Step 5: Configuration (30 min)
1. Update package.json name: "vibe-platform" or "vibe-events"
2. Update package.json description
3. Document Sentry config (may need to keep org/project names for now)

### Step 6: Capitalization Audit (1 hour)
1. Find all "VIBE" (all caps) → "ViBE"
2. Find all "Vibe" (title case) → "ViBE"
3. Verify user-facing text uses correct capitalization

### Step 7: Verification (1 hour)
1. Build passes
2. TypeScript checks pass
3. Manual QA: Review all pages
4. Check console for any remaining references

---

## 🚨 Risks & Mitigations

### Risk 1: Breaking Changes
**Mitigation:**
- Only change copy/text, not code logic
- Don't change route paths
- Don't change component props/types
- Test build after each batch

### Risk 2: Over-Scoping
**Mitigation:**
- Stick to copy changes only
- Don't add features "while we're here"
- Don't redesign UI
- Use checklist to stay focused

### Risk 3: Missing References
**Mitigation:**
- Use grep/search before starting
- Create comprehensive checklist
- Review all user-facing pages manually
- Check console logs

### Risk 4: Sentry Configuration
**Mitigation:**
- May need to keep Sentry org/project names for now
- Document as "legacy naming" if can't change
- Update in future when Sentry project is renamed

---

## ✅ Acceptance Criteria

### Must Have:
- [ ] Zero "Digital Builders" references in user-facing code
- [ ] Zero "TOTL" references in user-facing code (except legacy docs)
- [ ] Consistent "ViBE" capitalization everywhere (user-facing)
- [ ] All copy uses events-first language
- [ ] `app/about/page.tsx` rewritten OR removed
- [ ] `app/project-overview/page.tsx` fully rebranded
- [ ] Build passes
- [ ] No TypeScript errors
- [ ] Manual QA: All pages reviewed

### Nice to Have:
- [ ] Code comments updated
- [ ] Configuration files updated
- [ ] Documentation organized

---

## 🛑 Stop Line

**Phase 5 is complete when:**
1. All user-facing pages show "ViBE" branding
2. No "Digital Builders" or "TOTL" in user-facing text
3. Capitalization is consistent ("ViBE" everywhere)
4. Build passes and manual QA is done
5. Critical pages (`about`, `project-overview`) are fixed

**Estimated Completion:** 1-2 days of focused work

---

## 📊 Success Metrics

- **Before:** ~47 user-facing files with "Digital Builders" references
- **After:** 0 user-facing files with old branding
- **Before:** Inconsistent capitalization
- **After:** 100% "ViBE" capitalization in user-facing text
- **Before:** Builder/community language
- **After:** Events-first language throughout

---

*Ready for execution. Start with Step 1: Audit & Create Checklist.*
