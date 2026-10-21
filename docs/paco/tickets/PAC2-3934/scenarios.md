# Scenarios: PAC2-3934 — Cross-org Health Form Filing (PACO Connect)

**Input Revision:** 1
**Generated:** 2026-10-18T02:35:00Z

Ticket `Open` (P2, sprint WC 20/04/2026, blocker PAC2-5445 còn `Ready to Release`, PR `nhs-supergrid-be#2752` đang `Requesting changes`).

## Flow context observed

- Module: PACO Connect — consultation screen.
- Modes:
  - **Same-org** (REQ-3 / AC3 — baseline, must stay unchanged).
  - **Cross-org** (REQ-1, REQ-2 — main fix; AC1, AC2).
- Failure modes (REQ-4):
  - pre-fix: filing fails when form not shared với patient org; no permission error distinguishable from org mismatch.
  - post-fix expected: filing succeeds cross-org; on revoked access, error names permission/connection.
- Code path (per Mustafa review on `nhs-supergrid-be#2752`):
  1. Patient lookup phải dùng full PK `(patientguid, organisationguid)` — không query only `patientguid`.
  2. Khi patient row missing, KHÔNG fall back sang form/response org (đây là requesting-org path mà ticket này remove).
  3. Cross-org authorisation check phải so sánh requesting org vs patient org, không tautology.
- Logging: phải strip patient identifiers (Mustafa requirement).
- Related PRs (must be reviewed, không phải scope của story này): `nhs-supergrid-fe#4885` (nên đóng, trailing space), `paco-connect-fe#2520` (session null-guards, scope khác).

## Replay blocker (host whitelist)

`paco.config.yaml` `allowedHosts` không có `pac2-3934.dev.blinxpaco-np.com`; `externalDevHosts` cũng không có. Theo CLAUDE.md Safety Policy: production/unknown host luôn bị chặn → **live replay bị Blocked** đến khi host được add vào config. Mọi scenario dưới đây là **reconstructed** (không phải executed-live).

## Scenario: S1 — Cross-org filing — happy path (REQ-1, AC1)

**Class:** Persistent (`Send` + file into patient record)
**Preconditions:**
- 2 organisations: `Org A` (where user logs in) + `Org B` (where patient belongs).
- Cross-org access grant giữa A ↔ B cho user test.
- Có health form thuộc `Org A` (dù share với B hay không đều pass).
- Test user (Fiona hoặc auto-user) có role clinician ở A, với quyền xử lý patient ở B.

**Entry:** `https://pac2-3934.dev.blinxpaco-np.com/` → sidebar `PACO Connect` → chọn patient thuộc `Org B`.

**Steps:**
1. Login PACO Connect dưới `Org A`.
2. Navigate tới consultation screen.
3. Search/select một patient thuộc `Org B` (verify patient record loaded cross-org).
4. Trong consultation, attach health form của `Org A`.
5. Complete các field bắt buộc trong form.
6. Click `Submit` / `File`.
7. Đợi backend processing; observe confirmation + redirect.

**Observable assertions:**
- ✅ Form file thành công vào record bệnh nhân ở `Org B` (post-condition: AC1).
- ✅ Network response 2xx + reference tới patient org GUID (không phải requesting-org GUID).
- ✅ Audit log không chứa raw patient identifiers (Mustafa requirement).
- ❌ Nếu fail, kiểm tra error message; nếu error nói "form not shared" → pre-fix bug; nếu error nói "permission/connection" → REQ-4 path.

**Cleanup:**
- Sau khi verify, restore test user access state nếu đã grant tạm.

**Mutation class:** `Persistent` — health form đã được file vào patient record thật. Test data phải dùng patient test (`QA-test`) để tránh polluting real EMR data.

---

## Scenario: S2 — Cross-org filing — form chỉ thuộc requesting org (REQ-2, AC2)

**Class:** Persistent
**Preconditions:**
- Health form tồn tại ở `Org A`, KHÔNG shared với `Org B`.
- Same cross-org access như S1.
- Patient thuộc `Org B`.

**Steps:**
1. Login (A) → consultation → select patient (B).
2. Attach form (đã biết rõ là owned by A only, không share sang B).
3. Complete + Submit.

**Observable assertions:**
- ✅ Form vẫn file thành công (AC2).
- ✅ Backend log reference `(patientguid, organisationguid_of_B)` cho patient PK — proof of full PK lookup (Mustafa blocker #1).
- ❌ Nếu error vì "form not shared", pre-fix.
- ❌ Nếu DB query fallback dùng chỉ `patientguid` (no org), trace sẽ tìm org đầu tiên trong index → dễ silent wrong write.

**Mutation class:** `Persistent`.

---

## Scenario: S3 — Same-org filing — regression (REQ-3, AC3)

**Class:** Persistent
**Preconditions:**
- User logged in `Org A`, patient thuộc `Org A`.
- Health form thuộc `Org A`.

**Steps:**
1. Login (A) → consultation → select patient A.
2. Attach form A → submit.

**Observable assertions:**
- ✅ Form file thành công; observable = "không có behavior change" — tức là chạy đúng như baseline trước fix.

**Lý do cần:** verify rằng thay đổi không break single-org path.

**Mutation class:** `Persistent`.

---

## Scenario: S4 — Cross-org with revoked/denied access (REQ-4, AC4)

**Class:** Temporary (denied test ra error)
**Preconditions:**
- User ở `Org A`, access tới `Org B` bị revoke (hoặc denied từ đầu).
- Patient thuộc `Org B`.
- Có form ở `Org A`.

**Steps:**
1. Login (A) → consultation → select patient (B) — có thể lookup vẫn cho, nhưng filing sẽ deny.
2. Attach + submit form.

**Observable assertions:**
- ✅ Error message rõ ràng, dùng terms `permission` / `connection`, KHÔNG nói "organisational mismatch" / "form not shared".
- ❌ Nếu error nói generic "cannot file cross-org" → fail AC4.
- ❌ Bug hiện (Mustafa): `patientOrganisationGuid === patientOrganisationGuid` tautology → AC4 never runs → no surface distinct error.

**Mutation class:** `Temporary`.

---

## Scenario: S5 — File throttling & logging hygiene (cross-cutting, từ review)

**Class:** None (read-only verification)
**Preconditions:** Steps từ S1/S2.

**Steps:** Inspect logs from backend + audit trail.

**Observable assertions:**
- ✅ Logs KHÔNG chứa raw patient name, NHS number, dob — chỉ GUIDs.
- ✅ Logs chứa acting user GUID + requesting org GUID + patient org GUID.
- ❌ PII leak → fail security review.

**Mutation class:** None.

---

## Data prerequisites for replay

- 2 test organisations setup sẵn (A + B) trên host `pac2-3934.dev.blinxpaco-np.com`.
- Test user với cross-org role (Fiona hoặc equivalent trên host test).
- Patient test (tên prefix `QA-test`) thuộc `Org B` để tránh vào real EMR.
- Health form owned by `Org A`, public + private variants.
- Test ID strategy: `QA-test-cross-org-<timestamp>` trên patient + form.

## Mutation ledger (concept — live, when host whitelisted)

| Action | Target | Class | Required |
|---|---|---|---|
| `Login` | `Org A` user | None | Allowlisted auth |
| `Select patient` | Patient ở `Org B` (QA-test) | Temporary | Read |
| `Send health form` | Patient ở `Org B` | Persistent | Requires mutation gate + ledger |
| `Read logs` | Backend telemetry | None | Read |
| `Cleanup` | QA-test patient (B), form copies | Destructive | Approved data only |

> Live ledger sẽ được ghi bằng `scripts/mutation-ledger.ts` khi host whitelisted và PAC2-3934 replay được chạy thực sự (không phải đợt này).

## Open questions mapping

- OQ-1 (attachments) → feeds S1 + S2 evidence nếu user muốn download.
- OQ-2 (PR state) → update nếu có reply mới của Mustafa.author.
- OQ-3 (screenshots) → potentially a flow diagram; low priority.
- OQ-6 (host not whitelisted) → primary blocker; resolution required before any live scenario.
