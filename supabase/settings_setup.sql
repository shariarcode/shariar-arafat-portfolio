-- Run this SQL in your Supabase SQL Editor (https://app.supabase.com/)
-- Select your project, then go to SQL Editor -> New Query

-- 1. Create the settings table if it doesn't exist
create table if not exists public.settings (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.settings enable row level security;

-- 3. Drop existing policies if they exist (to avoid errors on re-run)
drop policy if exists "Allow public read access" on public.settings;
drop policy if exists "Allow anonymous upsert access" on public.settings;

-- 4. Create policy to allow ANYONE to read the settings
-- This is necessary for visitors to see your portfolio content
create policy "Allow public read access"
  on public.settings for select
  using (true);

-- 5. Create policy to allow anonymous UPSERT access
-- Since your app uses a local admin password and the 'anon' key for Supabase,
-- we need to allow 'anon' role to insert/update the 'settings' table.
-- Security Note: This is required for the current architecture to work.
create policy "Allow anonymous upsert access"
  on public.settings for all
  to anon
  using (true)
  with check (true);

-- 6. Insert default content if the table is empty (Optional but recommended)
-- Note: The 'portfolio' ID is what the app looks for.
insert into public.settings (id, content)
values ('portfolio', '{}')
on conflict (id) do nothing;
