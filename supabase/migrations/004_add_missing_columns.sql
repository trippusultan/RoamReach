-- Add missing columns to plans table (incremental fix)

ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS start_date timestamptz,
  ADD COLUMN IF NOT EXISTS end_date timestamptz,
  ADD COLUMN IF NOT EXISTS max_travelers integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS currency text CHECK (currency ~ '^[A-Z]{3}$') DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS budget_min numeric(10,2),
  ADD COLUMN IF NOT EXISTS budget_max numeric(10,2),
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('draft','active','completed','cancelled')) DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add default current_timestamp on created_at if not already set
DO $$
BEGIN
  ALTER TABLE plans ALTER COLUMN created_at SET DEFAULT now();
EXCEPTION
  WHEN undefined_column THEN NULL;  -- column doesn't exist, skip
END $$;
