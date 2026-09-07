#!/bin/bash
# PHASE 4 VERIFICATION SCRIPT
# Tests all runtime issues

echo "=== PHASE 4: RUNTIME VERIFICATION ==="
echo "Testing application at http://localhost:3000"
echo ""

# Test 1: Home page
echo "1. Testing home page..."
curl -s http://localhost:3000 | grep -q "Nyalian" && echo "  ✅ Page loads" || echo "  ❌ Page failed"

# Test 2: Check manifest
echo "2. Testing manifest..."
curl -s http://localhost:3000/manifest.json | grep -q "icon" && echo "  ✅ Manifest valid" || echo "  ❌ Manifest failed"

# Test 3: Check icons
echo "3. Testing icons..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/icons/icon-192.svg | grep -q "200" && echo "  ✅ icon-192 (200)" || echo "  ❌ icon-192 (404)"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/icons/icon-512.svg | grep -q "200" && echo "  ✅ icon-512 (200)" || echo "  ❌ icon-512 (404)"

# Test 4: Packages page
echo "4. Testing packages page..."
curl -s http://localhost:3000/packages | grep -q "PackageCard\|package" && echo "  ✅ Packages load" || echo "  ⚠️ Check manually"

echo ""
echo "Runtime verification complete. Manual browser testing required."
