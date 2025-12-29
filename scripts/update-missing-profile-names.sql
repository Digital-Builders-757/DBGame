-- Script: Update Missing Profile Display Names
-- Date: 2025-12-XX
-- Description: Updates existing profiles that have empty or NULL display_name fields
-- Usage: Run this in Supabase SQL Editor or via psql
-- Digital Builders: profiles table has username, display_name (not first_name/last_name)

-- Step 1: Identify profiles with missing display_name data
-- This query shows all profiles that need name updates
SELECT 
  p.id,
  p.username,
  p.display_name,
  u.email,
  CASE 
    WHEN p.display_name IS NULL OR p.display_name = '' THEN 'Missing display_name'
    WHEN p.username IS NULL OR p.username = '' THEN 'Missing username'
    ELSE 'Both missing'
  END as issue
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.display_name IS NULL 
   OR p.display_name = '' 
   OR (p.username IS NULL OR p.username = '');

-- Step 2: Update profiles with missing display_name
-- This will set display_name based on username or email
UPDATE profiles 
SET display_name = COALESCE(
  NULLIF(TRIM(username), ''),
  SPLIT_PART(auth.users.email, '@', 1),
  'Builder'
)
FROM auth.users
WHERE profiles.id = auth.users.id
  AND (profiles.display_name IS NULL OR profiles.display_name = '');

-- Step 3: Update profiles with missing username
-- This will set username based on display_name or email
UPDATE profiles 
SET username = COALESCE(
  NULLIF(TRIM(LOWER(REPLACE(display_name, ' ', '_'))), ''),
  LOWER(SPLIT_PART(auth.users.email, '@', 1)),
  'builder_' || SUBSTRING(auth.users.id::text, 1, 8)
)
FROM auth.users
WHERE profiles.id = auth.users.id
  AND (profiles.username IS NULL OR profiles.username = '');

-- Step 4: Verify the updates
-- Check that all profiles now have name data
SELECT 
  p.id,
  p.username,
  p.display_name,
  u.email,
  CASE 
    WHEN p.display_name IS NULL OR p.display_name = '' THEN 'Still missing display_name'
    WHEN p.username IS NULL OR p.username = '' THEN 'Still missing username'
    ELSE 'Names complete'
  END as status
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY status;

-- Step 5: Final verification
-- Show the final state of all profiles
SELECT 
  p.id,
  p.username,
  p.display_name,
  p.role,
  u.email,
  p.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.display_name, p.username;
