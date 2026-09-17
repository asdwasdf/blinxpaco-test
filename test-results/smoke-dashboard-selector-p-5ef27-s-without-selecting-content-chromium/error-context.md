# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke\dashboard-selector-probe.spec.ts >> scans Quick Send selectors without selecting content
- Location: playwright\tests\smoke\dashboard-selector-probe.spec.ts:86:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('button', { name: 'tab-Booking Link', exact: true })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" getByRole('button', { name: 'tab-Booking Link', exact: true }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'tab-Booking Link', exact: true })
    13 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic "Accessibility Menu":
    - button "Accessibility Menu" [ref=e3] [cursor=pointer]
  - generic [ref=e9]:
    - generic [ref=e10]:
      - generic [ref=e11]: 36m
      - generic [ref=e16]:
        - generic [ref=e17]:
          - img "Mobile burger menu" [ref=e18] [cursor=pointer]
          - generic [ref=e19]: TFN
        - generic [ref=e23]:
          - generic [ref=e24] [cursor=pointer]
          - button "More options" [ref=e26] [cursor=pointer]
          - generic [ref=e30] [cursor=pointer]: "0"
    - generic [ref=e34]:
      - generic [ref=e36]:
        - button "day" [ref=e38] [cursor=pointer]
        - button "week" [ref=e42] [cursor=pointer]
        - button "month" [ref=e46] [cursor=pointer]
        - button "year" [ref=e50] [cursor=pointer]
      - generic [ref=e51]:
        - region [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e57]:
              - generic [ref=e62]:
                - generic [ref=e63]: Opel level
                - generic [ref=e97]:
                  - generic [ref=e98]: Level 2
                  - generic [ref=e99]: Moderate Pressure
                - generic [ref=e101]: Coming soon
              - group "0" [ref=e102]:
                - generic [ref=e106]:
                  - generic [ref=e109] [cursor=pointer]:
                    - generic [ref=e110]:
                      - textbox: Master Case Board Overview
                    - generic [ref=e112]: Master Case Board Overview
                    - button [ref=e113]
                  - generic [ref=e118]:
                    - generic [ref=e119]: "0"
                    - generic:
                      - list
                    - generic [ref=e131]: Completed 0
              - group [aria-hidden] [ref=e135]:
                - generic [ref=e139]:
                  - generic [ref=e140]: Call Status
                  - img [ref=e146]:
                    - generic [ref=e152]:
                      - generic [ref=e153]: Calls Waiting
                      - generic [ref=e154]: Consultations Completed
                      - generic [ref=e155]: Failed to Contact
                      - generic [ref=e156]: active calls
                    - generic [ref=e157]:
                      - generic [ref=e158]: "0"
                      - generic [ref=e159]: "60"
                      - generic [ref=e160]: "120"
                      - generic [ref=e161]: "180"
                      - generic [ref=e162]: "240"
                      - generic [ref=e163]: "300"
              - group [aria-hidden] [ref=e164]:
                - generic [ref=e168]:
                  - generic [ref=e169]: Staff Status
                  - generic [ref=e172]:
                    - list [ref=e174]:
                      - listitem [ref=e175]: Available (75)
                      - listitem [ref=e177]: F2F (65)
                      - listitem [ref=e179]: Screening (50)
                      - listitem [ref=e181]: Lunch (15)
                      - listitem [ref=e183]: Away (50)
                    - generic [ref=e185]: Out of a possible 132
                  - generic [ref=e214]: Coming soon
              - group [aria-hidden] [ref=e215]:
                - generic [ref=e219]:
                  - generic [ref=e220]: Opel level
                  - generic [ref=e254]:
                    - generic [ref=e255]: Level 2
                    - generic [ref=e256]: Moderate Pressure
                  - generic [ref=e258]: Coming soon
              - generic [ref=e263]:
                - generic [ref=e266] [cursor=pointer]:
                  - generic [ref=e267]:
                    - textbox: Master Case Board Overview
                  - generic [ref=e269]: Master Case Board Overview
                  - button [ref=e270]
                - generic [ref=e275]:
                  - generic [ref=e276]: "0"
                  - generic:
                    - list
                  - generic [ref=e288]: Completed 0
            - list [ref=e292]:
              - listitem [ref=e293]:
                - button "Page 1" [ref=e294] [cursor=pointer]
              - listitem [ref=e295]:
                - button "Page 2" [ref=e296] [cursor=pointer]
              - listitem [ref=e297]:
                - button "Page 3" [ref=e298] [cursor=pointer]
              - listitem [ref=e299]:
                - button "Page 4" [ref=e300] [cursor=pointer]
        - generic [ref=e304]:
          - generic [ref=e305]:
            - generic [ref=e306]:
              - generic [ref=e307]: Staff Availability
              - button "What do these statuses mean?" [ref=e308] [cursor=pointer]
            - generic [ref=e312] [cursor=pointer]:
              - generic [ref=e313]:
                - textbox: A - Z Last Name
              - generic [ref=e315]: A - Z Last Name
              - button [ref=e316]
          - generic [ref=e319]:
            - textbox "Search Clinicians..." [ref=e321]
            - generic [ref=e322]:
              - generic [ref=e323]: 4 on Rota
              - generic [ref=e324]: Wed 16 Sept, 21:09
          - generic [ref=e325]:
            - button "Available (7)" [ref=e326] [cursor=pointer]
            - button "On Leave (0)" [ref=e327] [cursor=pointer]
          - generic [ref=e328]:
            - generic [ref=e329]:
              - generic [ref=e330]:
                - img "Admin · 4m" [ref=e331]
                - text: DGB
              - button "Dr Gareth Bartlett Super Admin GB Admin · 4m" [ref=e333] [cursor=pointer]:
                - generic "Dr Gareth Bartlett" [ref=e334]
                - generic [ref=e335]:
                  - generic [ref=e336]: Super Admin GB
                  - generic [ref=e337]: Admin · 4m
              - generic "Coming soon — PACOmms user messaging" [ref=e338]:
                - button "Send Message" [disabled]
            - generic [ref=e339]:
              - generic [ref=e340]:
                - img "TEST STATUS · 33m" [ref=e341]
                - text: SB
              - button "Simon Bowers Super User - Sales TEST STATUS · 33m" [ref=e343] [cursor=pointer]:
                - generic "Simon Bowers" [ref=e344]
                - generic [ref=e345]:
                  - generic [ref=e346]: Super User - Sales
                  - generic [ref=e347]: TEST STATUS · 33m
              - generic "Coming soon — PACOmms user messaging" [ref=e348]:
                - button "Send Message" [disabled]
            - generic [ref=e349]:
              - generic [ref=e350]:
                - img "TEST STATUS · 5h 34m" [ref=e351]
                - text: JB
              - button "Johnny (2255) Bravo Blinx Deployment TEST STATUS · 5h 34m" [ref=e353] [cursor=pointer]:
                - generic "Johnny (2255) Bravo" [ref=e354]
                - generic [ref=e355]:
                  - generic [ref=e356]: Blinx Deployment
                  - generic [ref=e357]: TEST STATUS · 5h 34m
              - generic "Coming soon — PACOmms user messaging" [ref=e358]:
                - button "Send Message" [disabled]
            - generic [ref=e359]:
              - generic [ref=e360]:
                - img "Admin · 2m" [ref=e361]
                - text: MTF
              - button "Miss Test Fiona Nguyen Super Admin GB Admin · 2m" [ref=e363] [cursor=pointer]:
                - generic "Miss Test Fiona Nguyen" [ref=e364]
                - generic [ref=e365]:
                  - generic [ref=e366]: Super Admin GB
                  - generic [ref=e367]: Admin · 2m
              - generic "Coming soon — PACOmms user messaging" [ref=e368]:
                - button "Send Message" [disabled]
            - generic [ref=e369]:
              - generic [ref=e370]:
                - img "Logged Out · 15m" [ref=e371]
                - text: HM
              - button "Hannah Murphy Super Admin (Dev Access) Logged Out · 15m" [ref=e373] [cursor=pointer]:
                - generic "Hannah Murphy" [ref=e374]
                - generic [ref=e375]:
                  - generic [ref=e376]: Super Admin (Dev Access)
                  - generic [ref=e377]: Logged Out · 15m
              - generic "Coming soon — PACOmms user messaging" [ref=e378]:
                - button "Send Message" [disabled]
            - generic [ref=e379]:
              - generic [ref=e380]:
                - img "Logged Out · 8m" [ref=e381]
                - text: LN
              - button "Lucas Ngo Super Admin (Dev Access) Logged Out · 8m" [ref=e383] [cursor=pointer]:
                - generic "Lucas Ngo" [ref=e384]
                - generic [ref=e385]:
                  - generic [ref=e386]: Super Admin (Dev Access)
                  - generic [ref=e387]: Logged Out · 8m
              - generic "Coming soon — PACOmms user messaging" [ref=e388]:
                - button "Send Message" [disabled]
            - generic [ref=e389]:
              - generic [ref=e390]:
                - img "Logged Out · 4m" [ref=e391]
                - text: SW
              - button "Sheena Wilton 111 Call Handler Logged Out · 4m" [ref=e393] [cursor=pointer]:
                - generic "Sheena Wilton" [ref=e394]
                - generic [ref=e395]:
                  - generic [ref=e396]: 111 Call Handler
                  - generic [ref=e397]: Logged Out · 4m
              - generic "Coming soon — PACOmms user messaging" [ref=e398]:
                - button "Send Message" [disabled]
  - 'dialog "Quick Send rocket icon Katie Sparrow | NHS Nr: 2222229537 View Patient Details sms not on file email not on file Post Code: - DOB: Unknown (Unknown)" [ref=e400]':
    - generic [ref=e402]:
      - generic [ref=e406]:
        - img "Quick Send rocket icon" [ref=e408]
        - generic [ref=e410]:
          - generic [ref=e411]:
            - generic [ref=e412]: Katie Sparrow
            - generic [ref=e413]: "|"
            - generic [ref=e414]:
              - generic [ref=e415]: "NHS Nr:"
              - generic [ref=e416] [cursor=pointer]: "2222229537"
            - button "View Patient Details" [ref=e417] [cursor=pointer]
            - generic [ref=e420]:
              - img "sms not on file" [ref=e423]
              - img "email not on file" [ref=e426]
          - generic [ref=e427]:
            - generic [ref=e428]:
              - generic [ref=e429]: "Post Code:"
              - generic [ref=e430]: "-"
            - generic [ref=e431]:
              - generic [ref=e432]: "DOB:"
              - generic [ref=e433] [cursor=pointer]: Unknown (Unknown)
      - button "Close" [ref=e434] [cursor=pointer]
    - generic [ref=e437]:
      - generic [ref=e438]:
        - generic [ref=e439]:
          - button [ref=e440] [cursor=pointer]
          - button [aria-hidden] [ref=e443] [cursor=pointer]
        - generic [ref=e445]:
          - paragraph [ref=e446]: Select Campaign
          - generic [ref=e447]:
            - generic [ref=e449]:
              - img "search icon" [ref=e450]
              - textbox "Search..." [ref=e451]
            - generic [ref=e452] [cursor=pointer]:
              - generic [ref=e453]:
                - textbox: By message type
              - generic [ref=e455]: By message type
              - button [ref=e456]
          - tree [ref=e461]:
            - treeitem "Favourites" [level=1] [ref=e462]:
              - generic [ref=e463] [cursor=pointer]:
                - button [ref=e464]
                - button "Favourites" [ref=e467]
            - treeitem "Booking Links & Health Forms" [level=1] [ref=e471]:
              - generic [ref=e472] [cursor=pointer]:
                - button [ref=e473]
                - button "Booking Links & Health Forms" [ref=e476]
            - treeitem "General News" [level=1] [ref=e478]:
              - generic [ref=e479] [cursor=pointer]:
                - button [ref=e480]
                - button "General News" [ref=e483]
            - treeitem "Guidance & Advice" [level=1] [ref=e485]:
              - generic [ref=e486] [cursor=pointer]:
                - button [ref=e487]
                - button "Guidance & Advice" [ref=e490]
      - generic [ref=e492]:
        - generic [ref=e493]:
          - generic [ref=e494]:
            - button
            - generic [ref=e495]:
              - generic [ref=e498] [cursor=pointer]: Test (updated due to duplicate name) updated 2
              - generic [ref=e499] [cursor=pointer]: (click to change)
            - generic [ref=e500]:
              - generic [ref=e501]: "Patient Reply:"
              - button "Set up Patient Reply" [ref=e502] [cursor=pointer]
          - generic [ref=e506]:
            - generic [ref=e507]: "Campaign:"
            - text: Test (updated due to duplicate name) updated 2
        - generic [ref=e509]:
          - generic [ref=e511]:
            - generic [ref=e512]:
              - generic [ref=e513]:
                - button "Preview" [ref=e514] [cursor=pointer]
                - button "Edit" [ref=e515] [cursor=pointer]
              - generic [ref=e516]: "Hi Katie, we noticed you missed your mental health review. Please rebook your appointment to continue your care. Visit {{{scheduler_link}}} to book now. aaaaa hhhhhh DDD"
              - generic [ref=e519] [cursor=pointer]:
                - generic:
                  - generic "PACO Assist"
            - generic:
              - generic:
                - button "Generate Virtual Consult Link":
                  - generic [ref=e523] [cursor=pointer]:
                    - button [ref=e524]
                    - menu:
                      - menuitem "Virtual Consult Link":
                        - menuitem "Virtual Consult Link"
                      - menuitem "Merge Fields":
                        - menuitem "Merge Fields"
          - generic [ref=e527]:
            - generic [ref=e528]:
              - generic [ref=e529]: "Send as:"
              - button "Enable SMS" [disabled] [ref=e530]
              - button "Enable Email" [disabled] [ref=e533]
            - generic [ref=e536]:
              - generic [ref=e537]: "Preview:"
              - button "Preview SMS" [disabled] [ref=e538]
              - button "Preview Email" [disabled] [ref=e541]
            - button "Copy to Email" [ref=e545] [cursor=pointer]
            - button "Resources" [ref=e549] [cursor=pointer]
      - generic "bottom-nav" [ref=e553]:
        - generic [ref=e554]:
          - button "quick-send-action" [ref=e556] [cursor=pointer]:
            - img "send, schedule or patient sequence context button" [ref=e557]
          - generic [ref=e558]:
            - button [ref=e559] [cursor=pointer]
            - button [ref=e561] [cursor=pointer]:
              - generic "Health Forms-badge" [ref=e563]: "2"
            - button [ref=e565] [cursor=pointer]
            - button [ref=e567] [cursor=pointer]:
              - generic "Booking Link-badge" [ref=e569]: "1"
```

# Test source

```ts
  42  |             });
  43  |           }
  44  | 
  45  |           const style = getComputedStyle(html);
  46  |           const visible =
  47  |             style.visibility !== 'hidden' &&
  48  |             style.display !== 'none' &&
  49  |             Boolean(html.offsetWidth || html.offsetHeight || html.getClientRects().length);
  50  |           if (!visible) continue;
  51  | 
  52  |           const text = (html.innerText || html.textContent || '').trim().replace(/\s+/g, ' ');
  53  |           const interactive = html.matches(
  54  |             'button, a, input, textarea, select, option, [role], [tabindex], [contenteditable="true"]',
  55  |           );
  56  |           const leafText = Boolean(text) && ![...html.children].some((child) =>
  57  |             (child as HTMLElement).innerText?.trim(),
  58  |           );
  59  |           if (!interactive && !leafText) continue;
  60  | 
  61  |           const id = html.id ? `#${html.id}` : '';
  62  |           const testId = html.getAttribute('data-testid');
  63  |           results.push({
  64  |             path: `${current.path} > ${html.tagName.toLowerCase()}${id}${testId ? `[data-testid="${testId}"]` : ''}`,
  65  |             tag: html.tagName.toLowerCase(),
  66  |             text: text.slice(0, 500),
  67  |             role: html.getAttribute('role'),
  68  |             ariaLabel: html.getAttribute('aria-label'),
  69  |             title: html.getAttribute('title'),
  70  |             type: html.getAttribute('type'),
  71  |             placeholder: html.getAttribute('placeholder'),
  72  |             class: html.getAttribute('class'),
  73  |           });
  74  |         }
  75  |       }
  76  | 
  77  |       return results;
  78  |     });
  79  | 
  80  |     frames.push({ url: frame.url(), candidates });
  81  |   }
  82  | 
  83  |   return frames;
  84  | }
  85  | 
  86  | test('scans Quick Send selectors without selecting content', async ({ authenticatedPage: page }) => {
  87  |   test.setTimeout(15 * 60_000);
  88  | 
  89  |   const search = page.getByPlaceholder('Search patients by name or NHS number', { exact: true });
  90  |   await expect(search).toHaveCount(1);
  91  |   await search.fill('katie sparrow');
  92  | 
  93  |   const nhs = page.getByText('NHS No: 222 222 9537', { exact: true });
  94  |   await expect(nhs).toHaveCount(1);
  95  | 
  96  |   const patientRow = nhs.locator('xpath=ancestor::div[contains(@class, "_patient-row_")][1]');
  97  |   const patient = patientRow.getByText('Katie Sparrow', { exact: true });
  98  |   const action = patientRow.getByRole('button', { name: 'Patient actions menu', exact: true });
  99  | 
  100 |   await expect(patientRow).toHaveCount(1);
  101 |   await expect(patient).toHaveCount(1);
  102 |   await expect(action).toHaveCount(1);
  103 | 
  104 |   const stages: Record<string, unknown> = {
  105 |     patientResults: await scanVisibleDom(page),
  106 |   };
  107 | 
  108 |   await action.click();
  109 |   stages.patientActionsMenu = await scanVisibleDom(page);
  110 | 
  111 |   const quickSend = page.getByRole('menuitem', { name: 'Quick Send', exact: true });
  112 |   await expect(quickSend).toHaveCount(1);
  113 |   await quickSend.click();
  114 |   await page.waitForTimeout(7_000);
  115 | 
  116 |   const dialog = page.getByRole('dialog');
  117 |   await expect(dialog).toHaveCount(1);
  118 |   stages.quickSendDialog = {
  119 |     aria: await dialog.ariaSnapshot(),
  120 |     dom: await scanVisibleDom(page),
  121 |   };
  122 | 
  123 |   const changeTemplate = dialog.getByText('(click to change)', { exact: true });
  124 |   const chooseTemplate = dialog.getByText('Choose template', { exact: true });
  125 |   const changeTemplateCount = await changeTemplate.count();
  126 |   const chooseTemplateCount = await chooseTemplate.count();
  127 |   if (changeTemplateCount > 1 || chooseTemplateCount > 1 || changeTemplateCount + chooseTemplateCount === 0) {
  128 |     throw new Error(
  129 |       `Blocked: expected one usable template picker control, found ${changeTemplateCount} change and ${chooseTemplateCount} choose controls`,
  130 |     );
  131 |   }
  132 |   await (changeTemplateCount === 1 ? changeTemplate : chooseTemplate).click();
  133 |   await page.waitForTimeout(7_000);
  134 |   stages.templatePicker = {
  135 |     aria: await ariaSnapshots(page.getByRole('dialog')),
  136 |     dom: await scanVisibleDom(page),
  137 |   };
  138 |   await page.keyboard.press('Escape');
  139 |   await expect(page.getByRole('dialog')).toHaveCount(1);
  140 | 
  141 |   const bookingLinkTab = page.getByRole('button', { name: 'tab-Booking Link', exact: true });
> 142 |   await expect(bookingLinkTab).toHaveCount(1);
      |                                ^ Error: expect(locator).toHaveCount(expected) failed
  143 |   await bookingLinkTab.click();
  144 |   stages.bookingLink = {
  145 |     aria: await dialog.ariaSnapshot(),
  146 |     dom: await scanVisibleDom(page),
  147 |   };
  148 | 
  149 |   const bookingComboboxes = dialog.getByRole('combobox');
  150 |   await expect(bookingComboboxes).toHaveCount(6);
  151 |   for (const [index, label] of [
  152 |     'Face to Face Slot Type(s)',
  153 |     'Phone Slot Type(s)',
  154 |     'Video Slot Type(s)',
  155 |     'Web Chat Slot Type(s)',
  156 |     'Select Clinician(s)',
  157 |     'Select Location(s)',
  158 |   ].entries()) {
  159 |     console.log(`PACO_PROBE_OPENING=${label}`);
  160 |     const combobox = bookingComboboxes.nth(index);
  161 |     const trigger = combobox
  162 |       .locator('xpath=ancestor::div[@data-pc-name="multiselect"][1]')
  163 |       .locator('[data-pc-section="trigger"]');
  164 |     await expect(trigger).toHaveCount(1);
  165 |     await trigger.click({ timeout: 7_000 });
  166 |     console.log(`PACO_PROBE_OPENED=${label}`);
  167 |     const visiblePicker = page.locator(
  168 |       '[role="listbox"]:visible, .p-dropdown-panel:visible, .p-multiselect-panel:visible, .p-overlay:visible',
  169 |     );
  170 |     await expect(visiblePicker.first()).toBeVisible({ timeout: 7_000 });
  171 |     stages[`bookingLink:${label}`] = {
  172 |       pickerText: await visiblePicker.allInnerTexts(),
  173 |       options: await ariaSnapshots(page.getByRole('option')),
  174 |     };
  175 |     await trigger.click({ timeout: 7_000 });
  176 |     await expect(visiblePicker.first()).toBeHidden({ timeout: 7_000 });
  177 |     await expect(dialog).toHaveCount(1);
  178 |   }
  179 | 
  180 |   const healthFormsTab = page.getByRole('button', { name: 'tab-Health Forms', exact: true });
  181 |   await expect(healthFormsTab).toHaveCount(1);
  182 |   await healthFormsTab.click();
  183 |   stages.healthForms = {
  184 |     aria: await dialog.ariaSnapshot(),
  185 |     dom: await scanVisibleDom(page),
  186 |   };
  187 | 
  188 |   const addHealthForms = dialog.getByText('Add Health Form(s)', { exact: true });
  189 |   await expect(addHealthForms).toHaveCount(1);
  190 |   await addHealthForms.click();
  191 |   await page.waitForTimeout(7_000);
  192 | 
  193 |   const healthFormDropdown = dialog.locator('.p-dropdown').filter({
  194 |     hasText: 'Select Health Form',
  195 |   });
  196 |   await expect(healthFormDropdown).toHaveCount(1);
  197 |   const listItemsBeforeOpen = await page.getByRole('listitem').allInnerTexts();
  198 |   console.log('PACO_PROBE_OPENING=Select Health Form');
  199 |   await healthFormDropdown.click({ timeout: 7_000 });
  200 |   await page.waitForTimeout(7_000);
  201 | 
  202 |   const healthFormSearch = page.getByRole('textbox', { name: 'Search...', exact: true });
  203 |   await expect(healthFormSearch).toBeVisible({ timeout: 7_000 });
  204 |   const listItemsAfterOpen = await page.getByRole('listitem').allInnerTexts();
  205 |   const healthFormOptions = listItemsAfterOpen.filter((text) => !listItemsBeforeOpen.includes(text));
  206 |   stages.healthFormPicker = {
  207 |     dropdown: await healthFormDropdown.evaluate((element) => ({
  208 |       ariaControls: element.getAttribute('aria-controls'),
  209 |       ariaExpanded: element.getAttribute('aria-expanded'),
  210 |       class: element.getAttribute('class'),
  211 |       html: element.outerHTML,
  212 |     })),
  213 |     options: healthFormOptions,
  214 |     allVisibleListItems: listItemsAfterOpen,
  215 |     dom: await scanVisibleDom(page),
  216 |   };
  217 |   console.log(`PACO_HEALTH_FORM_PICKER_SCAN=${JSON.stringify(stages.healthFormPicker, null, 2)}`);
  218 | 
  219 |   await healthFormSearch.fill('sleep ap');
  220 |   await page.waitForTimeout(7_000);
  221 |   stages.healthFormSearch = {
  222 |     query: 'sleep ap',
  223 |     listItems: await page.getByRole('listitem').allInnerTexts(),
  224 |     exactTextMatches: await page.getByText('sleep ap', { exact: true }).allInnerTexts(),
  225 |     dom: await scanVisibleDom(page),
  226 |   };
  227 |   console.log(`PACO_HEALTH_FORM_SEARCH=${JSON.stringify(stages.healthFormSearch, null, 2)}`);
  228 |   await expect(dialog).toHaveCount(1);
  229 | 
  230 |   console.log(`PACO_QUICK_SEND_DOM_SCAN=${JSON.stringify(stages, null, 2)}`);
  231 | });
  232 | 
```