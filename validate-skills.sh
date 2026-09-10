#!/bin/bash
set -euo pipefail

skills=(paco-ticket paco-requirements paco-explore paco-test-design paco-playwright paco-report)
for skill in "${skills[@]}"; do
  file=".claude/skills/$skill/SKILL.md"
  [ -f "$file" ] || { echo "FAIL: $file missing"; exit 1; }
  grep -q "^name: $skill$" "$file" || { echo "FAIL: $file name"; exit 1; }
  grep -q '^description: Use when' "$file" || { echo "FAIL: $file description"; exit 1; }
done

echo "PASS: skill contracts complete"
