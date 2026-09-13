import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../fixtures/auth-fixtures.js';

interface DomCandidate {
  path: string;
  tag: string;
  text: string;
  role: string | null;
  ariaLabel: string | null;
  title: string | null;
  type: string | null;
  placeholder: string | null;
  class: string | null;
}

async function ariaSnapshots(locator: Locator) {
  const snapshots = [];
  for (let index = 0; index < await locator.count(); index += 1) {
    snapshots.push(await locator.nth(index).ariaSnapshot());
  }
  return snapshots;
}

async function scanVisibleDom(page: Page) {
  const frames = [];

  for (const frame of page.frames()) {
    const candidates = await frame.locator('body').evaluate((body) => {
      const results: DomCandidate[] = [];
      const roots: Array<{ root: Document | ShadowRoot | Element; path: string }> = [
        { root: body, path: 'body' },
      ];

      while (roots.length) {
        const current = roots.shift()!;
        for (const element of current.root.querySelectorAll('*')) {
          const html = element as HTMLElement;
          if (html.shadowRoot) {
            roots.push({
              root: html.shadowRoot,
              path: `${current.path} > ${html.tagName.toLowerCase()}#shadow-root`,
            });
          }

          const style = getComputedStyle(html);
          const visible =
            style.visibility !== 'hidden' &&
            style.display !== 'none' &&
            Boolean(html.offsetWidth || html.offsetHeight || html.getClientRects().length);
          if (!visible) continue;

          const text = (html.innerText || html.textContent || '').trim().replace(/\s+/g, ' ');
          const interactive = html.matches(
            'button, a, input, textarea, select, option, [role], [tabindex], [contenteditable="true"]',
          );
          const leafText = Boolean(text) && ![...html.children].some((child) =>
            (child as HTMLElement).innerText?.trim(),
          );
          if (!interactive && !leafText) continue;

          const id = html.id ? `#${html.id}` : '';
          const testId = html.getAttribute('data-testid');
          results.push({
            path: `${current.path} > ${html.tagName.toLowerCase()}${id}${testId ? `[data-testid="${testId}"]` : ''}`,
            tag: html.tagName.toLowerCase(),
            text: text.slice(0, 500),
            role: html.getAttribute('role'),
            ariaLabel: html.getAttribute('aria-label'),
            title: html.getAttribute('title'),
            type: html.getAttribute('type'),
            placeholder: html.getAttribute('placeholder'),
            class: html.getAttribute('class'),
          });
        }
      }

      return results;
    });

    frames.push({ url: frame.url(), candidates });
  }

  return frames;
}

test('scans Quick Send selectors without selecting content', async ({ authenticatedPage: page }) => {
  test.setTimeout(15 * 60_000);

  const search = page.getByPlaceholder('Search patients by name or NHS number', { exact: true });
  await expect(search).toHaveCount(1);
  await search.fill('katie sparrow');

  const nhs = page.getByText('NHS No: 222 222 9537', { exact: true });
  await expect(nhs).toHaveCount(1);

  const patientRow = nhs.locator('xpath=ancestor::div[contains(@class, "_patient-row_")][1]');
  const patient = patientRow.getByText('Katie Sparrow', { exact: true });
  const action = patientRow.getByRole('button', { name: 'Patient actions menu', exact: true });

  await expect(patientRow).toHaveCount(1);
  await expect(patient).toHaveCount(1);
  await expect(action).toHaveCount(1);

  const stages: Record<string, unknown> = {
    patientResults: await scanVisibleDom(page),
  };

  await action.click();
  stages.patientActionsMenu = await scanVisibleDom(page);

  const quickSend = page.getByRole('menuitem', { name: 'Quick Send', exact: true });
  await expect(quickSend).toHaveCount(1);
  await quickSend.click();
  await page.waitForTimeout(7_000);

  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveCount(1);
  stages.quickSendDialog = {
    aria: await dialog.ariaSnapshot(),
    dom: await scanVisibleDom(page),
  };

  const changeTemplate = dialog.getByText('(click to change)', { exact: true });
  const chooseTemplate = dialog.getByText('Choose template', { exact: true });
  const changeTemplateCount = await changeTemplate.count();
  const chooseTemplateCount = await chooseTemplate.count();
  if (changeTemplateCount > 1 || chooseTemplateCount > 1 || changeTemplateCount + chooseTemplateCount === 0) {
    throw new Error(
      `Blocked: expected one usable template picker control, found ${changeTemplateCount} change and ${chooseTemplateCount} choose controls`,
    );
  }
  await (changeTemplateCount === 1 ? changeTemplate : chooseTemplate).click();
  await page.waitForTimeout(7_000);
  stages.templatePicker = {
    aria: await ariaSnapshots(page.getByRole('dialog')),
    dom: await scanVisibleDom(page),
  };
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(1);

  const bookingLinkTab = page.getByRole('button', { name: 'tab-Booking Link', exact: true });
  await expect(bookingLinkTab).toHaveCount(1);
  await bookingLinkTab.click();
  stages.bookingLink = {
    aria: await dialog.ariaSnapshot(),
    dom: await scanVisibleDom(page),
  };

  const bookingComboboxes = dialog.getByRole('combobox');
  await expect(bookingComboboxes).toHaveCount(6);
  for (const [index, label] of [
    'Face to Face Slot Type(s)',
    'Phone Slot Type(s)',
    'Video Slot Type(s)',
    'Web Chat Slot Type(s)',
    'Select Clinician(s)',
    'Select Location(s)',
  ].entries()) {
    console.log(`PACO_PROBE_OPENING=${label}`);
    const combobox = bookingComboboxes.nth(index);
    const trigger = combobox
      .locator('xpath=ancestor::div[@data-pc-name="multiselect"][1]')
      .locator('[data-pc-section="trigger"]');
    await expect(trigger).toHaveCount(1);
    await trigger.click({ timeout: 7_000 });
    console.log(`PACO_PROBE_OPENED=${label}`);
    const visiblePicker = page.locator(
      '[role="listbox"]:visible, .p-dropdown-panel:visible, .p-multiselect-panel:visible, .p-overlay:visible',
    );
    await expect(visiblePicker.first()).toBeVisible({ timeout: 7_000 });
    stages[`bookingLink:${label}`] = {
      pickerText: await visiblePicker.allInnerTexts(),
      options: await ariaSnapshots(page.getByRole('option')),
    };
    await trigger.click({ timeout: 7_000 });
    await expect(visiblePicker.first()).toBeHidden({ timeout: 7_000 });
    await expect(dialog).toHaveCount(1);
  }

  const healthFormsTab = page.getByRole('button', { name: 'tab-Health Forms', exact: true });
  await expect(healthFormsTab).toHaveCount(1);
  await healthFormsTab.click();
  stages.healthForms = {
    aria: await dialog.ariaSnapshot(),
    dom: await scanVisibleDom(page),
  };

  const addHealthForms = dialog.getByText('Add Health Form(s)', { exact: true });
  await expect(addHealthForms).toHaveCount(1);
  await addHealthForms.click();
  await page.waitForTimeout(7_000);

  const healthFormDropdown = dialog.locator('.p-dropdown').filter({
    hasText: 'Select Health Form',
  });
  await expect(healthFormDropdown).toHaveCount(1);
  const listItemsBeforeOpen = await page.getByRole('listitem').allInnerTexts();
  console.log('PACO_PROBE_OPENING=Select Health Form');
  await healthFormDropdown.click({ timeout: 7_000 });
  await page.waitForTimeout(7_000);

  const healthFormSearch = page.getByRole('textbox', { name: 'Search...', exact: true });
  await expect(healthFormSearch).toBeVisible({ timeout: 7_000 });
  const listItemsAfterOpen = await page.getByRole('listitem').allInnerTexts();
  const healthFormOptions = listItemsAfterOpen.filter((text) => !listItemsBeforeOpen.includes(text));
  stages.healthFormPicker = {
    dropdown: await healthFormDropdown.evaluate((element) => ({
      ariaControls: element.getAttribute('aria-controls'),
      ariaExpanded: element.getAttribute('aria-expanded'),
      class: element.getAttribute('class'),
      html: element.outerHTML,
    })),
    options: healthFormOptions,
    allVisibleListItems: listItemsAfterOpen,
    dom: await scanVisibleDom(page),
  };
  console.log(`PACO_HEALTH_FORM_PICKER_SCAN=${JSON.stringify(stages.healthFormPicker, null, 2)}`);

  await healthFormSearch.fill('sleep ap');
  await page.waitForTimeout(7_000);
  stages.healthFormSearch = {
    query: 'sleep ap',
    listItems: await page.getByRole('listitem').allInnerTexts(),
    exactTextMatches: await page.getByText('sleep ap', { exact: true }).allInnerTexts(),
    dom: await scanVisibleDom(page),
  };
  console.log(`PACO_HEALTH_FORM_SEARCH=${JSON.stringify(stages.healthFormSearch, null, 2)}`);
  await expect(dialog).toHaveCount(1);

  console.log(`PACO_QUICK_SEND_DOM_SCAN=${JSON.stringify(stages, null, 2)}`);
});
