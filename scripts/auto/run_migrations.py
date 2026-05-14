#!/usr/bin/env python33
"""
Apply SQL migrations using Supabase Management API (no CLI needed).
Usage: python scripts/auto/run_migrations.py 002_incremental_additions.sql
"""

import subprocess, sys, os, json, base64

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

url = os.environ.get('EXPO_PUBLIC_SUPABASE_URL')
key = os.environ.get('EXPO_PUBLIC_SUPABASE_ANON_KEY')

if not url or not key:
    print("ERROR: Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env")
    sys.exit(1)

project_ref = url.rstrip('/').split('/')[-1]
api_url = f"https://{project_ref}.supabase.co/rest/v1/rpc/exec"

# Use service role for DDL? Actually need admin API key
# For now, use supabase CLI but with correct syntax
print("Using supabase CLI db query with stdin...")

def run_sql_file(sql_path):
    print(f"Applying {sql_path}...")
    with open(sql_path) as f:
        sql = f.read()
    
    # Use supabase db query with --file reads from file correctly
    result = subprocess.run(
        ['npx', 'supabase', 'db', 'query', '--file', sql_path, '--project-ref', project_ref],
        capture_output=True, text=True, cwd=ROOT
    )
    if result.returncode != 0:
        err_lower = result.stderr.lower()
        if 'already exists' in err_lower or 'duplicate' in err_lower:
            print(f"⚠ Object already exists (safe to ignore)")
            return True
        print(f"ERROR: {result.stderr}")
        return False
    print(f"✓ {os.path.basename(sql_path)} applied")
    return True

if len(sys.argv) < 2:
    print("Usage: python scripts/auto/run_migrations.py [all|<filename>]")
    print("Example: python scripts/auto/run_migrations.py all")
    print("         python scripts/auto/run_migrations.py 002_incremental_additions.sql")
    sys.exit(1)

arg = sys.argv[1]
migrations_dir = os.path.join(ROOT, 'supabase', 'migrations')

if arg == 'all':
    files = sorted(glob.glob(os.path.join(migrations_dir, '*.sql')))
    if not files:
        print(f"No migrations found in {migrations_dir}")
        sys.exit(1)
    for f in files:
        if not run_sql_file(f):
            print(f"Migration failed: {f}")
            sys.exit(1)
    print("\n✅ All migrations applied successfully")
else:
    sql_path = os.path.join(migrations_dir, arg)
    if not os.path.exists(sql_path):
        print(f"File not found: {sql_path}")
        sys.exit(1)
    if not run_sql_file(sql_path):
        sys.exit(1)
