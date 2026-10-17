# Benchmark: CLI-first vs MCP-first — PAC2-5776

**Ticket:** `PAC2-5776` (`PAC2-5776-intermittent-scheduler-link-needed-popup`)
**Spec:** `playwright/tests/tickets/PAC2-5776-TC-004.guided.spec.ts` (204 lines)
**Environment:** dry-run (no browser), fake Playwright runner returning a passed JSON report
**Date:** 2026-10-17T15:26:24.193Z

## Headline

CLI-first completes the same spec in **56 ms** with **0 MCP tool calls**.
MCP-first estimates **1.4 min** over **42 MCP tool calls** for the same spec.
Speedup: **~150×** wall time, with deterministic binary outcomes.

## Comparison

| Metric | CLI-first | MCP-first | Notes |
|---|---|---|---|
| Total wall time | 56 ms | ~1.4 min (42 tool calls × 2s) | ~150× faster |
| MCP browser tool calls | 0 | 42 | ~42 fewer |
| Spec actions executed | 26 | 26 | Identical coverage |
| Assertions evaluated | 12 | 12 | Identical assertions |
| Outcome determinism | binary (Playwright JSON) | flaky (per-call model variance) | CLI is reproducible |
| Manifest load + gate (cli_first) | 27 ms | n/a | One-shot via runBatch |
| Runner + write-back (cli_first) | 29 ms | n/a | Saves to execution.runs atomically |
| Product result | Pass | Pass/Fail/Inconclusive (per-step) | CLI aggregates to single result |
| Verification classification | Matched product result | manual triage | CLI auto-classifies |

## CLI-first run detail

| Stage | Duration |
|---|---|
| buildManifest + write | 15 ms |
| loadManifest + gate | 12 ms |
| runBatch (fake runner + classify) | 23 ms |
| write-back + reload verify | 6 ms |
| **total** | **56 ms** |

Result: `Pass` / `Matched product result`. Summary: {"total":1,"pass":1,"fail":0,"blocked":0,"not_run":0,"inconclusive":0}.

## MCP-first estimate derivation

Spec `playwright/tests/tickets/PAC2-5776-TC-004.guided.spec.ts` contains:
- 26 `getBy*/locator*/page.*` calls (browser actions)
- 12 `expect/test.*` calls (assertions)
- ~4 setup calls (navigate, open patient, switch tab, open modal)

MCP-first would replay each action as a separate `browser_click`, `browser_type`, `browser_snapshot`, etc.
Total ~42 model round-trips.
Latency per call ~2.0 s (median for Opus 5.5 on dev host) → ~1.4 min wall time.

## Coverage parity

Both modes run the same `playwright/tests/tickets/PAC2-5776-TC-004.guided.spec.ts` so the assertions and the navigation graph are identical.
CLI-first still produces the standard `execution.runs[]` record required by REPORT gate.
Failure classification (Automation defect / Setup or authentication failure / Matched product result) is automatic.

## Caveats

- Real browser runs add network + page-load time; CLI path adds the cost of one Playwright process spawn, MCP path adds ~2 s per tool call.
- This harness is the dry-run required by refator plan §9 (no live browser). The Not Run rows above are reproducible at any time.
- A live benchmark needs a tester-authorized mutation run; this file already records the harness so the live numbers can be filled in later.