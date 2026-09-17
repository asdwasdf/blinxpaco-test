import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CDP = 'http://127.0.0.1:9222';
const runId = '20260917-locate-pac2-4700';
const outDir = path.resolve(`test-results/PAC2-4700/locate/${runId}`);
await mkdir(outDir, { recursive: true });

const browser = await chromium.connectOverCDP(CDP);
const context = browser.contexts()[0];
if (!context) throw new Error('no CDP context');
const pages = context.pages();

const inventory = [];
for (const p of pages) inventory.push({ url: p.url(), title: await p.title().catch(() => '') });
await writeFile(path.join(outDir, '05-inventory-recheck.json'), JSON.stringify(inventory, null, 2));

const pick = (pred) => pages.find(pred);
const os = pick((p) => p.url().includes('/paco/feature-branch/pac2-4700-qs-only/'));
const connect = pick((p) => p.url().includes('/paco-connect/feature-branch/pac2-4700-qs-only/'));
const gp = pick((p) => /pac2-4700-qs-only\.dev\.blinxpaco-np\.com/.test(p.url()));

const views = [];
const log = [];
const steps = [];

function add(app, label, url) {
  if (views.length >= 12) return false;
  views.push({ app, label, url });
  log.push(`VIEW ${views.length}: [${app}] ${label} :: ${url}`);
  return true;
}

async function shot(page, name) {
  try {
    await page.screenshot({ path: path.join(outDir, name), fullPage: false });
    return name;
  } catch (e) {
    return 'fail:' + e.message;
  }
}

async function waitPaint(page, ms = 2500) {
  await page.waitForTimeout(ms);
}

async function expandSidebar(page) {
  const btn = page.getByRole('button', { name: /Expand sidebar/i }).first();
  if (await btn.count()) {
    try {
      await btn.click({ timeout: 3000 });
      await waitPaint(page, 1200);
      return true;
    } catch {}
  }
  const alt = page.locator('[aria-label*="Expand"], [title*="Expand"]').first();
  if (await alt.count()) {
    try {
      await alt.click({ timeout: 3000 });
      await waitPaint(page, 1200);
      return true;
    } catch {}
  }
  return false;
}

async function clickNavText(page, text) {
  const candidates = [
    page.getByRole('link', { name: text, exact: true }),
    page.getByRole('button', { name: text, exact: true }),
    page.getByText(text, { exact: true }),
  ];
  for (const loc of candidates) {
    if ((await loc.count()) === 0) continue;
    try {
      await loc.first().click({ timeout: 4000 });
      await waitPaint(page, 2000);
      return true;
    } catch {
      try {
        await loc.first().click({ timeout: 4000, force: true });
        await waitPaint(page, 2000);
        return true;
      } catch {}
    }
  }
  return false;
}

async function clickIconRailGroup(page, ariaOrTitle) {
  // Collapsed icon rail: try aria-label / title on buttons
  const loc = page.locator(
    `button[aria-label="${ariaOrTitle}"], [aria-label="${ariaOrTitle}"], [title="${ariaOrTitle}"]`
  ).first();
  if ((await loc.count()) === 0) return false;
  try {
    await loc.click({ timeout: 4000 });
    await waitPaint(page, 1500);
    return true;
  } catch {
    return false;
  }
}

async function pageInfo(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector('h1,h2,[role="heading"]');
    const bodyText = (document.body?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 500);
    const links = [...document.querySelectorAll('a,button,[role="menuitem"],[role="link"]')]
      .map((el) => (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim())
      .filter((t) => t && t.length < 80)
      .slice(0, 100);
    return {
      title: document.title,
      h: h1?.textContent?.trim() || '',
      bodyText,
      links: [...new Set(links)],
    };
  });
}

const result = {
  startedAt: new Date().toISOString(),
  inventory,
  views: [],
  log: [],
  steps: [],
};

// GP
if (gp) {
  result.gp = {
    url: gp.url(),
    title: await gp.title().catch(() => ''),
    auth: !/\/login/i.test(gp.url()),
  };
  log.push('GP ' + JSON.stringify(result.gp));
  if (result.gp.auth && add('GP', 'post-login landing', gp.url())) {
    await gp.bringToFront();
    await waitPaint(gp, 2000);
    await shot(gp, `${String(views.length).padStart(2, '0')}-gp-landing.png`);
    steps.push({ app: 'GP', info: await pageInfo(gp) });
  }
} else {
  result.gp = { missing: true };
}

// OS
if (os) {
  await os.bringToFront();
  await os
    .goto('https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    })
    .catch((e) => log.push('os goto dash ' + e.message));
  await waitPaint(os, 3000);
  if (add('OS', 'dashboard (re-entry)', os.url())) {
    await shot(os, `${String(views.length).padStart(2, '0')}-os-dash2.png`);
  }
  const expanded = await expandSidebar(os);
  steps.push({ app: 'OS', expanded });
  const infoDash = await pageInfo(os);
  steps.push({ app: 'OS', dash: infoDash });
  await writeFile(path.join(outDir, '06-os-dash-info.json'), JSON.stringify(infoDash, null, 2));

  // After expand, try text nav
  for (const t of [
    'Patients',
    'Patient Search',
    'Comms Hub',
    'Campaign Manager',
    'Template Manager',
    'Health Forms',
    'Designer V2',
    'Configuration',
    'Appointment Book',
  ]) {
    if (views.length >= 9) break;
    const before = os.url();
    const ok = await clickNavText(os, t);
    steps.push({ app: 'OS', click: t, ok, url: os.url() });
    if (ok && os.url() !== before) {
      if (!add('OS', `nav:${t}`, os.url())) break;
      await shot(os, `${String(views.length).padStart(2, '0')}-os-${t.replace(/\s+/g, '-').toLowerCase()}.png`);
      steps.push({ app: 'OS', after: t, info: await pageInfo(os) });
      if (/\/login/i.test(os.url()) || /loggedout=true/i.test(os.url())) {
        log.push('OS auth wall at ' + t);
        await os
          .goto('https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard', {
            waitUntil: 'domcontentloaded',
            timeout: 45000,
          })
          .catch(() => {});
        await waitPaint(os, 1500);
        await expandSidebar(os);
      }
    }
  }

  // Icon rail groups if still collapsed-ish
  for (const group of ['Patients', 'Comms Hub', 'Health Forms', 'Configuration', 'Appointment Book']) {
    if (views.length >= 10) break;
    const before = os.url();
    const ok = await clickIconRailGroup(os, group);
    steps.push({ app: 'OS', icon: group, ok, url: os.url() });
    if (ok) {
      // try child after flyout
      for (const child of ['Patient Search', 'Campaign Manager', 'Template Manager', 'Designer V2']) {
        const childOk = await clickNavText(os, child);
        if (childOk && os.url() !== before) {
          if (!add('OS', `flyout:${group}>${child}`, os.url())) break;
          await shot(
            os,
            `${String(views.length).padStart(2, '0')}-os-flyout-${child.replace(/\s+/g, '-').toLowerCase()}.png`
          );
          steps.push({ app: 'OS', flyout: `${group}>${child}`, info: await pageInfo(os) });
          break;
        }
      }
    }
  }

  // Direct known routes
  for (const [label, url] of [
    [
      'patient-search',
      'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/patient-search',
    ],
    [
      'health-forms',
      'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/health-forms',
    ],
    [
      'configuration',
      'https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/configuration/',
    ],
  ]) {
    if (views.length >= 11) break;
    if (os.url().includes(label)) continue;
    const before = os.url();
    await os.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) =>
      log.push('goto ' + label + ' ' + e.message)
    );
    await waitPaint(os, 4000);
    if (os.url() !== before && add('OS', `direct:${label}`, os.url())) {
      await shot(os, `${String(views.length).padStart(2, '0')}-os-direct-${label}.png`);
      steps.push({ app: 'OS', direct: label, info: await pageInfo(os) });
    }
  }
}

// Connect
if (connect && views.length < 12) {
  await connect.bringToFront();
  await connect
    .goto('https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    })
    .catch((e) => log.push('connect goto ' + e.message));
  await waitPaint(connect, 3000);
  if (add('Connect', 'dashboard (re-entry)', connect.url())) {
    await shot(connect, `${String(views.length).padStart(2, '0')}-connect-dash2.png`);
  }
  const cExp = await expandSidebar(connect);
  steps.push({ app: 'Connect', expanded: cExp });
  const cInfo = await pageInfo(connect);
  steps.push({ app: 'Connect', dash: cInfo });
  await writeFile(path.join(outDir, '07-connect-dash-info.json'), JSON.stringify(cInfo, null, 2));

  for (const t of ['Appointment Book', 'Configuration', 'Patients', 'Booking Links', 'Quick Pay']) {
    if (views.length >= 12) break;
    const before = connect.url();
    const ok = await clickNavText(connect, t);
    steps.push({ app: 'Connect', click: t, ok, url: connect.url() });
    if (ok && connect.url() !== before) {
      if (!add('Connect', `nav:${t}`, connect.url())) break;
      await shot(
        connect,
        `${String(views.length).padStart(2, '0')}-connect-${t.replace(/\s+/g, '-').toLowerCase()}.png`
      );
      steps.push({ app: 'Connect', after: t, info: await pageInfo(connect) });
    }
  }

  if (views.length < 12 && !/appointment-book/i.test(connect.url())) {
    const before = connect.url();
    await connect
      .goto(
        'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/appointment-book',
        { waitUntil: 'domcontentloaded', timeout: 45000 }
      )
      .catch((e) => log.push('connect appt ' + e.message));
    await waitPaint(connect, 3500);
    if (connect.url() !== before && add('Connect', 'direct:appointment-book', connect.url())) {
      await shot(connect, `${String(views.length).padStart(2, '0')}-connect-appointment-book.png`);
      steps.push({ app: 'Connect', direct: 'appointment-book', info: await pageInfo(connect) });
    }
  }
}

result.views = views;
result.log = log;
result.steps = steps;
result.endedAt = new Date().toISOString();
await writeFile(path.join(outDir, '08-locate-pass2.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({ viewCount: views.length, views, gp: result.gp, logTail: log.slice(-20) }, null, 2));
