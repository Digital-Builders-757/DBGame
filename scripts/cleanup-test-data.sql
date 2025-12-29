-- Clean up test data from Digital Builders database
-- This script removes test users, events, tickets, and related data

-- Delete tickets first (due to foreign key constraints)
DELETE FROM tickets WHERE id IN (
  SELECT t.id FROM tickets t
  JOIN events e ON t.event_id = e.id
  WHERE e.title LIKE '%test%' OR e.title LIKE '%Test%'
);

-- Delete xp_transactions for test users
DELETE FROM xp_transactions WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email LIKE '%test%' OR email LIKE '%@example.com'
);

-- Delete tickets for test users
DELETE FROM tickets WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email LIKE '%test%' OR email LIKE '%@example.com'
);

-- Delete events (test events)
DELETE FROM events WHERE title LIKE '%test%' OR title LIKE '%Test%';

-- Delete profiles for test users
DELETE FROM profiles 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email LIKE '%test%' OR email LIKE '%@example.com'
);

-- Show remaining data counts
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL  
SELECT 'tickets', COUNT(*) FROM tickets
UNION ALL
SELECT 'xp_transactions', COUNT(*) FROM xp_transactions;
