-- Clean slate for plans table — drops and recreates with correct 17-column schema
-- Use instead of incremental ALTER to avoid orphaned not-null constraints

DROP TABLE IF EXISTS plans CASCADE;

-- Recreate with EXACT schema (no extra columns)
CREATE TABLE plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  host_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  city text NOT NULL DEFAULT '',
  country_code text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  start_date timestamptz,
  end_date timestamptz,
  max_travelers integer NOT NULL DEFAULT 1,
  is_public boolean NOT NULL DEFAULT false,
  currency text NOT NULL DEFAULT 'USD' CHECK (currency ~ '^[A-Z]{3}$'),
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','completed','cancelled')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_plans_city_status ON plans(city, status);
CREATE INDEX IF NOT EXISTS idx_plans_host_id ON plans(host_id);
CREATE INDEX IF NOT EXISTS idx_plans_start_date ON plans(start_date);

-- RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public plans viewable by everyone" ON plans FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Hosts can manage own plans" ON plans FOR INSERT
  WITH CHECK (auth.uid() = host_id OR is_public = true);
CREATE POLICY IF NOT EXISTS "Hosts can update own plans" ON plans FOR UPDATE
  USING (auth.uid() = host_id);
CREATE POLICY IF NOT EXISTS "Hosts can delete own plans" ON plans FOR DELETE
  USING (auth.uid() = host_id);
