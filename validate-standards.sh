#!/bin/bash
set -euo pipefail

standards=(knowledge-classification workflow-and-checkpoints data-safety traceability evidence-handling feature-location product-survey)
templates=(manifest.yaml status.md requirements.md exploration.md feature-location.md test-cases.md automation.md report.md defect.md open-question.md survey-view.md survey-checkpoint.yaml README.md)
for name in "${standards[@]}"; do [ -f "docs/standards/$name.md" ] || { echo "FAIL: $name.md missing"; exit 1; }; done
for name in "${templates[@]}"; do [ -f "docs/templates/$name" ] || { echo "FAIL: $name missing"; exit 1; }; done
for name in status.md requirements.md exploration.md feature-location.md test-cases.md automation.md report.md defect.md open-question.md survey-view.md; do
  [ "$(grep -c '^## Tester notes$' "docs/templates/$name")" -eq 1 ] || { echo "FAIL: $name protected section"; exit 1; }
  [ "$(grep -n '^## Tester notes$' "docs/templates/$name" | cut -d: -f1)" -gt 0 ] || exit 1
done

echo "PASS: standards and templates complete"
