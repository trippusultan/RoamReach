# QUICK FIX: Apply Database Migration

The error "relation 'profiles' already exists" means your DB already has some tables.

## EASIEST METHOD — Manual SQL Paste (2 minutes)

1. Open your Supabase project:
   https://supabase.com/project/aqcbobnhkiqkhcraeahd

2. Go to **SQL Editor** (left sidebar)

3. Click **New Query**

4. Copy the FULL contents of this file:
   ```
   supabase/migrations/002_incremental_additions.sql
   ```

5. Paste into the SQL Editor

6. Click **Run** (top-right)

7. Wait ~5 seconds → should see "Successfully ran SQL file"

8. Done! 🎉

## Alternative: Using Supabase CLI (if linked)

```bash
# First ensure you're linked to the right project
supabase link --project-ref aqcbobnhkiqkhcraeahd

# Then run:
supabase db query --file supabase/migrations/002_incremental_additions.sql
```

If `--file` fails, use the manual paste method above — it's faster anyway.

## Verify It Worked

```bash
python scripts/auto/check_schema.py
```

Expected output:
```
✓ Table 'profiles' exists — rows: N
✓ Table 'plans' exists — rows: 0 (or seeded count)
```

## Then Continue

```bash
npm run db:types
npx expo start
```

---

**Note**: The Python migration runner (`scripts/auto/run_migrations.py`) has some CLI compatibility issues with the latest Supabase version. Manual SQL paste is the recommended path. The script remains as reference for future automation.
