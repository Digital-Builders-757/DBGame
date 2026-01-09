-- ============================================
-- Phase 4: Fix Admin Profile Policy + Drop builder_cards View
-- Step 1: Fix admin profile update policy (add WITH CHECK)
-- Step 2: Drop builder_cards view (no longer needed)
-- ============================================

-- ============================================
-- STEP 1: FIX ADMIN PROFILE UPDATE POLICY
-- ============================================
-- Add WITH CHECK clause to prevent edge cases
-- Both USING and WITH CHECK should check admin role

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

COMMENT ON POLICY "Admins can update any profile" ON public.profiles IS 'Allows admins to update any user profile (including role changes). Includes both USING and WITH CHECK for security.';

-- ============================================
-- STEP 2: DROP BUILDER_CARDS VIEW
-- ============================================
-- builder_cards is no longer needed - event_pass_view replaces it
-- Verify no code references it before dropping:
-- grep -R "builder_cards" -n . (should return zero)

DROP VIEW IF EXISTS public.builder_cards;

COMMENT ON VIEW public.event_pass_view IS 'Event Pass view - displays user identity and attendance history (no XP fields). Replaces builder_cards.';
