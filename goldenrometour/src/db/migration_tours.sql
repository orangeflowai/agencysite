-- goldenrometour: editable tours table (2 products)
-- Drop any stale/incorrectly-schema'd tours table first so this recreates it cleanly.
drop table if exists tours cascade;

create table tours (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  tour_type text,
  price integer not null default 0,
  duration text,
  description text,
  highlights jsonb not null default '[]',
  includes jsonb not null default '[]',
  excludes jsonb not null default '[]',
  meeting_point text,
  important_info jsonb not null default '[]',
  image_url text,
  badge text,
  rating numeric,
  reviews integer not null default 0,
  group_size text,
  category text not null default 'vatican',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table tours enable row level security;
create policy "public read tours" on tours for select using (true);

insert into tours (slug, title, tour_type, price, duration, description, highlights, includes, excludes, meeting_point, important_info, image_url, badge, rating, reviews, group_size, category, sort_order) values
(
  'vatican-museums-sistine-chapel-skip-the-line',
  'Vatican Museums & Sistine Chapel Skip-the-Line Tour',
  'Skip-the-Line',
  45,
  'Flexible',
  'Bypass the crowds and maximize your time inside one of the world''s most incredible art collections. This fast-track entry ticket lets you skip the notorious Vatican queues, giving you the freedom to explore at your own pace.',
  '["Fast-Track Access — priority entry into Vatican Museums and Sistine Chapel","Independent Exploration — explore at your own pace","Michelangelo''s Masterpieces — stand beneath the Sistine Chapel frescoes","Self-Guided Map — navigate with a complimentary Vatican map"]',
  '["Priority Skip-the-Line Entry Ticket","Instant mobile voucher delivery","Detailed map of the Vatican Museums","All reservation and service fees"]',
  '["Hotel pick-up and drop-off","Gratuities","Food and beverages"]',
  'Via Germanico, 40, 00192 Roma, RM, Italy',
  '["Availability: Monday – Saturday (closed Sundays)","Duration: Flexible — spend as long as you like","Security screening is mandatory at the Vatican","Dress code: shoulders and knees must be covered","Photography prohibited inside the Sistine Chapel"]',
  '/vatican-skip-line.jpg',
  'Popular',
  4.7,
  1850,
  'Self-Guided',
  'vatican',
  1
),
(
  'vatican-museums-and-sistine-chapel-guided-tour',
  'Vatican Museums & Sistine Chapel Guided Tour',
  'Guided Tour',
  65,
  '3 Hours',
  'Bring history to life with an expert guide on this comprehensive tour of the Vatican Museums and Sistine Chapel. Bypass the crowds with exclusive skip-the-line access and explore the world''s largest collection of Renaissance masterpieces.',
  '["Exclusive Skip-the-Line Entry — save hours of waiting","Expert Storytelling — history, secrets, and context from a professional guide","Michelangelo, Raphael, and Bernini up close","Comprehensive route: Raphael''s Rooms, Gallery of Maps, Pinecone Courtyard","Small group — capped for a personal experience"]',
  '["Guided tour of Vatican Museums","Guided tour of the Sistine Chapel","Fast-track skip-the-line entry","Professional expert tour guide"]',
  '["Guided tour inside St. Peter''s Basilica","Hotel pick-up and drop-off","Gratuities","Food and beverages"]',
  'Via Germanico, 40, 00192 Roma, RM, Italy',
  '["Availability: Monday – Saturday (closed Sundays)","Arrive 25 minutes before your scheduled start time","Security screening is mandatory at the Vatican","Dress code: shoulders and knees must be covered","Large bags and sharp objects are not allowed","Photography prohibited inside the Sistine Chapel"]',
  '/vatican-guided-tour.jpg',
  'Best Seller',
  4.8,
  2850,
  'Up to 24 participants',
  'vatican',
  2
)
on conflict (slug) do nothing;
