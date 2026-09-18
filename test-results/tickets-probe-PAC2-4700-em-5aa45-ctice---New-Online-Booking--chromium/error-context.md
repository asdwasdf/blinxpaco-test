# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tickets/probe-PAC2-4700-emis-targets.spec.ts >> inspect Tower House Practice - New Online Booking!
- Location: playwright/tests/tickets/probe-PAC2-4700-emis-targets.spec.ts:31:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').locator('[role="treeitem"]').filter({ hasText: 'Tower House Practice - New Online Booking!' }).visible().first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('dialog').locator('[role="treeitem"]').filter({ hasText: 'Tower House Practice - New Online Booking!' }).visible().first() with timeout 10000ms
  - waiting for getByRole('dialog').locator('[role="treeitem"]').filter({ hasText: 'Tower House Practice - New Online Booking!' }).visible().first()

```

```yaml
- button "Accessibility Menu"
- button "Expand sidebar":
  - img "Paco Logo"
- img "Dashboards"
- img "Analytics & Reports"
- img "Quick Send"
- img "Health Forms"
- img "Patient Search"
- img "Web Chat & Video"
- img "case load management"
- img "Appointment Book"
- img "Quick Pay"
- img "Users"
- img "Configuration"
- img "Rocket Bar"
- img
- button "Switch to dark theme":
  - img "Switch to dark theme"
- text: 3h 3m TFN Test Fiona Nguyen Super Admin GB General Practice (Blinx Demo Site)
- textbox "Search patients by name or NHS number": Michael Ramella
- button "Clear search"
- text: Results (2) Consent & Actions MR
- img
- text: "Michael Ramella NHS No: 709 86 More Info"
- img
- img
- text: 15/03/2024 (2 yo)
- img
- text: "07379060817"
- img
- img
- button "Patient actions menu":
  - img
- text: MR
- img
- text: "Michael Ramella NHS No: 100 001 9932 More Info"
- img
- img
- text: 01/01/1900 (126 yo)
- img
- img
- button "Patient actions menu":
  - img
- checkbox "Include deleted patients"
- text: Include deleted patients
- button "More options":
  - img
- text: "0"
- button "day"
- button "week"
- button "month"
- button "year"
- region:
  - text: Opel level
  - img
  - text: Level 2 Moderate Pressure
  - group "0":
    - textbox: Master Task Board Overview
    - text: Master Task Board Overview
    - button
    - img
    - text: "0"
    - list
    - text: Completed 0
  - textbox: Master Task Board Overview
  - text: Master Task Board Overview
  - button
  - img
  - text: "0"
  - list
  - text: Completed 0
  - list:
    - listitem:
      - button "Page 1"
    - listitem:
      - button "Page 2"
    - listitem:
      - button "Page 3"
    - listitem:
      - button "Page 4"
- text: Staff Availability
- button "What do these statuses mean?"
- textbox: A - Z Last Name
- text: A - Z Last Name
- button
- textbox "Search Clinicians..."
- text: 5 on Rota Fri 18 Sept, 19:28
- button "Available (7)"
- button "On Leave (0)"
- img "Away from Desk · 21m"
- text: DEB
- button "Dr Ellie Bartlett Super Admin GB Away from Desk · 21m"
- button "Send Message" [disabled]
- img "Away from Desk · 8m"
- text: DGB
- button "Dr Gareth Bartlett Super Admin GB Away from Desk · 8m"
- button "Send Message" [disabled]
- img "Logged Out · 37m"
- text: JB
- button "Johnny (2255) Bravo Blinx Deployment Logged Out · 37m"
- button "Send Message" [disabled]
- img "Admin · 12m"
- text: MTF
- button "Miss Test Fiona Nguyen Super Admin GB Admin · 12m"
- button "Send Message" [disabled]
- img "Logged Out · 10m"
- text: AH
- button "Ammar Hashad Blinx Deployment Logged Out · 10m"
- button "Send Message" [disabled]
- img "Admin · 22m"
- text: MN
- button "MustafaDefault Nawaz GP Admin · 22m"
- button "Send Message" [disabled]
- img "Logged Out · 57m"
- text: KS
- button "Katie SparrowTest 111 Call Handler Logged Out · 57m"
- button "Send Message" [disabled]
- alert:
  - text: Error Your selection contains no session availability.
  - button
- 'dialog "Quick Send rocket icon Michael Ramella | NHS Nr: 70986 View Patient Details sms on file email on file Post Code: L61PH DOB: Unknown (Unknown)"':
  - img "Quick Send rocket icon"
  - text: "Michael Ramella | NHS Nr: 70986"
  - button "View Patient Details"
  - img "sms on file"
  - img "email on file"
  - text: "Post Code: L61PH DOB: Unknown (Unknown)"
  - button "Close"
  - button
  - paragraph: Select Campaign
  - img "search icon"
  - textbox "Search...": Tower House Practice - New Online Booking!
  - textbox: By message type
  - text: A - Z
  - button
  - tree
  - text: "JS & GB Test (click to change) Patient Reply:"
  - button "Set up Patient Reply"
  - button "Preview"
  - button "Edit"
  - text: Hi Michael, JS & GB Test Kind Regards Blinx HealthCare
  - button "Generate Virtual Consult Link":
    - button
    - menu:
      - menuitem "Virtual Consult Link":
        - menuitem "Virtual Consult Link"
      - menuitem "Merge Fields":
        - menuitem "Merge Fields"
  - text: "Send as:"
  - button "SMS enabled" [disabled]
  - button "Enable Email"
  - text: "Preview:"
  - button "Preview SMS"
  - button "Preview Email" [disabled]
  - button "Copy to Email"
  - button "Resources"
  - button "quick-send-action":
    - img "send, schedule or patient sequence context button"
  - button "tab-Campaign": Campaign
  - button "tab-Health Forms": Health Forms
  - button "tab-Files": Files
  - button "Booking Link-badge tab-Booking Link": 1 Booking Link
  - button "Save" [disabled]
- button
- text: Scheduler Link Required Your
- strong: booking link
- text: needs a scheduler link so patients can access it.
- button "I'll Choose Where"
- button "Add at End"
```

# Test source

```ts
  1  | import { expect, test } from '../../fixtures/auth-fixtures.js';
  2  | import type { Locator, Page } from '@playwright/test';
  3  | import { mkdir, writeFile } from 'node:fs/promises';
  4  | 
  5  | const OUTPUT = 'test-results/PAC2-4700/locate/20260918-emis-targets';
  6  | const CAMPAIGNS = [
  7  |   'GP Requested Appointment',
  8  |   'How do i set up an quick send message (no appointment)',
  9  |   'Tower House Practice - New Online Booking!',
  10 | ];
  11 | 
  12 | test.setTimeout(120_000);
  13 | 
  14 | async function openQuickSend(page: Page): Promise<Locator> {
  15 |   await page.goto('https://blinx.dev.blinxpaco-np.com/paco/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  16 |   const search = page.getByPlaceholder('Search patients by name or NHS number', { exact: true });
  17 |   await expect(search).toBeVisible({ timeout: 20_000 });
  18 |   await search.fill('Michael Ramella');
  19 |   const result = page.locator('div').filter({ hasText: '709 86' }).filter({ has: page.getByRole('button', { name: 'Patient actions menu', exact: true }) }).last();
  20 |   await expect(result).toBeVisible({ timeout: 20_000 });
  21 |   await result.getByRole('button', { name: 'Patient actions menu', exact: true }).click();
  22 |   const quickSend = page.locator('[role="menuitem"], li').filter({ hasText: 'Quick Send' }).filter({ visible: true });
  23 |   await expect(quickSend).toHaveCount(1);
  24 |   await quickSend.click();
  25 |   const dialog = page.getByRole('dialog');
  26 |   await expect(dialog).toBeVisible({ timeout: 20_000 });
  27 |   return dialog;
  28 | }
  29 | 
  30 | for (const campaign of CAMPAIGNS) {
  31 |   test(`inspect ${campaign}`, async ({ authenticatedContext }) => {
  32 |     await mkdir(OUTPUT, { recursive: true });
  33 |     const file = campaign.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  34 |     const checkpoint: Record<string, unknown> = { campaign, step: 'opening Quick Send' };
  35 |     const save = async (step: string): Promise<void> => {
  36 |       checkpoint.step = step;
  37 |       await writeFile(`${OUTPUT}/${file}.json`, `${JSON.stringify(checkpoint, null, 2)}\n`);
  38 |     };
  39 |     await save('opening Quick Send');
  40 |     const page = await authenticatedContext.newPage();
  41 |     const dialog = await openQuickSend(page);
  42 |     await save('opening picker');
  43 |     const change = dialog.getByText('(click to change)', { exact: true });
  44 |     const choose = dialog.getByText('Choose template', { exact: true });
  45 |     await (await change.count() === 1 ? change : choose).first().click();
  46 |     const search = dialog.getByPlaceholder('Search...', { exact: true });
  47 |     await expect(search).toBeVisible({ timeout: 10_000 });
  48 |     await search.fill(campaign);
  49 |     await save('selecting campaign');
  50 |     const item = dialog.locator('[role="treeitem"]').filter({ hasText: campaign }).filter({ visible: true }).first();
> 51 |     await expect(item).toBeVisible({ timeout: 10_000 });
     |                        ^ Error: expect(locator).toBeVisible() failed
  52 |     await item.scrollIntoViewIfNeeded();
  53 |     await item.click({ timeout: 15_000 });
  54 |     await save('opening Booking Link');
  55 |     const booking = dialog.locator('button').filter({ hasText: 'Booking Link' }).filter({ visible: true });
  56 |     await expect(booking).toHaveCount(1);
  57 |     await booking.click();
  58 |     const text = ((await dialog.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  59 |     const result = {
  60 |       campaign,
  61 |       hasEmis: /EMIS/i.test(text),
  62 |       hasSlot: /slot type|slot/i.test(text),
  63 |       hasVirtualMentalHealth: /Virtual Mental Health/i.test(text),
  64 |       hasSchedulerLink: /scheduler_link|scheduler link/i.test(text),
  65 |       relevant: (text.match(/.{0,80}(?:EMIS|slot type|slot|Virtual Mental Health|scheduler_link).{0,120}/gi) ?? []).slice(0, 10),
  66 |     };
  67 |     await writeFile(`${OUTPUT}/${file}.json`, `${JSON.stringify(result, null, 2)}\n`);
  68 |     await page.close();
  69 |   });
  70 | }
  71 | 
```