#!/bin/bash
set -euo pipefail

skills=(paco-ticket paco-requirements paco-explore paco-test-design paco-playwright paco-report paco-discover paco-verify-flow)
for skill in "${skills[@]}"; do
  file=".claude/skills/$skill/SKILL.md"
  [ -f "$file" ] || { echo "FAIL: $file missing"; exit 1; }
  grep -q "^name: $skill$" "$file" || { echo "FAIL: $file name"; exit 1; }
  grep -q '^description: Use when' "$file" || { echo "FAIL: $file description"; exit 1; }
done

grep -q 'markFeatureLocationStale' .claude/skills/paco-ticket/SKILL.md || { echo "FAIL: paco-ticket semantic location stale gate"; exit 1; }
grep -q 'evaluateUiLocationGate' .claude/skills/paco-playwright/SKILL.md || { echo "FAIL: paco-playwright UI location gate"; exit 1; }
grep -q 'MANUAL_EXECUTE' .claude/skills/paco-playwright/SKILL.md || { echo "FAIL: paco-playwright manual execution contract"; exit 1; }
grep -q 'AUTOMATION_EXECUTE' .claude/skills/paco-playwright/SKILL.md || { echo "FAIL: paco-playwright CLI execution contract"; exit 1; }
grep -q 'tối thiểu ba' .claude/skills/paco-playwright/SKILL.md || { echo "FAIL: paco-playwright manual retry contract"; exit 1; }
grep -q 'Ask QA early' .claude/skills/paco-ticket/SKILL.md || { echo "FAIL: paco-ticket ask-QA contract"; exit 1; }
grep -q 'Product Result' .claude/skills/paco-report/SKILL.md || { echo "FAIL: paco-report product result contract"; exit 1; }
grep -q 'Automation Verification' .claude/skills/paco-report/SKILL.md || { echo "FAIL: paco-report automation verification contract"; exit 1; }
grep -q 'docs/tickets/<ticket-folder>/evidence/' .claude/skills/paco-report/SKILL.md || { echo "FAIL: paco-report durable evidence contract"; exit 1; }

grep -q '`survey` strictly read-only' .claude/skills/paco-explore/SKILL.md || { echo "FAIL: paco-explore survey must be read-only"; exit 1; }
if grep -q 'Riêng `survey` được tự thực hiện mutation' .claude/skills/paco-explore/SKILL.md; then echo "FAIL: paco-explore survey still mutates"; exit 1; fi
grep -q 'DiscoveryChildOutcome' .claude/skills/paco-explore/SKILL.md || { echo "FAIL: paco-explore discovery outcome contract"; exit 1; }
grep -q 'npm run paco:discover' .claude/skills/paco-discover/SKILL.md || { echo "FAIL: paco-discover CLI protocol"; exit 1; }
grep -q '/paco/login' .claude/skills/paco-discover/SKILL.md || { echo "FAIL: paco-discover auth pause"; exit 1; }
grep -q 'Không tự bật' .claude/skills/paco-discover/SKILL.md || { echo "FAIL: paco-discover guard ownership"; exit 1; }
grep -q 'evaluateMutationGate' .claude/skills/paco-verify-flow/SKILL.md || { echo "FAIL: paco-verify-flow gate"; exit 1; }
grep -q 'reservation_id' .claude/skills/paco-verify-flow/SKILL.md || { echo "FAIL: paco-verify-flow reservation"; exit 1; }

echo "PASS: skill contracts complete"
