-- Create 'tours' table to store base pricing and metadata for unified access
create table if not exists tours (
  slug text primary key,
  title text not null,
  base_price integer not null default 0,
  category text,
  metadata jsonb -- For any extra info
);

-- RLS Policies
alter table tours enable row level security;

-- Allow public read access (so Navbar and API can read)
create policy "Allow public read access" on tours for select using (true);

-- Allow authenticated users (Admin/Scripts) to insert/update/delete
create policy "Allow authenticated upsert" on tours for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on tours for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete" on tours for delete using (auth.role() = 'authenticated');

-- Note: We intentionally avoid FK constraint on 'inventory' for now to prevent blocking migration if there's data mismatch. 
-- Ideally: alter table inventory add constraint fk_tour foreign key (tour_slug) references tours(slug);
