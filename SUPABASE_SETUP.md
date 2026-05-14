# RoamReach — Supabase Setup Guide

Complete one-time setup to connect your app to Supabase.

---

## 1. Prerequisites

- [x] Supabase project created (URL: `https://aqcbobnhkiqkhcraeahd.supabase.co`)
- [x] `.env` file configured with your anon key
- [ ] Supabase CLI installed (optional for migrations, see below)

---

## 2. Choose Your Migration Method

### Method A: SQL Editor (Easiest, 2 minutes)

1. Go to your Supabase dashboard → **SQL Editor**
2. Click **New Query**
3. Open `supabase/migrations/001_initial_schema.sql` from this repo
4. Copy-paste the entire contents into the SQL editor
5. Click **Run** (may take 10–20 seconds)

✅ Done! Tables and policies are live.

### Method B: Supabase CLI (For future schema changes)

```bash
# Login once
supabase login

# Link project
supabase link --project-ref aqcbobnhkiqkhcraeahd

# Push local migrations to cloud
npm run db:push
```

Method B is recommended because you can version-control migrations locally and re-apply on new branches/environments.

---

## 3. Verify Connectivity

Run the Python verification script (uses your `.env`):

```bash
python scripts/auto/verify_supabase.py
```

Expected output:
```
Connecting to: https://aqcbobnhkiqkhcraeahd.supabase.co
✓ Connection successful — profiles table accessible
ℹ No active session (expected on first run)
✅ Supabase is ready! You can now run the app.
```

If you see errors, double-check:.env values and restart your terminal.

---

## 4. Generate TypeScript Types

```bash
npm run db:types
```

This contacts your live database schema and generates `src/types/supabase.ts` with correct column types.

**Important**: Run this whenever you modify the schema (add columns, tables).

---

## 5. Seed Sample Data (Optional)

For development, populate sample plans and profiles:

```bash
# Manual approach (SQL Editor):
# Paste contents of supabase/seed/01_data.sql into a new SQL Editor query

# Or via CLI:
psql $DATABASE_URL -f supabase/seed/01_data.sql
```

**Important**: The seed uses fixed UUIDs (`11111111-…`). These will cause conflicts if you already have users. Edit the SQL to use your real user IDs (from `auth.users` table) or delete the seed file.

---

## 6. First Sign-In Test

```bash
# Start Expo dev server
npx expo start
```

1. Press `w` / `a` / `i` to open on device/emulator
2. Tap **Continue with Google** — should redirect to Google OAuth flow
3. After successful auth, you'll land on **Explore** screen
4. Pull up developer menu (Ctrl+M / Cmd+M) → inspect Redux/Zustand store → `user` object populated

During development without `.env`, a mock user (`Alex Mercer`) is auto-created. With `.env` present, real Supabase auth is used.

---

## 7. Common Commands

```bash
# View all migrations
ls supabase/migrations/

# Reset DB (nuclear option — wipes everything)
supabase db reset

# Push schema changes
npm run db:push

# Regenerate types after schema change
npm run db:types

# Open Supabase dashboard in browser
supabase project open

# View live logs
supabase db logs --tail
```

---

## 8. Troubleshooting

### "Failed to load resource: net::ERR_NAME_NOT_RESOLVED" in app
→ `.env` file not found or Expo not restarted. Kill server, run `npx expo start -c`.

### RLS policy violation (403)
→ You're trying to INSERT/UPDATE without proper ownership. Check policy conditions in SQL Editor → Policies tab.

### Types don't match after migration
→ Did you run `npm run db:types`? Also check that `supabase/config.toml` is linked to your project.

### Auth redirect loops
→ Ensure `EXPO_PUBLIC_SUPABASE_URL` matches exactly (no trailing slash). On Android emulator, use `10.0.2.2` instead of `localhost` if using local Supabase Docker — but you're on cloud so skip.

### Migration failed with "relation already exists"
→ Already migrated (maybe via Method A). Run `supabase db diff --schema public` to see pending changes.

---

## 9. Deploy to Production

When you're ready to ship:

1. Create **production Supabase project** (or use same with hardened settings)
2. Update `.env` to point to production URL
3. Run migrations: `supabase db push --project-ref <prod-ref>`
4. Set up **Email auth** in Supabase Auth → Settings (optional)
5. Enable **Row Level Security** — already enabled in this schema
6. Add **API keys** to EAS build secrets (for EAS Build):
   ```bash
   eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value <url>
   eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <key>
   ```

---

## 10. Next Steps After DB Setup

- [ ] Create first plan via app or DB
- [ ] Test real-time chat (optional: add Realtime subscriptions)
- [ ] Implement image uploads (Supabase Storage)
- [ ] Add email/password magic link flow
- [ ] Configure OAuth providers (Google → Supabase Auth → Settings → Providers)

Questions? Check `README.md` or open an issue.
