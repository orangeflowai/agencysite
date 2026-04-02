-- Run this command in your Supabase SQL Editor to add the missing column for variable pricing
alter table inventory add column if not exists price_override integer;
