# 🔒 Security Fix - OTP Expiry Configuration

**Date:** December 2025  
**Issue:** OTP expiry was incorrectly set to 1 hour instead of 15 minutes  
**Status:** ✅ Fixed

---

## 🚨 Issue Identified

The Supabase config had a security issue:
- **Comment stated:** "reduced from 1 hour to 15 minutes for security"
- **Actual value:** `3600` seconds (1 hour) ❌
- **Should be:** `900` seconds (15 minutes) ✅

This contradicted the security hardening documented in `AUTH_STRATEGY.md` which established 15-minute OTP expiry as a security improvement.

---

## ✅ Fix Applied

### **Email OTP Expiry**
- **Changed:** `otp_expiry = 3600` → `otp_expiry = 900`
- **Comment updated:** Now accurately reflects 15-minute expiry for security
- **Rationale:** Shorter OTP expiry reduces window of opportunity for unauthorized access

### **Phone OTP Length**
- **Changed:** `otp_length = 8` → `otp_length = 6` (for phone MFA)
- **Rationale:** Phone OTPs typically use 6 digits, email OTPs use 8 characters

---

## 📋 Security Best Practices

According to `docs/AUTH_STRATEGY.md`:
- ✅ **OTP expiry:** 15 minutes (900 seconds) - reduces attack window
- ✅ **Email OTP length:** 8 characters - better entropy
- ✅ **Phone OTP length:** 6 digits - standard for SMS

---

## ✅ Verification

After this fix:
- OTP expiry is set to 15 minutes (900 seconds) ✅
- Comment accurately describes the security configuration ✅
- Configuration aligns with security documentation ✅

---

**Security configuration is now correct!** 🔒

*Last Updated: December 2025*

