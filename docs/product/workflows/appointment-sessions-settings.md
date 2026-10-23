# Workflow: Appointment Sessions source

- Classification: `[Observed: dev, Super Admin GB, 2026-10-22]`
- Aliases: `Sessions`, `Add Session`, `Timed Appts`, `Untimed Appts`
- Coverage: `Partial (interactive)` — historical draft pass 5/9; saved lifecycle pass 9/15 giữ riêng, cleanup generated occurrences `Inconclusive`.
- Confidence: `Medium`
- Source: `product-explore/auto-20261022-1742/ledger.md#5–6` cho historical draft/receiver; `product-explore/auto-20261022-2011/ledger.md#2–4` cho saved lifecycle bên dưới.

## Business context observed

- Configuration source có session name, assignment, frequency, duration và slot count; schedule relationship mới là candidate, chưa receiver proof.
- Actual role `Super Admin GB`; không kiểm permission matrix. Không mở patient/booking hoặc chọn shared assignment.

## Entry và read-only flow

1. Known `/paco-connect/configuration/` mở `Sessions` mặc định; chờ actual header và `Search Session...`.
2. Configuration `Appointment Books` button mở region/tree gồm `Sessions`, `Slot Types` và các entries liên quan; hover riêng từng không expand.
3. Grid headers: `Assigned Location`, `Assigned Slot types`, `Weekdays`, `Frequency`, `Duration`, `Slot Count`, `Session Name`, `Actions`.
4. Add speed-dial → `Add Session`; complementary có `Loading` trước form.
5. Row menu có `Edit`, `View Audit`, `Archive`, `Clone`, `Delete`, `Cancel session appointments`; chỉ đọc labels, không chọn action trên existing row.

## Required test data và safety boundary

- Historical pass chỉ unsaved draft. Saved pass dùng fresh owned `QA-test` Session, Book và Slot Type; chỉ chọn exact current-run prerequisites.
- Không chọn existing book/slot/staff/location, không notification, booking hoặc private API; cleanup template không thay independent generated-occurrence proof.
- Owned prerequisite creatable có thể khám phá tại source riêng; không dùng pending patient decision để authorize clinical writes.

## Interactive flow (owned test data)

- Add form: required `Session Name`, `Timed Appts` default, required `Slot Duration (min)` default `10`, `Frequency`, `Apply Multi-Org Split`, `Assigned Slot Types`, `Assigned Appointment Book`, `Service provider`, `Location 1`, `Care Professional 1`, `Add another`, `Cancel`, `Save`.
- `Frequency` expand có Hours From/To, Start/End Date, Days và Reoccurrence Daily/Weekly/Monthly/Yearly/Weekdays; defaults không là trusted scheduling rules.
- Sửa owned draft Name, chọn `Untimed Appts`: duration chuyển thành `Slot counts *` default `10`.
- Dirty `Cancel` mở `Discard unsaved changes?`, copy `You have changes to this session that are not saved.`; `Keep editing` giữ Name/Untimed.
- Cancel lại rồi `Discard changes` bỏ local buffer. Fresh Add có Name blank, Timed default và duration `10`; clean Cancel đóng không cần discard dialog.
- Final reload giữ root search blank, không drawer/dialog; chưa saved business persistence.

## Validation behavior

- DOM `Session Name` và timed duration required; Save chưa dispatch, không exact submit-validation message hoặc server-rule proof.
- Draft/name validity probe không return do later confirmation wait timeout; không dùng probe đó làm result.

## Cross-feature relationships

- Later `[Observed]`: `Slot Types source` → `Assigned Slot Types` có một unique relationship với ba trigger observations: owned Create hiện unselected; rename thay original bằng edited; Archive bỏ cả hai và hiện `No results found` trong fresh Add picker. Không chọn option hoặc Save Session — `product-explore/auto-20261022-1742/ledger.md#6`.
- `[Observed]` Saved pass: `Appointment Books source` → `Assigned Appointment Book` có hai triggers: fresh owned Create xuất hiện/chọn được và retained trong saved Session editor; Archive sau Session Delete làm fresh picker hiện `No results found`. Đây new unique edge; Book→schedule selector giữ riêng. — `product-explore/auto-20261022-2011/ledger.md#3`.
- `[Observed]` Cùng pass reverify Slot Type→Session Create/Archive, gồm retained selection trong saved editor và fresh receiver absence; không new unique product edge. Không có Session→schedule occurrence proof. — `ledger.md#3–4` cùng run.

## Anomalies and unverified behavior

- Cancel wait-hidden timeout do discard confirmation chưa xử lý, không product defect.
- Historical pass chưa saved lifecycle; later pass bên dưới bổ sung Create/validation/template Delete. Rename và generated-occurrence cleanup còn `Inconclusive` theo OQ-072/OQ-073; staff/location footprint ngoài owned blank defaults chưa kiểm.

## Mutation coverage

| Branch | Exercised | End state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Root / Add map | Performed | Loaded source/form | N/A | Done |
| Frequency expand | Performed | Frequency region visible | UI only | Done |
| Timed / Untimed | Performed | Slot counts replaces duration | Draft only | Done |
| Keep editing | Performed | Owned Name/type retained | Local buffer | Done |
| Discard / fresh reset | Performed | Fresh Name blank, Timed default | Reopen + root reload reset | Done |
| Create / submit validation | Skipped | Owned prerequisites/footprint chưa established | Chưa kiểm | N/A |
| Edit / Save | Skipped | Chưa saved owned Session | Chưa kiểm | N/A |
| Owned cleanup | Skipped | Chỉ menu labels; chưa saved source | Chưa kiểm | N/A |
| Session / schedule receiver | Skipped | Chưa owned source | Chưa kiểm | N/A |

**5/9 bounded draft-pass branches**, 0 Session business mutations/new records, cleanup Done. Navigation done; main workflow, branches/states, validation, persistence partial; mutation none; errors/edge partial. Later Slot Type receiver evidence nâng relationships thành partial, không cộng lại vào 5/9 hoặc coi saved Session lifecycle complete.

### Saved lifecycle pass — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-2011/ledger.md#2–4`; independent pass, không cộng vào historical 5/9.

- Blank `Session Name` chặn submit bằng native `Please fill out this field.`; named submit với assignments blank hiện `Slot Types is required.` và `Appointment Book is required.`. Native required attributes không đủ xác định server rules.
- Minimal Create chọn exact fresh owned Book/Slot Type, giữ optional staff/location/split blank và Frequency defaults; source reload/fresh Edit retained Name, duration `10` và own assignments. `Service provider` tự filled current organisation trong Edit dù Add để blank; chưa xác định semantics.
- Saved Edit cảnh báo Slot Type chưa mapping Email/SMS campaign, copy Quick Book unavailable until mapping; `Set up mapping` dẫn same-dev `/configuration/?slot_type_id=:id#scheduler-config`. Chưa follow mapping hoặc kiểm rule/notification thực tế.
- Edit draft `Cancel`/`Discard changes`, fresh reopen giữ original. Rename `Save` một lần giữ drawer mở, không native invalid input; metadata `POST /dev/api/sessions/check-time-edit-impact` trả `404`. Discard/reload original retained, edited absent: rename `Inconclusive`, chưa root cause hoặc defect.
- `Archive` mở `Session Can't Be Archived`, copy Session still in use; không Archive transition. `View affected bookings and sessions` tải CSV, không detail view; isolated CSV có hai rows `Type=Session`, cả hai exact owned Name. Chưa biết nguyên nhân hai rows.
- Exact own `Delete` yêu cầu permanent acknowledgment trước `Continue`; success toast chưa đủ, fresh settled source query mới xác nhận template absent. Book/Slot Type sau đó Archive, fresh sources/pickers absent; generated occurrences sau Delete chưa có independent readback, giữ potential leftover theo OQ-073.

| Saved-pass branch | Exercised | End state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Blank Name submit | Performed | Native required block | N/A | Done |
| Named submit / blank assignments | Performed | Hai inline required messages | Không saved record | Done |
| Create / fresh readback | Performed | Own Name/duration/assignments retained | Reload + fresh editor | Template removed; occurrence cleanup Leftover |
| Saved Edit / Cancel | Performed | Draft discarded, original retained | Fresh editor | Done |
| Rename / Save | Skipped | Attempt `Inconclusive`; original retained sau Discard | Rename không persisted | Draft discarded |
| Archive dependency gate | Performed | Still-in-use dialog, không Archive | Gate only | Dialog closed |
| Affected export | Performed | Downloaded CSV hai owned Session rows | File only | Local isolated evidence |
| Delete / source readback | Performed | Template absent sau settled reload/search | Source UI | Template Done; occurrences Leftover |
| Book source / Session receiver | Performed | Create selection retained; Archive absent | Fresh saved editor + picker | Prerequisite Archive Done |
| Slot Type / Session receiver | Performed | Create selection retained; Archive absent | Fresh saved editor + picker | Prerequisite Archive Done |
| Generated occurrence cleanup | Skipped | Không safely scoped receiver proof sau template Delete | `Inconclusive` | Potential Leftover |
| Untimed saved lifecycle | Skipped | Chỉ historical unsaved toggle | Chưa kiểm | N/A |
| Recurrence / duplicate / boundary validation | Skipped | Chưa trusted domain basis hoặc independent fixture | Chưa kiểm | N/A |
| Clone / View Audit | Skipped | Deferred, không tạo thêm fixture để tăng coverage | Chưa kiểm | N/A |
| Mapping / notification handoff | Skipped | Chỉ warning/link; chưa owned campaign mapping | Chưa kiểm | N/A |

**9/15 bounded saved-pass branches**, hai persisted Session mutations: Create và template Delete. Không persisted rename hoặc Archive; cleanup toàn saved Session `Inconclusive`, không khẳng định occurrences còn active hay đã mất. Dimensions: navigation `done`; main workflow, branches/states, mutation, validation, persistence, relationships, errors/edge `partial`.

## Execution và automation guidance

- Scope drawer bằng heading `Add Session`, field `Session Name` cần input name vì textbox chưa accessible label; dirty Cancel phải chờ named discard dialog.
- Không force close drawer hoặc replay Save khi outcome chưa rõ. Khi menu không đóng rõ, reload trước leave.
- Scheduling/assignment correctness, validation và cleanup rules cần trusted expected basis riêng.

## Provenance and gaps

- `product-explore/auto-20261022-1742/ledger.md#5`, `sessions-observation.json`.
- Saved pass evidence: `product-explore/auto-20261022-2011/ledger.md#2–4`, `ui-observations.json`; giữ OQ-072/OQ-073, không replay Create/Delete hoặc restore Archived prerequisites.

## Tester notes

