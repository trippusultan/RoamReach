-- RoamReach Seed Data
-- For development and testing environments
-- Run after migrations: python scripts/auto/run_migrations.py all
-- Then: psql $DATABASE_URL -f supabase/seed/01_data.sql

-- ============================================
-- SEED USERS (profiles only — auth.users created separately)
-- These IDs must match auth.users.id created via signup or admin API
-- ============================================

-- Note: In production, profiles are auto-created on signup.
-- Below are placeholder UUIDs — replace with real user IDs after signup.

-- insert into public.profiles (id, name, home_city, country_code, travel_styles, countries_visited, travelling_months, reputation_score, total_ratings, is_verified)
-- values
--   ('11111111-1111-1111-1111-111111111111', 'Alex Mercer', 'San Francisco', 'US', '["adventure","nightlife","photography"]', 12, 8, 4.8, 24, true),
--   ('22222222-2222-2222-2222-222222222222', 'Sarah Chen', 'Tokyo', 'JP', '["food","culture","urban"]', 18, 12, 4.9, 41, true),
--   ('33333333-3333-3333-3333-333333333333', 'Marco Rossi', 'Rome', 'IT', '["history","architecture","food"]', 22, 15, 4.7, 33, true);

-- ============================================
-- SEED PLANS
-- ============================================

insert into public.plans (id, title, description, category, date, time, meeting_point, city, country_code, max_spots, host_id, attendee_ids)
values
  (
    'plan-batam-hike',
    'Batam Island Night Hike',
    'Explore hidden trails and local night markets together. Sunset ferry from Singapore, then off the beaten path.',
    'outdoors',
    '2026-05-20',
    '21:00',
    'Batam Centre Ferry Terminal (Hours Ferry)',
    'Batam',
    'ID',
    6,
    '11111111-1111-1111-1111-111111111111',
    '{}'  -- no attendees yet
  ),
  (
    'plan-bali-beach-rave',
    'Bali Beach Rave Afterparty',
    'Sunrise beach party with international DJs. Pre-party pool hangout at 23:00, beach at 05:00.',
    'nightlife',
    '2026-05-25',
    '23:00',
    'Potato Head Beach Club, Seminyak',
    'Bali',
    'ID',
    12,
    '11111111-1111-1111-1111-111111111111',
    '{}'
  ),
  (
    'plan-kyoto-temples',
    'Kyoto Temple Hopping & Tea',
    'Morning visit to Fushimi Inari secret path, then traditional tea ceremony in Gion.',
    'culture',
    '2026-06-05',
    '08:00',
    'Inari Station Exit 1',
    'Kyoto',
    'JP',
    4,
    '22222222-2222-2222-2222-222222222222',
    '{}'
  ),
  (
    'plan-rome-street-food',
    'Rome Street Food Crawl',
    '3-hour walking tour through Trastevere and Testaccio tasting authentic Roman street food.',
    'food',
    '2026-06-12',
    '19:30',
    'Piazza di Santa Maria in Trastevere',
    'Rome',
    'IT',
    8,
    '33333333-3333-3333-3333-333333333333',
    '{}'
  );
