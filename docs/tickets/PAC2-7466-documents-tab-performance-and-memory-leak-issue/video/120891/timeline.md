# Video timeline

**Source:** `120891-20260730-1327-39.3393041.mp4`  
**Duration:** 113.568633 seconds  
**Video:** h264, 1902x966  
**Review date:** 2026-09-25  
**Environment visible in source:** dev  
**Displayed user context:** `[SYSTEM] PACO GP`, `General Practice (Demo Site)`  
**Privacy:** Source frames contain patient identifiers. Local evidence only; not shareable or suitable for commit without redaction.

## Contact sheet

`contact-sheet.webp` — local evidence containing PII; do not share.

## Timeline

| Time | Review status | Visual observation | Evidence |
|---:|---|---|---|
| `00:00–00:04` | Reviewed | `Documents` tab initially shows a small document set, then enters `Loading patient profile`. | Local frames 0001–0003; not shareable |
| `00:06–00:18` | Reviewed | Document grid appears. Counter reaches `50/314`; scrolling starts lazy loading. | Local frames 0004–0010; not shareable |
| `00:20–00:44` | Reviewed | Repeated downward scrolling loads additional batches. Counter reaches `100/314`; cards alternate between loaded content and loading placeholders. | Local frames 0011–0023; not shareable |
| `00:46–01:18` | Reviewed | Continued scrolling advances through later batches; counter is seen at `250/314`. Loading states recur while more records arrive. | Local frames 0024–0040; not shareable |
| `01:20–01:32` | Reviewed | A document is opened. Detail view displays an image and `Back`, `Full screen`, `Show annotations`. | Local frames 0041–0047; not shareable |
| `01:34–01:38` | Reviewed | `Back` is activated; UI shows `Loading patient profile` rather than returning immediately to the list. | Local frames 0048–0050; not shareable |
| `01:40–01:46` | Reviewed | Document detail reappears; browser then displays `This page isn't responding` with `Wait` and `Exit page`. | Local frames 0051–0054; not shareable |
| `01:48–01:52` | Reviewed | Browser recovers to the document grid showing `100/314`; state differs from the pre-detail position. | Local frames 0055–0057; not shareable |

## Review conclusions

- `[Observed: recorded dev session, displayed PACO GP context, source video]` Lazy loading progresses in batches and reaches at least `250/314`.
- `[Observed: recorded dev session, displayed PACO GP context, source video]` Returning from document detail triggers a prolonged loading transition, then a browser `page isn't responding` dialog.
- `[Observed: recorded dev session, displayed PACO GP context, source video]` After recovery, the list shows `100/314`, indicating the prior list position/count was not retained.
- Video does not expose network status, API response, heap measurements, or permission configuration. It cannot confirm the ticket's `403` condition or quantify a memory leak.

## Open questions

- Was the `page isn't responding` event caused by the same `403` render loop described in the ticket, or by a separate `Back`/lazy-loading defect?
- Which exact role permissions were active? The header identifies a displayed account context, not the `View patient documents` permission state.

## Tester notes

[Protected area]
