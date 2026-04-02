-- Audit Logs Table
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  user_email text,
  action text not null,
  resource_type text not null,
  resource_id text not null,
  details jsonb default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.audit_logs enable row level security;

-- Policies
create policy "Admins can view audit logs"
  on public.audit_logs for select
  to service_role
  using (true);

create policy "System can insert audit logs"
  on public.audit_logs for insert
  to service_role
  with check (true);

-- Inventory Errors Table (for tracking overbookings)
create table if not exists public.inventory_errors (
  id uuid default gen_random_uuid() primary key,
  tour_slug text not null,
  date text not null,
  time text not null,
  guest_count integer not null,
  error_type text not null,
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.inventory_errors enable row level security;

-- Policies
create policy "Admins can view inventory errors"
  on public.inventory_errors for select
  to service_role
  using (true);

create policy "System can insert inventory errors"
  on public.inventory_errors for insert
  to service_role
  with check (true);
