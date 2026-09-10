#!/bin/bash
set -euo pipefail

for file in paco.config.yaml CLAUDE.md package.json; do [ -f "$file" ] || { echo "FAIL: $file missing"; exit 1; }; done
grep -Fq '^[A-Z][A-Z0-9]*-[0-9]+-[a-z0-9]+(?:-[a-z0-9]+)*$' paco.config.yaml || { echo "FAIL: ticket regex mismatch"; exit 1; }
grep -q 'primarySourceFile: ticket.md' paco.config.yaml || { echo "FAIL: primary source mismatch"; exit 1; }

echo "PASS: config files valid"
