# Digital Builders Database Schema Audit

**Audit Date:** December 2025  
**Database:** Supabase PostgreSQL  
**Schema:** public  
**Status:** Ready for Schema Creation

---

## 🎯 Overview

This document is the **single source of truth** for the Digital Builders database schema. 

**⚠️ IMPORTANT:** This file must be updated **before** creating any database migrations. Never alter the database without first updating this audit file.

---

## 📋 Current Status

**Schema Status:** Not yet created

The database schema for Digital Builders will be created in the following phases:

### **Phase 1: Core Tables**
- [ ] `profiles` - User accounts (from Supabase Auth)
- [ ] `game_accounts` - Digital Builders account data
- [ ] `characters` - Player characters

### **Phase 2: Location System**
- [ ] `cities` - City locations
- [ ] `districts` - District locations within cities

### **Phase 3: Game Systems**
- [ ] `jobs` - Available jobs
- [ ] `character_jobs` - Character job assignments with timers
- [ ] `actions` - Available actions
- [ ] `character_actions` - Character action assignments with timers

### **Phase 4: Economy & Progression**
- [ ] `db_cred_balances` - DB Cred currency balances
- [ ] `db_cred_transactions` - DB Cred transaction ledger
- [ ] `interaction_logs` - PVP-lite interaction history

---

## 🔒 Custom Types (Enums)

Will be defined as schema is created. Examples:

```sql
-- Example enums (to be created)
CREATE TYPE public.career_track AS ENUM ('designer', 'developer', 'marketer', 'product', 'other');
CREATE TYPE public.job_status AS ENUM ('available', 'in_progress', 'completed', 'expired');
CREATE TYPE public.action_type AS ENUM ('freelance', 'underbid', 'idea_poach', 'collab_challenge');
```

---

## 📊 Table Details

Tables will be documented here as they are created.

---

## 🔐 Row-Level Security (RLS)

All tables will have RLS enabled with appropriate policies:
- Users can only access their own character data
- Players can view online players in their district
- Players can interact with jobs/actions in their district

---

## 📝 Migration History

Migrations will be tracked here as they are created.

---

## 🚀 Next Steps

1. Create initial migration: `supabase migration new initial_game_schema`
2. Define schema in migration file
3. Update this audit file
4. Run migration: `supabase db push`
5. Generate types: `npm run types:regen`

---

**This file will be updated as the schema is created.**

*Last Updated: December 2025*
