#!/usr/bin/env python3

import os, sys, json, urllib.request

# Load .env
env = {}
with open(os.path.join(os.path.dirname(__file__), '../../../.env')) as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k,v = line.strip().split('=',1)
            env[k] = v

url = env.get('EXPO_PUBLIC_SUPABASE_URL','').rstrip('/')
anon = env.get('EXPO_PUBLIC_SUPABASE_ANON_KEY','')
headers = {'apikey': anon, 'Authorization': f'Bearer {anon}'}

expected = [
  "id","created_at","host_id","city","country_code","title","description",
  "start_date","end_date","max_travelers","is_public","currency","budget_min",
  "budget_max","tags","status","created_by"
]

print("Checking plans table schema...")
missing = []
for col in expected:
    try:
        req = urllib.request.Request(f"{url}/rest/v1/plans?select={col}&limit=1", headers=headers)
        urllib.request.urlopen(req, timeout=5)
        print(f"  ✓ {col}")
    except urllib.error.HTTPError as e:
        err = e.read().decode('utf-8')
        if 'column' in err or e.code in [400, 500]:
            print(f"  ✗ {col} — MISSING")
            missing.append(col)
        else:
            print(f"  ? {col} — HTTP {e.code}")
    except Exception as e:
        print(f"  ✗ {col} — {e}")
        missing.append(col)

if missing:
    print(f"
⚠️  Missing columns: {missing}")
    print("   Fix: run supabase db query --file supabase/migrations/004_add_missing_columns.sql")
    sys.exit(1)
else:
    print("
✅ All columns present!")
    sys.exit(0)
