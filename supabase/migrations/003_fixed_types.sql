-- RoamReach Database Schema — v3 Clean Slate
-- Drops and recreates profiles and plans with correct types
-- SAFE for development (destroys existing dev data)

-- ============================================
-- 1. Drop existing objects (clean slate)
-- ============================================

-- Drop trigger first (depends on function)
drop trigger if exists on_auth_user_created on auth.users;

-- Drop helper functions
drop function if exists public.join_plan(text, uuid);
drop function if exists public.leave_plan(text, uuid);
drop function if exists public.update_plan_fullness();
drop function if exists public.handle_new_user();

-- Drop tables (cascade will drop plans due to FK, but explicit)
drop table if exists public.plans cascade;
drop table if exists public.profiles cascade;

-- ============================================
-- 2. PROFILES TABLE (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  home_city text,
  country_code text default 'US',
  bio text,
  cover_photo_url text,
  travel_styles text[] default '{}',
  countries_visited int default 0,
  travelling_months int default 0,
  reputation_score int default 0,
  total_ratings int default 0,
  is_verified bool default false,
  journey_images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index idx_profiles_home_city on public.profiles(home_city);
create index idx_profiles_country on public.profiles(country_code);
create index idx_profiles_reputation on public.profiles(reputation_score desc);

-- ============================================
-- 3. PLANS TABLE — host_id UUID matches profiles.id
-- ============================================
create table public.plans (
  id text primary key,
  title text not null,
  description text,
  category text not null,
  date text not null,
  time text not null,
  meeting_point text not null,
  city text not null,
  country_code text not null default 'US',
  max_spots int not null,
  attendee_ids text[] default '{}',
  host_id uuid not null references public.profiles(id) on delete cascade,
  is_full bool default false,
  is_hot bool default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index idx_plans_date on public.plans(date);
create index idx_plans_city on public.plans(city);
create index idx_plans_category on public.plans(category);
create index idx_plans_host on public.plans(host_id);
create index idx_plans_is_full on public.plans(is_full) where is_full = false;

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.plans enable row level security;

-- Profiles policies
create policy "Public profiles viewable" on profiles for select using (true);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Plans policies
create policy "Plans viewable by all" on plans for select using (true);
create policy "Authenticated users create plans" on plans for insert with check (auth.uid() = host_id);
create policy "Host update own plans" on plans for update using (auth.uid() = host_id);
create policy "Host delete own plans" on plans for delete using (auth.uid() = host_id);

-- ============================================
-- 5. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'name', new.email, new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    avatar_url = excluded.avatar_url;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 6. AUTO-UPDATE is_full
-- ============================================
create or replace function public.update_plan_fullness()
returns trigger as $$
begin
  new.is_full = array_length(new.attendee_ids, 1) >= new.max_spots;
  return new;
end;
$$ language plpgsql;

create trigger update_plan_fullness_trigger
  before insert or update on public.plans
  for each row execute procedure public.update_plan_fullness();

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================
create or replace function public.join_plan(plan_id text, user_id uuid)
returns void as $$
begin
  update public.plans
  set attendee_ids = array_append(attendee_ids, user_id)
  where id = plan_id and auth.uid() = host_id and not (user_id = any(attendee_ids));
end;
$$ language plpgsql security definer;

create or replace function public.leave_plan(plan_id text, user_id uuid)
returns void as $$
begin
  update public.plans
  set attendee_ids = array_remove(attendee_ids, user_id)
  where id = plan_id and (auth.uid() = host_id or auth.uid() = user_id);
end;
$$ language plpgsql security definer;
