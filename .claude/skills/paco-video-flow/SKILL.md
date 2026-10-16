---
name: paco-video-flow
description: Use when a Paco ticket has a video attachment and the tester needs frame-by-frame analysis plus a Playwright re-run of the same flow on the dev host.
---

# Paco Video Flow

## Scope

Ingest one Paco ticket that has a video attachment. Produce (1) per-frame + flow notes, (2) a standalone Playwright spec that re-runs the flow. Never read frames in the main session.

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
| `video-notes.md` | `docs/tickets/<ticket>/video/video-notes.md` | this skill |
| Standalone Playwright spec | `playwright/tests/tickets/<ticket>/<case-id>-video-flow.spec.ts` | this skill (proposal; `paco-playwright` owns) |
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

### 2. Dispatch frame analysis subagent

Dispatch a fresh subagent with `model: kr|claude-sonnet-4-5` (Sonnet 4.5 via 9router). Pass:

- The list of frame paths (sorted).
- The relevant excerpt of `ticket.md` (description + acceptance criteria).
- The format spec from Step 3.
- A clear instruction: read every frame, return only the markdown content, do not echo frames back.

Subagent returns one markdown body. The main session writes that body verbatim to `video-notes.md`.

**Why this rule:** the baseline test (RED) showed that reading frames in the main session or in a general-purpose subagent without a fresh context overflows the context window within three compaction cycles. A dedicated subagent with a fresh context and a clear "return only markdown" instruction is the only sustainable path.

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

If the spec needs destructive or mutation actions, mark them with the `evaluateMutationGate()` pattern from `paco-playwright` and require safe test data (`QA-AUTO` prefix).

### 5. Auto-run policy

Do not run the spec in the main flow of this skill. Hand the spec back to `paco-playwright` mode `cli` for execution.

- If `status.md` contains `APPROVED` for the matching test data, `paco-playwright` may auto-run.
- Otherwise the spec is delivered as a proposal; the tester runs it.

This skill never runs Playwright directly. The single-execution-first exception in `CLAUDE.md` belongs to `paco-verify-flow` and the in-skill mutation of `paco-playwright`, not to this skill.

## Safety

- Read-only on the Paco dev host unless the action is part of the spec and authorized.
- Hostname gate: never point the spec at a host outside `paco.config.yaml`.
- No PII, no real patient data. Test data must be `QA-AUTO` prefixed.
- Cleanup: delete `docs/tickets/<ticket>/video/frames/` after `paco-playwright` runs the spec to `Pass` or `Fail`, unless the tester asks to keep them.
- The main session MUST NOT read any frame image. If you find yourself about to `Read` a PNG from `frames/`, stop and re-dispatch the subagent.

## Outcome

Return a `ChildSkillOutcome` v1 containing:

- `artifact_paths` for the frames folder, `video-notes.md`, spec file.
- `frame_count` and `video_duration_seconds`.
- `flow_steps` count from the synthesized flow.
- `mutation_authorization`: `none` (this skill did not mutate) or `delegated_to_paco-playwright`.
- `blockers`, `warnings`, `recommended_next_phase` (usually `MANUAL_EXECUTE` or `AUTOMATE`).

## Red flags — stop and re-dispatch

- The main session read a frame directly. The frame must never enter main-session context.
- The subagent was given `model: opus` or `model: haiku`. It must be Sonnet 4.5 (`kr|claude-sonnet-4-5`).
- The spec was written inline as a `browser_run_code` snippet instead of a standalone `.spec.ts` under `playwright/tests/tickets/<ticket>/`.
- The spec was run by this skill, not handed to `paco-playwright` mode `cli`.
- Frames were not deleted after the spec result was finalized, and the tester did not ask to keep them.

## Common mistakes

| Mistake | Fix |
|---|---|
| Reading all frames in main to "verify" | Stop. Re-dispatch subagent. Main only sees `video-notes.md`. |
| Sampling at 30 fps | Use 1 fps; increase only if a sub-second transition is the bug. |
| Skipping the synthesized flow section | Both sections are required. The flow is what the tester will cite in `status.md`. |
| Writing the spec with XPath or text-only selectors | Use role locators; promote new locators to the page object. |
| Forgetting `PACO_STEP_MS` settle after every interaction | Required by `paco-playwright` pacing rule (2026-10-02). |
| Auto-running the spec on a host outside `paco.config.yaml` | Hard block; return `Blocked: host not in allowlist`. |
