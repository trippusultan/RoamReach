#!/usr/bin/env python3
"""Generate TypeScript types from Supabase database schema.
Supports two methods:
  1. SUPABASE_ACCESS_TOKEN (db:read scope) -- preferred
  2. SUPABASE_DB_URL (connection string) -- fallback
"""

import subprocess, sys, os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ENV_PATH = os.path.join(ROOT, '.env')

# Load .env
if os.path.exists(ENV_PATH):
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, _, v = line.partition('=')
                os.environ[k.strip()] = v.strip()

output_file = os.path.join(ROOT, 'src', 'types', 'supabase.ts')
os.makedirs(os.path.dirname(output_file), exist_ok=True)

# Method 1: Access token (simpler, no password in env)
access_token = os.environ.get('SUPABASE_ACCESS_TOKEN')
url = os.environ.get('EXPO_PUBLIC_SUPABASE_URL')

if access_token and url:
    project_ref = url.rstrip('/').split('//')[-1].split('.')[0]
    print(f'Using project ref: {project_ref}')
    result = subprocess.run(
        ['npx', 'supabase', 'gen', 'types', 'typescript', '--project-id', project_ref],
        capture_output=True, text=True, cwd=ROOT, timeout=120,
        env={**os.environ, 'SUPABASE_ACCESS_TOKEN': access_token}
    )
    if result.returncode == 0:
        with open(output_file, 'w') as f:
            f.write(result.stdout)
        print(f'✓ Types written to {output_file}')
        sys.exit(0)
    else:
        print(f'Token method failed: {result.stderr[:200]}')

# Method 2: DB connection string
db_url = os.environ.get('SUPABASE_DB_URL') or os.environ.get('DATABASE_URL')
if db_url:
    print('Using DB connection string...')
    result = subprocess.run(
        ['npx', 'supabase', 'gen', 'types', 'typescript', '--db-url', db_url],
        capture_output=True, text=True, cwd=ROOT, timeout=120
    )
    if result.returncode == 0:
        with open(output_file, 'w') as f:
            f.write(result.stdout)
        print(f'✓ Types written to {output_file}')
        sys.exit(0)
    else:
        print(f'DB URL method failed: {result.stderr[:200]}')

# Neither worked — show instructions
print('ERROR: Could not generate types. Need one of:')
print('')
print('Option A (recommended): Access token')
print('  1. Get token: https://supabase.com/dashboard/account/tokens')
print('  2. Create token with db:read scope')
print('  3. Add to .env: SUPABASE_ACCESS_TOKEN=<token>')
print('')
print('Option B: Connection string')
print('  1. In Supabase dashboard: Settings → Database → Connection string')
print('  2. Copy "URI" format')
print('  3. Add to .env: SUPABASE_DB_URL=<connection-string>')
print('')
print('Then re-run: npm run db:types')
sys.exit(1)
