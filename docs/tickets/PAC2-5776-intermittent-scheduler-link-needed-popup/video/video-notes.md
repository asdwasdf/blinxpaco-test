# PAC2-5776 — Video notes

Video source: `ticket/PAC2-5776-intermittent-scheduler-link-needed-popup/Pac2-5776.mp4`
Duration: 58.29s @ 30fps. Extracted 1fps → 59 frames (frame_00000 → frame_00058).

## Section 1 — Per-frame table

| timestamp | frame | UI text | error | URL | behavior | note |
|---|---|---|---|---|---|---|
| 00:00 | frame_00000 | Quick Send, search field "art" | - | https://blinx.dev.blinxpaco-np.com/paco/dashboard | patient search typing | - |
| 00:01 | frame_00001 | Arthur Dent NHS Nr: 2222223792, DOB: 01/06/1970, Post Code: WA4 4FS, Email checkbox checked | - | - | patient selected, template selection area visible | - |
| 00:02 | frame_00002 | Select Message Template dropdown | Your selection contains no session availability | - | error popup appears over template selector | - |
| 00:03 | frame_00003 | Select Message Template area | Your selection contains no session availability | - | error popup still visible | - |
| 00:04 | frame_00004 | Patient search results: Arthur Dent NHS Nr: 2222223792 | - | - | search results list | - |
| 00:05 | frame_00005 | Multiple Arthur Dent entries in search | - | - | patient search results | - |
| 00:06 | frame_00006 | Select Message Template heading, template "Test (updated due to duplicate name) updated 2" | - | - | template selection view | - |
| 00:07 | frame_00007 | Select Health Form dropdown | Your selection contains no session availability | - | error popup on health forms screen | - |
| 00:08 | frame_00008 | Added Health Forms section with entries | Your selection contains no session availability | - | health forms list, error popup | - |
| 00:09 | frame_00009 | Select Health Form dropdown with search | - | - | health form dropdown expanded | - |
| 00:10 | frame_00010 | Sleep Ap form options in dropdown | - | - | health form search results | - |
| 00:11 | frame_00011 | Booking Link, Date & Time 24/04/2026-24/05/2026, Face to Face Slot Type(s) search "de" | - | - | booking link config, slot type search | - |
| 00:12 | frame_00012 | Face to Face Slot Type(s) dropdown: "Default" with EMIS label, search "def" | - | - | slot type dropdown showing Default option | - |
| 00:13 | frame_00013 | Select Health Form dropdown | Your selection contains no session availability | https://blinx.dev.blinxpaco-np.com/#pr_id_27493_content_0 | health forms screen with error | - |
| 00:14 | frame_00014 | Added Health Forms: two "Sleep Ap" entries | Your selection contains no session availability | - | health forms added, error visible | - |
| 00:15 | frame_00015 | Video Slot Type(s) tag "Virtual Mental Health Re...", Web Chat Slot Type(s) dropdown | - | - | booking link slot types | - |
| 00:16 | frame_00016 | Face to Face Slot Type(s) empty with search, Phone Slot Type(s) dropdown | - | - | booking link slot selectors | - |
| 00:17 | frame_00017 | [không chắc] | - | - | [frame read failed] | - |
| 00:18 | frame_00018 | Select Health Form empty dropdown | Your selection contains no session availability | - | health form selector with error | - |
| 00:19 | frame_00019 | Loading sessions... | - | - | booking link loading spinner | - |
| 00:20 | frame_00020 | Booking Link, Date & Time visible, Face to Face "Default" search "def" | - | - | booking link config | - |
| 00:21 | frame_00021 | Loading sessions... | - | - | booking link loading spinner | - |
| 00:22 | frame_00022 | Face to Face search: "Call Clinic" highlighted, "Call Clinic", "joint session", "mike untimed1", "PCN FCP" all PACO-CONNECT | - | - | clinic dropdown search results | - |
| 00:23 | frame_00023 | Success toast, Face to Face "Default" tag, Video/Web Chat/Clinician/Location dropdowns, Confirmation/Reminder Message | Session availability successfully updated | - | booking link configured successfully | - |
| 00:24 | frame_00024 | Booking Link, "Default" tag, Video/Web Chat/Clinician/Location dropdowns, Select appt reason code, Confirmation/Reminder Message | - | - | booking link form scrolled | - |
| 00:25 | frame_00025 | Email Preview: "Reminder: Your Upcoming Mental Health Review", full message content | - | - | email preview display | - |
| 00:26 | frame_00026 | Success toast, Video/Web Chat dropdowns, Booking Notes, Confirmation/Reminder Message | Session availability successfully updated | - | booking link scrolled down | - |
| 00:27 | frame_00027 | Email Preview: "General Practice (Demo Site)", "Reminder: Your Upcoming Mental Health Review", "Hi Arthur," | - | - | email preview with header | - |
| 00:28 | frame_00028 | Email editor: "hello" text, "General Practice (Demo Site)" header, Preview tab | - | - | editing email template | - |
| 00:29 | frame_00029 | [không chắc] | - | - | [frame read failed] | - |
| 00:30 | frame_00030 | Email editor: "hello", blue header "General Practice (Demo Site)", full email content | - | - | email editor with preview | - |
| 00:31 | frame_00031 | Email compose, Send Now/Schedule dropdown visible | - | - | send options menu open | - |
| 00:32 | frame_00032 | Create Campaign with PACO Assist modal, Tone: Professional, Email+SMS checked, Booking Link checked | - | - | PACO Assist dialog | - |
| 00:33 | frame_00033 | PACO Assist modal, campaign description field: "Boo" | - | - | typing campaign description | - |
| 00:34 | frame_00034 | PACO Assist modal, placeholder text visible in description field | - | - | PACO Assist form | - |
| 00:35 | frame_00035 | PACO Assist modal, description field: "Book your as" | - | - | typing campaign description | - |
| 00:36 | frame_00036 | Create Campaign with PACO Assist — What is this campaign for?, Tone: Professional, Email + SMS checked, Booking Link + Health Form checked, Cancel, Generate Templates | - | - | PACO Assist dialog open, user fills "Book your asthma review" | - |
| 00:37 | frame_00037 | Test (updated due to duplicate name) updated 2, Send as: SMS / Email, Preview, {{organisation_header}} {{organisation_name}} "Book Your Asthma Review", "Hi {{{first_name}}},", "Your regular asthma review..." | - | - | Generated email template displayed in editor | Template generated successfully with booking link |
| 00:38 | frame_00038 | Test (updated due to duplicate name) updated 2, Send as: Email, Preview, Email | [không chắc] | - | Campaign editor transitioning/scrolling | Content appears blurred during scroll |
| 00:39 | frame_00039 | [không chắc - partially visible] | - | - | Loading indicator visible | Template preview loading or transitioning |
| 00:40 | frame_00040 | Create Campaign with PACO Assist, Generated Email Template, "General Practice (Demo Site)", "Book Your Asthma Review", "Hi Arthur,", "Your regular asthma review is an important part of managing your condition effectively. It allows us to assess your symptoms,", Regenerate, Cancel, Use These Templates | - | - | Template preview modal showing generated content | Generated template displays patient name "Arthur" |
| 00:41 | frame_00041 | Save Campaign, Choose how you'd like to save this campaign, Save as New, Create a new campaign using the current content. Your existing campaign will remain unchanged., Update existing, Overwrite the current campaign with these changes. This will replace the existing content., Cancel, Update | - | - | Save dialog opened with "Update existing" selected | User opts to update existing campaign instead of creating new |
| 00:42 | frame_00042 | Create Campaign with PACO Assist, Analysing your campaign requirements..., Understanding the context..., What is this campaign for?: Book your asthma review, Tone: Professional, Email + SMS checked, Booking Link + Health Form checked, Generating... | - | - | PACO Assist analyzing campaign requirements | Loading state while processing campaign |
| 00:43 | frame_00043 | [Same as 00:42] | Analysing your campaign requirements... | - | Dialog still in analyzing/loading state | Progress indicator continues |
| 00:44 | frame_00044 | Test (updated due to duplicate name) updated 2, Send as: Email, "- Our team will contact you to confirm the details", When to do it, Please book your appointment at your earliest convenience, We recommend scheduling your review within the next few weeks to maintain your health, What happens next, After booking you will receive a confirmation email with the appointment details, Our healthcare team will prepare for your visit, How to get help, contact us at {{{organisation_phone_number}}} or email us at {{{organisation_email_address}}}, Book Now | - | - | Email template editor showing full campaign content | Content scrolled to show call-to-action and contact details |
| 00:45 | frame_00045 | [Similar to 00:44] | [không chắc - partial view] | - | Scrolled view of email template | Similar state to previous frame |
| 00:46 | frame_00046 | Create Campaign with PACO Assist, What is this campaign for?: Book your asthma review, Tone: Professional, Email + SMS checked, Booking Link + Health Form checked, Cancel, Generate Templates | - | - | PACO Assist dialog re-opened | User opens dialog again, now both Email and SMS checked |
| 00:47 | frame_00047 | Test (updated due to duplicate name) updated 2, {{organisation_header}} {{organisation_name}} "Book Your Asthma Review", "Hi {{{first_name}}},", "Your regular asthma review...", When to do it, Please book your appointment, We recommend scheduling your review within the next few weeks | - | - | Email template in editor with content visible | Template showing header placeholders and body content |
| 00:48 | frame_00048 | "- Our team will contact you to confirm the details", When to do it, Please book your appointment, Our healthcare team will prepare for your visit, How to get help, contact us at {{{organisation_phone_number}}} or email {{{organisation_email_address}}}, Book Now | - | - | Scrolled view showing contact info and CTA | Booking Link icon visible on right sidebar with badge |
| 00:49 | frame_00049 | [Similar to 00:48] | - | - | Similar scrolled state | Cursor near Booking Link icon |
| 00:50 | frame_00050 | "- Our team will contact you to confirm the details", When to do it, Please book your appointment, We recommend scheduling your review within the next few weeks, What happens next, After booking you will receive a confirmation email, Our healthcare team will prepare for your visit, How to get help, contact us at {{{organisation_phone_number}}} or email {{{organisation_email_address}}}, Book Now | - | - | Full email template visible in editor | Complete campaign content displayed |
| 00:51 | frame_00051 | [Similar to 00:50] | - | - | Similar editor state | Minor cursor movement |
| 00:52 | frame_00052 | [Similar to previous frames] | - | - | Campaign editor showing full template | Content ready for sending |
| 00:53 | frame_00053 | Success, Message Sent Single, "- Our team will contact you to confirm the details", When to do it, Please book your appointment, We recommend scheduling your review within the next few weeks, What happens next, After booking you will receive a confirmation email, Our healthcare team will prepare for your visit, How to get help, contact us at {{{organisation_phone_number}}} or email {{{organisation_email_address}}}, Book Now, Send Now, Schedule | - | - | Success toast appears showing message sent | Send Now dropdown menu visible showing Schedule option |
| 00:54 | frame_00054 | Templates Applied, Your PACO Assist templates have been loaded into the editor, {{organisation_header}} {{organisation_name}} "Book Your Asthma Review", "Hi {{{first_name}}},", "Your regular asthma review..." | - | - | Toast notification showing templates applied | Confirmation that templates loaded into editor |
| 00:55 | frame_00055 | Templates Generated, PACO Assist has generated your campaign templates, Templates Applied, Your PACO Assist templates have been loaded into the editor, {{organisation_header}} {{organisation_name}} "Book Your Asthma Review", "Hi {{{first_name}}},", "Your regular asthma review..." | - | - | Two toast notifications stacked | Both generation and application confirmations shown |
| 00:56 | frame_00056 | Templates Generated, Templates Applied, {{organisation_header}} {{organisation_name}} "Book Your Asthma Review", "Hi {{{first_name}}},", "Your regular asthma review..." | - | - | Toast notifications still visible | User reviewing generated template content |
| 00:57 | frame_00057 | Home, Hi Daniel Farley, cient, Analytics, Comms Hub, Web Chat & Video, Patient Search, Health Forms, Care Navigator | - | blinx.dev.blinxpaco-np.com | User navigated back to PACO home dashboard | Search bar shows partial text "cient", main modules visible |
| 00:58 | frame_00058 | (no separate frame read; video may end on dashboard state from 00:57) | - | - | End of video or transition | Frame 58 not distinctly captured |

## Section 2 — Synthesized flow

1. Mở Quick Send panel → gõ "art" tìm bệnh nhân → chọn Arthur Dent (NHS Nr 2222223792, DOB 01/06/1970), checkbox `Email` đã checked.

2. Mở dropdown `Select Message Template` → popup **"Your selection contains no session availability"** xuất hiện đè lên template selector.

3. Chọn template "Test (updated due to duplicate name) updated 2" → chuyển sang màn hình chọn Health Form, popup error vẫn hiển thị.

4. Mở dropdown `Select Health Form`, tìm và thêm hai health form "Sleep Ap" → popup error vẫn hiện.

5. Cấu hình `Booking Link`: Date & Time 24/04/2026-24/05/2026 → search slot type "def" trong Face to Face → chọn "Default" (EMIS label) → loading spinner "Loading sessions...".

6. Search thêm trong Face to Face, hiển thị danh sách "Call Clinic", "joint session", "mike untimed1", "PCN FCP" (tất cả PACO-CONNECT).

7. Toast `Session availability successfully updated` → booking link đã cấu hình xong với tag "Default", các dropdown Video/Web Chat/Clinician/Location hiển thị.

8. Xem Email Preview: tiêu đề "Reminder: Your Upcoming Mental Health Review", header "General Practice (Demo Site)", nội dung "Hi Arthur,..." → chuyển sang email editor, gõ "hello".

9. Mở dropdown `Send Now/Schedule` → chọn mở modal `Create Campaign with PACO Assist`: Tone `Professional`, checkbox `Email` + `SMS` checked, `Booking Link` checked.

10. Gõ mô tả campaign "Book your asthma review" → click `Generate Templates` → PACO Assist analyzing ("Analysing your campaign requirements...").

11. Template email được generate hiển thị trong editor với booking link đã nhúng, preview modal mở ra cho thấy nội dung đầy đủ với tên "Arthur".

12. Mở dialog `Save Campaign` → chọn `Update existing` (ghi đè campaign hiện tại) → click `Update`.

13. PACO Assist dialog mở lại lần thứ hai [không chắc lý do], cả `Email` và `SMS` vẫn checked, `Booking Link` + `Health Form` checked.

14. Editor hiển thị email template đầy đủ, sidebar bên phải có icon `Booking Link` với badge → scroll xuống thấy call-to-action "Book Now" và contact info.

15. Toast `Message Sent Single` xuất hiện → dropdown `Send Now` mở cho thấy option `Schedule`.

16. Hai toast notification chồng lên nhau: "Templates Generated" + "Templates Applied" → xác nhận PACO Assist đã load templates vào editor.

17. Navigate về PACO home dashboard, search bar hiển thị text "cient" [không chắc].

**Quan sát:** Popup "Your selection contains no session availability" xuất hiện ở bước 2-4 khi đang chọn template và health form, có thể là popup scheduler link cần thêm mà ticket mô tả; popup này có thể bị che khuất bởi Quick Send panel hoặc các dialog khác khi workflow phức tạp hơn.

## Section 3 — Open questions

- Frames 17, 29, 38, 39, 45, 51, 52, 58 không đọc được rõ (một số do system-reminder injection chen vào). Không thể khẳng định chi tiết UI tại các frame đó.
- Frame 57 hiển thị "Hi Daniel Farley" thay vì "Arthur" — có thể user khác cùng session, hoặc navigation giữa accounts. Cần test data rõ ràng để xác minh.
- Không thấy frame nào chụp được popup "Scheduler Link Needed" che khuất Quick Send box như ticket mô tả; popup "Your selection contains no session availability" có thể là biểu hiện khác của cùng defect hoặc liên quan.

## Section 4 — Suggested manual replay

The minimal flow to reproduce the popup bug:
1. Open Quick Send panel.
2. Search and select a patient with an existing booking link template.
3. Add a new health form or booking link to the template.
4. Observe whether a "Scheduler Link Needed" popup appears and whether it is behind the Quick Send box.

This corresponds to video frames 02-04 + 13-14.
