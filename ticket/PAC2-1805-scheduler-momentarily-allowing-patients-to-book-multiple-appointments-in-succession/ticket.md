# Scheduler - Momentarily Allowing Patients to Book Multiple Appointments in Succession

**Ticket:** PAC2-1805

## Description

A patient who refreshes between EPR confirmation and the audit landing in `CAMPAIGN_ANALYTICS` can currently re-enter the booking flow and double-book, design a mechanism to prevent that.

## Acceptance Criteria

- On booking appointment via scheduler, rather than using “Back Home” and waiting, log out immediately or refresh the page immediately. When logging back in, you should see your appointment booking details. Previously this reset allowing user to book multiple appointments with no limit.

# Comments / Updates

## Comment — tony.do — 2026-09-11

**QA round on the feature stage (2026-09-11), traced in CloudWatch** — link `sch:55636:214052`, all times UTC. Sources: scheduler-be feature lambda, EMIS request router, EMIS processor.

### Report

| Report | What the logs show | Outcome |
| --- | --- | --- |
| Booking shows blank time/clinician after navigating back quickly | `decodeToken` returned `booked: true` from the PACO row before the comms-hub row (which carries the times, clinician and location) existed; the PACO row has none of those for EMIS/SystmOne. | **Fixed** in nhs-scheduler-be (c66b25b): PACO-booked with no comms-hub row is reported as "in progress", so the FE keeps polling and shows the confirming notice until the real details land. Never bookable in that window. |
| Manually booked 16:30 EMIS appointment was cancelled by the scheduler | 13:33:56 book slot 2130348 → 13:34:01 EMIS "Patient already booked in slot" → 13:34:01 the FE failure rollback cancelled slot 2130348 for the patient → 13:34:03 EMIS accepted the cancel (the manual appointment). The retry at 13:34:17 then succeeded because the slot had just been freed. The different-patient attempt (13:35:30, "Slot already booked") was refused on the cancel ("This patient is not booked in this slot"), which is why it did not reproduce. **Pre-existing on** `development`: the rollback cancelled every slot of the attempt by slot id + patient, including the refused one. | **Fixed** in nhs-scheduler (88d0ac8f): only slots that actually returned a SessionId/AppointmentUID in this attempt are rolled back. |
| "EMIS appointment cancelled the second I click Reschedule" | Not what happened. In all six reschedules the old appointment's cancel was sent 2–4 s **after** the new booking relay, never on the click (e.g. 13:31:53 book new → 13:31:57 cancel old). The event the tester most likely saw is the 13:34:01 one above: Reschedule → chose 16:30 → the existing manual 16:30 appointment vanished, i.e. the previous row. | No change. |
| Back-home and sign-out | — | Working. |

Also observed: both failed reschedules restored the previous booking within seconds (`released_by_fe` → `restored_after_failed_reschedule`), i.e. the reschedule-failure fix working in practice. Both fixes are pushed; the feature stage redeploys automatically. Please retest the first two reports there.

## Comment — Beth

**Few comments**

- **If i navigate back too quickly, booking is shown as blank - unknown time, unknown clinician**
- The second I click reschedule, **my appointment in EMIS is cancelled.** It is not held until I select a new time to reschedule for.
- **I manually booked the patient an appt in EMIS for 4:30 to test the fallback behaviour of an appt not being available any more. PACO cancelled the appointment, critically booked outside of the scheduler link booking and not a booking it itself created, to release the appointment for the scheduler link. We cannot do this. I tried to replicate with a different patient booked in the slot but couldn’t, btu we still cannot be cancelling appointments that were not created by that specific scheduler link**
- Noted back home and sign out behaviour is working well

## Comment — tony.do — 2026-09-07

**Review gaps closed (2026-09-07)** — five gaps were raised on nhs-scheduler-be #517. All five were confirmed; fixes below. Nothing is merged or deployed yet.

| Gap | Finding | Fix | Where |
| --- | --- | --- | --- |
| 1 Unique indexes not shipped | Confirmed and worse: the four columns and both unique indexes only ever existed on dev, applied by hand. UAT has none of them; prod could not be checked (no read access to the prod paco database) and is assumed to match UAT. Deployed as-is, #517 would refuse every scheduler booking on UAT/prod. | paco-one-db migration `1788792381783_add-scheduler-booking-columns` (3 columns on appointment.appointment, 1 on appointment.session, both unique indexes built per partition then attached). No-op on dev; proven on a throwaway Postgres 16 (fresh apply, re-apply, dev-style pre-existing index, crash resume, UAT plain-table shape, duplicate key rejected). **Prod runbook in the PR:** pre-apply the four ADD COLUMN statements by hand or use a maintenance window (the migrator's single transaction otherwise holds an exclusive lock on both appointment tables for the index scan). | paco-one-db PR #908 (branch `PAC2-1805-scheduler-booking-columns`) |
| 2 Real booking hidden behind "in progress" | Confirmed: a Pending row whose confirm write was lost stayed "in progress" even though comms-hub held the booking. | On login, Pending + analytics 17/31 for the same send log dated after the Pending status, for the same slots ⇒ flipped to Booked. Pending with no analytics at all stays in progress by design (PAC2-8220 covers that). Alarm on `scheduler_booking_pending_stale` = ops item. | nhs-scheduler-be #517 |
| 3 Fail-closed rollout | By design. Dev pre-flight passes (5/5 organisations with a main location, 72/72 patient–organisation pairs). | UAT and prod pre-flight still to run before each deploy (needs comms-hub DB access per environment). | ops step |
| 4 Reschedule failure reopens link | Confirmed: the old Booked row was released before the relay; a relay failure or EPR rejection cancelled only the new row. | The reschedule releases the old row and records the new one in one transaction; the new row remembers the row it replaced, and on relay failure or EPR rejection it is cancelled and the previous booking restored (key live again, reschedule's Cancelled status removed). On paco-connect a failed retry rolls the release back. | nhs-scheduler-be #517 |
| 5 Read path on the replica | Confirmed. | Booking state is read from the writer (one indexed lookup per login). | nhs-scheduler-be #517 |

**Reviews (2026-09-07):** code review APPROVE after one round of changes; security audit PASS (no Critical/High introduced). Extra hardening from the audit: every booking asserts the unique index exists (missing = refused, never silent), attempt ids validated, reconcile requires matching slot ids. Test-coverage analysis found one more route to gap 4 (a second tab between the old row's release and the new insert): fixed by making the reschedule one transaction. Follow-up tickets to raise: audit row when a restore removes a Cancelled status; bind the analytics mutations to the verified token (pre-existing gap).

**Deploy order per environment:** paco-one-db #908 → FE #1407 with BE #517. **Tests:** 9 suites / 142 tests green, lint clean. **Still to run on the feature stage:** reschedule, cancel then rebook, EPR rejection (the scenarios that exercise gaps 2 and 4).

### How to test

1. Open a booking link, pick a slot, click Book, and refresh immediately. Expected: "Your booking is being confirmed" then the booked view. No Book button.
2. Same link in two tabs, click Book in both. Expected: one succeeds; the other shows "booking already in progress". One appointment in the EPR.
3. Book, then reschedule. Expected: old slot cancelled, new slot booked, confirmation comms for the new time only.
4. Book, then cancel. Expected: link shows no appointment and can be used to book again.
5. Quick-send link: same as 1. Expected: booked state survives refresh (previously quick-send links could not register as booked).
6. Repeat 1 for an EMIS, a SystmOne and a paco-connect practice.

Steps 1 and 2 passed on the feature build on 2026-09-07 (paco-connect practice).

Follow-up PAC2-8220 removes the browser from the confirmation step entirely.

## Current solution (supersedes the DynamoDB lock design above)

Root cause: the scheduler never stored whether a link had been booked. On every page load it inferred it from an analytics row the browser writes after the EPR confirms, so a refresh in that 2–5 s window showed the Book button again.

Fix: every booking is now recorded in PACO (`appointment.appointment`, one row per booking link) by the backend before the request goes to EMIS / SystmOne / paco-connect. The row starts as Pending and becomes Booked once the EPR confirms, or is released if the EPR rejects. Page loads read that row, so a refresh, second tab or back-button cannot re-open the Book button. A link can only ever hold one booking; a second appointment needs a second link.

No feature flag: the behaviour is always on once deployed (the earlier `SCHEDULER_BOOKING_STATE_ENABLED` flag was removed after the feature-branch test passed on 2026-09-07). Rollback = redeploy the previous build.

PRs: nhs-scheduler-be #517, nhs-scheduler #1407, NHS-COMMS-HUB-LAMBDA #1342 (quick-send links now carry a send-log id).

### Environments

- Feature build (dev data): https://dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state — backend feature stage `pac2-1805-booking-state`. Double-booking scenarios verified here on 2026-09-07 (patient Michael Ramella, campaign "Home Visit FJ", General Practice (Blinx Demo Site)).
- The comms-hub change (#1342) only affects links generated by the DEV comms pipeline, so quick-send test links need #1342 deployed to DEV.
- Deploy order per environment: FE #1407 first (or together with) BE #517, never BE alone, because the FE must understand the backend's refusal responses.

## Solution design (OLD)

Create a distributed lock and store on DynamoDB, reject follow up requests with `409 status` code if race condition detected.

### Lock design

- **Key**: `book:{patient_guid}:{campaign_id}:{communications_id}` — pulled from JWT-merged `params` (already available at handler entry, no plumbing). Per-link granularity: same link from two tabs collides; Link A and Link B for the same patient run independently.
- **TTL**: 30s (DynamoDB native TTL).
- **Atomicity**: per AWS docs, single-item `PutItem` with `ConditionExpression` has Serializable isolation — no `TransactWriteItems` needed.
- **Fencing**: `request_id` (UUID per acquire) on release-condition prevents a stale acquirer from deleting the next acquirer's lock if its own TTL expired mid-flow.
- **Reclaim**: acquire condition is `attribute_not_exists(lock_key) OR ttl < :now` — handles DDB's eventual TTL deletion so an expired-but-not-yet-evicted lock is treated as available.

### Feature flag

`BOOKING_LOCK_ENABLED` (env, default `'false'`). When false, both handlers short-circuit to the unwrapped internal method — zero behaviour change. Enable per-stage to roll out.

### Rollout

1. Deploy with `BOOKING_LOCK_ENABLED=false` → table and code shipped, no behaviour change
2. Enable in **dev** → run E2E
3. Enable in **UAT** → synthetic load
4. Enable in **pre-prod** → 24h soak
5. Enable in **prod** → 1-week monitor before removing the flag

**Rollback**: flip flag to `false`. No data migration to undo.

### How to test (OLD design)

**Unit / integration** (against DDB Local):

- 100 parallel acquires same key → exactly 1 succeeds, 99 × `ConditionalCheckFailedException`
- 100 parallel acquires distinct keys → 100 successes
- Acquire → wait 31s → re-acquire → succeeds (TTL reclaim)
- Acquire → simulated crash → re-acquire after 31s → succeeds

**Manual** (`BOOKING_LOCK_ENABLED=true`):

| Test | Expected |
| --- | --- |
| Click Book → rapid FE | Reload shows "Booking in progress" card; auto-recovers after lock release |
| Two tabs, same link, simultaneous click | One success; the other shows toast "Your booking is being processed” |
| Two tabs, **Link A + Link B** for same patient | Both succeed (regression check) |
| Throttle network to simulate slow EPS | Lock holds; success when EPR returns |

### Edge cases handled

| Scenario | Behaviour |
| --- | --- |
| Refresh mid-booking | Lock held → `bookingInProgress: true` → no rebook |
| BE Lambda crash mid-flow | TTL auto-releases after 30s |
| Patient closes browser | TTL auto-releases after 30s |
| EPR call >30s | TTL expires; **mitigation:** validate p99 EPR latency post-deploy, raise to 60s if `LockTTLReclaim` metric trends non-zero |
| Lock expired but DDB hasn't deleted yet | Acquire reclaims via `OR ttl < now` |
| DDB outage | Acquire throws → fail-closed (no silent double-book); `decodeToken` lock check fails open |

### Out of scope (follow-up tickets)

1. **Slot-level race** — `PostgresDatabasePACO.js:441` reads slot status outside the transaction; two different patients can both pass the availability check. Fix: `SELECT … FOR UPDATE`. Orthogonal to this patient-level race.
2. `CAMPAIGN_ANALYTICS` idempotency — audit POST has no client request id; FE retry creates duplicate audit rows.
