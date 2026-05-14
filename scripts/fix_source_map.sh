#!/usr/bin/env bash
# Fix source-map corruption — manually reinstall problematic packages
cd /mnt/c/Users/Spoidy/Desktop/startup/RR/RoamReach

# Remove just the broken packages
rm -rf node_modules/source-map-support
rm -rf node_modules/source-map

# Reinstall source-map explicitly
npm install source-map@0.7.4 source-map-support@0.5.21 --save-dev --no-save

# Verify
node -e "require('source-map'); console.log('source-map OK')"

echo "Done. Try: npx expo start"
