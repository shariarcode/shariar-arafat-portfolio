-- Run this SQL in your Supabase SQL Editor (https://app.supabase.com/)
-- Select your project, then go to SQL Editor -> New Query

-- 1. Create the settings table if it doesn't exist
create table if not exists public.settings (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz default now()
);

-- 2. IMPORTANT: If the table already existed, the column 'updated_at' might be missing.
-- This command will add it safely.
alter table public.settings 
add column if not exists updated_at timestamptz default now();

-- 3. Enable Row Level Security (RLS)
alter table public.settings enable row level security;

-- 4. Drop existing policies to ensure we have a clean slate
drop policy if exists "Allow public read access" on public.settings;
drop policy if exists "Allow anonymous upsert access" on public.settings;
drop policy if exists "Allow anonymous update access" on public.settings;
drop policy if exists "Allow anonymous insert access" on public.settings;

-- 5. Create policy to allow ANYONE to read the settings
create policy "Allow public read access"
  on public.settings for select
  using (true);

-- 6. Create policies to allow anonymous INSERT and UPDATE (necessary for UPSERT)
-- Since your app uses a local admin password and the 'anon' key for Supabase,
-- we need to allow 'anon' role to manage the 'settings' table.
create policy "Allow anonymous insert access"
  on public.settings for insert
  to anon
  with check (true);

create policy "Allow anonymous update access"
  on public.settings for update
  to anon
  using (true)
  with check (true);

-- 7. Ensure the 'portfolio' row exists
insert into public.settings (id, content)
values ('portfolio', '{}')
on conflict (id) do nothing;
