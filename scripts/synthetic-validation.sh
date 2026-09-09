#!/bin/bash
set -e

echo "=== Synthetic Validation ==="

# Test 1: Valid ticket structure
if [ ! -f "fixtures/synthetic-ticket-valid/ticket.md" ]; then
  echo "FAIL: Valid fixture missing"
  exit 1
fi

# Test 2: Invalid ticket (no primary source)
if [ ! -d "fixtures/synthetic-ticket-invalid-no-primary" ]; then
  echo "FAIL: Invalid fixture missing"
  exit 1
fi

if [ -f "fixtures/synthetic-ticket-invalid-no-primary/ticket.md" ]; then
  echo "FAIL: Invalid fixture should not have ticket.md"
  exit 1
fi

# Test 3: Real ticket must not be processed
if grep -r "PAC2-5776" fixtures/ 2>/dev/null; then
  echo "FAIL: Real ticket ID found in fixtures"
  exit 1
fi

echo "PASS: All synthetic validation checks passed"
