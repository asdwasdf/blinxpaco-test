#!/bin/bash
set -euo pipefail

docs=(docs/README.md docs/product/README.md docs/product/feature-map.md docs/product/roles-permissions.md docs/product/glossary.md docs/product/open-questions.md docs/product/change-log.md docs/product/requirements/README.md docs/product/workflows/README.md docs/tickets/README.md docs/regression/README.md docs/regression/smoke-suite.md docs/test-runs/README.md docs/templates/README.md)
for doc in "${docs[@]}"; do [ -f "$doc" ] || { echo "FAIL: $doc missing"; exit 1; }; done

echo "PASS: documentation structure complete"
