-- ============================================
-- Phase 2: Role System Migration
-- Step 1: Expand role model safely (no behavior loss)
-- Step 2: Data migration (builder -> user, mentor -> client)
-- ============================================
-- Goal: Move from roles {builder, mentor, admin} to {user, client, admin}
-- Strategy: Expand RLS policies FIRST, then migrate data, then update code

-- ============================================
-- STEP 1: EXPAND ROLE MODEL SAFELY
-- ============================================
-- Ensure profiles.role supports 'user' and 'client'
-- Keep 'builder' temporarily during migration (no constraint changes needed for text column)

-- Update default role value to 'user' (new signups get 'user')
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- ============================================
-- STEP 2: UPDATE RLS POLICIES
-- ============================================
-- Update policies to treat 'builder' and 'user' as equivalent DURING migration
-- Introduce 'client' permissions
-- Admin retains full access

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create new policies that treat 'builder' and 'user' as equivalent
-- Users (including transitional 'builder') can update their own profile
-- SECURITY: Role changes are blocked by trigger (see below)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() = id
    AND (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('user', 'builder', 'client', 'admin')
      )
    )
  );

-- Users (including transitional 'builder') can insert their own profile
-- SECURITY: Users can only self-insert role NULL or 'user' (prevents self-assignment of admin/client)
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
-- EVENTS POLICIES
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Published events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Admins and creators can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins and creators can update events" ON public.events;

-- Everyone can read published public events (unchanged)
CREATE POLICY "Published events are viewable by everyone"
  ON public.events FOR SELECT
  USING (is_public = true AND status = 'published');

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

-- Clients and admins can insert events
-- SECURITY: Require role check AND created_by match (removed bypass)
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

-- Clients can update their own events, admins can update any event
CREATE POLICY "Clients and admins can update events"
  ON public.events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
    OR created_by = auth.uid()
  );

-- ============================================
-- TICKETS POLICIES
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can create own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can update own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can update any ticket" ON public.tickets;

-- Users (including transitional 'builder') can see their own tickets
CREATE POLICY "Users can view own tickets"
  ON public.tickets FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('user', 'builder')
      AND auth.uid() = user_id
    )
  );

-- Admins can see all tickets
CREATE POLICY "Admins can view all tickets"
  ON public.tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Clients can view tickets for events they created
CREATE POLICY "Clients can view tickets for their events"
  ON public.tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.profiles p ON p.id = e.created_by
      WHERE e.id = tickets.event_id
      AND p.id = auth.uid()
      AND p.role = 'client'
    )
  );

-- Users (including transitional 'builder') can create their own tickets (RSVP)
CREATE POLICY "Users can create own tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('user', 'builder', 'client', 'admin')
    )
  );

-- Users (including transitional 'builder') can update their own tickets (cancel RSVP)
CREATE POLICY "Users can update own tickets"
  ON public.tickets FOR UPDATE
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('user', 'builder', 'client', 'admin')
    )
  );

-- Admins can update any ticket (check-in)
CREATE POLICY "Admins can update any ticket"
  ON public.tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Clients can check-in tickets for events they created
CREATE POLICY "Clients can check-in tickets for their events"
  ON public.tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.profiles p ON p.id = e.created_by
      WHERE e.id = tickets.event_id
      AND p.id = auth.uid()
      AND p.role = 'client'
    )
  );

-- ============================================
-- XP_TRANSACTIONS POLICIES (will be removed in Phase 3, but update for now)
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Admins can view all XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Admins can create XP transactions" ON public.xp_transactions;

-- Users (including transitional 'builder') can see their own transactions
CREATE POLICY "Users can view own XP transactions"
  ON public.xp_transactions FOR SELECT
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('user', 'builder', 'client', 'admin')
    )
  );

-- Admins can see all transactions
CREATE POLICY "Admins can view all XP transactions"
  ON public.xp_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Only admins can create XP transactions
CREATE POLICY "Admins can create XP transactions"
  ON public.xp_transactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================
-- STEP 3: DATA MIGRATION
-- ============================================
-- Convert all existing 'builder' -> 'user'
-- Convert all existing 'mentor' -> 'client' (mentor = event organizer)
--
-- ⚠️ PRE-MIGRATION CHECK REQUIRED:
-- Run this query BEFORE migration to verify mentor -> client mapping:
--   SELECT COUNT(*) FROM profiles WHERE role = 'mentor';
-- If mentors were NOT event organizers, consider migrating to 'admin' instead.

-- Migrate builder -> user
UPDATE public.profiles SET role = 'user' WHERE role = 'builder';

-- Migrate mentor -> client (mentor = event organizer)
-- NOTE: If mentors were helpers/advisors (not organizers), change to:
--   UPDATE public.profiles SET role = 'admin' WHERE role = 'mentor';
UPDATE public.profiles SET role = 'client' WHERE role = 'mentor';

-- ============================================
-- COMMENTS
-- ============================================

-- ============================================
-- SECURITY: PREVENT ROLE SELF-ASSIGNMENT
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
-- COMMENTS
-- ============================================

COMMENT ON COLUMN public.profiles.role IS 'VIBE user role: user (attendee), client (event organizer), admin (internal team). Migrated from builder/mentor/admin.';
COMMENT ON FUNCTION public.prevent_role_self_assignment() IS 'Prevents users from changing their own role. Only admins can change roles.';
