import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
const target =
  'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/dashboard';
await mkdir(outDir, { recursive: true });

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no CDP context');

let page = context.pages().find((p) => !p.url().startsWith('chrome'));
if (!page) page = await context.newPage();

const consoleErrors = [];
const pageErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300));
});
page.on('pageerror', (e) => pageErrors.push(e.message.slice(0, 300)));

await page.bringToFront();
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
if (/\/login/i.test(page.url())) throw new Error('Blocked: Authentication expired');

// Wait Loading gone (Connect needs ~15s)
await page.waitForFunction(
  () => {
    const t = document.body?.innerText || '';
    return t.length > 200 && !/\bLoading\b/i.test(t);
  },
  null,
  { timeout: 45_000 },
);

await page.screenshot({ path: path.join(outDir, '01-dashboard-stable.png') });

const probe = await page.evaluate(() => {
  const clean = (v) => (v || '').replace(/\s+/g, ' ').trim();
  const text = clean(document.body?.innerText || '').slice(0, 2500);
  const markers = {
    Dashboard: /Dashboard/i.test(text),
    BookingLinksHealthForms: /Booking Links\s*&\s*Health Forms/i.test(text),
    BookingLinks: /Booking Links/i.test(text),
    HealthForms: /Health Forms/i.test(text),
    Campaign: /Campaign/i.test(text),
    ExportPDF: /Export PDF/i.test(text),
    Loading: /\bLoading\b/i.test(text),
  };
  const comboboxes = [...document.querySelectorAll('[role="combobox"], select, [aria-haspopup="listbox"]')].map(
    (el) => ({
      tag: el.tagName,
      role: el.getAttribute('role'),
      ariaLabel: clean(el.getAttribute('aria-label') || '').slice(0, 120),
      text: clean(el.textContent || '').slice(0, 120),
      expanded: el.getAttribute('aria-expanded'),
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
    }),
  );
  const buttons = [...document.querySelectorAll('button, [role="button"]')]
    .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    .map((el) => clean(el.getAttribute('aria-label') || el.textContent || '').slice(0, 80))
    .filter(Boolean)
    .slice(0, 40);
  return {
    url: location.href,
    title: document.title,
    authExpired: /\/login/i.test(location.href),
    bodyLength: (document.body?.innerText || '').length,
    markers,
    comboboxes,
    buttons,
  };
});

await writeFile(path.join(outDir, '02-dashboard-probe.json'), JSON.stringify(probe, null, 2));

if (probe.authExpired) throw new Error('Blocked: Authentication expired');

// Find campaign selector control
const selectorCandidates = [
  page.getByRole('combobox', { name: /Booking Links|Health Forms|Campaign/i }),
  page.getByRole('button', { name: /Booking Links|Health Forms|Campaign|Select/i }),
  page.locator('[aria-label*="Booking Links" i], [aria-label*="Campaign" i], [aria-label*="Health Forms" i]'),
  page.getByText(/Booking Links\s*&\s*Health Forms/i),
];

let opened = false;
let openMethod = null;
for (const [idx, loc] of selectorCandidates.entries()) {
  const count = await loc.count().catch(() => 0);
  if (!count) continue;
  const first = loc.first();
  const visible = await first.isVisible().catch(() => false);
  if (!visible) continue;
  await first.click({ timeout: 10_000 });
  opened = true;
  openMethod = `candidate-${idx}`;
  break;
}

// Fallback: click any visible combobox
if (!opened) {
  const boxes = page.locator('[role="combobox"]');
  const n = await boxes.count();
  for (let i = 0; i < n; i++) {
    const el = boxes.nth(i);
    if (!(await el.isVisible().catch(() => false))) continue;
    await el.click({ timeout: 10_000 });
    opened = true;
    openMethod = `combobox-index-${i}`;
    break;
  }
}

await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, '03-after-open-attempt.png') });

const afterOpen = await page.evaluate(() => {
  const clean = (v) => (v || '').replace(/\s+/g, ' ').trim();
  const options = [...document.querySelectorAll('[role="option"], [role="menuitem"], li, .option')]
    .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    .map((el) => clean(el.textContent || '').slice(0, 120))
    .filter((t) => t.length > 1)
    .slice(0, 60);
  const sortLabels = [...document.querySelectorAll('button, [role="button"], [role="menuitem"], [role="option"], span, div')]
    .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    .map((el) => clean(el.textContent || ''))
    .filter((t) => /By date|A–Z|A-Z|Z–A|Z-A|message type|sort/i.test(t))
    .slice(0, 30);
  const listboxOpen = !!document.querySelector('[role="listbox"], [role="menu"], [aria-expanded="true"]');
  return {
    listboxOpen,
    options,
    sortLabels,
    bodySnippet: clean(document.body?.innerText || '').slice(0, 2000),
  };
});

await writeFile(path.join(outDir, '04-after-open.json'), JSON.stringify({ opened, openMethod, afterOpen }, null, 2));

let sortClicked = false;
let sortMethod = null;
if (opened || afterOpen.listboxOpen) {
  const az = page.getByText(/A\s*[–-]\s*Z/i).first();
  if (await az.isVisible().catch(() => false)) {
    await az.click({ timeout: 10_000 });
    sortClicked = true;
    sortMethod = 'getByText-A-Z';
  } else {
    const azOpt = page.getByRole('option', { name: /A\s*[–-]\s*Z/i });
    if ((await azOpt.count()) > 0 && (await azOpt.first().isVisible().catch(() => false))) {
      await azOpt.first().click({ timeout: 10_000 });
      sortClicked = true;
      sortMethod = 'role-option-A-Z';
    }
  }
}

await page.waitForTimeout(1000);
await page.screenshot({ path: path.join(outDir, '05-after-sort-attempt.png') });

const afterSort = await page.evaluate(() => {
  const clean = (v) => (v || '').replace(/\s+/g, ' ').trim();
  const options = [...document.querySelectorAll('[role="option"], [role="menuitem"]')]
    .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    .map((el) => clean(el.textContent || '').slice(0, 120))
    .filter((t) => t.length > 1 && !/By date|A–Z|A-Z|Z–A|Z-A|message type|^Sort/i.test(t))
    .slice(0, 20);
  const activeSort = [...document.querySelectorAll('button, [role="button"], [aria-selected="true"], [aria-checked="true"], span, div')]
    .map((el) => clean(el.textContent || ''))
    .find((t) => /By date|A–Z|A-Z|Z–A|Z-A|message type/i.test(t) && t.length < 60) || null;
  return {
    optionsTop: options,
    activeSortHint: activeSort,
    bodySnippet: clean(document.body?.innerText || '').slice(0, 2000),
  };
});

const expectedTop = [
  '6 July - Test Case 1',
  '6 July - Test Case 3',
  '7-feb-general-camp',
];

const top3 = afterSort.optionsTop.slice(0, 3);
const alphabetOk =
  top3.length >= 3 &&
  top3[0].toLowerCase().localeCompare(top3[1].toLowerCase()) <= 0 &&
  top3[1].toLowerCase().localeCompare(top3[2].toLowerCase()) <= 0;

let result = 'Inconclusive';
let reason = '';
if (!opened && !afterOpen.listboxOpen) {
  result = 'Blocked';
  reason = 'Không mở được Campaign selector trên Connect Dashboard';
} else if (!sortClicked) {
  result = 'Blocked';
  reason = 'Selector mở nhưng không click được sort A–Z';
} else if (afterSort.optionsTop.length === 0) {
  result = 'Inconclusive';
  reason = 'Đã click A–Z nhưng không đọc được option list';
} else if (alphabetOk) {
  result = 'Pass';
  reason = `Top3 alphabet-ordered: ${JSON.stringify(top3)}`;
} else {
  result = 'Fail';
  reason = `Top3 không alphabet: ${JSON.stringify(top3)}; expected-ish ${JSON.stringify(expectedTop)}`;
}

const summary = {
  caseId: 'PAC2-4700-TC-001',
  app: 'PACO Connect',
  url: page.url(),
  mutation: { class: 'Temporary', occurred: sortClicked },
  opened,
  openMethod,
  sortClicked,
  sortMethod,
  top3,
  expectedTopHint: expectedTop,
  result,
  reason,
  consoleErrors: consoleErrors.slice(0, 10),
  pageErrors: pageErrors.slice(0, 10),
  observedAt: new Date().toISOString(),
};

await writeFile(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
