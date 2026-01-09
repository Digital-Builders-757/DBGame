# GitHub Actions Supabase Authentication Fix

**Date:** January 2026  
**Issue:** Supabase CLI "Unauthorized" error in GitHub Actions

---

## Problem

GitHub Actions workflow failing with:
```
Unexpected error retrieving remote project status: {"message":"Unauthorized"}
during: npx supabase@2.67.1 link --project-ref *****
```

---

## Root Causes

1. **Missing or Invalid Token:** `SUPABASE_ACCESS_TOKEN` not set or expired
2. **Fork PRs:** GitHub doesn't expose secrets to fork PRs by default
3. **Token Not Passed:** Token not explicitly passed to CLI commands

---

## Solution Applied

### 1. Added Fork Detection
- Check if PR is from fork before running Supabase steps
- Skip Supabase steps gracefully for fork PRs (expected behavior)

### 2. Enhanced Token Handling
- Explicitly pass `SUPABASE_ACCESS_TOKEN` as env var to each step
- Add verification step to check secrets are available
- Better error messages with troubleshooting hints

### 3. Improved Error Messages
- Clear messages when secrets are missing
- Helpful hints about where to set secrets
- Success confirmations for each step

---

## Required GitHub Secrets

Make sure these are set in **Settings → Secrets and variables → Actions**:

- `SUPABASE_ACCESS_TOKEN` - Personal access token from Supabase account
- `SUPABASE_PROJECT_ID` - Your Supabase project reference ID
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

---

## How to Get Supabase Access Token

1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Copy the token
4. Add to GitHub Secrets as `SUPABASE_ACCESS_TOKEN`

**Important:** Token must be from an account that has access to the project.

---

## Workflow Behavior

### Same-Repo PRs
- ✅ Supabase steps run normally
- ✅ Types are verified
- ✅ Schema sync is checked

### Fork PRs
- ⚠️ Supabase steps are skipped (expected)
- ✅ Build still runs
- ✅ Types verification happens when PR is merged

---

## Testing

After updating the workflow:

1. Create a PR from same repo branch → Should work
2. Check workflow logs for:
   - "✅ Supabase secrets are available"
   - "🔐 Authenticating with Supabase..."
   - "✅ Login successful"
   - "✅ Link successful"

---

*Fix applied: January 2026*
