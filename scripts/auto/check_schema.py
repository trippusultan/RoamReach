#!/usr/bin/env python33
"""auto/check_schema.py - Inspect current Supabase schema state
Usage: python scripts/auto/check_schema.py
"""

import os, sys, subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ENV_PATH = os.path.join(ROOT, ".env")

# Load .env
if os.path.exists(ENV_PATH):
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, _, val = line.partition('=')
                os.environ[key.strip()] = val.strip()

try:
    from supabase import create_client
except ImportError:
    print("ERROR: Install @supabase/supabase-js first")
    sys.exit(1)

url = os.environ.get('EXPO_PUBLIC_SUPABASE_URL')
key = os.environ.get('EXPO_PUBLIC_SUPABASE_ANON_KEY')

if not url or not key:
    print("ERROR: Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env")
    sys.exit(1)

supabase = create_client(url, key)

print("=== Current Database Schema ===\n")

# Check tables
for table in ['profiles', 'plans']:
    try:
        res = supabase.table(table).select('*', count='exact').limit(0).execute()
        count = res.count if hasattr(res, 'count') else 0
        print(f"✓ Table '{table}' exists - rows: {count}")
    except Exception as e:
        print(f"✗ Table '{table}' missing: {e}")

# Check profiles columns
print("\n=== profiles columns ===")
try:
    # Query one row to see what columns exist
    res = supabase.table('profiles').select('*').limit(1).execute()
    if res.data:
        cols = list(res.data[0].keys())
        print("Columns:", ', '.join(cols))
    else:
        print("(table empty - columns unknown)")
except Exception as e:
    print(f"Error: {e}")

# Check RLS
print("\n=== Row Level Security ===")
for table in ['profiles', 'plans']:
    try:
        # Try a SELECT (should always work)
        supabase.table(table).select('*').limit(1).execute()
        print(f"✓ {table}: SELECT allowed (public)")
    except Exception as e:
        print(f"✗ {table}: SELECT blocked - {e}")

print("\n✅ Schema check complete")
