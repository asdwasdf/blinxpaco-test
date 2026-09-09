#!/bin/bash
set -e

[ -f "playwright.config.ts" ] || (echo "FAIL: playwright.config.ts missing" && exit 1)
[ -d "playwright/.auth" ] || (echo "FAIL: .auth directory missing" && exit 1)
[ -f "playwright/fixtures/auth-fixtures.ts" ] || (echo "FAIL: auth fixtures missing" && exit 1)

# Check .gitignore includes auth state
grep -q "playwright/.auth/" .gitignore || (echo "FAIL: .auth not in .gitignore" && exit 1)

echo "PASS: Playwright scaffold complete"
