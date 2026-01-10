-- ============================================
-- Phase 3: Remove XP System - Dependency Resolution First
-- Step 1: Create event_pass_view (no XP dependencies)
-- Step 2: Replace builder_cards with non-XP version (temporary compatibility)
-- Step 3: Add missing admin profile update policy
-- Step 4: Drop XP table and columns
-- ============================================
-- Goal: Remove ALL XP references while maintaining compatibility
-- Strategy: Create replacement views FIRST, then drop XP objects

-- ============================================
-- STEP 1: CREATE EVENT_PASS_VIEW (NO XP DEPENDENCIES)
-- ============================================
-- This view replaces builder_cards but without XP fields
-- Used by Event Pass page (Phase 4 wiring)

CREATE OR REPLACE VIEW public.event_pass_view AS
SELECT
  p.id as profile_id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.region,
  COUNT(DISTINCT CASE WHEN t.status = 'checked_in' THEN t.event_id END) as events_attended_count,
  MAX(CASE WHEN t.status = 'checked_in' THEN e.start_at END) as last_event_at
FROM public.profiles p
LEFT JOIN public.tickets t ON t.user_id = p.id
LEFT JOIN public.events e ON e.id = t.event_id
GROUP BY p.id;

COMMENT ON VIEW public.event_pass_view IS 'Event Pass view - displays user identity and attendance history (no XP fields). Replaces builder_cards.';

-- ============================================
-- STEP 2: REPLACE BUILDER_CARDS (TEMPORARY COMPATIBILITY)
-- ============================================
-- Drop and recreate builder_cards with non-XP version to break dependency
-- This allows us to drop xp_transactions safely
-- builder_cards will be fully dropped in Phase 4
-- Note: Must DROP first because column structure is changing

DROP VIEW IF EXISTS public.builder_cards;

CREATE VIEW public.builder_cards AS
SELECT
  p.id as profile_id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.region,
  COUNT(DISTINCT CASE WHEN t.status = 'checked_in' THEN t.event_id END) as events_attended_count,
  MAX(CASE WHEN t.status = 'checked_in' THEN e.start_at END) as last_event_at
FROM public.profiles p
LEFT JOIN public.tickets t ON t.user_id = p.id
LEFT JOIN public.events e ON e.id = t.event_id
GROUP BY p.id;

COMMENT ON VIEW public.builder_cards IS 'Temporary compatibility view - replaced with event_pass_view. Will be dropped in Phase 4.';

-- ============================================
-- STEP 3: ADD MISSING ADMIN PROFILE UPDATE POLICY
-- ============================================
-- Admins should be able to update any profile (for role management, etc.)
-- This policy was missing from Phase 2 migration

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

COMMENT ON POLICY "Admins can update any profile" ON public.profiles IS 'Allows admins to update any user profile (including role changes).';

-- ============================================
-- STEP 4: DROP XP TABLE AND COLUMNS
-- ============================================
-- Now that builder_cards no longer depends on xp_transactions,
-- we can safely drop the XP system

-- Drop RLS policies for xp_transactions (will be CASCADE'd, but explicit for clarity)
DROP POLICY IF EXISTS "Users can view own XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Admins can view all XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Admins can create XP transactions" ON public.xp_transactions;

-- Drop xp_transactions table (CASCADE will handle any remaining dependencies)
DROP TABLE IF EXISTS public.xp_transactions CASCADE;

-- Remove XP-related columns from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS xp_total;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS level;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON VIEW public.event_pass_view IS 'Event Pass view - displays user identity and attendance history (no XP fields). Replaces builder_cards.';
COMMENT ON VIEW public.builder_cards IS 'Temporary compatibility view - replaced with event_pass_view. Will be dropped in Phase 4.';
