#!/bin/bash
set -e
standards=(knowledge-classification workflow-and-checkpoints data-safety traceability evidence-handling)
for std in "${standards[@]}"; do
  [ -f "docs/standards/${std}.md" ] || (echo "FAIL: ${std}.md missing" && exit 1)
done
templates=(manifest.yaml status.md requirements.md)
for tpl in "${templates[@]}"; do
  [ -f "docs/templates/${tpl}" ] || (echo "FAIL: ${tpl} missing" && exit 1)
done
echo "PASS: standards and templates exist"
