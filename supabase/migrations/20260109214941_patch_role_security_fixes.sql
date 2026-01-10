-- ============================================
-- Phase 2 Security Patches
-- Fixes security holes in role system migration
-- ============================================

-- ============================================
-- FIX 1: PREVENT ROLE SELF-ASSIGNMENT ON INSERT
-- ============================================
-- Users can only self-insert role NULL or 'user'
-- Prevents self-assignment of admin/client roles

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id
    AND (
      role IS NULL
      OR role = 'user'
      OR role = 'builder'  -- Transitional support during migration
    )
  );

-- ============================================
-- FIX 2: PREVENT ROLE SELF-ASSIGNMENT ON UPDATE
-- ============================================
-- Trigger function to prevent users from changing their own role
-- Only admins (via service role or admin UI) can change roles

CREATE OR REPLACE FUNCTION public.prevent_role_self_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- If role is being changed
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Check if user is trying to change their own role
    IF auth.uid() = NEW.id THEN
      -- Allow if changing from 'builder' to 'user' (migration case)
      IF OLD.role = 'builder' AND NEW.role = 'user' THEN
        RETURN NEW;
      END IF;
      
      -- Allow if changing from 'mentor' to 'client' (migration case)
      IF OLD.role = 'mentor' AND NEW.role = 'client' THEN
        RETURN NEW;
      END IF;
      
      -- Block all other role changes by users
      RAISE EXCEPTION 'Users cannot change their own role. Role changes must be done by an admin.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS prevent_role_self_assignment_trigger ON public.profiles;
CREATE TRIGGER prevent_role_self_assignment_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_assignment();

-- ============================================
-- FIX 3: FIX EVENTS INSERT POLICY BYPASS
-- ============================================
-- Remove OR that allows created_by=auth.uid() to bypass role checks
-- Require (role in admin/client) AND created_by=auth.uid()

DROP POLICY IF EXISTS "Clients and admins can insert events" ON public.events;

CREATE POLICY "Clients and admins can insert events"
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'client')
    )
    AND created_by = auth.uid()
  );

-- ============================================
-- FIX 4: ADD EVENTS SELECT POLICIES
-- ============================================
-- Clients can see their own events (including drafts)
-- Admins can see all events
-- Public events remain visible to all
-- NOTE: These policies already exist from migrate_role_system.sql, so we drop and recreate them

-- Drop existing policies if they exist (from previous migration)
DROP POLICY IF EXISTS "Clients can view own events" ON public.events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;

-- Clients can view their own events (including drafts)
CREATE POLICY "Clients can view own events"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'client'
    )
    AND created_by = auth.uid()
  );

-- Admins can view all events
CREATE POLICY "Admins can view all events"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON FUNCTION public.prevent_role_self_assignment() IS 'Prevents users from changing their own role. Only admins can change roles.';
