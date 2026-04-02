-- DROP existing tables safely so we can recreate them with the correct structure
drop table if exists bookings cascade;
drop table if exists inventory cascade;

-- Create a table for Inventory
-- This tracks availability for each tour on a specific date AND time
create table inventory (
  id uuid default uuid_generate_v4() primary key,
  tour_slug text not null, 
  date date not null,
  time text not null default '09:00', -- Added Time Slot (e.g., '10:00', '14:30')
  available_slots integer not null default 0,
  price_override integer, -- Optional price override for this specific slot
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tour_slug, date, time) -- Prevent duplicate entries for the same tour/date/time
);

-- Create a table for Bookings
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  tour_slug text not null, 
  tour_title text not null, 
  date date not null,
  time text not null default '09:00', -- Added Booked Time
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  guests integer not null, 
  total_price integer not null, 
  status text not null default 'pending', 
  stripe_session_id text,
  guest_details jsonb, 
  adults integer default 0,
  youths integer default 0,
  students integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table inventory enable row level security;
alter table bookings enable row level security;

-- Policies
create policy "Enable read access for all users" on inventory for select using (true);
create policy "Enable insert for authenticated users only" on inventory for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on inventory for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on inventory for delete using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users only" on bookings for select using (auth.role() = 'authenticated');
