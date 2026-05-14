# Fix: "relation 'profiles' already exists" Error

Your Supabase database already has a `profiles` table (possibly from an earlier test). The migration `001_initial_schema.sql` tries to create it fresh and fails.

## Solution: Run the Incremental Migration

I've created a safe migration that only adds missing objects (plans table, policies, functions) without touching existing data.

### Step 1 — Check Current Schema

```bash
python scripts/auto/check_schema.py
```

Expected output:
```
✓ Table 'profiles' exists
✗ Table 'plans' missing  ← or similar
```

### Step 2 — Apply Incremental Changes

```bash
# Apply just the new objects (safe — won't drop data)
python scripts/auto/run_migrations.py 002_incremental_additions.sql
```

This will:
- Create `plans` table if missing
- Add RLS policies (replaces old ones)
- Create triggers/functions (idempotent)
- Add missing columns to `profiles` (if any)
- Set up join/leave helper functions

### Step 3 — Verify Connectivity

```bash
python scripts/auto/verify_supabase.py
```

Should show: `✓ Connection successful`

### Step 4 — Regenerate Types

```bash
npm run db:types
```

### Step 5 — Start App

```bash
npx expo start
```

---

## Alternative: Fresh Reset (if you want clean slate)

If you're in early development and don't need to keep data:

```bash
# WARNING: Deletes ALL data
supabase db reset

# Then run full schema
python scripts/auto/run_migrations.py 001_initial_schema.sql
npm run db:types
```

---

## What Changed in DB?

| Object | Status | Action |
|--------|--------|--------|
| `profiles` table | already exists | left untouched |
| `plans` table | may not exist | created by incremental migration |
| RLS policies | may be missing | created/replaced |
| Triggers & functions | missing | created |
| `profiles` new columns | may be missing | `ALTER TABLE ADD COLUMN IF NOT EXISTS` |

---

## Next

Once migration succeeds, sign in with Google → Explore → Map markers should work → Plan details → Rating should appear after date passes.

Questions? Check SUPABASE_SETUP.md or README.md.
