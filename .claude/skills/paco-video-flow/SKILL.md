---
name: paco-video-flow
description: Use when a Paco ticket has a video attachment and the tester needs frame-by-frame analysis plus a Playwright re-run of the same flow on the dev host.
---

# Paco Video Flow

## Scope

Ingest one Paco ticket that has a video attachment. Produce (1) per-frame + flow notes, (2) a standalone Playwright spec that re-runs the flow. Never read frames in the main session.

## Mutation Mode
Read `manifest.yaml:mutationMode` before any side effect. Default is `auto` whenever the host is in `paco.config.yaml: safety.allowedHosts` or `externalDevHosts`. In `auto` mode the spec produced by this skill can `Create`/`Update`/`Save`/`Send`/`Delete`/`Restore`/`Upload`/`Import`/`Download` on owned test data without per-action approval: the spec is the authorization.

Still enforce in `auto` mode: `evaluateMutationGate()` with the `mutationMode` param; hostname matches allowlist; safe test data only (no real PII, `QA-test` prefix; historical `QA-AUTO` accepted); approved recipient (`fiona.nguyen@blinxsolutions.com` for email; SMS requires explicit tester confirmation each time); production/unknown host is blocked; mutation ledger written; cleanup in `finally { cleanup() }`; leftover log on cleanup fail. `PACO_ALLOW_MUTATION` / `PACO_ALLOW_DESTRUCTIVE` env vars are an optional local safety guard, not the primary gate.

`manual` (only when tester or intake forces it): legacy behavior — ask tester per case; env var guards still apply.

## When to use

- `ticket/<TICKET-ID>-<short-title>/` contains `*.mp4` / `*.webm` / `*.mov`.
- Tester needs to confirm UI behavior described in `ticket.md` and replay the same flow in Playwright.
- Skip when video is decorative (intro/outro only) or when `ticket.md` already provides enough detail without the video.

## When NOT to use

- Non-Paco project.
- Video is raw screen recording without UI (logs, metrics). Use a different pipeline.
- Flow involves destructive ops not authorized in `status.md`.

## Required background

Read before starting:
- `paco-ticket` — for ticket conventions, checkpoint, safety policy.
- `paco-playwright` (mode `generate` + `cli`) — for spec convention, page objects, pacing.
- Memory `paco-video-ingestion` — model + frame extraction policy.

## Inputs

| Input | Source | Required |
|---|---|---|
| Ticket folder | `ticket/<TICKET-ID>-<short-title>/` | yes |
| Video file | `<folder>/*.{mp4,webm,mov}` | yes |
| `ticket.md` | same folder | yes |
| Dev host | `paco.config.yaml` `allowedHosts` + `externalDevHosts` | yes |
| Test data | from `status.md` or tester | yes (for spec re-run) |
| `APPROVED` flag in `status.md` | `docs/tickets/<ticket>/status.md` | yes (for auto-run, see Step 5) |

## Output

| Artifact | Path | Owner |
|---|---|---|
| Frame images | `docs/tickets/<ticket>/video/frames/frame_NNNNN.png` | this skill |
| Per-chunk markdown | `docs/tickets/<ticket>/video/chunk_<NN>.md` (deleted after `video-notes.md` is written) | this skill |
| `video-notes.md` | `docs/tickets/<ticket>/video/video-notes.md` | this skill |
| Standalone Playwright spec | `playwright/tests/tickets/<ticket>/<case-id>-video-flow.spec.ts` | this skill (proposal; `paco-playwright` owns) |
| Spec execution | Với `execution.mode === 'cli_first'`, spec chạy qua `npm run paco-cli -- <ticket> <case-id>`; outcome merge vào `execution.runs[]` thay vì `execution.manual[]`. Với `mcp_first`, giữ legacy flow. | this skill + `paco-ticket` |
| `ChildSkillOutcome` v1 | returned to caller | this skill |

## Steps

### 1. Frame extraction (cheap, deterministic)

Use ffmpeg 1 fps, started at first non-blank frame. Output PNG to `docs/tickets/<ticket>/video/frames/frame_NNNNN.png`.

```bash
mkdir -p "docs/tickets/<ticket>/video/frames"
ffmpeg -i "ticket/<ticket>/<video>" -vf "fps=1" -start_number 0 "docs/tickets/<ticket>/video/frames/frame_%05d.png" -loglevel error
```

Confirm frame count and total duration before analysis. If ffmpeg fails, return `Blocked: ffmpeg failed: <stderr>`.

**Do not** read frames into the main session at this point.

### 2. Dispatch frame analysis (split into small chunks)

**Why split:** Sonnet 4.5 via 9router has a small context window. The baseline test (RED) showed that a single subagent reading all frames overflowed the context within three compaction cycles. Split the work into N small subagents, each handling one chunk of frames, plus one synthesis subagent that only reads markdown.

#### 2a. Decide chunk size

- Default: 30 frames per chunk.
- Lower the chunk size to 10 if frames are dense (e.g. heavy text, error overlays).
- Never exceed 30 frames per subagent — that already saturates the context.

Example for a 90-frame video: 3 chunk subagents (frames 0-29, 30-59, 60-89) + 1 synthesis subagent.

#### 2b. Dispatch per-frame subagents (one per chunk)

For each chunk, dispatch a fresh subagent with `model: kr|claude-sonnet-4-5`. Pass:

- The list of frame paths in that chunk (sorted).
- The relevant excerpt of `ticket.md` (description + acceptance criteria).
- The format spec from Step 3, **Section 1 only** (per-frame table).
- A hard instruction: read every frame in the chunk, return the markdown table rows, do not echo frames, do not write any prose summary.

Subagent returns plain markdown rows (one row per frame). The main session writes each chunk's rows to a temporary file `docs/tickets/<ticket>/video/chunk_<NN>.md` and discards the subagent.

#### 2c. Dispatch synthesis subagent

After all chunks return, dispatch one final subagent with `model: kr|claude-sonnet-4-5`. Pass:

- The chunk markdown files (`chunk_00.md`, `chunk_01.md`, ...). Do NOT pass frame paths.
- The relevant `ticket.md` excerpt.
- The format spec from Step 3, **Section 2 only** (synthesized flow).
- A hard instruction: read the chunk files, return one numbered Vietnamese flow list, do not read any frame, do not echo chunk files.

The synthesis subagent only sees text — its context stays small and survives.

#### 2d. Combine

The main session concatenates:

1. Header + Section 1 (chunk rows merged in order).
2. Section 2 (synthesis subagent output).

Writes the result to `docs/tickets/<ticket>/video/video-notes.md`. The main session never reads a frame image.

### 3. `video-notes.md` format

Two sections, in this order.

**Section 1 — Per-frame table.**

| timestamp | frame | UI text | error | URL | behavior | note |
|---|---|---|---|---|---|---|

Empty cells are allowed; mark unreadable text `[không chắc]`.

**Section 2 — Synthesized flow.**

Numbered list of steps from the first frame to the last, in Vietnamese prose, with explicit cause-effect between states (e.g. `Submit fail → toast "Invalid email" + border đỏ field Email → không redirect, vẫn ở /login → sau 3s toast tự ẩn`).

### 4. Generate Playwright spec

Read `paco-playwright` mode `generate`. Produce a standalone spec at `playwright/tests/tickets/<ticket>/<case-id>-video-flow.spec.ts` that:

- Imports page objects from `playwright/pages/` first; new locators go to the page object with a `Source:` comment.
- Uses Chromium, role locators, observable waits.
- Inserts `await settle()` (= `page.waitForTimeout(Number(process.env.PACO_STEP_MS ?? 1000))`) after every `click` / `fill` / `press`, and `~3000ms` extra after opening a modal/list that loads data.
- Sourced assertions only — no claims based purely on inference from the video.
- The filename contains the stable case ID.

#### 4a. Replay scope (smoke vs full)

Two scopes, decided from `ticket.md` + tester intent (default = full):

| Scope | When to use | What spec covers |
|---|---|---|
| **smoke** | Tester only wants to confirm dev host + locator work; ticket has no mutation | Steps 1-N until first observable defect state; assert visible/invisible; no mutation |
| **full** | Tester wants to replay the whole video, including mutation actions to reproduce the bug | Every step in Section 2 of `video-notes.md` from frame 0 to final state; asserts final state; mutation allowed via 4b |

**Default to `full`** unless the tester explicitly says "smoke" or the ticket has no mutation context. A smoke spec that doesn't reproduce the bug is evidence the pipeline works, not evidence about the product.

#### 4b. Mutation gate for full replay

If the spec needs to create / update / save / send / delete / import, the spec MUST:

1. Call `evaluateMutationGate()` (from `paco-playwright`) at the top of each test, before any side effect.
2. Use test data prefixed `QA-test` (per CLAUDE.md). New records created by the spec must follow this prefix. Historical tickets may still reference `QA-AUTO` from before the rename — gate accepts both prefixes to preserve audit trail.
3. Resolve recipient to `fiona.nguyen@blinxsolutions.com` for any email; SMS requires explicit tester confirmation.
4. Add a cleanup block that runs after the test (or after `Pass` / `Fail`) to remove the test records. Use `try { ... } finally { await cleanup(); }`.
5. On cleanup failure, log the leftover record IDs into `test-results/<spec>/leftovers.txt` and never silently drop.
6. Encode the expected product outcome in the spec assertions: if the ticket says "this should fail", the spec asserts fail; if it says "this should pass", the spec asserts pass. The spec is allowed to fail on a known defect.
7. Never use real patient PII. Search/create with `QA-test` only.

`evaluateMutationGate()` checks:
- `PACO_ALLOW_MUTATION=true` in env
- Host in `paco.config.yaml` `allowedHosts` + `externalDevHosts`
- No production host
- A test record marker is present (e.g. `QA-test` prefix on data being created/updated; historical `QA-AUTO` accepted)

If any check fails, the test is `Blocked: <reason>` and stops. The spec must NOT bypass the gate.

#### 4c. Skips and Blocked

A spec that hits a missing fixture (no template, no health form, no recipient) MUST `test.skip(true, '<reason>')` with a clear reason, not `test.fail()`. Skips are surfaced as `Setup or authentication failure` in the run result and let the orchestrator route back to bounded manual investigation.

### 5. Auto-run policy

Auto-run the spec directly when ALL of the following are true:
- `manifest.yaml:mutationMode === 'auto'` (default on configured dev host).
- `status.md` has `Mutation Policy: APPROVED` for the matching test data.
- The spec passed `evaluateMutationGate()` (hostname, `QA-test` data, recipient, ledger, cleanup, production block).

Auto-run path: invoke `npm run paco:cli -- <ticket> <case-id>` from this skill in `auto` mode, then merge the outcome into `execution.runs[]` via `applyPlaywrightOutcome()` so the result flows back into `paco-playwright` and `paco-ticket` the same as a delegated run. Report the final spec result in the `ChildSkillOutcome` and surface leftovers from `test-results/<spec>/leftovers.txt` if cleanup failed.

In all other cases (manual mode, missing `APPROVED`, gate rejection) this skill is read-only: hand the spec back to `paco-playwright` mode `cli` for execution, never to MCP. The tester runs it.

`paco-verify-flow` is the only other path that may mutate outside the spec; both rely on the same safety rules.

## Safety

- Read-only on the Paco dev host unless the action is part of the spec and authorized.
- Hostname gate: never point the spec at a host outside `paco.config.yaml`.
- No PII, no real patient data. Test data must be `QA-test` prefixed (historical `QA-AUTO` accepted).
- Cleanup: delete `docs/tickets/<ticket>/video/frames/` after `paco-playwright` runs the spec to `Pass` or `Fail`, unless the tester asks to keep them.
- The main session MUST NOT read any frame image. If you find yourself about to `Read` a PNG from `frames/`, stop and re-dispatch the subagent.

## Outcome

Return a `ChildSkillOutcome` v1 containing:

- `artifact_paths` for the frames folder, `video-notes.md`, spec file.
- `frame_count` and `video_duration_seconds`.
- `chunk_count` (number of per-frame subagents dispatched).
- `flow_steps` count from the synthesized flow.
- `mutation_authorization`: `none` (this skill did not mutate) or `delegated_to_paco-playwright`.
- `blockers`, `warnings`, `recommended_next_phase` (usually `MANUAL_EXECUTE` or `AUTOMATE`).

## Red flags — stop and re-dispatch

- The main session read a frame directly. The frame must never enter main-session context.
- A single subagent was given all frames. With Sonnet 4.5 via 9router the context overflows within 3 compactions. Split into chunks of 30 frames max.
- The synthesis subagent was given frame paths. It must see only chunk markdown files, never frames.
- A chunk subagent was given `model: opus` or `model: haiku`. It must be Sonnet 4.5 (`kr|claude-sonnet-4-5`).
- A chunk subagent wrote prose flow instead of just table rows. Restrict its output to Section 1 rows.
- The spec was written inline as a `browser_run_code` snippet instead of a standalone `.spec.ts` under `playwright/tests/tickets/<ticket>/`.
- The spec was run by this skill, not handed to `paco-playwright` mode `cli`.
- Frames were not deleted after the spec result was finalized, and the tester did not ask to keep them.

## Common mistakes

| Mistake | Fix |
|---|---|
| Reading all frames in main to "verify" | Stop. Re-dispatch subagent. Main only sees `video-notes.md`. |
| Giving one subagent the full frame list | Split into chunks of 30 frames max. Synthesis subagent sees only markdown. |
| Sampling at 30 fps | Use 1 fps; increase only if a sub-second transition is the bug. |
| Skipping the synthesized flow section | Both sections are required. The flow is what the tester will cite in `status.md`. |
| Writing the spec with XPath or text-only selectors | Use role locators; promote new locators to the page object. |
| Forgetting `PACO_STEP_MS` settle after every interaction | Required by `paco-playwright` pacing rule (2026-10-02). |
| Auto-running the spec on a host outside `paco.config.yaml` | Hard block; return `Blocked: host not in allowlist`. |
| Letting the synthesis subagent read frames | Pass only the chunk markdown files. Synthesis = text only. |
| Defaulting to smoke when the ticket is a defect repro | Use `full` scope; smoke cannot reproduce a defect, only verifies the pipeline. |
| Skipping `evaluateMutationGate()` in full replay | Gate is mandatory; missing gate = spec is `Blocked` at runtime. |
| Creating test data without `QA-test` prefix | CLAUDE.md requires prefix; missing prefix = mutation gate refuses. |
| Skipping cleanup | Add a `finally { cleanup() }` block; on failure, log leftovers to `test-results/<spec>/leftovers.txt`. |
| Encoding expected `Fail` as `test.fail()` | Use `expect(...).toBeVisible()` etc; `test.fail()` is for intentionally skipping a known-broken case, not for asserting product outcome. |
