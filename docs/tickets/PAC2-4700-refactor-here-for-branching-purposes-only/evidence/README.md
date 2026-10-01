# PAC2-4700 Durable Evidence

**Captured:** 2026-09-23  
**Run:** `20260923-plugin-three-link-deep`  
**Role:** `Super Admin GB`  
**Mutation:** None  
**Redaction:** Patient name, NHS number, postcode, DOB and email replaced in the live DOM before capture.

| Environment | Evidence | Result | Observation |
|---|---|---|---|
| Baseline (`PAC2-4683`) | `baseline-quick-send-redacted.png` | Pass | `Quick Send` dialog renders without major layout breakage; campaign/editor/sidebar visible. |
| OS feature branch | `os-branch-quick-send-redacted.png` | Pass | `Quick Send` dialog renders without major layout breakage; campaign/editor/sidebar visible. |
| Connect feature branch | `connect-branch-quick-send-redacted.png` | Pass | `Quick Send` dialog renders without major layout breakage; template/editor/sidebar visible. |

## Suggested Jira comment

Read-only regression check completed on baseline (`PAC2-4683`), OS feature branch and Connect feature branch using the same patient context. `Quick Send` opened successfully on all three; dialog layout, editor and navigation rendered without major visual or functional breakage. `Files` completed loading and `Booking Link` rendered its controls during the run. No `Save`/`Send` or other mutation was performed. No confirmed PAC2-4700 defect found. Screenshots attached are redacted.
