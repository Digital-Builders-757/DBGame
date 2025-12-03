# 🔐 Digital Builders - Environment Setup Guide

**Last Updated:** December 2025  
**Purpose:** Complete guide to setting up environment variables for Digital Builders

---

## 📋 Quick Setup

### **Step 1: Copy Template**

```bash
# Copy the example file
cp .env.local.example .env.local
```

### **Step 2: Fill in Your Values**

Edit `.env.local` and replace all `YOUR_*` placeholders with actual values from each service.

---

## 🔑 Getting Your Credentials

### **1. Supabase Credentials**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...`
   - **service_role key:** `eyJhbGc...` (⚠️ Keep secret!)
5. Go to **Settings** → **General**
6. Copy **Project Reference ID:** `xxxxx`

**Add to `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_PROJECT_ID=xxxxx
```

### **2. Resend API Key**

1. Go to [resend.com](https://resend.com)
2. Sign up/login
3. Go to **API Keys**
4. Click **Create API Key**
5. Name: `Digital Builders Development`
6. Copy key: `re_xxxxx`

**Add to `.env.local`:**
```env
RESEND_API_KEY=re_xxxxx
```

### **3. Sentry Credentials**

1. Go to [sentry.io](https://sentry.io)
2. Create organization (or use existing)
3. Create project: `digital-builders-frontend`
4. Go to **Settings** → **Projects** → `digital-builders-frontend`
5. Go to **Client Keys (DSN)**
6. Copy **DSN:** `https://xxxxx@o4510191.ingest.sentry.io/xxxxx`
7. Go to **Settings** → **Auth Tokens**
8. Create token with scopes: `project:read`, `project:releases`, `org:read`
9. Copy token: `sntrys_xxxxx`

**Add to `.env.local`:**
```env
SENTRY_DSN_DEV=https://xxxxx@o4510191.ingest.sentry.io/xxxxx
SENTRY_DSN_PROD=https://xxxxx@o4510191.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntrys_xxxxx
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=digital-builders-frontend
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

---

## ✅ Verification

### **Test Supabase Connection**

```bash
# Start dev server
npm run dev

# Visit test endpoint
curl http://localhost:3000/api/admin/test-connection
```

### **Test Sentry**

```bash
# Visit test endpoint
curl http://localhost:3000/api/test-sentry

# Check Sentry dashboard for error
```

### **Test Resend**

Create `scripts/test-resend.js`:
```javascript
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'your-email@example.com',
      subject: 'Test Email',
      html: '<p>Test email from Digital Builders!</p>',
    });

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Email sent successfully:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

testEmail();
```

Run:
```bash
node scripts/test-resend.js
```

---

## 🚨 Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Never expose service keys** - Keep `SUPABASE_SERVICE_ROLE_KEY` secret
3. **Use different keys for dev/prod** - Separate environments
4. **Rotate keys regularly** - Especially if exposed

---

## 📚 Related Documentation

- **Launch Roadmap:** `docs/digital-builders/LAUNCH_ROADMAP.md`
- **Supabase Setup:** See Phase 1 in Launch Roadmap
- **Resend Setup:** See Phase 2 in Launch Roadmap
- **Sentry Setup:** See Phase 3 in Launch Roadmap

---

*Last Updated: December 2025*

