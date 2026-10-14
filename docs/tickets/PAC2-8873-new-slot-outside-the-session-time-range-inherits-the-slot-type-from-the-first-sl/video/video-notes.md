# PAC2-8873 Video Notes

## Bug Flow (từ video 6:22)
1. **Session config:** 4 slots tại 10:00, 10:30, 11:00, 11:30
2. **Default Slot Type:** "Test Billable"
3. **Bug trigger:** User thay đổi Slot Type của slot 10:00 thành "Test Slot Type"
4. **Add slot outside range:** User thêm slot 11:45-12:15 (ngoài session 10:00-12:00)
5. **BUG:** New slot được tạo với Slot Type = "Test Slot Type" (inherit từ first slot)
6. **Expected:** New slot nên dùng "Test Billable" (default session Slot Type)

## UI Evidence
- Session start: 10:00 AM, end: 12:00 PM
- 4 existing slots với Slot Type "Test Billable"
- First slot (10:00) đổi thành "Test Slot Type"
- New slot outside range inherit "Test Slot Type" → BUG

## Target Feature Branch
`blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8873/`

## Key Timestamps
- 0:00-1:00: Session config view
- 1:00-2:00: Change first slot type
- 2:00-3:30: Add slot outside range
- 3:30-4:00: Bug visible - wrong slot type

## Provenance
Observed from video frames extracted at 0.33fps
