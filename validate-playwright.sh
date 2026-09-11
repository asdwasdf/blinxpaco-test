#!/bin/bash
set -euo pipefail

files=(playwright.config.ts playwright/fixtures/auth-fixtures.ts playwright/tests/smoke/dashboard.spec.ts playwright/README.md scripts/manual-login.md scripts/playwright-login.ts)
for file in "${files[@]}"; do
  [ -f "$file" ] || { echo "FAIL: $file missing"; exit 1; }
done

grep -q '^playwright/.auth/$' .gitignore || { echo "FAIL: .auth not in .gitignore"; exit 1; }
grep -q 'Blocked: Authentication state not found' playwright/fixtures/auth-fixtures.ts || { echo "FAIL: missing auth Blocked handling"; exit 1; }
grep -q 'Blocked: Authentication expired' playwright/fixtures/auth-fixtures.ts || { echo "FAIL: missing expiry Blocked handling"; exit 1; }

echo "PASS: Playwright scaffold complete"
