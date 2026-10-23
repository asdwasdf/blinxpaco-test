# Workflow: Staff Profiles

- Classification: `[Observed: dev, Blinx Deployment, 2026-10-21]`
- Aliases: `Staff Profiles`, `Add Care Professional`, `Skill Capabilities & Attributes`
- Coverage: `Partial (read-only)` trên Staff Profiles; source mutation ở Skills được ghi riêng.
- Confidence: `Medium`
- Last verified: `2026-10-21`
- Provenance: `product-explore/auto-20261021-1359/ledger.md#10`–`#11`.

## Business context observed

- `[Observed; #10]` Staff list có `Active`/`Archived`, `Search...`, `My Profile`, pagination và menu `Add Care Professional`.
- `[Observed; #10]` Grid columns `First Name`, `Last Name`, `Gender`, `Email`, `Roles`, `Mobile`, `Created At`, `Actions`. Không lưu giá trị staff có sẵn.
- `[Observed; #10]` Add form có tabs `General`, `Roles & Permissions`, `Skill Capabilities & Attributes`; action `Create`.
- `[Unverified hypothesis]` Form quản lý nhân sự/quyền và capabilities. Chưa tạo staff hoặc xác minh email/invite side effect.

## Entry

1. `[Observed]` `/paco/dashboard` → `Configuration` → `Users & Staff` → `Staff Profiles`.
2. `[Observed]` Route `/paco/configuration/staff/profiles`; heading `Staff Profiles`.

## Read-only flow

1. `[Observed; #10]` Search prefix riêng run → `Showing 0–0 of 0`; URL thêm query `q` tương ứng. Knowledge chỉ lưu path, không lưu giá trị query/user data.
2. `[Observed; #10]` Header icon menu → `Add Care Professional` mở dialog chưa lưu.
3. `[Observed; #10]` General có required labels `First Name(s)`, `Last Name`, `Gender`, `Email`; các field identity/registration/contact/integration/PIN khác không điền, không ghi prefilled values.
4. `[Observed; #11]` Tab `Skill Capabilities & Attributes` có hai multiselect `Skill Capabilities`, `Attributes`.

## Decision points

- `[Observed]` `Create` enabled khi form chưa điền; chưa submit nên không biết validation messages/server rule.
- `[Observed]` Skill picker thay đổi theo source create/rename/archive sau fresh page; không cần lưu profile để quan sát.
- `[Open Question]` Profile Create có tự tạo identity/invite/email không? Cần domain rule và safe unique email trước submit.

## End and exceptional states

- `[Observed; #10]` Empty search grid `Showing 0–0 of 0`.
- `[Observed; #11]` Ba lần fresh receiver check đóng draft bằng Escape/Close, không bấm Create hoặc chọn option.
- `[Observed]` Không thay profile/role của staff có sẵn, không SMS/email.

## Safety boundary

- Chỉ mở owned new draft và picker; không `My Profile`, edit/archive người dùng có sẵn.
- Không tạo tài khoản/role hoặc nhập identifiers/PIN thật.
- Dừng trước Create cho tới xác định safe email và side effects (`OQ-051`); recipient ngoài approved email hoặc SMS luôn cần approval riêng.

## Required test data

- Synthetic Name prefix `QA-test`, dữ liệu không PII; Email bắt buộc nhưng không tự dùng recipient tester để tạo tài khoản khi có thể trùng account.
- `[Observed; #11]` Owned Skill source đủ để kiểm tra picker không cần persisted Staff Profile.

## Interactive flow (owned test data)

- Không persisted Staff Profile mutation.
- `[Observed; #11]` Tạo owned Skill ở source → mở fresh Staff Profile draft → Skill Capabilities có exact Name.
- `[Observed; #11]` Rename source → fresh picker có tên mới, không tên cũ. Archive source → fresh picker không còn cả hai.
- `[Observed]` Close draft sau mỗi lần đọc; source Archive trong `finally`; script hoàn tất không error/cleanupError.

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| First/Last Name, Gender, Email | Không điền | Required labels visible | Chưa submit Create | `Observed / Open Question` |
| Empty form | Không submit | Create enabled | Chưa biết validator | `Observed` |
| Email format/duplicate | Chưa thử | Chưa biết | Chưa biết | `Open Question` |

## Cross-feature relationships

- `[Observed; #11]` `Organisation / Skills` → `Staff Profiles / Skill Capabilities`: source create cho option mới; rename thay tên; archive bỏ option trong fresh receiver.
- Chỉ xác minh availability trong picker, không saved assignment hoặc xử lý profile đang gắn archived Skill. Không nâng thành `Confirmed`.
- `[Unverified hypothesis]` Teams → Staff Profiles chưa kiểm tra vì source Team chưa persist an toàn.

## Anomalies and unverified behavior

- Không defect đủ evidence trên Staff Profiles.
- `[Open Question]` Create/invite/identity side effects, safe unique Email, validation và cleanup scope (`OQ-051`).
- `[Open Question]` Saved Skill assignment/role gating/Attributes còn chưa thử.

## Mutation coverage

| Workflow branch | Status (Performed/Skipped/Not supported) | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|
| Open Add draft → inspect General → Close | Performed | — | Required labels only | List → draft → closed | Không lưu, N/A | Done |
| Source Skill create → receiver picker | Performed | Receiver read-only | Exact Name availability | Fresh picker có owned option | Fresh page | Done, source Archive/draft Close |
| Source Skill rename → receiver picker | Performed | Receiver read-only | New/old exact Name | Fresh picker new only | Fresh page | Done |
| Source Skill archive → receiver picker | Performed | Receiver read-only | Both Names absent | Fresh picker removes option | Fresh page | Done |
| Create Staff Profile → list | Skipped | Safe Email/identity/invite side effects chưa rõ | Chưa submit | Create visible | Không | N/A |
| Edit/cancel/save Staff Profile | Skipped | Không owned persisted profile | — | Không mở shared profile | Không | N/A |
| Archive/Restore Staff Profile | Skipped | Không owned persisted profile | — | Archived list visible, row actions chưa map | Không | N/A |
| Roles & Permissions / Attributes save | Skipped | Quyền/security và prerequisites chưa xác lập | — | Tab/Attributes visible | Không | N/A |
| Teams → profile consumer | Skipped | Không owned persisted Team | — | Receiver field chưa map | Không | N/A |

- Nhánh quan sát end state / nhánh tìm thấy: **4/9**, toàn receiver read-only. Staff Profile mutation **0**, coverage vẫn `Partial (read-only)`.
- Không claim unsupported cho branch chưa map.
- Cleanup: không staff persisted, draft closed; owned source Skill UI Archive. Final fresh-page sweep #12: prefix toàn run có `Showing 0–0 of 0`, 0 active staff row, 0 dialog; 0 active Skills. Không chứng minh hard deletion/archived retention.

## Execution guidance

- Dùng prefix run để lọc trước khi mở form, không đưa staff values vào evidence.
- Chỉ mở Add draft để inspect; không submit Create cho tới OQ-051 có đáp án/scope.
- Chờ target tab/picker load, kiểm tra exact Name; không suy total dataset từ option subset.

## Automation guidance

- Landmarks: `Staff Profiles`, `Search...`, `Add Care Professional`, `Skill Capabilities & Attributes`, `Close`.
- Add là dialog; Skills source Add/Archive là dialog, Edit drawer `complementary`.
- Script local `skills-staff-picker.js` kiểm tra create/rename/archive propagation, guard exact origin, cleanup source trong finally; đã chạy thành công.
- Không dùng availability picker làm expected result của persisted assignment/role permission chưa có trusted basis.

## Provenance and gaps

- Environment: `dev`, `blinx.dev.blinxpaco-np.com`.
- Role: `Blinx Deployment`.
- Observed at: `2026-10-21`.
- Raw evidence: `test-results/product-explore/auto-20261021-1359/ledger.md#10`–`#12`, `skills-staff-picker.js`, `final-cleanup-check.js`.
- Open questions: `OQ-051`; saved assignment và Teams relation chưa verified.
- Exact resume: Staff Profiles list, không dialog, no persisted owned staff. Feature tiếp theo chọn từ autonomous frontier sau checkpoint.

## Tester notes
