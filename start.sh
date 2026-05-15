#!/usr/bin/env bash
# Load .env and export all variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

while IFS= read -r line || [ -n "$line" ]; do
  # Skip comments and empty lines
  line="${line%%#*}"
  line="$(echo "$line" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')"
  [ -z "$line" ] && continue
  
  # Only lines with KEY=VALUE
  if [[ "$line" == *=* ]]; then
    key="${line%%=*}"
    val="${line#*=}"
    # Remove inline comments from value
    val="$(echo "$val" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')"
    export "$key=$val"
  fi
done < "$SCRIPT_DIR/.env"

echo "env: load .env"
echo "env: export $(grep -v '^#' "$SCRIPT_DIR/.env" | grep -v '^$' | cut -d= -f1 | tr '\n' ' ')"
echo ""

exec npx expo "$@"
