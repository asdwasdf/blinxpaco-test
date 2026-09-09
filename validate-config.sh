#!/bin/bash
set -e
[ -f "paco.config.yaml" ] || (echo "FAIL: paco.config.yaml missing" && exit 1)
[ -f "CLAUDE.md" ] || (echo "FAIL: CLAUDE.md missing" && exit 1)
[ -f "package.json" ] || (echo "FAIL: package.json missing" && exit 1)
echo "PASS: config files exist"
