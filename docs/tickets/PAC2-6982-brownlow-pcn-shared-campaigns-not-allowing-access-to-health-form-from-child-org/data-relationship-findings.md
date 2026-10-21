# Data Relationship Findings: PAC2-6982

**Input Revision:** 1
**Environment:** `dev` — PACO `https://blinx.dev.blinxpaco-np.com`, scheduler `https://dev.blinxscheduler-np.com`, Comms Hub `https://nhs-comms-hub-dev.blinxhealthcare.com`
**Mode:** read-only (GraphQL query + source inspection; không mutation, không tạo/sửa campaign, form hay patient)
**Observed at:** 2026-10-21

## 1. Verified org hierarchy

| Org | GUID |
|---|---|
| General Practice (Demo Site) | `{10d7a4b5-844c-4511-b082-a188643ec920}` |
| Redmoor Liverpool (Non-OBE) — PCN/parent | `{BA818521-9CA3-4D42-A392-8B6722502708}` |
| 3ST — child | `{0056DC33-0007-4CEC-B57D-E2B9CA355BE3}` |

## 2. Form ownership / sharing — the exact ticket data shape confirmed

PACO GraphQL (`POST https://t7tj132ft8.execute-api.eu-west-2.amazonaws.com/dev/graphql`, query `webForms`):

Form `test by mw1` (`org_web_form_uuid` = `d2ff0784-92c0-4ab4-9f78-0c9c427de4ee`):

| Field | Value |
|---|---|
| `organisationguid` | `{0056DC33-0007-4CEC-B57D-E2B9CA355BE3}` (3ST) |
| `shared_to_org_names` | `null` |
| `shared_from_org_name` | `null` |
| `creator` | user id 262 |

→ Đúng cấu hình ticket: **Created by** child practice, **không có** `Shared To` cho chính practice đó.

Toàn bộ 13 form thuộc 3ST (filter `organisationguid` = 3ST) đều có `shared_to_org_names` = `null`. Không tồn tại form nào của 3ST có quan hệ share.

## 3. Visibility filter — measured, not inferred

Query `webForms(filters:{organisationguid, org_web_form_uuid})` với cùng một form `d2ff0784-…`:

| `organisationguid` | `includeShared` | Result |
|---|---|---|
| 3ST (child, owner) | `false` | ✅ `["test by mw1"]` |
| 3ST (child, owner) | `true` | ✅ `["test by mw1"]` |
| Redmoor Liverpool (parent PCN) | `false` | ❌ `[]` |
| Redmoor Liverpool (parent PCN) | `true` | ❌ `[]` |

**Kết luận:** `includeShared` **không** giúp form của child hiện với parent PCN. Form chỉ trả về cho đúng `organisationguid` sở hữu nó (hoặc org được ghi trong `shared_to_org_ids`).

Query trên chỉ có 3ST nên **không** thể tách biệt "org owner" với "org được share" — mọi form của 3ST đều `shared_to_org_names = null`. Cần một form có share thật để đối chiếu; hiện chưa xác định form nào trong tenant có `shared_to_org_ids` khác 3ST.

## 4. Where the access decision is made

- **Scheduler app** (`dev.blinxscheduler-np.com`, route `/web-form`) query `webForms(filters:{org_web_form_uuid, campaign_web_form_uuid, sendLogId, communications_id})` — **không truyền `organisationguid`**. Nghĩa là quyền truy cập form được server phân giải từ quan hệ share, không từ org context của campaign.
- Scheduler GraphQL endpoint: `https://8kj14jpch3.execute-api.eu-west-2.amazonaws.com/dev/graphql`, auth qua header `x-blinx-schedule` (token lấy từ `location.hash` hoặc `localStorage.sch-token`).
- PACO GraphQL endpoint: `https://t7tj132ft8.execute-api.eu-west-2.amazonaws.com/dev/graphql`, auth `Authorization: Bearer <cognito accessToken>`.

## 5. Comms Hub share path (source-read)

`POST /CommsHub/Webforms/getAllWebForms {includeShared}` trả về danh sách form attach được cho campaign. Khi share campaign từ PCN, form của child được copy sang org PCN với:

- `shared_to_org_names` = [PCN]
- `shared_from_org_name` = [child]

Trong quan hệ đó, **child không nằm trong `shared_to_org_names`** — đúng trạng thái ticket mô tả. Child chỉ giữ vai trò `shared_from`.

## 6. Mechanism — hypothesis supported by measurements

Quyền truy cập form của patient được quyết định bởi tập org mà form được share tới (`shared_to_org_ids` ∪ org cha trong cây, theo chiều share). Với form do child tạo:

1. Form được share tới **PCN** (parent), không share tới child.
2. Child là creator, không nằm trong `shared_to_org_ids`.
3. Khi patient thuộc child mở scheduler link của shared campaign → server không resolve được quan hệ form↔child org ⇒ **login fail + form inaccessible**.

Điều này khớp chính xác mô tả ticket.

## 7. Blocker — Comms Hub access (không phải lỗi product)

Account `blinx_fiona.nguyen@blinxsolutions.com` (Cognito user pool `eu-west-2_N4TWPvi9t`, client `7ukgmgfi8p78ubmcb1tse87rdj`) đăng nhập thành công ở Comms Hub nhưng:

```
GET https://nhs-comms-hub-be-dev.blinxhealthcare.com/User/getUserInfo
→ 401 {"exception":"Permission Denied - No Access to Module"}
```

- `POST /CommsHub/Campaigns/getAllCreatedCampaigns` → 401 tương tự
- Thử 3 GUID org (GP, Redmoor, 3ST) với header `Organisation` → vẫn 401 (`No Access to Module` / `No Access to Organisation`)
- `checkPermission()` trong Comms Hub `global.js` kiểm tra `roles` có `COMMSHUB_ROLE` và `modules` có `COMMSHUB_MODULE`; thiếu → `removeUserSession('error-at-checkPermission')`

Frontend redirect tới `/login?loggedout=true&msg=error-at-axios-interceptor` và xoá cookie `usersCurrentOrg` — khớp với quan sát ban đầu (cookie biến mất, request kế tiếp 401).

⇒ Account thiếu Comms Hub role/module. **Không thể tạo campaign để verify end-to-end** cho tới khi QA cấp quyền hoặc cấp user khác.

## 8. What is still needed to execute TC-001 / TC-002

1. Comms Hub access cho account có role Comms Hub + org context Redmoor (hoặc user thay thế trong `.env`).
2. Safe test patient thuộc 3ST hoặc Primary Care 24 — **chưa xác minh**; không tự chọn bệnh nhân nhìn thấy.
3. Control form có `shared_to_org_ids` thật — chưa xác định candidate trong tenant.

## Tester notes
