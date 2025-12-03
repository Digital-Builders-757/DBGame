# ⚠️ Supabase Config Decision - OTP Expiry

**Date:** December 2025  
**Issue:** Remote project wants `otp_expiry = 3600` (1 hour), but we set `900` (15 minutes) for security

---

## 🔒 Security vs. Remote Sync

### **Current Local Config (Secure)**
- `otp_expiry = 900` (15 minutes)
- **Rationale:** Shorter expiry reduces attack window
- **Matches:** `AUTH_STRATEGY.md` security requirements

### **Remote Project Config (Less Secure)**
- `otp_expiry = 3600` (1 hour)
- **Issue:** Longer expiry increases security risk

---

## ✅ Decision: Keep Secure Setting

**We should keep `otp_expiry = 900` (15 minutes) for security reasons.**

### **Why:**
1. **Security Best Practice:** 15-minute expiry is recommended in security documentation
2. **Attack Window:** Shorter expiry reduces time for unauthorized access
3. **User Experience:** 15 minutes is still reasonable for users to complete verification

### **Action:**
- **Keep local config:** `otp_expiry = 900`
- **Update remote project:** Change Supabase dashboard settings to match
- **Document:** This intentional security hardening

---

## 🎯 How to Update Remote Project

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Find **Email Auth** section
3. Change **OTP Expiry** from `3600` to `900` seconds
4. Save changes
5. Re-link to verify: `npx supabase@2.34.3 link --project-ref YOUR_PROJECT_REF`

---

## 📋 Other Config Differences

These differences are acceptable and match remote:

- ✅ `enable_confirmations`: `true` (matches remote)
- ✅ `max_frequency`: `"1m0s"` (matches remote)
- ✅ `otp_length`: `8` (matches remote)
- ⚠️ `otp_expiry`: `900` (local) vs `3600` (remote) - **Keep secure local setting**

---

**Recommendation:** Update remote project to match secure local config, don't downgrade security.

*Last Updated: December 2025*

