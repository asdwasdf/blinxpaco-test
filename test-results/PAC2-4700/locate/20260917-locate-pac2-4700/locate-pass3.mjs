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
await writeFile(path.join(outDir, '09-inventory-pass3.json'), JSON.stringify(inventory, null, 2));

const pick = (pred) => pages.find(pred);
const os = pick((p) => p.url().includes('/paco/feature-branch/pac2-4700-qs-only/'));
const connect = pick((p) => p.url().includes('/paco-connect/feature-branch/pac2-4700-qs-only/'));
const gp = pick((p) => /pac2-4700-qs-only\.dev\.blinxpaco-np\.com/.test(p.url()));

// Prior budget: 6 views used. Ceiling 12 → 6 remaining this pass.
const PRIOR = 6;
const views = [];
const log = [];
const steps = [];

function add(app, label, url) {
  if (PRIOR + views.length >= 12) return false;
  views.push({ app, label, url });
  log.push(`VIEW ${PRIOR + views.length}: [${app}] ${label} :: ${url}`);
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

async function waitPaint(page, ms = 3500) {
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

async function pageInfo(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector('h1,h2,[role="heading"]');
    const bodyText = (document.body?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 600);
    const links = [...document.querySelectorAll('a,button,[role="menuitem"],[role="link"]')]
      .map((el) => (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim())
      .filter((t) => t && t.length < 80)
      .slice(0, 120);
    return {
      title: document.title,
      h: h1?.textContent?.trim() || '',
      bodyText,
      links: [...new Set(links)],
      path: location.pathname + location.search + location.hash,
    };
  });
}

const result = {
  startedAt: new Date().toISOString(),
  inventory,
  priorViews: PRIOR,
  views: [],
  log: [],
  steps: [],
};

// --- GP ---
if (gp) {
  await gp.bringToFront();
  await waitPaint(gp, 2000);
  const gpAuth = !/\/login/i.test(gp.url());
  result.gp = { url: gp.url(), title: await gp.title().catch(() => ''), auth: gpAuth };
  log.push('GP ' + JSON.stringify(result.gp));
  if (!gpAuth) {
    log.push('GP still login — abort GP probes');
  } else if (add('GP', 'post-login landing', gp.url())) {
    await shot(gp, `${String(PRIOR + views.length).padStart(2, '0')}-gp-landing.png`);
    const info = await pageInfo(gp);
    steps.push({ app: 'GP', landing: info });
    await writeFile(path.join(outDir, '10-gp-landing-info.json'), JSON.stringify(info, null, 2));

    await expandSidebar(gp);
    for (const t of [
      'Patients',
      'Patient Search',
      'Appointment Book',
      'Booking Links',
      'Configuration',
      'Health Forms',
      'Comms Hub',
    ]) {
      if (PRIOR + views.length >= 10) break;
      const before = gp.url();
      const ok = await clickNavText(gp, t);
      steps.push({ app: 'GP', click: t, ok, url: gp.url() });
      if (ok && gp.url() !== before) {
        if (!add('GP', `nav:${t}`, gp.url())) break;
        await shot(gp, `${String(PRIOR + views.length).padStart(2, '0')}-gp-${t.replace(/\s+/g, '-').toLowerCase()}.png`);
        steps.push({ app: 'GP', after: t, info: await pageInfo(gp) });
      }
    }

    // Direct GP routes if still budget (guess common paths on GP host)
    for (const [label, pathPart] of [
      ['patient-search', '/patient-search'],
      ['appointment-book', '/appointment-book'],
      ['booking-links', '/booking-links'],
      ['configuration', '/configuration'],
    ]) {
      if (PRIOR + views.length >= 11) break;
      if (gp.url().includes(pathPart.replace(/^\//, ''))) continue;
      const before = gp.url();
      const target = `https://pac2-4700-qs-only.dev.blinxpaco-np.com${pathPart}`;
      await gp.goto(target, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) =>
        log.push('gp goto ' + label + ' ' + e.message)
      );
      await waitPaint(gp, 4000);
      if (/\/login/i.test(gp.url())) {
        log.push('GP auth wall at direct ' + label);
        break;
      }
      if (gp.url() !== before && add('GP', `direct:${label}`, gp.url())) {
        await shot(gp, `${String(PRIOR + views.length).padStart(2, '0')}-gp-direct-${label}.png`);
        steps.push({ app: 'GP', direct: label, info: await pageInfo(gp) });
      }
    }
  }
} else {
  result.gp = { missing: true };
  log.push('GP page missing from CDP');
}

// --- Connect Booking Links (priority candidate) ---
if (connect && PRIOR + views.length < 12) {
  await connect.bringToFront();
  const blUrl =
    'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/booking-links';
  const before = connect.url();
  await connect.goto(blUrl, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) =>
    log.push('connect booking-links ' + e.message)
  );
  await waitPaint(connect, 4500);
  if (/\/login/i.test(connect.url())) {
    log.push('Connect auth wall at booking-links');
  } else if (add('Connect', 'direct:booking-links', connect.url())) {
    await shot(connect, `${String(PRIOR + views.length).padStart(2, '0')}-connect-booking-links.png`);
    const info = await pageInfo(connect);
    steps.push({ app: 'Connect', direct: 'booking-links', info });
    await writeFile(path.join(outDir, '11-connect-booking-links-info.json'), JSON.stringify(info, null, 2));
  } else if (connect.url() !== before) {
    log.push('Connect booking-links navigated but budget full: ' + connect.url());
  }

  // Also try configuration on connect if budget
  if (PRIOR + views.length < 12) {
    const cfg =
      'https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/configuration';
    const b2 = connect.url();
    await connect.goto(cfg, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) =>
      log.push('connect cfg ' + e.message)
    );
    await waitPaint(connect, 4000);
    if (!/\/login/i.test(connect.url()) && connect.url() !== b2 && add('Connect', 'direct:configuration', connect.url())) {
      await shot(connect, `${String(PRIOR + views.length).padStart(2, '0')}-connect-configuration.png`);
      steps.push({ app: 'Connect', direct: 'configuration', info: await pageInfo(connect) });
    }
  }
}

// --- OS: try open first patient row Actions > Profile if any ---
if (os && PRIOR + views.length < 12) {
  await os.bringToFront();
  await os
    .goto('https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/patient-search', {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    })
    .catch((e) => log.push('os patient-search ' + e.message));
  await waitPaint(os, 4000);
  const psInfo = await pageInfo(os);
  steps.push({ app: 'OS', recheck: 'patient-search', info: psInfo });

  // Search for a common demo surname without mutating
  const search = os.getByPlaceholder(/Search Patients/i).or(os.getByRole('textbox').first());
  if (await search.count()) {
    try {
      await search.first().fill('Test');
      await waitPaint(os, 2500);
      steps.push({ app: 'OS', search: 'Test', info: await pageInfo(os) });
      // Do NOT click Create. Try open first row Actions if present (read-only profile)
      const actions = os.getByRole('button', { name: /Actions/i }).first();
      if (await actions.count()) {
        await actions.click({ timeout: 3000 }).catch(() => {});
        await waitPaint(os, 1000);
        const profile = os.getByText('Profile', { exact: true }).first();
        if (await profile.count()) {
          const before = os.url();
          await profile.click({ timeout: 3000 }).catch(() => {});
          await waitPaint(os, 4000);
          if (os.url() !== before && /patient-profile/i.test(os.url()) && add('OS', 'patient-profile', os.url())) {
            await shot(os, `${String(PRIOR + views.length).padStart(2, '0')}-os-patient-profile.png`);
            // Redact: store path pattern only in summary; full info local
            const info = await pageInfo(os);
            const redacted = {
              ...info,
              bodyText: info.bodyText.slice(0, 200),
              path: info.path.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<guid>'),
            };
            steps.push({ app: 'OS', profile: redacted });
            await writeFile(path.join(outDir, '12-os-patient-profile-info.json'), JSON.stringify(redacted, null, 2));
          }
        }
      }
    } catch (e) {
      log.push('os search/profile ' + e.message);
    }
  }
}

result.views = views;
result.log = log;
result.steps = steps;
result.endedAt = new Date().toISOString();
result.totalViews = PRIOR + views.length;
await writeFile(path.join(outDir, '13-locate-pass3.json'), JSON.stringify(result, null, 2));
console.log(
  JSON.stringify(
    {
      newViews: views.length,
      totalViews: PRIOR + views.length,
      views,
      gp: result.gp,
      logTail: log.slice(-25),
    },
    null,
    2
  )
);
