#!/bin/bash
# Push RoamReach to GitHub
cd /home/spoidy/workspace/RoamReach

# Configure credential helper (stores in plaintext ~/.git-credentials)
git config credential.helper store

# Read token from user input or env
TOKEN="${GITHUB_TOKEN:-$1}"
if [ -z "$TOKEN" ]; then
  echo "Usage: ./push_to_github.sh <PAT>"
  echo "Or set GITHUB_TOKEN env var"
  exit 1
fi

# Write credentials
cat > ~/.git-credentials <<EOF
https://$TOKEN@github.com
EOF

# Add remote if missing
git remote add origin https://github.com/trippusultan/RoamReach.git 2>/dev/null || true

# Push
git push -u origin master

# Cleanup
rm ~/.git-credentials
