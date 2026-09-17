import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const runId = '20260917-gp-scheduler-readonly';
const outDir = path.resolve(`test-results/PAC2-4700/explore/${runId}`);
const target = 'https://pac2-4700-qs-only.dev.blinxpaco-np.com/feature-branch/pac2-4700-qs-only/configuration/';
await mkdir(outDir, { recursive: true });

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('no CDP context');
const pages = context.pages();
const page = pages.find((candidate) => candidate.url().includes('pac2-4700-qs-only.dev.blinxpaco-np.com'));
if (!page) throw new Error('GP feature-branch page missing');

const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text().slice(0, 500));
});
page.on('pageerror', (error) => pageErrors.push(error.message.slice(0, 500)));

await page.bringToFront();
if (page.url() !== target) {
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 45_000 });
}
if (/\/login/i.test(page.url())) throw new Error('Authentication expired');
await page.waitForFunction(() => document.body?.innerText.includes('SCHEDULER CONFIG'), null, { timeout: 30_000 });

const observed = await page.evaluate(() => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const labelFor = (element) => {
    if (element.labels?.length) return clean([...element.labels].map((label) => label.innerText).join(' '));
    return clean(element.getAttribute('aria-label') || element.getAttribute('name') || '');
  };
  const styleOf = (element) => {
    const style = getComputedStyle(element);
    return {
      display: style.display,
      visibility: style.visibility,
      color: style.color,
      backgroundColor: style.backgroundColor,
      border: style.border,
      borderRadius: style.borderRadius,
      fontSize: style.fontSize,
      height: style.height,
      width: style.width,
    };
  };

  const selects = [...document.querySelectorAll('select')].map((select) => {
    const selected = select.options[select.selectedIndex];
    const selectedText = clean(selected?.textContent);
    return {
      label: labelFor(select),
      disabled: select.disabled,
      required: select.required,
      multiple: select.multiple,
      size: select.size,
      optionCount: select.options.length,
      selectedIndex: select.selectedIndex,
      selectedType: /email/i.test(selectedText) ? 'Email' : /sms/i.test(selectedText) ? 'SMS' : selectedText ? 'Other' : 'None',
      selectedIsPlaceholder: Boolean(selected?.disabled) || select.selectedIndex < 0 || /select/i.test(selectedText),
      optionTypeCounts: [...select.options].reduce(
        (counts, option) => {
          const text = clean(option.textContent);
          if (/email/i.test(text)) counts.Email += 1;
          else if (/sms/i.test(text)) counts.SMS += 1;
          else counts.Other += 1;
          return counts;
        },
        { Email: 0, SMS: 0, Other: 0 },
      ),
      style: styleOf(select),
    };
  });

  const roleComboboxes = [...document.querySelectorAll('[role="combobox"]')].map((element) => ({
    label: clean(element.getAttribute('aria-label') || element.textContent).slice(0, 120),
    expanded: element.getAttribute('aria-expanded'),
    disabled: element.getAttribute('aria-disabled'),
    style: styleOf(element),
  }));

  const buttons = [...document.querySelectorAll('button, input[type="button"], input[type="submit"]')].map((button) => ({
    text: clean(button.innerText || button.value || button.getAttribute('aria-label')).slice(0, 120),
    type: button.getAttribute('type') || 'button',
    disabled: Boolean(button.disabled) || button.getAttribute('aria-disabled') === 'true',
    style: styleOf(button),
  }));

  const inputs = [...document.querySelectorAll('input')].map((input) => ({
    type: input.type,
    label: labelFor(input),
    placeholder: input.placeholder,
    disabled: input.disabled,
    required: input.required,
    checked: ['checkbox', 'radio'].includes(input.type) ? input.checked : undefined,
    hasValue: Boolean(input.value),
  }));

  return {
    url: location.href,
    title: document.title,
    headings: [...document.querySelectorAll('h1,h2,h3,[role="heading"]')].map((element) => clean(element.textContent)).filter(Boolean),
    visibleTextMarkers: {
      schedulerConfig: document.body.innerText.includes('SCHEDULER CONFIG'),
      selectCampaignTemplate: document.body.innerText.includes('Select Campaign Template'),
      open: [...document.querySelectorAll('button,a')].some((element) => clean(element.textContent) === 'Open'),
    },
    selects,
    roleComboboxes,
    buttons,
    inputs,
    forms: [...document.forms].map((form) => ({
      method: form.method,
      actionPath: (() => {
        try { return new URL(form.action).pathname; } catch { return ''; }
      })(),
      controlCount: form.elements.length,
    })),
  };
});

const result = {
  runId,
  observedAt: new Date().toISOString(),
  environment: 'dev',
  role: 'Super Admin GB',
  scope: 'GP Scheduler Configuration landing state only',
  mutation: { class: 'None', occurred: false },
  actions: ['navigate to observed feature root', 'inspect rendered DOM and default control state', 'capture local screenshot'],
  actionsNotTaken: ['change campaign-template selection', 'click Open', 'compose', 'send', 'attach', 'submit', 'any unknown-persistence action'],
  observed,
  consoleErrors,
  pageErrors,
};

await page.screenshot({ path: path.join(outDir, 'PAC2-4700-EXPLORE-gp-scheduler-landing.png'), fullPage: false });
await writeFile(path.join(outDir, 'observation.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({
  observedAt: result.observedAt,
  url: observed.url,
  title: observed.title,
  headings: observed.headings,
  markers: observed.visibleTextMarkers,
  selects: observed.selects,
  roleComboboxes: observed.roleComboboxes,
  buttons: observed.buttons,
  inputs: observed.inputs,
  formCount: observed.forms.length,
  consoleErrorCount: consoleErrors.length,
  pageErrorCount: pageErrors.length,
}, null, 2));
