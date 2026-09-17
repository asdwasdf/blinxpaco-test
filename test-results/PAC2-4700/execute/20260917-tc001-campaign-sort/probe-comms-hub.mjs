import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-results/PAC2-4700/execute/20260917-tc001-campaign-sort');
await mkdir(outDir, { recursive: true });

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
if (!context) throw new Error('Blocked: no CDP context');

let page = context.pages().find((p) => /paco-connect/i.test(p.url()));
if (!page) page = context.pages().find((p) => !p.url().startsWith('chrome')) || (await context.newPage());

await page.bringToFront();
await page.setViewportSize({ width: 1280, height: 720 });
await page.keyboard.press('Escape').catch(() => {});

const waitStable = async () => {
  await page.waitForFunction(
    () => {
      const t = document.body?.innerText || '';
      return t.length > 200 && !/\bLoading\b/i.test(t);
    },
    null,
    { timeout: 45_000 },
  );
};

const snap = async (name) =>
  page.evaluate(() => {
    const c = (v) => (v || '').replace(/\s+/g, ' ').trim();
    const text = c(document.body?.innerText || '');
    return {
      url: location.href,
      markers: {
        BookingLinksHealthForms: /Booking Links\s*&\s*Health Forms/i.test(text),
        BookingLinks: /Booking Links/i.test(text),
        HealthForms: /Health Forms/i.test(text),
        Campaign: /Campaign/i.test(text),
        CommsHub: /Comms Hub/i.test(text),
        AZ: /A\s*[–-]\s*Z/i.test(text),
        ByDate: /By date/i.test(text),
      },
      comboboxes: [...document.querySelectorAll('[role="combobox"], select, [aria-haspopup="listbox"]')]
        .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
        .map((el) => ({
          tag: el.tagName,
          role: el.getAttribute('role'),
          ariaLabel: c(el.getAttribute('aria-label') || '').slice(0, 120),
          text: c(el.textContent || '').slice(0, 120),
          expanded: el.getAttribute('aria-expanded'),
        }))
        .slice(0, 20),
      buttons: [...document.querySelectorAll('button, [role="button"], a')]
        .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
        .map((el) => c(el.getAttribute('aria-label') || el.textContent || '').slice(0, 100))
        .filter((t) => t.length > 1)
        .slice(0, 50),
      bodySnippet: text.slice(0, 2000),
    };
  });

// Expand sidebar if needed
const expand = page.getByRole('button', { name: /Expand sidebar/i });
if ((await expand.count()) > 0 && (await expand.first().isVisible().catch(() => false))) {
  await expand.first().click({ timeout: 10_000 });
  await page.waitForTimeout(500);
}

await waitStable();
const before = await snap();
await page.screenshot({ path: path.join(outDir, '20-before-comms.png') });

// Click Comms Hub — prefer nav link/button
const candidates = [
  page.getByRole('link', { name: /^Comms Hub$/i }),
  page.getByRole('button', { name: /^Comms Hub$/i }),
  page.getByText(/^Comms Hub$/i),
];
let clicked = false;
let clickMethod = null;
for (const [i, loc] of candidates.entries()) {
  const n = await loc.count().catch(() => 0);
  if (!n) continue;
  const first = loc.first();
  if (!(await first.isVisible().catch(() => false))) continue;
  await first.click({ timeout: 10_000 });
  clicked = true;
  clickMethod = `candidate-${i}`;
  break;
}

if (!clicked) throw new Error('Blocked: Comms Hub not clickable');

await waitStable();
await page.waitForTimeout(800);
const afterNav = await snap();
await page.screenshot({ path: path.join(outDir, '21-comms-hub.png') });

// Try open campaign selector
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
  if (!(await first.isVisible().catch(() => false))) continue;
  await first.click({ timeout: 10_000 });
  opened = true;
  openMethod = `candidate-${idx}`;
  break;
}

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
await page.screenshot({ path: path.join(outDir, '22-after-open-attempt.png') });

const afterOpen = await page.evaluate(() => {
  const c = (v) => (v || '').replace(/\s+/g, ' ').trim();
  const options = [...document.querySelectorAll('[role="option"], [role="menuitem"]')]
    .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    .map((el) => c(el.textContent || '').slice(0, 120))
    .filter((t) => t.length > 1)
    .slice(0, 60);
  const sortLabels = [...document.querySelectorAll('button, [role="button"], [role="menuitem"], [role="option"], span, div')]
    .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    .map((el) => c(el.textContent || ''))
    .filter((t) => /By date|A–Z|A-Z|Z–A|Z-A|message type|sort/i.test(t))
    .slice(0, 30);
  return {
    listboxOpen: !!document.querySelector('[role="listbox"], [role="menu"], [aria-expanded="true"]'),
    options,
    sortLabels,
    bodySnippet: c(document.body?.innerText || '').slice(0, 2000),
  };
});

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
await page.screenshot({ path: path.join(outDir, '23-after-sort-attempt.png') });

const afterSort = await page.evaluate(() => {
  const c = (v) => (v || '').replace(/\s+/g, ' ').trim();
  const options = [...document.querySelectorAll('[role="option"], [role="menuitem"]')]
    .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    .map((el) => c(el.textContent || '').slice(0, 120))
    .filter((t) => t.length > 1 && !/By date|A–Z|A-Z|Z–A|Z-A|message type|^Sort/i.test(t))
    .slice(0, 20);
  return { optionsTop: options, bodySnippet: c(document.body?.innerText || '').slice(0, 2000) };
});

const top3 = afterSort.optionsTop.slice(0, 3);
const alphabetOk =
  top3.length >= 3 &&
  top3[0].toLowerCase().localeCompare(top3[1].toLowerCase()) <= 0 &&
  top3[1].toLowerCase().localeCompare(top3[2].toLowerCase()) <= 0;

let result = 'Inconclusive';
let reason = '';
if (!opened && !afterOpen.listboxOpen) {
  result = 'Blocked';
  reason = 'Comms Hub mở nhưng không thấy Campaign selector';
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
  reason = `Top3 không alphabet: ${JSON.stringify(top3)}`;
}

await page.keyboard.press('Escape').catch(() => {});

const summary = {
  caseId: 'PAC2-4700-TC-001-comms-hub',
  app: 'PACO Connect',
  url: page.url(),
  mutation: { class: 'Temporary', occurred: sortClicked },
  nav: { clicked, clickMethod },
  opened,
  openMethod,
  sortClicked,
  sortMethod,
  top3,
  result,
  reason,
  before,
  afterNav,
  afterOpen,
  observedAt: new Date().toISOString(),
};

await writeFile(path.join(outDir, '24-comms-hub-probe.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
