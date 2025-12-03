# 🔧 Digital Builders - Tech Stack Setup Guide

**Date:** December 2025  
**Status:** Step-by-Step Setup  
**Purpose:** Connect Next.js, Vercel, GitHub, and Supabase

---

## 🎯 Overview

This guide walks you through connecting all services for Digital Builders:
1. ✅ **Next.js** - Already configured
2. 🔄 **GitHub** - Repository setup
3. 🔄 **Supabase** - Database connection
4. 🔄 **Vercel** - Deployment

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] GitHub account
- [ ] Supabase account
- [ ] Vercel account
- [ ] Node.js 18+ installed
- [ ] Git installed

---

## 🔵 Step 1: GitHub Repository Setup

### **1.1 Create GitHub Repository**

1. Go to [github.com](https://github.com)
2. Click **"New repository"** (or **"+"** → **"New repository"**)
3. Fill in details:
   - **Repository name:** `digital-builders-game`
   - **Description:** "Text-based MMO for the creative tech community"
   - **Visibility:** Private (or Public)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### **1.2 Connect Local Repository**

```bash
# Check if git is initialized
git status

# If not initialized, initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: Initial Digital Builders setup - extracted from TOTL"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/digital-builders-game.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/digital-builders-game.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **1.3 Verify Connection**

```bash
# Check remote
git remote -v

# Should show:
# origin  https://github.com/YOUR_USERNAME/digital-builders-game.git (fetch)
# origin  https://github.com/YOUR_USERNAME/digital-builders-game.git (push)
```

---

## 🟢 Step 2: Supabase Setup

### **2.1 Create Supabase Project**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in details:
   - **Name:** `digital-builders`
   - **Database Password:** (create a strong password - save it securely!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine for MVP
4. Click **"Create new project"**
5. Wait for project to initialize (~2 minutes)

### **2.2 Get Supabase Credentials**

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (long string)
   - **service_role key:** `eyJhbGc...` (⚠️ Keep secret!)
3. Go to **Settings** → **General**
4. Copy **Project Reference ID:** `xxxxx` (the part before `.supabase.co`)

### **2.3 Link Local Project to Supabase**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
npx supabase@2.34.3 login

# Link to your project (replace YOUR_PROJECT_REF with your actual project ref)
npx supabase@2.34.3 link --project-ref YOUR_PROJECT_REF

# Verify connection
npx supabase@2.34.3 projects list
```

### **2.4 Create Environment Variables File**

Create `.env.local` in project root:

```env
# ======================================
# Digital Builders - Environment Variables
# ======================================

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ======================================
# Supabase Configuration
# ======================================
# Replace YOUR_PROJECT_REF with your actual project reference ID
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_PROJECT_ID=YOUR_PROJECT_REF

# ======================================
# Optional: Sentry Error Tracking
# ======================================
# SENTRY_DSN_DEV=https://your_dev_dsn@sentry.io/project_id
# SENTRY_DSN_PROD=https://your_prod_dsn@sentry.io/project_id
# SENTRY_AUTH_TOKEN=your_sentry_auth_token
# NEXT_PUBLIC_SENTRY_ENVIRONMENT=development

# ======================================
# Optional: Resend Email Service
# ======================================
# RESEND_API_KEY=re_your_resend_api_key
```

**⚠️ Important:** Never commit `.env.local` to git (it's in `.gitignore`)

### **2.5 Test Supabase Connection**

```bash
# Start development server
npm run dev

# In another terminal, test connection
curl http://localhost:3000/api/admin/test-connection

# Or visit in browser:
# http://localhost:3000/api/admin/test-connection
```

---

## 🟣 Step 3: Vercel Setup

### **3.1 Connect GitHub Repository**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository:
   - Find `digital-builders-game` in the list
   - Click **"Import"**
4. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### **3.2 Configure Environment Variables in Vercel**

Before deploying, add environment variables:

1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Add each variable from your `.env.local`:

**Required Variables:**
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
```

**Optional Variables:**
```
SENTRY_DSN_PROD=your_prod_dsn
SENTRY_DSN_DEV=your_dev_dsn
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=digital-builders-frontend
RESEND_API_KEY=re_your_resend_key
```

3. Set for all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### **3.3 Deploy to Vercel**

1. Click **"Deploy"** button
2. Vercel will:
   - Install dependencies
   - Run build command
   - Deploy to production
3. Monitor build logs
4. Once deployed, you'll get a URL like: `digital-builders-game.vercel.app`

### **3.4 Configure Custom Domain (Optional)**

1. Go to **Settings** → **Domains**
2. Add your domain: `digitalbuilders.com` (or your domain)
3. Add DNS records:
   - **A Record:** `76.76.21.21` (Vercel IP)
   - **CNAME:** `cname.vercel-dns.com`
4. Wait for DNS propagation (~5-30 minutes)
5. SSL certificate will be automatically provisioned

---

## ✅ Step 4: Verification & Testing

### **4.1 Verify GitHub Connection**

```bash
# Check remote
git remote -v

# Push a test commit
echo "# Test" >> README.md
git add README.md
git commit -m "test: Verify GitHub connection"
git push origin main

# Check GitHub - should see the commit
```

### **4.2 Verify Supabase Connection**

```bash
# Test local connection
npm run dev
# Visit: http://localhost:3000/api/admin/test-connection

# Test Supabase CLI
npx supabase@2.34.3 projects list
npx supabase@2.34.3 db status --linked
```

### **4.3 Verify Vercel Deployment**

1. Check deployment status in Vercel dashboard
2. Visit your deployed URL
3. Test the site:
   - [ ] Site loads
   - [ ] No build errors
   - [ ] Environment variables loaded
   - [ ] Supabase connection works

### **4.4 Test End-to-End Flow**

1. **Local Development:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: Add feature"
   git push origin main
   ```

3. **Vercel Auto-Deploy:**
   - Vercel automatically detects push
   - Builds and deploys automatically
   - Check deployment in Vercel dashboard

---

## 🔄 Step 5: Continuous Integration Setup

### **5.1 GitHub Actions (Optional)**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

### **5.2 GitHub Secrets**

1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_PROJECT_ID`

---

## 📝 Step 6: Update Configuration Files

### **6.1 Update package.json Scripts**

The scripts are already configured, but verify:

```json
{
  "scripts": {
    "types:regen": "cmd /d /c \"set SUPABASE_INTERNAL_NO_DOTENV=1&& npx -y supabase@2.34.3 gen types typescript --project-id %SUPABASE_PROJECT_ID% --schema public > types\\database.ts && node scripts\\prepend-autogen-banner.mjs\"",
    "link:dev": "npx -y supabase@2.34.3 link --project-ref %SUPABASE_PROJECT_ID%"
  }
}
```

**⚠️ Important:** Set `SUPABASE_PROJECT_ID` environment variable before running these scripts.

### **6.2 Update Supabase Config**

Edit `supabase/config.toml`:
- Project ID is already set to `digital-builders`
- Verify project reference matches your Supabase project

---

## 🎯 Quick Reference Commands

### **GitHub**
```bash
# Push changes
git add .
git commit -m "feat: Description"
git push origin main

# Check status
git status
git remote -v
```

### **Supabase**
```bash
# Link project
npx supabase@2.34.3 link --project-ref YOUR_PROJECT_REF

# Check status
npx supabase@2.34.3 db status --linked

# Generate types
set SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
npm run types:regen
```

### **Vercel**
```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy from CLI (optional)
vercel

# View deployments
vercel ls
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] GitHub repository created and connected
- [ ] Code pushed to GitHub
- [ ] Supabase project created
- [ ] Supabase project linked locally
- [ ] `.env.local` created with Supabase credentials
- [ ] Local Supabase connection works
- [ ] Vercel project created
- [ ] Vercel connected to GitHub
- [ ] Environment variables added to Vercel
- [ ] First deployment successful
- [ ] Site accessible at Vercel URL

---

## 🚨 Troubleshooting

### **GitHub Connection Issues**
- Verify remote URL: `git remote -v`
- Check SSH keys if using SSH
- Verify repository exists on GitHub

### **Supabase Connection Issues**
- Verify project reference ID
- Check API keys are correct
- Verify `.env.local` exists and has correct values
- Test connection: `npm run dev` → visit test endpoint

### **Vercel Deployment Issues**
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Check for TypeScript errors: `npm run build`
- Verify Next.js version compatibility

---

## 📚 Next Steps

After connecting all services:

1. **Create Database Schema**
   - Follow `docs/digital-builders/LAUNCH_ROADMAP.md` Phase 1
   - Create initial migrations
   - Generate types

2. **Set Up Resend** (Optional)
   - Follow `docs/digital-builders/LAUNCH_ROADMAP.md` Phase 2

3. **Set Up Sentry** (Optional)
   - Follow `docs/digital-builders/LAUNCH_ROADMAP.md` Phase 3

4. **Start Building Features**
   - Character creation
   - Dashboard
   - Game systems

---

**Ready to connect everything? Follow each step above!** 🚀

*Last Updated: December 2025*

