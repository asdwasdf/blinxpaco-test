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

let page = context.pages().find((p) => /paco-connect/i.test(p.url()));
if (!page) page = context.pages().find((p) => !p.url().startsWith('chrome')) || (await context.newPage());

await page.bringToFront();
await page.setViewportSize({ width: 1280, height: 720 });
if (!/paco-connect.*dashboard/i.test(page.url())) {
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
}
if (/\/login/i.test(page.url())) throw new Error('Blocked: Authentication expired');

await page.waitForFunction(
  () => {
    const t = document.body?.innerText || '';
    return t.length > 200 && !/\bLoading\b/i.test(t);
  },
  null,
  { timeout: 45_000 },
);

const clean = async () =>
  page.evaluate(() => {
    const c = (v) => (v || '').replace(/\s+/g, ' ').trim();
    const buttons = [...document.querySelectorAll('button, [role="button"], a, [role="menuitem"], [role="option"], nav *')]
      .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
      .map((el) => c(el.getAttribute('aria-label') || el.textContent || '').slice(0, 100))
      .filter((t) => t.length > 1)
      .slice(0, 80);
    return {
      url: location.href,
      markers: {
        BookingLinks: /Booking Links/i.test(document.body.innerText),
        HealthForms: /Health Forms/i.test(document.body.innerText),
        Campaign: /Campaign/i.test(document.body.innerText),
        Comms: /Comms/i.test(document.body.innerText),
      },
      buttons,
      bodySnippet: c(document.body.innerText).slice(0, 1800),
    };
  });

const steps = {};
steps.baseline = await clean();
await page.screenshot({ path: path.join(outDir, '10-baseline.png') });

// Expand sidebar
const expand = page.getByRole('button', { name: /Expand sidebar/i });
let sidebarExpanded = false;
if ((await expand.count()) > 0 && (await expand.first().isVisible().catch(() => false))) {
  await expand.first().click({ timeout: 10_000 });
  sidebarExpanded = true;
  await page.waitForTimeout(600);
}
steps.afterExpand = await clean();
steps.afterExpand.sidebarExpanded = sidebarExpanded;
await page.screenshot({ path: path.join(outDir, '11-after-expand-sidebar.png') });

// More options
const more = page.getByRole('button', { name: /More options/i });
let moreOpened = false;
if ((await more.count()) > 0 && (await more.first().isVisible().catch(() => false))) {
  await more.first().click({ timeout: 10_000 });
  moreOpened = true;
  await page.waitForTimeout(600);
}
steps.afterMore = await clean();
steps.afterMore.moreOpened = moreOpened;
await page.screenshot({ path: path.join(outDir, '12-after-more-options.png') });

const menuItems = await page.evaluate(() => {
  const c = (v) => (v || '').replace(/\s+/g, ' ').trim();
  return [...document.querySelectorAll('[role="menuitem"], [role="option"], [role="menu"] *, li')]
    .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    .map((el) => c(el.getAttribute('aria-label') || el.textContent || '').slice(0, 120))
    .filter((t) => t.length > 1)
    .slice(0, 40);
});
steps.menuItems = menuItems;

// Escape any open menu — no mutation
await page.keyboard.press('Escape').catch(() => {});

const summary = {
  caseId: 'PAC2-4700-probe-sidebar',
  app: 'PACO Connect',
  result: 'Observed',
  mutation: { class: 'None', occurred: false },
  foundCampaignHint:
    /Booking Links|Health Forms|Campaign|Comms Hub|Message/i.test(JSON.stringify(steps)),
  steps,
  observedAt: new Date().toISOString(),
};
await writeFile(path.join(outDir, '13-sidebar-probe.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
