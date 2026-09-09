#!/bin/bash
set -e

docs=(
  "docs/README.md"
  "docs/product/README.md"
  "docs/product/feature-map.md"
  "docs/product/roles-permissions.md"
  "docs/product/glossary.md"
  "docs/product/open-questions.md"
  "docs/product/change-log.md"
  "docs/tickets/README.md"
)

for doc in "${docs[@]}"; do
  [ -f "$doc" ] || (echo "FAIL: $doc missing" && exit 1)
done

echo "PASS: Documentation structure complete"
