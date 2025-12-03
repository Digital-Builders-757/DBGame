# 🚀 Vercel Deployment Checklist

**Date:** December 2025  
**Purpose:** Quick checklist for deploying Digital Builders to Vercel

---

## ✅ Pre-Deployment Checklist

- [x] Build passes locally (`npm run build`)
- [x] GitHub repository connected
- [x] Supabase project created
- [x] Environment variables documented

---

## 🔧 Step 1: Connect GitHub Repository

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository:
   - Find `digital-builders-game` (or your repo name)
   - Click **"Import"**
4. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

---

## 🔑 Step 2: Add Environment Variables

**⚠️ CRITICAL:** Add these BEFORE deploying!

Go to **Settings** → **Environment Variables** and add:

### **Required Variables:**

```
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://hzcpxidgmvsfmmocnasj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=https://hzcpxidgmvsfmmocnasj.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_PROJECT_ID=hzcpxidgmvsfmmocnasj
```

### **Optional Variables (if using Sentry):**

```
SENTRY_DSN_PROD=your_prod_dsn
SENTRY_DSN_DEV=your_dev_dsn
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=digital-builders-frontend
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

### **Optional Variables (if using Resend):**

```
RESEND_API_KEY=re_your_resend_key
```

**Important:** Set each variable for:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

---

## 🚀 Step 3: Deploy

1. Click **"Deploy"** button
2. Monitor build logs
3. Wait for deployment to complete (~2-3 minutes)
4. You'll get a URL like: `digital-builders-game-xxxxx.vercel.app`

---

## ✅ Step 4: Verify Deployment

After deployment, verify:

- [ ] Site loads at Vercel URL
- [ ] No build errors in logs
- [ ] Homepage renders correctly
- [ ] Login page works
- [ ] Supabase connection works (test `/api/admin/test-connection`)

---

## 🔄 Step 5: Update Site URL

After first deployment:

1. Copy your Vercel URL: `https://your-project.vercel.app`
2. Update environment variable:
   - In Vercel: **Settings** → **Environment Variables**
   - Update `NEXT_PUBLIC_SITE_URL` to your Vercel URL
3. Redeploy (or wait for auto-deploy on next push)

---

## 📝 Step 6: Configure Supabase Redirect URLs

1. Go to Supabase Dashboard → **Settings** → **Auth** → **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   https://your-project.vercel.app/**
   https://your-project.vercel.app/auth/callback
   ```
3. Update **Site URL** to: `https://your-project.vercel.app`

---

## 🔄 Auto-Deployment

Once connected, Vercel will automatically:
- ✅ Deploy on every push to `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Run build checks before deploying

---

## 🚨 Troubleshooting

### **Build Fails**

1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check for TypeScript errors

### **Environment Variables Not Working**

1. Verify variables are set for correct environment (Production/Preview/Development)
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### **Supabase Connection Issues**

1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
3. Verify Supabase redirect URLs include your Vercel domain
4. Test connection endpoint: `/api/admin/test-connection`

---

## 📚 Quick Reference

**Your Project ID:** `hzcpxidgmvsfmmocnasj`

**Types Regeneration Command:**
```bash
$env:SUPABASE_PROJECT_ID="hzcpxidgmvsfmmocnasj"; npm run types:regen
```

**Or add to `.env.local`:**
```
SUPABASE_PROJECT_ID=hzcpxidgmvsfmmocnasj
```

---

## ✅ Post-Deployment Checklist

- [ ] Site accessible at Vercel URL
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Supabase connection verified
- [ ] Environment variables working
- [ ] Auto-deployment configured
- [ ] Supabase redirect URLs updated

---

**Ready to deploy? Follow the steps above!** 🚀

*Last Updated: December 2025*

