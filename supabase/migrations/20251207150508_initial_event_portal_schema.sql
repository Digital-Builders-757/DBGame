-- Digital Builders World - v1: Event Portal + Builder Card
-- Initial schema migration
-- Created: December 2025

-- ============================================
-- PROFILES: Builder profiles (one per auth user)
-- ============================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  role text not null default 'builder', -- 'builder' | 'mentor' | 'admin'
  bio text,
  avatar_url text,
  region text, -- "Hampton Roads", "Atlanta", etc.
  xp_total integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Simple updated_at trigger function
create or replace function public.set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for profiles updated_at
drop trigger if exists set_timestamp_on_profiles on public.profiles;
create trigger set_timestamp_on_profiles
before update on public.profiles
for each row
execute procedure public.set_timestamp();

-- ============================================
-- EVENTS: Events people can attend
-- ============================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  subtitle text,
  description text,
  venue_name text,
  venue_address text,
  city text,
  start_at timestamptz not null,
  end_at timestamptz,
  capacity integer,
  is_public boolean not null default true,
  status text not null default 'draft', -- 'draft' | 'published' | 'archived'
  price_cents integer not null default 0, -- 0 = free
  currency char(3) not null default 'USD',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for events updated_at
drop trigger if exists set_timestamp_on_events on public.events;
create trigger set_timestamp_on_events
before update on public.events
for each row
execute procedure public.set_timestamp();

-- ============================================
-- TICKETS: RSVP / attendance records
-- ============================================

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'reserved',
  -- 'reserved' = RSVP'd, 'confirmed' = paid/approved,
  -- 'checked_in' = at the event, 'cancelled', 'refunded'
  checked_in_at timestamptz,
  payment_provider text,     -- 'stripe' | 'cash' | 'free'
  payment_reference text,    -- stripe session id, etc.
  notes text,
  created_at timestamptz not null default now()
);

-- Prevent duplicate tickets per event/user
create unique index if not exists tickets_event_user_unique
on public.tickets (event_id, user_id);

-- ============================================
-- XP_TRANSACTIONS: XP earning log
-- ============================================

create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null,
  -- e.g. 'event_attendance', 'speaking', 'volunteering', 'referral', 'manual'
  source_id uuid, -- optional: event id, ticket id, etc.
  amount integer not null, -- can be negative for corrections
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================
-- BUILDER_CARDS: View for Builder Card display
-- ============================================

create or replace view public.builder_cards as
select
  p.id as profile_id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.region,
  coalesce(sum(x.amount), 0) as xp_total,
  p.level,
  max(case when t.status = 'checked_in' then e.start_at end) as last_event_at
from public.profiles p
left join public.xp_transactions x on x.user_id = p.id
left join public.tickets t on t.user_id = p.id
left join public.events e on e.id = t.event_id
group by p.id;

-- ============================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.tickets enable row level security;
alter table public.xp_transactions enable row level security;

-- PROFILES policies
-- Everyone can read profiles (public directory)
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile (on signup)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Admins can do everything (will be added via role check in app logic)

-- EVENTS policies
-- Everyone can read published public events
create policy "Published events are viewable by everyone"
  on public.events for select
  using (is_public = true and status = 'published');

-- Admins and event creators can insert events
create policy "Admins and creators can insert events"
  on public.events for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'mentor')
    )
    or created_by = auth.uid()
  );

-- Admins and event creators can update events
create policy "Admins and creators can update events"
  on public.events for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
    or created_by = auth.uid()
  );

-- TICKETS policies
-- Users can see their own tickets
create policy "Users can view own tickets"
  on public.tickets for select
  using (auth.uid() = user_id);

-- Admins can see all tickets
create policy "Admins can view all tickets"
  on public.tickets for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Users can create their own tickets (RSVP)
create policy "Users can create own tickets"
  on public.tickets for insert
  with check (auth.uid() = user_id);

-- Users can update their own tickets (cancel RSVP)
create policy "Users can update own tickets"
  on public.tickets for update
  using (auth.uid() = user_id);

-- Admins can update any ticket (check-in)
create policy "Admins can update any ticket"
  on public.tickets for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- XP_TRANSACTIONS policies
-- Users can see their own transactions
create policy "Users can view own XP transactions"
  on public.xp_transactions for select
  using (auth.uid() = user_id);

-- Admins can see all transactions
create policy "Admins can view all XP transactions"
  on public.xp_transactions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Only admins can create XP transactions (admin-only grants in v1)
create policy "Admins can create XP transactions"
  on public.xp_transactions for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================
-- COMMENTS
-- ============================================

comment on table public.profiles is 'Builder profiles - one per auth user';
comment on table public.events is 'Events people can attend';
comment on table public.tickets is 'RSVP / attendance records';
comment on table public.xp_transactions is 'XP earning log - admin-only grants in v1';
comment on view public.builder_cards is 'View for Builder Card display';

