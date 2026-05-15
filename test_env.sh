#!/bin/bash
echo "PWD=$(pwd)"
echo "HAS .env: -f /home/spoidy/workspace/RoamReach/.env"

# Run the .env loader from start.sh
while IFS= read -r line || [ -n "$line" ]; do
  line="${line%%#*}"
  line="$(echo "$line" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')"
  [ -z "$line" ] && continue
  
  if [[ "$line" == *=* ]]; then
    key="${line%%=*}"
    val="${line#*=}"
    val="$(echo "$val" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')"
    export "$key=$val"
  fi
done < "/home/spoidy/workspace/RoamReach/.env"

echo "URL: ${EXPO_PUBLIC_SUPABASE_URL:0:30}..."
echo "KEY set: ${EXPO_PUBLIC_SUPABASE_ANON_KEY:+yes}"
echo "ROLE set: ${SUPABASE_SERVICE_ROLE_KEY:+yes}"

echo ""
echo "Child process env check:"
echo "URL=$EXPO_PUBLIC_SUPABASE_URL"
echo "KEY=${EXPO_PUBLIC_SUPABASE_ANON_KEY:0:10}..."
