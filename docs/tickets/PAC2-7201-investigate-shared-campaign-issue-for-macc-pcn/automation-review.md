# Automation Review: PAC2-7201

**Input Revision:** 1
**Phase:** AUTOMATION_REVIEW
**Generated:** 2026-09-14
**Owner:** paco-ticket (orchestrator)

## Automation Gate Criteria

Một test case đủ điều kiện automate khi thỏa tất cả:
1. **Location Confirmed** — entry path và feature đã LOCATE, không có unresolved location blocker
2. **Role/preconditions known** — tài khoản, quyền, môi trường xác định được
3. **Expected-result basis = Confirmed** — kết quả mong đợi dựa trên spec/AC/confirmed design text, không phải suy luận
4. **No open blockers** — không có dependency hoặc ambiguity chưa giải quyết

> Automation tùy chọn. Không automate assertion chỉ dựa trên `Inferred`.

## Case-by-Case Gate Evaluation

### PAC2-7201-TC-001 — Creator giữ quyền Edit/Delete sau khi share

| Criterion | Status | Notes |
|-----------|--------|-------|
| Location | ✅ Confirmed | `Campaign Manager`, `Viewing data for = Blinx Demo Site` |
| Role/preconditions | ✅ Known | Account có quyền tạo Quick Send campaign tại Blinx Demo Site |
| Expected-result basis | ✅ **Confirmed** | Product design text: "will be able to view it and its assets but will NOT be able to edit" → ngược lại, creator giữ đủ quyền |
| Open blockers | ✅ None | |

**Gate result: ✅ PASS**

- Evidence từ EXPLORE (OBS-PAC2-7201-004): đã thực hiện ad-hoc 2026-09-14, kết quả khớp expected result
- Automation action class: Persistent mutation (Create + Share campaign)
- **Khuyến nghị:** Vào `AUTOMATE` — TC-001 là candidate automation đầu tiên. Cần mutation approval riêng cho việc tạo campaign test.

---

### PAC2-7201-TC-002 — Shared-to org (Redmoor Liverpool) KHÔNG có quyền Edit/Delete

| Criterion | Status | Notes |
|-----------|--------|-------|
| Location | ✅ Confirmed | `Campaign Manager`, `Viewing data for = Redmoor Liverpool` |
| Role/preconditions | ✅ Known | Account có quyền xem Redmoor Liverpool (không cần quyền tạo) |
| Expected-result basis | ✅ **Confirmed** | Product design text (cùng nguồn TC-001): "will be able to view it and its assets but will NOT be able to edit" |
| Open blockers | ✅ None | |

**Gate result: ✅ PASS**

- Evidence từ EXPLORE (OBS-PAC2-7201-003, OBS-PAC2-7201-004): ad-hoc cho thấy Redmoor Liverpool thực tế **có đủ** Edit/Delete → expected result BỊ VI PHẠM trên dev
- Evidence từ video BH-41375 (OBS-PAC2-7201-006): production (Broken Cross Surgery) **đúng** hành vi — shared-to org chỉ có View → cho thấy **production đúng, dev có bug**
- Đây là case **dự kiến FAIL trên dev** — phản ánh bug REQ-003 xuất hiện trên dev nhưng không xuất hiện trên production
- Automation action class: None (read-only, chỉ observe)
- **Khuyến nghị:** Vào `AUTOMATE` trên dev — TC-002 là bằng chứng xác nhận bug REQ-003 trên môi trường dev. Bug này có thể đã được fix trên production, hoặc production và dev chưa sync.

---

### PAC2-7201-TC-003 — Redmoor creator giữ quyền Edit/Delete (chiều đối xứng TC-001)

| Criterion | Status | Notes |
|-----------|--------|-------|
| Location | ⚠️ Partial | Route `Campaign Manager` confirmed; hành động `Create Campaign` dưới Redmoor Liverpool chưa verify (tài khoản hiện tại không tạo được tại Redmoor) |
| Role/preconditions | ❌ **Not met** | Không có tài khoản có home organisation = Redmoor Liverpool; không xác nhận được quyền tạo campaign tại Redmoor Liverpool |
| Expected-result basis | ✅ Confirmed | Product design text |
| Open blockers | ❌ Blocker | Thiếu Redmoor creator account |

**Gate result: ❌ BLOCKED**

- Blocker: `feature-location.md` ghi nhận tài khoản hiện tại không tạo được campaign tại Redmoor Liverpool — step 1 (đăng nhập account Redmoor creator) không thể thực hiện
- Không automate được trong phạm vi ticket hiện tại
- **Khuyến nghị:** Giữ trạng thái Blocked, chờ tài khoản Redmoor creator. Không có action trong phase AUTOMATE.

---

### PAC2-7201-TC-004 — Sau Edit, shared campaign vẫn trong Shared dropdown và view/edit được từ creator

| Criterion | Status | Notes |
|-----------|--------|-------|
| Location | ✅ Confirmed | `Campaign Manager`, edit từ creator org |
| Role/preconditions | ✅ Known | Account creator có quyền edit |
| Expected-result basis | ⚠️ **Inferred** | Expected result dựa trên mô tả trong `ticket.md:26` ("Edit both and check can still view & edit"), không có AC/specced behavior chính thức |
| Open blockers | ⚠️ Ambiguity | Expected-result basis là Inferred, không đủ Confirmed |

**Gate result: ❌ DOES NOT PASS — Expected-result basis is Inferred**

- Automation Gate yêu cầu `Expected-result basis = Confirmed`; TC-004 chỉ có `Inferred`
- Theo quy tắc: "Never automate assertion chỉ dựa trên Inferred"
- Evidence ad-hoc (OBS-PAC2-7201-004) cho thấy kết quả khớp, nhưng không đủ để automate vì không có AC chính thức
- **Khuyến nghị:** Không vào `AUTOMATE`. Giữ nguyên trạng thái Explored, reference trong REPORT. Cần BA/PO xác nhận AC cho hành vi này nếu muốn automate.

---

### PAC2-7201-TC-005 — Campaign patient-initiated hiển thị tại Macclesfield PCN home org

| Criterion | Status | Notes |
|-----------|--------|-------|
| Location | ❌ **Not confirmed** | Chưa từng LOCATE trong org Macclesfield PCN; entry path chưa xác định |
| Role/preconditions | ❌ Not met | Không có quyền/tài khoản Macclesfield PCN trên dev hoặc production |
| Expected-result basis | ⚠️ Inferred | Suy luận từ bug description, chưa có AC |
| Open blockers | ❌ Multiple blockers | Thiếu location, role, environment |

**Gate result: ❌ BLOCKED (multiple)**

- Blocker: Không LOCATE được Macclesfield PCN, không có quyền, môi trường production không confirm được
- Theo quyết định tester (2026-09-14): coi là bất khả thi trong phạm vi ticket
- **Khuyến nghị:** Giữ trạng thái Blocked. Không có action.

---

### PAC2-7201-TC-006 — Campaign status không hiển thị Failed khi còn active

| Criterion | Status | Notes |
|-----------|--------|-------|
| Location | ❌ **Not confirmed** | Chưa LOCATE; cần access Macclesfield PCN/site con (Broken Cross) |
| Role/preconditions | ❌ Not met | Không có quyền |
| Expected-result basis | ⚠️ **Inferred + Disputed** | Definition của "Failed" còn tranh cãi (xem `requirements.md` Ambiguities); chưa có AC |
| Open blockers | ❌ Multiple blockers + disputed definition | Thiếu location, role, và định nghĩa expected result chưa rõ |

**Gate result: ❌ BLOCKED (multiple + disputed)**

- Theo `requirements.md`: định nghĩa `Failed` status chưa được BA/PO/technical team xác nhận — là Disputed
- Automation với disputed expected result không đáng tin cậy
- **Khuyến nghị:** Giữ trạng thái Blocked. Cần BA/PO xác nhận định nghĩa `Failed` trước khi có thể thiết kế assertion.

---

## Automation Gate Summary

| Case | Gate | Action | Reason |
|------|------|--------|--------|
| TC-001 | ✅ PASS | **AUTOMATE** | Confirmed location + role + expected-result |
| TC-002 | ✅ PASS | **AUTOMATE** | Confirmed location + role + expected-result; dự kiến FAIL (phản ánh bug) |
| TC-003 | ❌ BLOCKED | Skip | Thiếu Redmoor creator account |
| TC-004 | ❌ NOT PASS | Skip | Expected-result basis là Inferred, không đủ Confirmed |
| TC-005 | ❌ BLOCKED | Skip | Không LOCATE, không có quyền Macclesfield PCN |
| TC-006 | ❌ BLOCKED | Skip | Không LOCATE + disputed definition "Failed" |

## Automation Recommendation

**Candidate automate (AUTOMATE):** TC-001, TC-002

- **TC-002 là ưu tiên cao nhất** — đây là test case phản ánh trực tiếp bug REQ-003 (shared-to org có quyền Edit/Delete sai). Việc automate TC-002 sẽ tạo bằng chứng chính thức cho bug report.
- **TC-001 là tốt nhất để verify không có regression** — nếu fix được bug, TC-001 phải Pass và TC-002 phải Fail (vì TC-002 test ngược lại expectation).

**Pre-automation actions cần cho TC-001 và TC-002:**
1. Mutation approval cho việc tạo campaign test (TC-001)
2. Xác nhận tài khoản test còn đủ quyền trên dev (`nhs-comms-hub-dev.blinxhealthcare.com`)

**Cleanup note:** Campaign test `PAC2-7201-TEST-BDS-to-Redmoor-edited` (tạo trong EXPLORE) vẫn tồn tại — có thể dùng làm pre-existing test data cho TC-002 (giảm mutation). Cần kiểm tra trạng thái trước khi quyết định tạo mới hay dùng lại.

## Relationship to EXPLORE Ad-hoc Results

| Observation | Related Case | Automation Value |
|-------------|-------------|-----------------|
| OBS-PAC2-7201-003 | TC-002 | Ad-hoc xác nhận Redmoor có Edit/Delete (vi phạm expected) → TC-002 sẽ formalize |
| OBS-PAC2-7201-004 | TC-001, TC-002 | Ad-hoc cả 2 case — TC-001 Pass (expected), TC-002 Fail (expected) |
| OBS-PAC2-7201-005 | TC-005 | BH-37920 campaign confirm pattern lỗi lần 3 |

Ad-hoc results từ EXPLORE được dùng làm **confidence signal**, không thay thế formal execution qua AUTOMATE → EXECUTE.

## Open Questions

1. Campaign test từ EXPLORE (`PAC2-7201-TEST-BDS-to-Redmoor-edited`) có thể dùng lại cho TC-002, hay cần tạo mới? Cần kiểm tra tồn tại + trạng thái trước khi AUTOMATE.
2. TC-004 có nên được đưa vào AUTOMATE sau khi có AC từ BA/PO không? (hiện tại chỉ có Inferred basis)
3. Tester cần xác nhận mutation approval cho TC-001 (tạo campaign) trước khi vào AUTOMATE.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
