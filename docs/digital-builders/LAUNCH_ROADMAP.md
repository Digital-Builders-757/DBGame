# 🚀 Digital Builders - Launch Roadmap

**Date:** December 2025  
**Status:** Pre-Launch Setup  
**Purpose:** Complete guide to launching Digital Builders with all services connected

---

## 🎯 Overview

This roadmap covers the complete setup and launch process for Digital Builders, including:
- ✅ Supabase (Database + Auth + Storage + Real-time)
- ✅ Vercel (Hosting + Deployment)
- ✅ Next.js (Frontend Framework)
- ✅ Sentry (Error Tracking & Logging)
- ✅ Resend (Email Service)

---

## 📋 Pre-Launch Checklist

### **Phase 0: Account Setup** (Day 1)

- [ ] **Supabase Account**
  - [ ] Create new Supabase project: `digital-builders`
  - [ ] Note project URL and keys
  - [ ] Set up project region (choose closest to users)

- [ ] **Vercel Account**
  - [ ] Sign up/login at [vercel.com](https://vercel.com)
  - [ ] Connect GitHub repository
  - [ ] Prepare for deployment

- [ ] **Sentry Account**
  - [ ] Sign up/login at [sentry.io](https://sentry.io)
  - [ ] Create organization: `digital-builders` (or use existing)
  - [ ] Create project: `digital-builders-frontend`
  - [ ] Note DSN keys (dev and prod)

- [ ] **Resend Account**
  - [ ] Sign up at [resend.com](https://resend.com)
  - [ ] Verify domain (or use default)
  - [ ] Create API key
  - [ ] Note API key

- [ ] **GitHub Repository**
  - [ ] Create new repo: `digital-builders-game`
  - [ ] Push code to repository
  - [ ] Set up branch protection (optional)

---

## 🔧 Phase 1: Supabase Setup (Day 1-2)

### **1.1 Create Supabase Project**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in details:
   - **Name:** `digital-builders`
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine for MVP
4. Wait for project to initialize (~2 minutes)

### **1.2 Get Supabase Credentials**

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...`
   - **service_role key:** `eyJhbGc...` (⚠️ Keep secret!)
3. Go to **Settings** → **General**
4. Copy **Project Reference ID:** `xxxxx`

### **1.3 Link Local Project**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
npx supabase@2.34.3 login

# Link to your project (replace with your project ref)
npx supabase@2.34.3 link --project-ref YOUR_PROJECT_REF

# Verify connection
npx supabase@2.34.3 projects list
```

### **1.4 Create Database Schema**

```bash
# Create initial migration
npx supabase@2.34.3 migration new initial_game_schema

# Edit the migration file in supabase/migrations/
# Add your game schema (see ARCHITECTURE.md)

# Push migrations to Supabase
npx supabase@2.34.3 db push

# Generate TypeScript types
npm run types:regen
```

### **1.5 Set Up RLS Policies**

- [ ] Create RLS policies for all tables
- [ ] Test policies with different user roles
- [ ] Document policies in `database_schema_audit.md`

### **1.6 Configure Storage Buckets**

1. Go to **Storage** in Supabase dashboard
2. Create buckets:
   - `avatars` (public, authenticated upload)
   - `character-images` (public, authenticated upload)
3. Set up bucket policies

---

## 📧 Phase 2: Resend Setup (Day 1)

### **2.1 Create Resend Account**

1. Go to [resend.com](https://resend.com)
2. Sign up/login
3. Verify email address

### **2.2 Set Up Domain (Optional)**

**Option A: Use Default Domain (Quick Start)**
- Resend provides `onboarding.resend.dev` for testing
- Good for MVP/development

**Option B: Custom Domain (Production)**
1. Go to **Domains** → **Add Domain**
2. Add your domain: `mail.digitalbuilders.com` (or similar)
3. Add DNS records:
   - **SPF:** `v=spf1 include:_spf.resend.com ~all`
   - **DKIM:** (provided by Resend)
   - **DMARC:** `v=DMARC1; p=none;`
4. Wait for verification (~5-10 minutes)

### **2.3 Create API Key**

1. Go to **API Keys**
2. Click **Create API Key**
3. Name: `Digital Builders Production`
4. Permission: **Sending access**
5. Copy the key: `re_xxxxx` (starts with `re_`)

### **2.4 Test Email Sending**

```bash
# Test email sending (create test script)
node scripts/test-resend.js
```

---

## 🐛 Phase 3: Sentry Setup (Day 1)

### **3.1 Create Sentry Project**

1. Go to [sentry.io](https://sentry.io)
2. Create organization: `digital-builders` (or use existing)
3. Create project:
   - **Platform:** Next.js
   - **Name:** `digital-builders-frontend`
   - **Team:** (select or create)

### **3.2 Get Sentry Credentials**

1. Go to **Settings** → **Projects** → `digital-builders-frontend`
2. Go to **Client Keys (DSN)**
3. Copy **DSN:** `https://xxxxx@o4510191.ingest.sentry.io/xxxxx`
4. Go to **Settings** → **Auth Tokens**
5. Create new token:
   - **Scopes:** `project:read`, `project:releases`, `org:read`
   - Copy token: `sntrys_xxxxx`

### **3.3 Update Sentry Configuration**

**Files to update:**
- `sentry.server.config.ts` - Update org/project names
- `sentry.edge.config.ts` - Update DSN
- `next.config.mjs` - Update Sentry config
- `lib/sentry/env.ts` - Update project IDs

**Update `next.config.mjs`:**
```javascript
export default withSentryConfig(nextConfig, {
  org: "your-sentry-org-slug",
  project: "digital-builders-frontend",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // ... rest of config
});
```

### **3.4 Test Sentry Integration**

```bash
# Test Sentry (visit test endpoint)
curl http://localhost:3000/api/test-sentry

# Check Sentry dashboard for error
```

---

## 🚀 Phase 4: Vercel Setup (Day 2)

### **4.1 Connect GitHub Repository**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `digital-builders-game`
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### **4.2 Configure Environment Variables**

In Vercel dashboard, go to **Settings** → **Environment Variables**:

**Add these variables:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_PROJECT_ID=your_project_ref

# Site URL
NEXT_PUBLIC_SITE_URL=https://digitalbuilders.com

# Resend
RESEND_API_KEY=re_your_resend_key

# Sentry
SENTRY_DSN_PROD=https://your_prod_dsn@sentry.io/project_id
SENTRY_DSN_DEV=https://your_dev_dsn@sentry.io/project_id
SENTRY_AUTH_TOKEN=your_sentry_auth_token
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production

# Optional: Admin Email
ADMIN_EMAIL=admin@digitalbuilders.com
```

**Set for all environments:**
- Production
- Preview
- Development

### **4.3 Configure Custom Domain (Optional)**

1. Go to **Settings** → **Domains**
2. Add domain: `digitalbuilders.com`
3. Add DNS records:
   - **A Record:** `76.76.21.21` (Vercel IP)
   - **CNAME:** `cname.vercel-dns.com`
4. Wait for DNS propagation (~5-30 minutes)

### **4.4 Deploy to Production**

1. Push to `main` branch (or trigger deployment)
2. Vercel will automatically build and deploy
3. Monitor build logs
4. Test deployed site

---

## 📝 Phase 5: Local Environment Setup (Day 1)

### **5.1 Create `.env.local` File**

Create `.env.local` in project root:

```env
# ======================================
# Digital Builders - Local Development
# ======================================

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ======================================
# Supabase Configuration
# ======================================
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_PROJECT_ID=your_project_ref

# ======================================
# Resend Email Service
# ======================================
RESEND_API_KEY=re_your_resend_api_key

# ======================================
# Sentry Error Tracking
# ======================================
SENTRY_DSN_DEV=https://your_dev_dsn@sentry.io/project_id
SENTRY_DSN_PROD=https://your_prod_dsn@sentry.io/project_id
SENTRY_AUTH_TOKEN=your_sentry_auth_token
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development

# ======================================
# Optional: Admin Email
# ======================================
ADMIN_EMAIL=admin@digitalbuilders.com
```

### **5.2 Test Local Development**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test Supabase connection
# Visit: http://localhost:3000/api/admin/test-connection

# Test Sentry
# Visit: http://localhost:3000/api/test-sentry

# Test Resend (create test script)
node scripts/test-resend.js
```

---

## ✅ Phase 6: Verification & Testing (Day 2-3)

### **6.1 Supabase Verification**

- [ ] Database connection works
- [ ] Authentication works (signup/login)
- [ ] RLS policies enforced
- [ ] Storage buckets accessible
- [ ] Real-time subscriptions work

### **6.2 Resend Verification**

- [ ] Test email sending
- [ ] Email templates render correctly
- [ ] Domain verified (if custom)
- [ ] Emails deliver successfully

### **6.3 Sentry Verification**

- [ ] Errors captured in Sentry dashboard
- [ ] Source maps uploaded
- [ ] Environment tags correct
- [ ] Performance monitoring active

### **6.4 Vercel Verification**

- [ ] Site deploys successfully
- [ ] Environment variables loaded
- [ ] Build passes
- [ ] Custom domain works (if configured)
- [ ] SSL certificate active

---

## 🎯 Phase 7: Pre-Launch Checklist (Day 3)

### **7.1 Code Quality**

- [ ] All TypeScript errors resolved
- [ ] Linting passes: `npm run lint`
- [ ] Build passes: `npm run build`
- [ ] Schema verified: `npm run schema:verify:comprehensive`
- [ ] Types generated: `npm run types:regen`

### **7.2 Security**

- [ ] RLS policies tested
- [ ] No service keys exposed to client
- [ ] Environment variables secured
- [ ] HTTPS enforced
- [ ] CORS configured correctly

### **7.3 Performance**

- [ ] Page load times acceptable
- [ ] Images optimized
- [ ] Bundle size reasonable
- [ ] Database queries optimized

### **7.4 Monitoring**

- [ ] Sentry error tracking active
- [ ] Vercel analytics enabled
- [ ] Database monitoring active
- [ ] Email delivery monitored

---

## 🚀 Phase 8: Launch (Day 3-4)

### **8.1 Final Pre-Launch**

1. **Deploy to Production**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   # Vercel will auto-deploy
   ```

2. **Verify Production Build**
   - Check Vercel deployment logs
   - Test production URL
   - Verify all services connected

3. **Smoke Tests**
   - [ ] User can sign up
   - [ ] User can log in
   - [ ] Character creation works
   - [ ] Dashboard loads
   - [ ] Emails send successfully
   - [ ] Errors tracked in Sentry

### **8.2 Post-Launch Monitoring**

- [ ] Monitor Sentry for errors (first 24 hours)
- [ ] Check Vercel analytics
- [ ] Monitor Supabase dashboard
- [ ] Check email delivery rates
- [ ] Monitor user signups

---

## 📚 Quick Reference: Service URLs

### **Supabase**
- Dashboard: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`
- API Docs: `https://YOUR_PROJECT_REF.supabase.co`
- Storage: `https://YOUR_PROJECT_REF.supabase.co/storage/v1`

### **Vercel**
- Dashboard: `https://vercel.com/dashboard`
- Project: `https://vercel.com/YOUR_TEAM/digital-builders-game`

### **Sentry**
- Dashboard: `https://sentry.io/organizations/YOUR_ORG/projects/digital-builders-frontend/`
- Issues: `https://sentry.io/organizations/YOUR_ORG/issues/`

### **Resend**
- Dashboard: `https://resend.com/dashboard`
- API Keys: `https://resend.com/api-keys`
- Domains: `https://resend.com/domains`

---

## 🔧 Troubleshooting

### **Supabase Connection Issues**
- Verify project URL and keys
- Check RLS policies
- Verify network connectivity

### **Vercel Deployment Failures**
- Check build logs
- Verify environment variables
- Check Next.js version compatibility

### **Sentry Not Capturing Errors**
- Verify DSN is correct
- Check auth token
- Verify source maps uploaded

### **Resend Email Not Sending**
- Verify API key
- Check domain verification
- Review email logs in Resend dashboard

---

## 📝 Next Steps After Launch

1. **Monitor & Iterate**
   - Watch error rates
   - Monitor user feedback
   - Fix critical bugs

2. **Scale Infrastructure**
   - Upgrade Supabase plan if needed
   - Optimize database queries
   - Add caching where appropriate

3. **Feature Development**
   - Implement game features
   - Add new functionality
   - Improve UX

---

**Ready to launch? Start with Phase 0 and work through each phase systematically!** 🚀

*Last Updated: December 2025*

