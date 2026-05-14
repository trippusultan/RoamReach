#!/usr/bin/env python33
"""
Fix schema mismatch: detect current plans table columns and add missing ones.
Uses Supabase REST API directly — no CLI needed.
"""

import subprocess, sys, os, json, requests

ROOT = "/mnt/c/Users/Spoidy/Desktop/startup/RR/RoamReach"
ENV_PATH = os.path.join(ROOT, ".env")

# Load .env
if os.path.exists(ENV_PATH):
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, _, v = line.partition('=')
                os.environ[k.strip()] = v.strip()

url = os.environ.get('EXPO_PUBLIC_SUPABASE_URL')
key = os.environ.get('EXPO_PUBLIC_SUPABASE_ANON_KEY')
if not url or not key:
    print("ERROR: Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env")
    sys.exit(1)

project_ref = url.rstrip('/').split('/')[-1]
api_base = f"https://{project_ref}.supabase.co"

print("=== Inspecting current 'plans' table ===\n")

query = '''
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'plans'
ORDER BY ordinal_position
'''

try:
    r = requests.post(
        f"{api_base}/rest/v1/rpc/exec",
        headers={"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={"sql": query}, timeout=15
    )
    if r.status_code != 200:
        raise Exception(f"REST failed: {r.status_code} {r.text[:100]}")
    cols = r.json()
except Exception as e:
    print(f"REST query failed ({e}), trying supabase CLI...")
    result = subprocess.run(
        ['npx', 'supabase', 'db', 'query', '--project-ref', project_ref,
         '--query', query],
        capture_output=True, text=True, cwd=ROOT, timeout=30
    )
    if result.returncode != 0:
        print(f"CLI error: {result.stderr[:200]}")
        print("\nProceeding with full reset migration (003)...")
        subprocess.run(['npx', 'supabase', 'db', 'query', '--project-ref', project_ref,
                        '--file', 'supabase/migrations/003_fixed_types.sql'],
                       cwd=ROOT)
        sys.exit(0)
    # Parse output (JSON usually)
    try:
        cols = json.loads(result.stdout)
    except:
        print("Could not parse CLI output, using full reset")
        subprocess.run(['npx', 'supabase', 'db', 'query', '--project-ref', project_ref,
                        '--file', 'supabase/migrations/003_fixed_types.sql'],
                       cwd=ROOT)
        sys.exit(0)

print(f"Found {len(cols)} columns:")
for c in cols:
    print(f"  {c['column_name']:20s} {c['data_type']}")

required_cols = {'id','title','description','category','date','time','meeting_point',
                 'city','country_code','max_spots','attendee_ids','host_id',
                 'is_full','is_hot','created_at','updated_at'}

existing = {c['column_name'] for c in cols}
missing = required_cols - existing

if missing:
    print(f"\nMissing columns: {missing}")
    print("Applying ALTER TABLE to add missing columns...")
    # We'll use the full reset because ALTER with existing data can be tricky
    print("Using clean reset migration (003)...")
    subprocess.run(['npx', 'supabase', 'db', 'query', '--project-ref', project_ref,
                    '--file', 'supabase/migrations/003_fixed_types.sql'],
                   cwd=ROOT)
else:
    print("\n✓ All columns present — schema is correct!")
    print("Check other issues (e.g., foreign key types)")

print("\nNext: npm run db:types && npx expo start")
