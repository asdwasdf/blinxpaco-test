# Workflow: User Portal

- Classification: `[Observed: dev, Super Admin GB, 2026-10-23]`
- Aliases: `Users`, `User Portal`, `User Guides`, `FAQs`
- Coverage: `Partial (read-only)`
- Confidence: High cho root/search/category/FAQ và native video/presentation; embedded guide content Blocked, support submission chưa kiểm.

## Business context observed

- Sidebar `Users` mở training/help portal, không account management.
- Actor: authenticated `Super Admin GB`; actual destination header verified.
- Entities: guide/video categories và FAQ content, không patient fixture.
- Starting state: `User Guides`, search trống và chín category sections.

## Entry

1. Sidebar `Users` → `/paco-connect/user-training-portal`.
2. Chờ initial `Loading` biến mất, `User Portal`/`User Guides` và actual header render.
3. Document HTTP `404` vẫn render app; không dùng status riêng làm missing-page assertion.

## Read-only flow và decision points

- `User Guides` có `Search`, `Videos`/`User Guides`, category buttons và `View All`.
- Synthetic no-match search giữ query và ẩn category/card sections, không explicit empty copy trong state đã kiểm. Clear khôi phục categories.
- `Deselect All` để lại heading `User Guides`; chọn `Care Navigation` chỉ hiện category tương ứng. Reload khôi phục tất cả categories và search trống; preference không giữ trong context đã thử.
- `FAQs` giữ route, có search, category buttons và question accordions. Mở RBAC question có `aria-expanded=true`/answer; đóng về `false`.
- RBAC answer nói roles quyết định khu vực và actions staff truy cập. Đây là `[Observed]` UI help content, không acceptance criteria, quyền cụ thể hoặc authorization cho pending decisions.
- `Release Notes` mở tab mới public `/release-notes/` trên `www.blinxhealthcare.com`; source tab giữ view. Chỉ ghi navigation boundary, không tương tác destination; tab test đã đóng.

## Safety boundary và required test data

- Mutation `None`; không account/role/password writes, invites, support request, external submit hoặc patient data.
- Chỉ synthetic search và own UI category preference; không tạo business record.
- `Technical Support` chưa mở vì target/side effect chưa rõ; historical viewer gaps đã được kiểm một phần trong pass riêng bên dưới. Embedded guide boundary không cấp quyền interact external site hoặc bypass policy.

## Validation, state và persistence

- Không form validation được thử. Search no-match dùng visibility/end-state, không assert matching logic toàn bộ.
- Category transitions: all → none → single category → reload all; verified UI reset, không saved business persistence.
- FAQ expand/collapse observed. Final root: `User Guides`, all category sections, search blank, 0 dialogs.

## Cross-feature relationships

- Guide category mang tên module không chứng minh business integration. FAQ permissions prose không xác lập actual enforcement; không thêm two-sided edge.

## Mutation coverage

**6/10 bounded branches**, không inventory toàn portal.

| Branch | Exercised | End state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Current-role loaded root | Performed | Training/help root, không account manager | Reload root | Done |
| Guide search / clear | Performed | No category/card match, clear restore | UI reset | Done |
| Category select / reset | Performed | None/single category; reload all | Reload reset | Done |
| FAQ root | Performed | Search/categories/questions visible | Transient view | Done |
| FAQ expand / collapse | Performed | RBAC answer visible, expanded true rồi false | Transient view | Done |
| Release Notes handoff | Performed | Public tab opened; không destination interaction | Source unchanged | Done |
| Guide / View All viewer | Skipped | Deferred sau root/search breadth | Chưa kiểm | N/A |
| Videos | Skipped | Deferred sau root/search breadth | Chưa kiểm | N/A |
| FAQ search/category | Skipped | Deferred sau accordion branch | Chưa kiểm | N/A |
| Technical Support | Skipped | Chưa rõ destination/request side effect | Chưa kiểm | N/A |

Validation, guide playback/steps và support flow chưa kiểm. 0 business mutations; cleanup Done, không new record hoặc tab leftover.

## Execution và automation guidance

- Scope `main` để phân biệt `User Guides` button với sidebar button; `Search` khác global `Search...`.
- Chờ settled content sau spinner; FAQ answer tìm bằng button `aria-controls`, không assume parent chứa answer.
- Category names là filter labels; không click guide có external target nếu chưa rõ scope. Public release-notes destination chỉ boundary, không configured dev mutation target.
- No expected business assertions từ instructional text; ticket/trusted source vẫn cần riêng.

## Provenance and gaps

- Evidence: `product-explore/auto-20261022-1414/ledger.md#4–5`, `user-training-observation.json`, `user-training-category.js`.
- Environment/role/date: dev, `Super Admin GB`, 2026-10-22.
- Remaining branches theo bảng; không OQ quan trọng được giải quyết bằng help content.

## Independent guide, video và FAQ filters — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0000/ledger.md#5`. **6/8 independent bounded branches**, giữ riêng historical 6/10.

- Category-scoped `View All` chuyển sang category page với `Back to User Guides`. Guide icon mở right-side viewer; guide title không có immediate end state trong attempt trước đó, chưa xác lập delayed/stacked behavior.
- Guide drawer có `Close`, `Open in New Window` và iframe `https://scribehow.com`; rendered content báo `scribehow.com refused to connect.` Outer viewer/Close observed, guide steps/content `Blocked` OQ-074. Không mở new window hoặc interact iframe destination.
- `Videos` đổi category/card inventory; exact `Play video: …` mở native video mini-player dialog. `Breadcrumbs Navigation` có controls, finite duration, ready state và playback progress; không media error trong readback. Asset là public dev S3 origin; không download hoặc đọc instructional frames.
- `Maximise` mở own `about:blank` tab chứa native video, không expand inline; source player paused, pop-out loaded/paused. Đóng exact owned tab và source dialog remove media; không extra playback action.
- FAQ synthetic query để lại zero question controls; known `RBAC` query tìm một exact question, clear khôi phục exact baseline list. `Deselect All` bỏ toàn categories/questions; chọn `General` chỉ category đó active và subset questions.
- Reload từ General-only FAQs trả `User Guides`; reopen FAQs thấy original all-category/blank-search/question baseline. Final root restore all named guide categories, Search blank, không viewer/media/test tab còn mở. Đây UI lifetime, không saved business persistence.
- Không form/domain validation, business mutation, clinical data hoặc support request. Help names/prose không chứng minh business integration hay actual permission enforcement; không two-sided relationship.

### Mutation coverage

| Nhánh | Thực hiện | End state / persistence / lý do | Cleanup |
|---|---|---|---|
| Category View All / Back | `Performed` | Category page và root restored | `Done` |
| Guide outer viewer / Close | `Performed` | Drawer/frame boundary và frame/mask removed | `Done` |
| Video inventory / mini-player / Close | `Performed` | Native media ready/progress rồi detached | `Done` |
| Maximise pop-out / cleanup | `Performed` | Loaded own tab, source paused; tab/dialog closed | `Done` |
| FAQ no-match / known match / clear | `Performed` | Question visibility và exact baseline restored | `Done` |
| FAQ categories / reload reset | `Performed` | None/General-only rồi original FAQ/root baseline | `Done` |
| Embedded guide content/steps | `Skipped` | `Blocked`: rendered refused-to-connect boundary, OQ-074 | `N/A` |
| Technical Support flow | `Skipped` | Destination/request scope chưa rõ, không submit | `N/A` |

Coverage `Partial (read-only)`; form/domain validation và business transitions/persistence `Not Run`. Remaining gaps là embed prerequisite, support scope và chưa thử hết guide/video categories; không exhaustive inventory.

### Execution guidance bổ sung

- FAQ question controls dùng semantic `role=button` trên anchors; không assume native `<button>`. Search/category result chờ end state, không static delay hoặc hardcode content counts làm requirement.
- Guide là complementary drawer; video là dialog xuất hiện sau content load. Close chờ target iframe/video detached và viewer mask absent, không generic complementary count vì layout có landmark khác.
- Maximise là pop-out; chỉ đóng tab vừa tạo có exact title/about:blank, giữ source. Không dùng generic external-tab cleanup hoặc click instructional actions.
- Guide refusal và delayed viewer behavior chưa có root cause. Không lặp unchanged clicks để tìm pass, không force mask/hidden controls.

## Tester notes
