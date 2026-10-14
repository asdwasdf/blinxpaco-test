# PAC2-7398 — Feature Location

## Ticket
**Summary:** Scheduler Not Picking Up Clinicians from Connect
**Bug:** Scheduler không hiển thị/gợi ý clinicians khi template được map với CONNECT slot.

## LOCATE Result

**Status:** Confirmed

**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)
**Role:** Super Admin GB
**Entry:** Dashboard → Configuration → Appointment Books → Scheduler

### Verified Route

1. Dashboard → click `Configuration` (sidebar icon)
2. Navigate to `/paco/configuration/organisation/general`
3. Click `Appointment Books` expand → child `Scheduler`
4. URL redirects to: `/configuration/#scheduler-config`
5. Page title: `Scheduler Configuration`

### Feature Root

- **Route:** `/configuration/#scheduler-config`
- **Landmark:** heading `Scheduler Config`
- **Template List:** left panel với danh sách template (campaign)
- **Edit Connections:** dialog mở khi click Edit button trên template row

### Edit Connections Dialog

- **Trigger:** Click Edit button (icon) trên template row
- **Content:** AG Grid table với columns: Template, Appointment, Slot, Min Time, Period
- **Clinician Selection:** combobox `Select a clinician` (chưa test kỹ trong locate)
- **Actions:** Cancel, Save

### Template chứa EMIS & Connect

- Template name: `Newly Created with EMIS & Connect Availability`
- Type: Email + SMS variants
- Có cả EMIS slots và PACO-CONNECT slots được map

### Budget

- Views count: 3 (dashboard, scheduler-config, edit-connections dialog)
- Minutes: ~5

### Evidence

- Screenshot: `test-results/PAC2-7398/locate/edit-connections-dialog.png`

## Next Step

EXPLORE phase: Observe behavior khi chọn clinician cho CONNECT slot — xác nhận clinicians có hiện trong dropdown hay không.
