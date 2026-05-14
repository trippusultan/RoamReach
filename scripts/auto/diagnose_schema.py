#!/usr/bin/env python33
"""Check actual DB schema — tells us exactly what's missing"""
import os, sys, subprocess

ROOT = "/mnt/c/Users/Spoidy/Desktop/startup/RR/RoamReach"
ENV_PATH = os.path.join(ROOT, ".env")

if os.path.exists(ENV_PATH):
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, _, v = line.partition('=')
                os.environ[k.strip()] = v.strip()

try:
    from supabase import create_client
except ImportError:
    print("Install @supabase/supabase-js first: npm install @supabase/supabase-js")
    sys.exit(1)

url = os.environ.get('EXPO_PUBLIC_SUPABASE_URL')
key = os.environ.get('EXPO_PUBLIC_SUPABASE_ANON_KEY')
if not url or not key:
    print("Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env")
    sys.exit(1)

supabase = create_client(url, key)

print("=== profiles table ===
")
try:
    # Get one row to see columns
    r = supabase.table('profiles').select('*').limit(1).execute()
    if r.data:
        print("Columns:", list(r.data[0].keys()))
    else:
        print("Table exists but empty")
except Exception as e:
    print(f"Error: {e}")

print("
=== plans table ===
")
try:
    r = supabase.table('plans').select('*').limit(1).execute()
    if r.data:
        print("Columns:", list(r.data[0].keys()))
    else:
        print("Table exists but empty")
except Exception as e:
    print(f"Error or missing: {e}")

print("
=== Checking for specific columns ===
")
for table, needed in [('profiles', ['city', 'country_code', 'home_city']), 
                       ('plans', ['city', 'country_code'])]:
    print(f"{table}:")
    try:
        r = supabase.table(table).select(','.join(needed)).limit(1).execute()
        print(f"  ✓ All needed columns present")
    except Exception as e:
        print(f"  ✗ Issue: {e}")
