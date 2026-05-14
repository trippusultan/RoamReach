#!/usr/bin/env python33
""
auto/verify_supabase.py - Test Supabase connection and basic queries
Usage: python scripts/auto/verify_supabase.py
"""

import os, sys

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

# Try importing supabase
try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: @supabase/supabase-js not installed.")
    print("  Run: npm install @supabase/supabase-js")
    sys.exit(1)

url = os.environ.get('EXPO_PUBLIC_SUPABASE_URL')
key = os.environ.get('EXPO_PUBLIC_SUPABASE_ANON_KEY')

if not url or not key:
    print("ERROR: EXPO_PUBLIC_SUPABASE_URL / ANON_KEY not found in .env")
    sys.exit(1)

print(f"Connecting to: {url}")
supabase: Client = create_client(url, key)

# Test 1: Health check
try:
    health = supabase.table('profiles').select('*', count='exact').limit(0).execute()
    print("✓ Connection successful - profiles table accessible")
except Exception as e:
    print(f"✗ Connection failed: {e}")
    sys.exit(1)

# Test 2: Check if user is authenticated (should be nil before signup)
try:
    auth = supabase.auth.get_session()
    if auth.session:
        print(f"✓ Active session: {auth.session.user.email}")
    else:
        print("ℹ No active session (expected on first run)")
except Exception as e:
    print(f"⚠ Auth check error: {e}")

print("\n✅ Supabase is ready! You can now run the app.")
print("   npx expo start")
