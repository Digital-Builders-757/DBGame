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

Or:
```
cannot save provided token: Invalid access token format
```

---

## Root Causes

1. **Missing or Invalid Token:** `SUPABASE_ACCESS_TOKEN` not set or expired
2. **Fork PRs:** GitHub doesn't expose secrets to fork PRs by default
3. **Token Not Passed:** Token not explicitly passed to CLI commands
4. **Using `supabase login` in CI:** The `supabase login --token` command tries to "save" the token and can fail with "Invalid access token format" if the token has quotes, spaces, or other formatting issues
5. **Token Format Issues:** Token may have quotes, spaces, newlines, or comments accidentally included
6. **Quotes in Secret Value:** Most common cause - if you paste `'sbp_...'` or `"sbp_..."` into GitHub Secrets, GitHub stores the quotes literally, and Supabase CLI rejects it
7. **Environment Secret Not Loaded:** If using environment secrets but workflow job doesn't have `environment:` declaration, secrets won't load

---

## Solution Applied

### 1. Added Fork Detection
- Check if PR is from fork before running Supabase steps
- Skip Supabase steps gracefully for fork PRs (expected behavior)

### 2. Removed `supabase login` Step
- **Do NOT use `supabase login` in CI** - it's not needed and causes "Invalid access token format" errors
- Use `supabase/setup-cli@v1` action instead to install the CLI
- Pass token via `env:` in each step that runs `supabase` commands

### 3. Enhanced Token Handling
- Added debug step to verify token format (length, prefix, no spaces/quotes)
- Explicitly pass `SUPABASE_ACCESS_TOKEN` as env var to each step
- Add verification step to check secrets are available
- Added connection verification step after linking to catch auth issues early
- Fixed `gen types` command to use `--project-ref` instead of `--project-id`
- Better error messages with troubleshooting hints

### 4. Updated Node Version
- Changed from Node 18 to Node 20 to match modern tooling and avoid EBADENGINE warnings

### 5. Improved Error Messages
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
3. Copy the token (should start with `sbp_`)
4. Add to GitHub Secrets as `SUPABASE_ACCESS_TOKEN`

**🚨 CRITICAL - Token Format Rules:**

### **ABSOLUTE RULE: NO QUOTES EVER**

When entering the secret value in GitHub:

**❌ WRONG:**
```
'sbp_7705c225dbb10be18934de2739bcf55f7c47ab63'
```
```
"sbp_7705c225dbb10be18934de2739bcf55f7c47ab63"
```

**✅ CORRECT:**
```
sbp_7705c225dbb10be18934de2739bcf55f7c47ab63
```

**GitHub Secrets store the value LITERALLY as typed.**
- If you type quotes → GitHub stores quotes → Supabase CLI rejects it
- No single quotes (`'`)
- No double quotes (`"`)
- No spaces before/after
- No newlines
- No comments (`# comment`)

### **Repository Secrets vs Environment Secrets**

**Option A: Repository Secrets (Recommended - Simplest)**
- Go to: **Settings → Secrets and variables → Actions → Repository secrets**
- Works for all jobs automatically
- No environment scoping needed

**Option B: Environment Secrets (If you need env-specific values)**
- Go to: **Settings → Secrets and variables → Actions → Environments → develop**
- **MUST** have `environment: develop` in your workflow job (we have this ✅)
- Environment name must match exactly: `develop` = `develop` (case-sensitive)

**Current Setup:** Our workflow uses `environment: develop` on line 19, so environment secrets will work, but repository secrets are simpler and recommended.

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
   - "✅ Token format looks valid" (from debug step)
   - "✅ Link successful"
   - "✅ Connection verified"
   - "✅ Types generated"

## Troubleshooting "Invalid access token format"

If you see `cannot save provided token: Invalid access token format`:

### Step 1: Check Debug Output

Look for the "Debug token format" step in your workflow logs. It will show:
- Token length (should be ~40-80 characters)
- Starts with: `sbp_` (should be exactly this)
- Has spaces: `false` (should be false)
- Has quotes: `false` (should be false)

If `Has quotes: true` → **Your secret value contains quotes!**

### Step 2: Fix the Secret

1. Go to **Settings → Secrets and variables → Actions**
2. Click on `SUPABASE_ACCESS_TOKEN`
3. Click **Update**
4. **Delete everything** in the Value field
5. Paste your token **without any quotes**: `sbp_7705c225dbb10be18934de2739bcf55f7c47ab63`
6. Click **Update secret**

### Step 3: Verify Environment Declaration

If using Environment secrets, verify your workflow has:

```yaml
jobs:
  verify-schema:
    environment: develop  # ← This line must exist and match your environment name
```

Our workflow has this ✅ on line 19.

### Step 4: Use Repository Secrets (Simpler)

If you want to avoid environment scoping entirely:
1. Go to **Settings → Secrets and variables → Actions → Repository secrets**
2. Add `SUPABASE_ACCESS_TOKEN` there instead
3. Remove `environment: develop` from workflow (or keep it for other secrets)

Repository secrets work for all jobs automatically.

## Workflow Pattern (Correct CI Usage)

```yaml
- name: Setup Supabase CLI
  uses: supabase/setup-cli@v1
  with:
    version: latest

- name: Link Supabase
  run: supabase link --project-ref $SUPABASE_PROJECT_REF
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}

- name: Generate types
  run: supabase gen types typescript --project-ref $SUPABASE_PROJECT_REF --schema public > types.ts
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}
```

**Key Points:**
- ✅ Use `supabase/setup-cli@v1` action (no `npx` needed)
- ✅ Pass token via `env:` in each step
- ✅ Do NOT use `supabase login` in CI
- ✅ Token must be clean (no quotes, spaces, comments)

---

*Fix applied: January 2026*
