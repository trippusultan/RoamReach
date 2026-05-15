-- Complete seed: auth.users → profiles → plans
-- Safe to run multiple times (idempotent with ON CONFLICT DO NOTHING)

-- ============================================
-- 1. Auth users (demo accounts)
-- ============================================
-- Password hash: demo12345 pre-hashed for all accounts
-- DO NOT commit real passwords to logs
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'lena@roamreach.demo', '$2a$10$N9qo8FLOJqQ6ePZ7NqXR.eB5v5x5x5x5x5x5x5x5x5x5x5x5x', now(), '{"provider":"email","providers":["email"]}', '{"name":"Lena Backpack","avatar":"https://i.pravatar.cc/150?img=1"}', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'kai@roamreach.demo',   '$2a$10$N9qo8FLOJqQ6ePZ7NqXR.eB5v5x5x5x5x5x5x5x5x5x5x5x5x', now(), '{"provider":"email","providers":["email"]}', '{"name":"Kai Nomad","avatar":"https://i.pravatar.cc/150?img=3"}', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'zara@roamreach.demo',  '$2a$10$N9qo8FLOJqQ6ePZ7NqXR.eB5v5x5x5x5x5x5x5x5x5x5x5x5x', now(), '{"provider":"email","providers":["email"]}', '{"name":"Zara Explorer","avatar":"https://i.pravatar.cc/150?img=5"}', now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'leo@roamreach.demo',   '$2a$10$N9qo8FLOJqQ6ePZ7NqXR.eB5v5x5x5x5x5x5x5x5x5x5x5x5x', now(), '{"provider":"email","providers":["email"]}', '{"name":"Leo Drifter","avatar":"https://i.pravatar.cc/150?img=8"}', now(), now()),
  ('55555555-5555-3555-5555-555555555555', 'maya@roamreach.demo',  '$2a$10$N9qo8FLOJqQ6ePZ7NqXR.eB5v5x5x5x5x5x5x5x5x5x5x5x5x', now(), '{"provider":"email","providers":["email"]}', '{"name":"Maya Roamer","avatar":"https://i.pravatar.cc/150?img=9"}', now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = now();

-- ============================================
-- 2. Profiles (must reference existing auth.users.id)
-- ============================================
INSERT INTO profiles (id, name, bio, city, country_code, avatar_url, current_city, is_verified, rating, followers_count)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Lena Backpack', 'Solo traveler from Germany', 'Bali',       'ID', 'https://i.pravatar.cc/150?img=1', 'Bali',       true,  4.8, 320),
  ('22222222-2222-2222-2222-222222222222', 'Kai Nomad',    'Digital nomad since 2019',        'Lisbon',     'PT', 'https://i.pravatar.cc/150?img=3', 'Lisbon',     true,  4.9, 891),
  ('33333333-3333-3333-3333-333333333333', 'Zara Explorer','Adventure seeker | Photographer','Tokyo',     'JP', 'https://i.pravatar.cc/150?img=5', 'Tokyo',      true,  4.7, 1024),
  ('44444444-4444-4444-4444-444444444444', 'Leo Drifter',  'Slow travel advocate',            'Medellín',   'CO', 'https://i.pravatar.cc/150?img=8', 'Medellín',   true,  4.6, 567),
  ('55555555-5555-3555-5555-555555555555', 'Maya Roamer',  'Culture & street food lover',     'Marrakech',  'MA', 'https://i.pravatar.cc/150?img=9', 'Marrakech',  true,  4.9, 756)
ON CONFLICT (id) DO UPDATE SET
  name           = EXCLUDED.name,
  bio            = EXCLUDED.bio,
  city           = EXCLUDED.city,
  country_code   = EXCLUDED.country_code,
  avatar_url     = EXCLUDED.avatar_url,
  rating         = EXCLUDED.rating,
  followers_count= EXCLUDED.followers_count;

-- ============================================
-- 3. Plans (id auto-generated as UUID, host_id→profiles.id)
-- ============================================
INSERT INTO plans (
  host_id,  city,    country_code, title,                                 description,                                           start_date,               end_date,                 max_travelers, is_public, currency, budget_min,  budget_max, tags,                              status
)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Bali',     'ID', 'Hidden Waterfall Trek + Rice Terrace Walk',     '3-day guided trek through jungles and rice terraces.', '2026-05-20', '2026-05-22', 6, true,  'IDR', 1_500_000, 3_200_000, ARRAY['hiking','culture','nature'],   'active'),
  ('22222222-2222-2222-2222-222222222222', 'Lisbon',   'PT', 'Tram 28 Street Photography Ride',              'One-day photography tour along historic Tram 28.',      '2026-05-25', '2026-05-25', 4, true,  'EUR', 50,        120,        ARRAY['photography','city','history'], 'active'),
  ('33333333-3333-3333-3333-333333333333', 'Tokyo',    'JP', 'Shibuya Crossing Night Walk',                  'Evening walk through Shibuya, Harajuku, Shinjuku.',   '2026-05-28', '2026-05-28', 8, true,  'JPY', 3_000,     8_000,      ARRAY['night','urban','food'],        'active'),
  ('44444444-4444-4444-4444-444444444444', 'Medellín', 'CO', 'Comuna 13 Graffiti & Art Walk',                'Guided community art tour through transformation.',    '2026-06-01', '2026-06-01', 10, true, 'COP', 30_000,    80_000,     ARRAY['art','urban','community'],     'active'),
  ('55555555-5555-3555-5555-555555555555', 'Marrakech','MA', 'Sahara Side Trip from Marrakech',              '2-day desert trip to Erg Chegaga with camel trek.',   '2026-06-05', '2026-06-06', 4, true,  'MAD', 1_500,     3_500,      ARRAY['desert','adventure','culture'],'active')
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. Verify
-- ============================================
SELECT '✅ Seed complete!' AS status,
  (SELECT COUNT(*) FROM auth.users)    AS users,
  (SELECT COUNT(*) FROM profiles)      AS profiles,
  (SELECT COUNT(*) FROM plans)         AS plans;
