# Patient Profile & PDS Gate 1 Epic

## Trends và Shared Records — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0819/ledger.md#5–6`.

- Dashboard `View all trends` mở `Trends & Measurements` cùng route dashboard; `All Measurements`/`Priority Only` đổi pressed state. Baseline empty copy `No priority measurements found` không chứng minh patient khỏe hoặc dataset đầy đủ.
- Search synthetic đổi thành `No measurements found matching your search`; clear/All trả baseline; Back/reopen query blank và All selected. Coverage 3/5 read-only groups: root/back, mode toggle, search/clear/reopen; populated detail và range/chart correctness Skipped vì không fixture. Cleanup N/A; navigation done, branches/errors partial, các dimension business mutation/persistence/relationships none.
- Shared Records route `/paco/patient-profile/:id/shared-records` có Date Selection, Search, GP Connect, Launch NCRS. Sau batch search/clear/date click xuất hiện `Smartcard Login Required`; trigger riêng chưa xác định. Close khôi phục blank search/All Time, không external login/handoff.
- Shared Records coverage 2/5 groups: root và Smartcard gate dismiss Performed; populated record/date filtering/external handoffs Skipped thiếu Smartcard prerequisite. Cleanup N/A; navigation/branches/errors partial, workflow/mutation/validation/persistence/relationships none. Không clinical access hoặc mutation.

## Template Library menu boundary — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0819/ledger.md#4`.

- Configuration > Clinical Config > Template Library visible; pointer/native anchor clicks đóng menu nhưng route giữ `/paco/configuration/organisation/general`, không tab/dialog mới. Auth/role vẫn đúng qua shared preflight.
- Coverage 1/3 bounded groups: menu interaction Performed; library root/owned template cleanup Skipped vì destination chưa tới. Không mutation, permission/defect verdict hoặc cross-feature relationship. OQ-077 vẫn Open; template leftover giữ checkpoint.

## Documents own template lifecycle — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0819/ledger.md#3`.

- `Save as Template` mở dialog Template Name required, Category Letter/Referral/Other, optional Description; Save template không Save patient document, editor vẫn mở.
- Discard document draft/reload rồi `From Template` có own template và synthetic preview; `Use this template` chuyển body vào editor nhưng title blank. Điền title Save/reload tạo patient document; Delete/reload trở empty verified.
- Picker tự chọn baseline đầu; không tự dùng baseline. Không template management/delete tại picker hoặc bounded Configuration > Patient menu; own template còn lại, ghi checkpoint để cleanup khi có UI path.
- Mutation coverage 4/6 bounded groups: picker/back, template Save/readback, Use/body draft, generated document Save/Delete Performed; template update/delete và category/validation Skipped. Ba persisted changes; document cleanup Done, template Leftover. Navigation done; workflow/branches/mutation/persistence partial, validation/relationships/errors none; source-to-picker là same-feature dependency, không cross-feature edge.

## Documents pointer Download control — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0819/ledger.md#2`.

- Owned generated PDF qua `Document actions` button và pointer `Download` menuitem tạo download event, filename đúng synthetic title, failure null. Native-dispatch timeout pass trước không reproduced bằng pointer; không product defect established.
- Default `No review needed` unchecked, Save/reload detail vẫn `Pending Review`, giống checked control #1; OQ-076 semantics vẫn Open.
- Mutation coverage 3/4 bounded groups: Create/readback, Download completion, Delete/reload Performed; PDF content validation Skipped. Hai persisted changes và một Download; cleanup Done, không new leftover/relationship. Navigation done; workflow/branches/mutation/persistence/errors partial, validation/relationships none.

## Documents explicit review checkbox — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0819/ledger.md#1`.

- `No review needed` là checkbox; fresh editor unchecked. Label click thay checked state, không mở dropdown; Cancel/reopen trở unchecked.
- Explicit checked được xác minh trước Save; success rồi reload/list/detail vẫn `Pending Review`. OQ-076 vẫn Open vì semantics chưa có trusted basis; không kết luận defect.
- Owned card action nên scope `button`: nested span và button cùng accessible label có thể làm count/locator không unique. Pointer menu Delete/confirmation và reload empty verified.
- Mutation coverage 4/5 bounded groups: checkbox toggle, Cancel/reopen, checked Save/readback, Delete/reload Performed; unchecked saved control Skipped. Hai persisted changes; cleanup Done, không new leftover/relationship. Navigation done; workflow/branches/mutation/validation/persistence/errors partial, relationships none.

## Dashboard customisation picker — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0713/ledger.md#7`.

- Route `/paco/patient-profile/:id/dashboard`; `Customise Dashboard` accessible name kèm selected count. Picker có Search, 14 card labels, `Reset`; không Save/Cancel observed.
- Unmatched search không còn card option; `Timeline` search thu một label. Clear/reopen query blank, `14 Selected` giữ nguyên; close picker verified.
- Coverage Partial (read-only), 3/5 bounded groups: open/close, unmatched search, matching/clear/reopen. Selection/persistence và Reset Skipped vì scope/auto-persistence chưa rõ. Không clinical action, mutation hoặc new leftover; cleanup N/A.
- Navigation done; branches/errors partial; main workflow/mutation/validation/persistence/relationships none. Search không chứng minh card data correctness.

## Timeline root — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0713/ledger.md#5`.

- Route `/paco/patient-profile/:id/timeline`; root `No data`, Search, fullscreen, All Time/year controls, Sector/Event Type/Organisation/Status pickers, Patient/My org/External toggles.
- Continuation: fullscreen chuyển thành `Exit full screen`; exit khôi phục `Expand to full screen`. Event Type chọn `Document` hiện `1 Selected`; reload settled `No data`, cả bốn picker trở `0 Selected`. Chưa chứng minh filtering correctness trên populated data.
- Coverage Partial (read-only), 2/4 bounded groups: root và filter/fullscreen controls Performed; populated detail/source correlation Skipped vì chưa fixture. Auth expiry trước đó được khôi phục cùng role; không product failure established.
- Navigation done; branches/persistence partial (chỉ preference reset); mutation/validation/relationships none. Cleanup N/A, controls reset; no new leftover.

## Documents Download diagnostic — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0713/ledger.md#6`.

- Synthetic Document Create hiển thị success; auth recovery cùng role rồi list/detail xác minh saved title. Cleanup cuối cùng reload empty list và own title absent.
- Native dispatch vào menu `Download` không cho download event trong 20 giây; kết quả `Inconclusive`, chưa chứng minh file/content hoặc product defect. Native menu dispatch cũng không mở Delete confirmation; pointer click mở được, nên locator dispatch là diagnostic confounder.
- Mutation coverage riêng 2/3 bounded groups: prerequisite Create/readback và Delete/reload Performed; Download completion/content chưa verified. Hai persisted changes, cleanup Done; không new leftover hoặc relationship. Navigation done; main workflow/branches/mutation/persistence/errors partial, validation/relationships none.

## Payments placeholder — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0713/ledger.md#4`.

- Route `/paco/patient-profile/:id/payments`; tabpanel renders only `Payments`, no button/input/link observed. This does not establish billing history absence or feature unsupported.
- Coverage `Partial (read-only)`, 1/3 bounded branches: root Performed; history and transaction flow Skipped because observed root exposes neither.
- Navigation done; other dimensions none, no mutation, validation or persistence verified. Cleanup N/A; no new leftover.

## Patient Comms empty receiver — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0713/ledger.md#3`.

- Route `/paco/patient-profile/:id/patient-comms`; Search, Date Selection, seven category links; no create/send button observed within tabpanel.
- All comms empty label `No messages to show`; health forms category changes query and label to `No Health Forms to show`. Accessible category names lowercase despite visual capitalization.
- Synthetic search/clear on empty data retains empty root; matching correctness unverified. Date Selection exposes From/To calendars, Cancel/Apply; Cancel retains All time.
- Coverage `Partial (read-only)`, 4/7 branches: root, category switch, empty search/clear, date open/Cancel. Skipped populated detail/matching, date Apply/filter correctness, source-send correlation due missing comms fixture.
- Navigation done; branches/errors partial; main workflow, mutation, validation, persistence and relationships none. No source send, receiver relationship, new leftover or defect verdict; cleanup N/A, controls closed.

## Tasks draft — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0713/ledger.md#1–2`.

- Owned Profile `Tasks`, route `/paco/patient-profile/:id/tasks`, root `Total Tasks: 0`; Active/Closed/All, grouping, Filters and Create New task visible.
- Create dialog prefills patient. Task Type `Free text` reveals title; Board, Description, column and Due Date marked required; staff/team, reviewer, status, priority and resources also visible.
- Save disabled on blank form; title/description filled leaves `workboard_id: Required` and `task_due_date: Invalid input`. No submit; server rules unknown.
- Cancel then reopen resets type/description; Cancel/reload returns empty root, zero dialogs. Cleanup Done; no persisted task.
- Board picker populated but safe notification mapping not verified; no board/assignee selected, comment added or resource uploaded. Existing dev data authorization is not recipient proof.

### Mutation coverage — Tasks

| Branch | Status | End state / limitation |
|---|---|---|
| Empty root | Performed | Total Tasks: 0 |
| Task Type / Free text | Performed | Title field visible |
| Title/description validation gate | Performed | Remaining Board/date errors, Save disabled |
| Cancel/reopen/reload | Performed | Draft reset, empty root; cleanup Done |
| Valid Save | Skipped | Safe Board/notification mapping needed |
| Saved update/status/delete | Skipped | No saved fixture |
| Resource/comment/attachment | Skipped | Separate mutations not exercised |
| Cross-feature receiver | Skipped | No saved source |

Coverage Partial, 4/8 bounded branches; navigation done, main workflow/branches/mutation/validation/persistence partial, relationships none, errors/edge partial. Persistence covers draft discard only. Filters/grouping remain untested.

## Autonomous owned patient receiver — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0223/ledger.md#3–4`.

- Entry: exact owned `Patient Search` result → pinned `Actions` → `Profile` → `/paco/patient-profile/:id/dashboard`; actual destination role independently verified.
- Source patient Create và optional `Known As` Update đã giữ sau list reload; Profile receiver hiển thị owned identity và updated field. Một observed two-sided edge từ registration/demographics tới Profile, không suy clinical filing hoặc booking/media propagation.
- Dashboard có `Patient actions`, `Customise Dashboard`, `Trends`, `Health Report` và cards; mới map receiver, chưa thay dashboard, clinical record, pharmacy, risk hoặc send.
- Mutation coverage: **1/1 bounded receiver-readback branch Performed**, không enumerated Profile lifecycle; navigation `done`, main_workflow/branches_states/relationships `partial`, mutation/validation/persistence chưa exercise riêng tại receiver. Owned source intentionally retained theo patient decision; không Profile draft.


## Owned Documents lifecycle — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0506/ledger.md#1–3`.

- Entry: owned Patient Search row mở Profile; tab `Documents` tại `/paco/patient-profile/:id/documents`. Empty state `There are no documents for this patient yet`. `Create New` có `Document`, `Fit Note`, `From Template`; Upload riêng.
- `Document` mở editor với `Document Title`, rich text, merge fields, `Save as Template`, review selector, `Preview`, `Cancel`, `Save`. Blank Save: `Please enter a document title`; title-only Save: `Document content cannot be empty`.
- Synthetic title/body Save: `Document saved successfully`; generated PDF xuất hiện trong list và detail sau reload. Không dùng merge fields hoặc clinical content.
- Detail `Pending Review` có option `Reviewed`; đợi `Saving...` kết thúc rồi reload/reopen, detail và card đều `Reviewed`. Reload quá sớm từng cho Pending; không coi immediate DOM hoặc filter button `Reviewed` là persistence proof.
- Default editor hiển thị `No review needed` nhưng saved record ban đầu `Pending Review`/card `Pending`; semantics chưa rõ, chưa kết luận defect.
- `Document actions` có `Download`, `Send to patient`, `Create Task`, `Delete`. Delete own record mở confirmation `This action cannot be undone and will be audited.`; confirm và reload trở empty state, exact owned title absent. Cleanup `Done`.

### Mutation coverage

| Nhánh | Thực hiện | Validation / end state / persistence | Cleanup |
|---|---|---|---|
| Empty list và Document editor entry | Performed | Empty state rồi editor visible | Done |
| Blank title gate | Performed | Exact title error; editor retained | Done |
| Empty content gate | Performed | Exact content error; editor retained | Done |
| Valid Create và list/detail readback | Performed | Success; generated PDF/title qua reload | Done |
| Pending Review → Reviewed | Performed | Detail/card Reviewed sau settled Save và reload/reopen | Done |
| Delete confirmation và deletion | Performed | Reload empty và exact title absent | Done |
| Preview / Cancel / duplicate / boundary | Skipped | Chưa exercise riêng | N/A |
| Review selector semantics / reverse transition | Skipped | Cần focused experiment mới | N/A |
| Upload / Download / From Template | Skipped | Chưa exercise trong bounded pass | N/A |
| Fit Note / Analyse / annotation / comments / task / send | Skipped | Chưa map scope hoặc downstream side effects | N/A |

**6/10 bounded branch groups**, `Partial`. Navigation done; main workflow, branches, mutation, validation, persistence partial; relationships none; errors/edge partial. Ba persisted business mutations: Create, review update, Delete. Không two-sided cross-feature edge; PDF generation là same-feature result. Existing synthetic patient retained; không document leftover. Runnable cleanup check: `test-results/product-explore/auto-20261023-0506/documents-cleanup-check.js`.

## Document draft Preview và discard — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0506/ledger.md#4`.

- `Preview` mở `Document Preview`, render synthetic body, có `Save Document`; Close giữ draft title. Không bấm preview Save.
- Dirty editor `Cancel` mở `Discard unsaved changes?`; `Keep Editing` giữ title; `Discard & Exit` trở list empty. Reload xác minh draft không persist.
- Click copy `No review needed` không lộ options trong pass; OQ-076 vẫn Open.
- Mutation coverage riêng **3/4 bounded branches Performed**: Preview/Close, Keep Editing, Discard/reload; preview Save Skipped để không replay completed saved lifecycle. Duplicate/boundary và review semantics chưa exercise. Cleanup Done, không new saved record hoặc edge; denominator độc lập với historical 6/10 groups.

## Owned Patient Appointments receiver — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0506/ledger.md#5`.

- `Appointments` tab mở `/paco/patient-profile/:id/appointments`; `Search appointments`, grid columns `Appt Type`, `Appointment Name`, `Date`, `Start Time`, `End Time`, `Status`, `Actions`; settled `No Rows To Show` trên owned synthetic patient, không tabpanel button.
- Mutation coverage **1/3 bounded branches**: root empty Performed; known matching/search và booked-row lifecycle Skipped vì chưa owned appointment fixture. Read-only Partial; navigation done, branches/errors partial, main workflow/mutation/validation/persistence/relationships none. Không booking propagation hoặc two-sided relationship evidence; cleanup N/A, không leftover.

## Synthetic TXT Upload — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0506/ledger.md#6–7`.

- `Upload a document` mở native single-file chooser; accept `.pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.csv,.xlsx`. Chọn synthetic TXT tự upload ngay, không intermediate form; success toast, filename trong card và detail sau reload. Đây UI accept list, chưa chứng minh server hỗ trợ mọi extension.
- Owned uploaded item có `Pending Review`; không bấm Analyse/send/task. Exact owned item Delete/confirm rồi reload về empty state, filename absent; cleanup Done.
- Mutation coverage **3/6 bounded branches Performed**: chooser/cancel, TXT upload/reload/detail, Delete/reload. Unsupported format/size, other accepted formats, Download Skipped vì ngoài bounded pass. Hai persisted mutations: Upload và Delete; không new cross-feature relationship hoặc leftover.

## PDS Gate 1 — Epic Overview (PAC2-63)

### Epic Summary
**PAC2-63 — PDS Gate 1** là Epic tích hợp NHS Personal Demographic Service (PDS) vào Patient registration.

### Epic Children Tickets
| Ticket | Title | Status |
|--------|-------|--------|
| `PAC2-114` | Address finder / postcode lookup | ✅ Done |
| `PAC2-115` | Email sent to PDS submission | ✅ Done |
| `PAC2-116` | Phone numbers include type | ✅ Done |
| `PAC2-117` | Address Line 5 map to county | ✅ Done |
| `PAC2-118` | PDS "More fields" | ✅ Done |
| `PAC2-120` | Language selection SNOMED CT | ✅ Done |
| `PAC2-121` | Temporary address 90-day cap | ✅ Done |
| `PAC2-122` | Postcode for temporary/billing address | ✅ Done |
| `PAC2-123` | Date of Death pulled from PDS | ✅ Done |
| `PAC2-124` | Email field included in PDS update | ✅ Done |

### Entry Point
1. Navigate to `/paco/patient-search`
2. Click `Create new patient` button
3. Dialog `Create New Patient` opens

### Create New Patient Tabs
1. **Patient** — PDS Check section, NHS Number, "More fields"
2. **Personal** — Date of Birth, Date of Death, Language, etc.
3. **Contact** — Email, Phone (Home/Mobile), SMS/Email options
4. **Address** — Postcode lookup, Temporary address with 90-day cap
5. **Healthcare Provider** — GP details
6. **Relationships & Permissions**

### Patient Search Grid Columns
| Column | Source |
|--------|--------|
| Date of Birth | PDS |
| Date of Death | PDS (PAC2-123) |
| Home Phone | PDS (PAC2-116) |
| Mobile Phone | PDS (PAC2-116) |
| Email Address | PDS (PAC2-115/124) |
| Main Language | PDS SNOMED CT (PAC2-120) |
| Interpreter Required | PDS |
| County | PDS (PAC2-117) |
| Postcode | PDS |

---

## Address Finder / Postcode Lookup (PAC2-114)

### Entry
1. Navigate to `/paco/patient-search`
2. Click `Create new patient` button
3. Dialog `Create New Patient` opens with tabs: Patient, Personal, Contact, **Address**, Healthcare Provider, Relationships & Permissions
4. Click **Address** tab

### Address Finder Flow
- Field: `Search by postcode` (combobox)
- Type UK postcode (e.g., "NG1 1EA") → suggestions appear
- Select suggestion → address fields auto-populate:
  - `numberandstreet` (Address line 1)
  - `village` (Address line 2)
  - `city` (Town/City)
  - County (auto-filled)
  - Postcode (auto-filled)

### Address Fields
| Field Name | Type | Notes |
|---|---|---|
| `numberandstreet` | textbox | Address line 1 |
| `village` | textbox | Address line 2 (optional) |
| `city` | textbox | Town/City |
| `locality_desc` | textbox | Locality (optional) |
| `county` | combobox | Auto-populated from postcode lookup |
| `postcode` | textbox | Postcode |
| `access_instructions` | textbox | Access instructions (optional) |

### Temporary Address Fields
Same fields prefixed with `temporary_`:
- `temporary_house_flat`
- `temporary_street`
- `temporary_town_city`
- `temporary_postcode`
- `temporary_access_instructions`

### Technical Notes
- Postcode lookup integrates with PDS (Personal Demographic Service) or external address service
- Auto-populate reduces manual entry errors
- Service availability depends on NHS connectivity
- **PAC2-117 Bug Fix:** Address Line 5 → County mapping (PDS "S Yorkshire" vs "South Yorkshire" discrepancy fixed)

### Related Tickets
- `PAC2-114` — Address finder / postcode lookup (base feature)
- `PAC2-117` — County mapping bug fix (S Yorkshire vs South Yorkshire)
- `PAC2-118` — PDS Check More fields (additional PDS info)
- `PAC2-121` — Temporary address 90-day cap restriction

## Temporary Address — 90-Day Cap (PAC2-121)

### Entry
1. Navigate to `/paco/patient-search`
2. Click `Create new patient` button
3. Dialog `Create New Patient` → **Address** tab
4. Scroll to Temporary Address section

### Temporary Address Fields
| Field Name | Type | Notes |
|---|---|---|
| `temporary_address_type` | select | Address type (e.g., Temporary) |
| `temporary_house_flat` | textbox | House name/flat number |
| `temporary_street` | textbox | Street address |
| `temporary_town_city` | textbox | Town/City |
| `temporary_postcode` | textbox | Postcode |
| `temporary_access_instructions` | textbox | Access instructions |

### Validation Rules (PAC2-121)
- **90-day cap:** End date must be ≤ 90 days after Start date
- **Max date for temporary address:** Tomorrow (not today)
- **Billing address:** Max date is today (future date throws error)
- Same rules apply to temporary emails and phones

### NHS PDS Guidelines
Reference: [Get and update contact details in PDS - NHS England Digital](https://digital.nhs.uk/developer/api-catalogue/personal-demographics-service-fhir/get-and-update-contact-details-in-pds#contact-details-for-healthcare-workers)

### Test Scenarios
1. Temporary address with end date ≤ 90 days → accepted ✓
2. Temporary address with end date > 90 days → validation error
3. Temporary address end date = tomorrow → accepted
4. Billing address with future date → error thrown

## PDS Check — More Fields (PAC2-118)

### Entry
1. Navigate to `/paco/patient-search`
2. Click `Create new patient` button
3. Dialog `Create New Patient` opens with tabs
4. Click **Patient** tab
5. Scroll to **PDS Check** section

### PDS Check Section
- **NHS Number** field
- **Postcode** field (for PDS lookup)
- **Last Name** field
- **Date of Birth** field
- **"More fields"** button — expands to show additional PDS fields when no match

### More Fields Expansion
When PDS returns no match or partial match:
- Click "More fields" button to expand
- Additional patient demographics visible:
  - Middle Names
  - Known as
  - Previous Family Name
  - Title
  - etc.

### Technical Notes
- PDS (Personal Demographic Service) lookup for NHS patient verification
- "More fields" reveals additional demographics for manual matching
- **PAC2-122 Bug Fix:** PDS payload must include postalCode for temporary/billing addresses

### Test Scenarios
1. Valid UK postcode → address auto-populated ✓
2. Invalid/incomplete postcode → no suggestions
3. Edit auto-filled address → manual override preserved
4. Clear postcode → address fields cleared

## Phone Types / Contact Methods (PAC2-116)

### Entry
1. Navigate to `/paco/patient-search`
2. Grid columns: `Home Phone`, `Mobile Phone`, `Email Address`, `Preferred Contact Method`, `SMS Options`, `Email Options`
3. Or: Click `Create new patient` → **Contact** tab

### Patient Search Grid Columns
| Column | Description |
|---|---|
| `Home Phone` | Home telephone number |
| `Mobile Phone` | Mobile/cell phone number |
| `Email Address` | Email address |
| `Preferred Contact Method` | Contact preference (phone/email/SMS) |
| `SMS Options` | SMS opt-in status |
| `Email Options` | Email opt-in status |
| `Preferred Communication Method` | Communication preference |

### Contact Tab Fields
| Field Name | Type | Notes |
|---|---|---|
| `email_address` | textbox | Email input |
| `preferred_communication_method` | select | Preferred contact method |
| `expressed_by` | select | Who expressed the preference |
| `sms_option_ind` | checkbox | SMS opt-in |
| `email_option_ind` | checkbox | Email opt-in |

### Technical Notes
- Phone numbers have distinct types (Home vs Mobile) for easier mapping/filtering
- Contact preferences allow patients to specify preferred communication method
- SMS/Email options track consent for digital communications
- **PAC2-115 Bug Fix:** Email address must be included in PDS submission payload
- **PAC2-124:** Email field included in PDS update (related fix)

### Test Scenarios
1. Grid displays Home Phone and Mobile Phone in separate columns ✓
2. Create patient with phone type selection preserved
3. Preferred contact method displayed in patient list
4. SMS/Email opt-in checkboxes functional

## Patient Search — Date of Death (PAC2-123)

### Entry
1. Navigate to `/paco/patient-search`
2. Grid columns: `Date of Death`
3. PDS Check section pulls Date of Death from NHS PDS

### Patient Search Grid Columns
| Column | Description |
|---|---|
| `Date of Death` | Date patient passed away (from PDS) |
| `Date of Birth` | Patient's birth date |

### Technical Notes
- **PAC2-123 Bug Fix:** Date of Death must pull correctly from PDS
- Date format: DD/MM/YYYY (NHS standard)
- Deceased patients may have restricted access to certain features
- PDS Check shows deceased patient indicator in UI

### Related Tickets
- `PAC2-123` — Date of Death pulled from PDS correctly (bug fix)

## Language Selection (PAC2-120)

### Entry
1. Navigate to `/paco/patient-search`
2. Grid columns: `Main Language`, `Interpreter Required`
3. Or: Click `Create new patient` → **Personal** tab → `Main Language` dropdown

### Patient Search Grid Columns
| Column | Description |
|---|---|
| `Main Language` | Patient's primary language (from PDS) |
| `Interpreter Required` | Whether interpreter is needed |

### Personal Tab Fields
| Field Name | Type | Notes |
|---|---|---|
| `preferred_language_code` | select | Language selection (SNOMED CT codes) |
| `interpreter_required_ind` | select | Interpreter required flag |

### Technical Notes
- **PAC2-120:** Language dropdown populated from SNOMED CT instead of hardcoded 5 languages
- SNOMED CT language codes provide comprehensive language coverage
- PDS lookup can populate language from NHS demographic data
- Interpreter flag supports accessibility requirements

### Related Tickets
- `PAC2-120` — Populate language selection from SNOMED CT (fixes limited language list)
