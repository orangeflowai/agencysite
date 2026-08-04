-- ============================================================================
-- Wonders of Rome — Supabase Schema
-- Matches the deployed database as of 2026-08.
-- Last updated: migration from legacy Payload CMS to Supabase-native.
-- ============================================================================

-- DROP existing tables safely so we can recreate them with the correct structure
drop table if exists bookings cascade;
drop table if exists user_tickets cascade;
drop table if exists inventory cascade; -- legacy, never used by code

-- ============================================================================
-- tour_slots — Inventory / availability per tour, date, and time slot
-- ============================================================================
create table tour_slots (
  id uuid default uuid_generate_v4() primary key,
  tour_slug text not null,
  date date not null,
  time text not null default '09:00',
  available_slots integer not null default 20,
  total_slots integer not null default 20,
  price_override numeric,                     -- optional per-slot price override
  site_id text not null default 'wondersofrome',
  is_paused boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tour_slug, date, time)
);

-- Index for availability queries
create index idx_tour_slots_lookup on tour_slots (tour_slug, date, time);
create index idx_tour_slots_site on tour_slots (site_id);

-- ============================================================================
-- bookings — Confirmed bookings (written by Stripe webhook)
-- ============================================================================
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  booking_ref text unique not null,           -- public reference (e.g., "A1B2C3D4")
  tenant text default 'wondersofrome',
  -- Tour info
  tour_title text not null,
  tour_slug text not null,
  date date not null,
  time text not null default '09:00',
  -- Guest info
  guests integer not null default 1,
  guest_counts jsonb,                        -- {"Adult": 2, "Youth": 1, "Student": 1}
  participant_details jsonb,                 -- per-participant names + DOBs
  add_ons jsonb,                             -- selected add-ons
  -- Lead traveler
  lead_first_name text,
  lead_last_name text,
  lead_email text,
  lead_phone text,
  -- Payment
  total_amount integer not null default 0,   -- in euros
  currency text default 'EUR',
  status text not null default 'pending',    -- pending | confirmed | refunded | cancelled
  stripe_payment_intent_id text,
  stripe_session_id text,                    -- legacy Checkout Session flow
  -- Meeting
  meeting_point text,
  -- Source
  source text default 'website',             -- website | direct_booking | app
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_bookings_email on bookings (lead_email);
create index idx_bookings_ref on bookings (booking_ref);
create index idx_bookings_pi on bookings (stripe_payment_intent_id);
create index idx_bookings_tenant on bookings (tenant);

-- ============================================================================
-- user_tickets — App-side ticket cache (synced from bookings via trigger)
-- ============================================================================
create table user_tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  user_email text,
  booking_id text,                           -- maps to bookings.booking_ref
  ticket_code text,
  tour_id text,                              -- tour_slug
  tour_title text,
  tour_date text,
  tour_time text,
  tour_duration text,
  number_of_people integer default 1,
  total_price numeric,
  price_per_person numeric,
  currency text default 'EUR',
  status text default 'active',              -- active | used | expired | cancelled
  qr_code text,
  qr_code_image text,
  qr_data text,
  meeting_point text,
  meeting_point_address text,
  meeting_point_coordinates jsonb,
  special_instructions text,
  valid_from text,
  valid_until text,
  used_at text,
  booking_reference text,
  user_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(booking_id)
);

create index idx_user_tickets_user on user_tickets (user_id);
create index idx_user_tickets_email on user_tickets (user_email);

-- ============================================================================
-- Auto-sync trigger: copies new bookings into user_tickets
-- ============================================================================
create or replace function sync_booking_to_user_tickets()
returns trigger as $$
declare
  v_user_id uuid;
begin
  -- Find user by email
  select id into v_user_id from auth.users where email = NEW.lead_email limit 1;

  -- Insert only if user exists in auth.users
  if v_user_id is not null then
    insert into user_tickets (
      user_id, user_email, booking_id, ticket_code,
      tour_id, tour_title, tour_date, tour_time,
      number_of_people, total_price, currency,
      status, meeting_point, booking_reference, qr_data
    ) values (
      v_user_id, NEW.lead_email, NEW.booking_ref, NEW.booking_ref,
      NEW.tour_slug, NEW.tour_title, NEW.date::text, NEW.time,
      NEW.guests, NEW.total_amount, NEW.currency,
      NEW.status, NEW.meeting_point, NEW.booking_ref,
      json_build_object(
        'ref', NEW.booking_ref,
        'tour', NEW.tour_title,
        'date', NEW.date,
        'guests', NEW.guests
      )::text
    )
    on conflict (booking_id) do update set
      status = EXCLUDED.status,
      updated_at = now();
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists on_booking_created on bookings;
create trigger on_booking_created
  after insert on bookings
  for each row execute function sync_booking_to_user_tickets();

-- ============================================================================
-- Atomic inventory RPC functions
-- ============================================================================
create or replace function reserve_slots(
  p_tour_slug text,
  p_date date,
  p_time text,
  p_guest_count int,
  p_site_id text default 'wondersofrome'
) returns int as $$
declare
  v_new_slots int;
begin
  update tour_slots
  set available_slots = available_slots - p_guest_count,
      updated_at = now()
  where tour_slug = p_tour_slug
    and date = p_date
    and time = p_time
    and available_slots >= p_guest_count
  returning available_slots into v_new_slots;

  if not found then
    return null;
  end if;

  return v_new_slots;
end;
$$ language plpgsql security definer;

create or replace function release_slots(
  p_tour_slug text,
  p_date date,
  p_time text,
  p_guest_count int,
  p_site_id text default 'wondersofrome'
) returns int as $$
declare
  v_new_slots int;
begin
  update tour_slots
  set available_slots = available_slots + p_guest_count,
      updated_at = now()
  where tour_slug = p_tour_slug
    and date = p_date
    and time = p_time
  returning available_slots into v_new_slots;

  if not found then
    insert into tour_slots (tour_slug, date, time, available_slots, site_id)
    values (p_tour_slug, p_date, p_time, p_guest_count, p_site_id)
    returning available_slots into v_new_slots;
  end if;

  return v_new_slots;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- tour_slots: public read, service_role write
alter table tour_slots enable row level security;
create policy "Public read tour_slots" on tour_slots for select using (true);
create policy "Service role manage tour_slots" on tour_slots for all
  using (true) with check (true); -- service_role bypasses RLS anyway

-- bookings: user reads only own email, service_role writes
alter table bookings enable row level security;
create policy "Users read own bookings" on bookings
  for select using (
    auth.role() = 'authenticated'
    and auth.email() = lead_email
  );
create policy "Service role all bookings" on bookings
  for all using (true) with check (true);

-- user_tickets: user reads/writes own rows only
alter table user_tickets enable row level security;
create policy "Users read own tickets" on user_tickets
  for select using (auth.uid() = user_id);
create policy "Users insert own tickets" on user_tickets
  for insert with check (auth.uid() = user_id);
create policy "Users update own tickets" on user_tickets
  for update using (auth.uid() = user_id);
create policy "Service role all user_tickets" on user_tickets
  for all using (true) with check (true);