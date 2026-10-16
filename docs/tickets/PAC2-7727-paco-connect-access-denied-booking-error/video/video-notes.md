# Video Analysis: PAC2-7727 Booking Error Flow

**Video metadata:** 178.3s, 1876×980px, 30fps  
**Recorded:** 2026-08-19

## Tổng quan

Video ghi lại flow từ PACO Configuration → generate DFD booking link → scheduler page, trong đó xuất hiện lỗi "No token found" tại giây 60, nhưng sau đó web form vẫn load thành công và cho phép điền thông tin. Lỗi mang tính intermittent - blocking error xuất hiện nhưng flow vẫn tiếp tục được.

## Các bước flow

1. **0s:** Màn PACO Configuration, sidebar trái có menu `Patient` expanded với item `DFD` được hover/highlight
2. **30s:** Màn scheduler "Request an appointment" đã load
   - Patient: Michael Ramella
   - NHS No: 70986
   - DOB: 19/08/2026
   - Button `Send Secure Code` visible
   - Privacy notice popup hiển thị bên phải
3. **60s:** ERROR PAGE - màn "Link Error" với background xanh nhạt, logo Blinx centered
4. **90s:** Web form đã load thành công (lỗi đã qua)
   - Greeting: "Hi Michael Ramella 👋"
   - NHS No. 70986
   - Form fields hiển thị: "Brief description", "Details of your symptoms today?"
5. **120s:** Form scroll xuống, user đã điền:
   - Brief description: "this is testing"
   - Radio selected: "A problem that we already know about that's ongoing"
   - File upload area showing "Uploading..."
6. **150s:** Form hoàn chỉnh
   - File uploaded: "ánh structur.jpg"
   - Phone: +44 4324 322
   - Submit modal popup: "Submit to Your Healthcare Team" với warning về không thể edit sau khi continue
7. **178s:** Modal đã đóng, form sẵn sàng submit

## Error message nguyên văn

**Heading:** `Link Error`

**Body text:**
```
No token found. Your link may have expired — please use the most recent link your healthcare team sent you.
```

**Context:** Modal dialog với info icon (chấm than trong vòng tròn), background trắng over light blue page background, footer "Powered by blinx healthcare"

## Màn/bước trước khi lỗi

- **Trước lỗi (30s):** Scheduler page "Request an appointment" đã load với patient details populated, button `Send Secure Code` sẵn sàng
- **URL pattern (60s error):** `https://dev.blinxscheduler-np.com/patient-self-booking/#eyJhbG...` (JWT token trong URL fragment)
- **Sau lỗi (90s):** URL chuyển sang `https://dev.blinxscheduler-np.com/web-form/?wf=...`, web form load thành công với patient context còn nguyên

## Console/network errors

Không visible trong video frames (không có dev tools open).

## Timestamp key

- `0s` - PACO Configuration (DFD menu item)
- `30s` - Scheduler appointment request page loaded
- `60s` - **ERROR: "No token found" page**
- `90s` - Web form recovered, form fields visible
- `120s` - User filling form, file uploading
- `150s` - Submit modal appeared
- `178s` - Ready to submit (end)

## Kết luận

Lỗi "No token found" xuất hiện tại mid-flow (60s) nhưng không block hoàn toàn - web form vẫn load thành công sau đó. Behavior này cho thấy intermittent/transient error có thể liên quan đến JWT token validation hoặc routing giữa scheduler page và web form page.
