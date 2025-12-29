# 🚀 Digital Builders - Setup Checklist

**Follow these steps in order to connect everything:**

---

## ✅ Step 1: Commit Current Changes

```bash
# Stage all changes
git add .

# Commit
git commit -m "feat: Digital Builders project setup - brand guide, types cleanup, docs"

# Push to current repo
git push origin main
```

---

## ✅ Step 2: Create New GitHub Repository (or use existing)

**Option A: Create New Repo**
1. Go to [github.com/new](https://github.com/new)
2. Name: `digital-builders-game`
3. Description: "Text-based MMO for the creative tech community"
4. **Don't** initialize with README
5. Click "Create repository"

**Option B: Use Existing Repo**
- Current repo: `Digital-Builders-757/DBGame` ✅
- Remote is already configured!

**Verify Remote:**
```bash
git remote -v
# Should show: https://github.com/Digital-Builders-757/DBGame.git
```

---

## ✅ Step 3: Supabase Setup

### 3.1 Create Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name:** `digital-builders`
   - **Database Password:** (create strong password - save it!)
   - **Region:** Choose closest
4. Click **"Create new project"**
5. Wait ~2 minutes for initialization

### 3.2 Get Credentials
1. **Settings** → **API**
   - Copy **Project URL:** `https://xxxxx.supabase.co`
   - Copy **anon public key:** `eyJhbGc...`
   - Copy **service_role key:** `eyJhbGc...` ⚠️ Keep secret!

2. **Settings** → **General**
   - Copy **Project Reference ID:** `xxxxx`

### 3.3 Create `.env.local`
Create file `.env.local` in project root:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
```

**Replace all `YOUR_PROJECT_REF` and `your_*_key_here` with actual values!**

### 3.4 Link Supabase CLI
```bash
# Login
npx supabase@2.34.3 login

# Link project (replace YOUR_PROJECT_REF)
npx supabase@2.34.3 link --project-ref YOUR_PROJECT_REF

# Verify
npx supabase@2.34.3 projects list
```

### 3.5 Test Connection
```bash
npm run dev
# Visit: http://localhost:3000
# Should load without errors
```

---

## ✅ Step 4: Vercel Setup

### 4.1 Connect Repository
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import `digital-builders-game` project
4. Click **"Import"**

### 4.2 Configure Project
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 4.3 Add Environment Variables
Before deploying, go to **Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
```

**Set for:** Production, Preview, Development

### 4.4 Deploy
1. Click **"Deploy"**
2. Wait for build to complete
3. Get your URL: `digital-builders-game.vercel.app`

### 4.5 Update Site URL
After first deployment:
1. Copy your Vercel URL
2. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables
3. Redeploy

---

## ✅ Step 5: Verify Everything Works

### GitHub
```bash
git remote -v  # Should show your repo
git push origin main  # Should work
```

### Supabase
```bash
npx supabase@2.34.3 projects list  # Should show your project
npm run dev  # Should connect to Supabase
```

### Vercel
- Visit your Vercel URL
- Site should load
- No build errors

---

## 🎯 Next Steps

After everything is connected:
1. ✅ Create database schema (see `docs/digital-builders/LAUNCH_ROADMAP.md`)
2. ✅ Set up Resend (optional - see Launch Roadmap)
3. ✅ Set up Sentry (optional - see Launch Roadmap)
4. 🚀 Start building features!

---

**Need help? Check `docs/digital-builders/TECH_STACK_SETUP.md` for detailed instructions.**

