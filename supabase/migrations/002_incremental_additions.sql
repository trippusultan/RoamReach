-- RoamReach Incremental Migration — v2
-- Idempotent: safe to run on any DB state
-- Handles partially-created tables by adding missing columns

-- ============================================
-- 1. Ensure PLANS table exists with correct schema
-- ============================================

-- If table doesn't exist, create it fresh
create table if not exists public.plans (
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

-- If table already exists, add any missing columns (safe, no-op if present)
alter table public.plans 
  add column if not exists title text not null default 'Untitled',
  add column if not exists description text,
  add column if not exists category text not null default 'general',
  add column if not exists date text not null default '2026-01-01',
  add column if not exists time text not null default '00:00',
  add column if not exists meeting_point text not null default 'TBD',
  add column if not exists city text not null default 'Unknown',
  add column if not exists country_code text not null default 'US',
  add column if not exists max_spots int not null default 10,
  add column if not exists attendee_ids text[] default '{}',
  add column if not exists host_id text references public.profiles(id) on delete cascade,
  add column if not exists is_full bool default false,
  add column if not exists is_hot bool default false,
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Indexes (create if not exists)
create index if not exists idx_plans_date on public.plans(date);
create index if not exists idx_plans_city on public.plans(city);
create index if not exists idx_plans_category on public.plans(category);
create index if not exists idx_plans_host on public.plans(host_id);

-- ============================================
-- 2. RLS on plans
-- ============================================
alter table public.plans enable row level security;

drop policy if exists "Plans are viewable by everyone" on public.plans;
drop policy if exists "Authenticated users can create plans" on public.plans;
drop policy if exists "Host can update own plans" on public.plans;
drop policy if exists "Host can delete own plans" on public.plans;

create policy "Plans are viewable by everyone"
  on public.plans for select using (true);

create policy "Authenticated users can create plans"
  on public.plans for insert with check (auth.uid() = host_id);

create policy "Host can update own plans"
  on public.plans for update using (auth.uid() = host_id);

create policy "Host can delete own plans"
  on public.plans for delete using (auth.uid() = host_id);

-- ============================================
-- 3. PROFILES table enhancements (add missing columns)
-- ============================================
alter table public.profiles 
  add column if not exists cover_photo_url text,
  add column if not exists bio text,
  add column if not exists travel_styles text[] default '{}',
  add column if not exists countries_visited int default 0,
  add column if not exists travelling_months int default 0,
  add column if not exists reputation_score int default 0,
  add column if not exists total_ratings int default 0,
  add column if not exists is_verified bool default false,
  add column if not exists journey_images text[] default '{}',
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Policies (recreate to ensure they exist)
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- ============================================
-- 4. TRIGGER: Auto-create profile on signup (recreate)
-- ============================================
drop function if exists public.handle_new_user();
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================
drop function if exists public.join_plan(text, text);
create or replace function public.join_plan(plan_id text, user_id text)
returns void as $$
begin
  update public.plans
  set attendee_ids = array_append(attendee_ids, user_id)
  where id = plan_id
    and auth.uid() = host_id
    and not (user_id = any(attendee_ids));
end;
$$ language plpgsql security definer;

drop function if exists public.leave_plan(text, text);
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
-- 6. Auto-update is_full trigger (recreate)
-- ============================================
drop function if exists public.update_plan_fullness();
create or replace function public.update_plan_fullness()
returns trigger as $$
begin
  new.is_full = array_length(new.attendee_ids, 1) >= new.max_spots;
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_plan_fullness_trigger on public.plans;
create trigger update_plan_fullness_trigger
  before insert or update on public.plans
  for each row execute procedure public.update_plan_fullness();
