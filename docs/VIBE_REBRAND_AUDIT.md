# ViBE Rebrand Audit & Completion Status

**Date:** January 2026  
**Status:** Phase 1-4 Complete ✅ | Phase 5 In Planning 📋

---

## 🎯 Overall Grade: **B+ (85%)**

### Breakdown:
- **Core Infrastructure:** A (95%) - Database, RLS, roles, XP removal complete
- **Brand Identity:** B+ (85%) - Colors, fonts, major pages updated
- **Copy & Language:** C+ (75%) - Many references remain, inconsistent capitalization
- **Documentation:** B (80%) - Key docs updated, many legacy docs untouched
- **Configuration:** C (70%) - Package.json, Sentry config, env defaults need updates

---

## 📊 Remaining Work Inventory

### 🔴 CRITICAL (User-Facing)

#### App Pages (32 references found)
- `app/admin/dashboard/page.tsx` - Comments mention "Digital Builders"
- `app/settings/profile-editor.tsx` - Comments mention "Digital Builders"
- `app/settings/sections/basic-info.tsx` - Comments mention "Digital Builders"
- `app/api/admin/create-user/route.ts` - Comments mention "Digital Builders"
- `app/dashboard/actions.ts` - Comments mention "Digital Builders"
- `app/project-overview/page.tsx` - **ENTIRE PAGE** needs rebrand (title, descriptions)
- `app/about/page.tsx` - **ENTIRE PAGE** is TOTL Agency content (needs complete rewrite)
- `app/dashboard/talent-data.tsx` - Mentions "Digital Builders game components"
- `app/settings/page.tsx` - Comments mention "Digital Builders"
- `app/test-sentry/page.tsx` - Multiple "Digital Builders" references
- `app/api/test-sentry/route.ts` - Multiple "Digital Builders" references
- `app/api/sentry-diagnostic/route.ts` - Sentry org/project names
- `app/admin/users/page.tsx` - Comments mention "Digital Builders"
- `app/globals.css` - Comment: "Digital Builders Neon Effects"

#### Components (15 references found)
- `components/navbar.tsx` - Alt text "Digital Builders", comment
- `components/admin/admin-header.tsx` - Title "Digital Builders Admin"
- `components/admin/admin-user-creation.tsx` - Comments and text
- `components/auth/sign-in-gate.tsx` - "Learn more about Digital Builders"
- `components/auth/auth-provider.tsx` - Comments mention "Digital Builders"
- `components/admin/direct-user-creation.tsx` - Comments
- `components/ui/status-badge.tsx` - Comments
- `components/ui/background-paths.tsx` - Title "Digital Builders"

#### Lib Files (12 references found)
- `lib/selects.ts` - Comments mention "Digital Builders"
- `lib/utils/safe-query.ts` - Comments mention "Digital Builders"
- `lib/safe-query.ts` - Comments mention "Digital Builders"
- `lib/sentry/env.ts` - Comments mention "Digital Builders"
- `lib/email/resend.ts` - Email from: "Digital Builders 757"

### 🟡 MEDIUM (Configuration & Infrastructure)

#### Configuration Files
- `package.json` - Name: "digital-builders-game", description: "Text-based MMO"
- `next.config.mjs` - Sentry org: "the-digital-builders-bi", project: "digital-builders-game"
- `supabase/config.toml` - May contain project references
- Environment defaults in various files

#### Documentation (141 files found with references)
- Most files in `docs/digital-builders/` folder (legacy, can archive)
- Many historical docs mention "Digital Builders" or "TOTL"
- Migration docs reference old names

### 🟢 LOW (Comments & Legacy)

#### Code Comments
- Many TypeScript comments reference "Digital Builders" as placeholder
- These are low priority but should be cleaned up

---

## 📋 Phase 5 Execution Checklist

### Task 1: User-Facing Copy (HIGH PRIORITY)
- [ ] Update `app/project-overview/page.tsx` - Complete rebrand
- [ ] Update `app/about/page.tsx` - Rewrite for ViBE (or remove if not needed)
- [ ] Update `components/navbar.tsx` - Alt text, comments
- [ ] Update `components/admin/admin-header.tsx` - Title
- [ ] Update `components/auth/sign-in-gate.tsx` - Copy
- [ ] Update all error messages/toasts mentioning "Digital Builders"
- [ ] Update `lib/email/resend.ts` - Email from name

### Task 2: Code Comments (MEDIUM PRIORITY)
- [ ] Clean up comments in `app/admin/*`, `app/settings/*`, `app/dashboard/*`
- [ ] Update comments in `lib/*` files
- [ ] Update comments in `components/*` files
- [ ] Update `app/globals.css` comment

### Task 3: Configuration (MEDIUM PRIORITY)
- [ ] Update `package.json` name and description
- [ ] Update `next.config.mjs` Sentry org/project (or document as legacy)
- [ ] Review environment variable defaults
- [ ] Update any hardcoded Sentry references

### Task 4: Documentation (LOW PRIORITY)
- [ ] Archive `docs/digital-builders/` folder (or update selectively)
- [ ] Update key migration docs
- [ ] Create "Legacy Docs" section for historical reference

### Task 5: Capitalization Consistency (HIGH PRIORITY)
- [ ] Audit all "VIBE" → "ViBE" (correct capitalization)
- [ ] Audit all "Vibe" → "ViBE"
- [ ] Audit all "vibe" (lowercase) in user-facing text → "ViBE"

---

## 🎯 Files Requiring Complete Rewrite

### `app/about/page.tsx`
**Current State:** Entire page is TOTL Agency content (modeling agency)
**Action Required:** Complete rewrite for ViBE events platform OR remove page

### `app/project-overview/page.tsx`
**Current State:** References "Digital Builders", "Builder Card", "XP and badges"
**Action Required:** Complete rebrand to ViBE events platform

---

## 📊 Progress Metrics

### By Category:
- **Pages:** 14/26 updated (54%) ⚠️
- **Components:** 8/56 updated (14%) ⚠️
- **Lib Files:** 2/21 updated (10%) ⚠️
- **Configuration:** 0/3 updated (0%) 🔴
- **Documentation:** 5/117 updated (4%) 🔴

### By Priority:
- **Critical (User-Facing):** ~47 files need updates
- **Medium (Config):** ~5 files need updates
- **Low (Comments/Docs):** ~100+ files (can be done gradually)

---

## 🚨 Critical Issues Found

1. **`app/about/page.tsx`** - Entire page is wrong product (TOTL Agency)
2. **`package.json`** - Still named "digital-builders-game" with wrong description
3. **Sentry Configuration** - Org/project names still reference "digital-builders"
4. **Email Templates** - From name is "Digital Builders 757"
5. **Capitalization** - Inconsistent "VIBE" vs "ViBE" throughout

---

## ✅ What's Already Done Well

- Core database schema ✅
- Role system migration ✅
- XP removal ✅
- Event Pass implementation ✅
- Major pages (homepage, events, login, signup) ✅
- Brand colors and typography ✅
- Route redirects ✅
- Build passes ✅

---

*Last Updated: January 2026*
