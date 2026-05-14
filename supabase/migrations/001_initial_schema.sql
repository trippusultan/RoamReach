-- RoamReach Database Schema
-- Generated for Supabase (PostgreSQL)
-- Run these in Supabase SQL Editor or via migration files

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text unique,
  avatar_url text,
  cover_photo_url text,
  home_city text,
  country_code text default 'US',
  bio text,
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

-- Index for profile lookups
create index idx_profiles_country on public.profiles(country_code);
create index idx_profiles_home_city on public.profiles(home_city);

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'name', new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- PLANS TABLE
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
  host_id text not null references public.profiles(id) on delete cascade,
  is_full bool default false,
  is_hot bool default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for plan queries
create index idx_plans_date on public.plans(date);
create index idx_plans_city on public.plans(city);
create index idx_plans_category on public.plans(category);
create index idx_plans_host on public.plans(host_id);

-- ============================================
-- RLS: Enable Row Level Security
-- ============================================
alter table public.profiles enable row level security;
alter table public.plans enable row level security;

-- Profiles: users can read any profile, edit only their own
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Plans: anyone can read, authenticated users can create/update/delete
create policy "Plans are viewable by everyone"
  on plans for select using (true);

create policy "Authenticated users can create plans"
  on plans for insert with check (auth.uid() = host_id);

create policy "Host can update own plans"
  on plans for update using (auth.uid() = host_id);

create policy "Host can delete own plans"
  on plans for delete using (auth.uid() = host_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update plan full status based on attendee count
create or replace function public.update_plan_fullness()
returns trigger as $$
begin
  new.is_full = array_length(new.attendee_ids, 1) >= new.max_spots;
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-set is_full before insert/update
create trigger update_plan_fullness_trigger
  before insert or update on public.plans
  for each row execute procedure public.update_plan_fullness();

-- Function to increment/decrement attendee count helpers
create or replace function public.join_plan(plan_id text, user_id text)
returns void as $$
begin
  update public.plans
  set attendee_ids = array_append(attendee_ids, user_id)
  where id = plan_id
    and auth.uid() = host_id  -- host can add attendees
    and not (user_id = any(attendee_ids));  -- not already attending
end;
$$ language plpgsql security definer;

create or replace function public.leave_plan(plan_id text, user_id text)
returns void as $$
begin
  update public.plans
  set attendee_ids = array_remove(attendee_ids, user_id)
  where id = plan_id
    and (auth.uid() = host_id or auth.uid() = user_id);
end;
$$ language plpgsql security definer;

-- ============================================
-- SEED DATA (optional — for dev environment)
-- ============================================
-- Replace 'YOUR-USER-ID-HERE' with an actual auth.users id after signup
-- insert into public.profiles (id, name, home_city, country_code, travel_styles)
-- values (
--   '00000000-0000-0000-0000-000000000000',
--   'Alex Mercer',
--   'San Francisco',
--   'US',
--   '["adventure","nightlife"]'
-- );

-- insert into public.plans (id, title, description, category, date, time, meeting_point, city, country_code, max_spots, host_id, attendee_ids)
-- values (
--   'plan-batam-hike',
--   'Batam Island Night Hike',
--   'Explore hidden trails and night markets together.',
--   'outdoors',
--   '2026-05-20',
--   '21:00',
--   'Batam Centre Ferry Terminal',
--   'Batam',
--   'ID',
--   6,
--   '00000000-0000-0000-0000-000000000000',
--   '{}'
-- );

-- insert into public.plans (id, title, description, category, date, time, meeting_point, city, country_code, max_spots, host_id, attendee_ids)
-- values (
--   'plan-rave-bali',
--   'Bali Beach Rave Afterparty',
--   'Sunrise beach party with international DJs.',
--   'nightlife',
--   '2026-05-25',
--   '23:00',
--   'Potato Head Beach Club',
--   'Bali',
--   'ID',
--   12,
--   '00000000-0000-0000-0000-000000000000',
--   '{}'
-- );
