# Feature Location Standards

## Input Contract

`LOCATE` yêu cầu valid `ANALYZE`, `environment`, `role`, manual browser authentication và read-only mode. Tester-provided module/page/context/menu clue là tùy chọn và giữ provenance riêng; trả lời “không biết” không phải blocker.

## Search Order

1. Match exact term hoặc alias trong `docs/product/feature-map.md`.
2. Validate reusable route bằng 1–3 meaningful views.
3. Nếu route thiếu, stale hoặc mismatch, bắt đầu dashboard và scan theo global navigation, page search, visible menu, authorized contextual menu, rồi read-only detail.
4. Ghi tối đa ba candidate hữu ích và rejected path có dependency revision.
5. Dừng ngay khi ordered entry path được xác minh hoặc stop condition xảy ra.

## Meaningful View and Budget

Meaningful view là page/module/menu/dialog/drawer/search-result state mới có giá trị điều hướng. Reload, retry kỹ thuật và screenshot cùng state không tăng count. Default ceiling là 12 meaningful views hoặc 15 elapsed minutes, điều kiện nào tới trước; ceiling không phải target.

## Safety and Stop Conditions

Chỉ navigate, view, search, filter, sort, paginate, mở detail/menu/dialog chắc chắn read-only. Dừng trước `Create`, `Update`, `Delete`, `Submit`, `Approve`, `Reject`, upload, import, send, chọn item vào draft/template hoặc action chưa rõ persistence. Dừng và trả exact next action khi thiếu auth/role/permission/authorized context, chạm budget, browser fault hoặc mutation boundary. Không mở rộng scope.

## Outcome and Evidence

- `completed`: feature root và ordered entry path đã mở bằng action read-only.
- `completed_with_warnings`: route usable nhưng còn context/confidence warning.
- `inconclusive`: candidate hữu ích nhưng hết budget hoặc evidence chưa đủ.
- `blocked`: auth, role, permission, context hoặc mutation boundary.
- `failed`: browser/tool/artifact fault.

Khi route verified, chụp milestone áp dụng: module/context landmark, entry control/menu và feature/page/dialog đã mở. Raw artifact ở `test-results/<ticket-key>/locate/<run-id>/`. Chỉ evidence đã review/redact mới vào `docs/tickets/<folder>/evidence/`; patient/NHS/contact/clinical/message/auth data phải bỏ hoặc ghi “local evidence; not shareable”.

## Resume and Staleness

Resume phải validate input revision và checksum, đọc budget/candidates, không lặp rejected path khi UI/source dependency không đổi, và không rerun completed route còn valid. Feature alias, actor/context, module/location, entry path hoặc role/permission change làm location stale; expected-business-behavior-only change không tự làm location stale. Không xóa checkpoint history.

## Automation Gate

UI-dependent case cần valid `feature-location.md`, route status `Confirmed`, ordered entry path, context, environment, role, test-data category, mutation class và expected-result basis. Preliminary case có thể tồn tại nhưng automation phải blocked và không chứa locator suy đoán. Locator probe phải read-only, scoped, bounded, tách business assertions, không thuộc smoke mặc định và chờ observable condition thay fixed wait.

## Protected Content

`feature-location.md` luôn kết thúc bằng `## Tester notes`. Update dùng protected merge; conflict phải dừng, không overwrite.
