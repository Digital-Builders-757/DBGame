# ⚡ Digital Builders - Quick Setup Checklist

**Date:** December 2025  
**Purpose:** Quick reference for connecting all services

---

## 🎯 Quick Setup Steps

### **1. GitHub (5 minutes)**

```bash
# 1. Create repo on GitHub.com (don't initialize with files)

# 2. Connect local repo
git init  # if not already initialized
git add .
git commit -m "feat: Initial Digital Builders setup"
git remote add origin https://github.com/YOUR_USERNAME/digital-builders-game.git
git branch -M main
git push -u origin main
```

### **2. Supabase (10 minutes)**

1. **Create Project:**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Name: `digital-builders`
   - Save database password securely
   - Wait for initialization

2. **Get Credentials:**
   - Settings → API → Copy URL, anon key, service_role key
   - Settings → General → Copy Project Reference ID

3. **Link Locally:**
   ```bash
   npx supabase@2.34.3 login
   npx supabase@2.34.3 link --project-ref YOUR_PROJECT_REF
   ```

4. **Create `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Test:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/api/admin/test-connection
   ```

### **3. Vercel (10 minutes)**

1. **Connect Repository:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import `digital-builders-game` from GitHub

2. **Add Environment Variables:**
   - Settings → Environment Variables
   - Add all variables from `.env.local`
   - Set for: Production, Preview, Development

3. **Deploy:**
   - Click "Deploy"
   - Wait for build
   - Get your URL: `digital-builders-game.vercel.app`

---

## ✅ Verification

```bash
# 1. GitHub
git remote -v  # Should show your GitHub repo

# 2. Supabase
npx supabase@2.34.3 projects list  # Should show your project

# 3. Vercel
# Check dashboard - should show deployment
```

---

## 🎯 What's Next?

1. ✅ All services connected
2. 🔄 Create database schema (see `LAUNCH_ROADMAP.md`)
3. 🔄 Set up Resend (optional)
4. 🔄 Set up Sentry (optional)
5. 🚀 Start building features!

---

*For detailed instructions, see `TECH_STACK_SETUP.md`*

