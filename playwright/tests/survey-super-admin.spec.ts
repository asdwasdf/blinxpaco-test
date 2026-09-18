import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

const CDP_URL = 'http://127.0.0.1:9222';
const BASE_URL = 'https://blinx.dev.blinxpaco-np.com';
const RUN_ID = `super-admin-${Date.now()}`;
const EVIDENCE_DIR = `test-results/product-survey/${RUN_ID}`;

test.describe('Super Admin Survey', () => {
  let browser;
  let context;
  let page;

  test.beforeAll(async () => {
    try {
      browser = await chromium.connectOverCDP(CDP_URL);
      const contexts = browser.contexts();
      if (contexts.length === 0) {
        throw new Error('No browser context found. Is auth:login running?');
      }
      context = contexts[0];
      const pages = context.pages();
      page = pages.length > 0 ? pages[0] : await context.newPage();
    } catch (error) {
      throw new Error(`Blocked: Login browser not running. Run: npm run auth:login`);
    }
  });

  test.afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('survey Super Admin areas', async () => {
    const startTime = Date.now();
    const MAX_VIEWS = 12;
    const MAX_DURATION_MS = 15 * 60 * 1000;
    let viewCount = 0;
    const observations: string[] = [];

    // Circuit breaker: check for unsafe URLs
    const isUnsafeUrl = (url: string) => {
      return url.includes('/logout') || url.includes('/sign-out') || url.includes('loggedout=true');
    };

    // Helper: capture screenshot with proper naming
    const capture = async (label: string) => {
      if (isUnsafeUrl(page.url())) {
        throw new Error(`Circuit breaker: unsafe URL detected: ${page.url()}`);
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `${EVIDENCE_DIR}/super-admin-${label}-${timestamp}.png`;
      await page.screenshot({ path: filename, fullPage: false });
      observations.push(`[${label}] ${page.url()}`);
      viewCount++;
    };

    // Check current state
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    const currentUrl = page.url();

    if (currentUrl.includes('/login') || currentUrl.includes('loggedout=true')) {
      throw new Error(`Blocked: Authentication expired. Run: npm run auth:login`);
    }

    // Start from current location (user said they're at Super Admin dashboard)
    await capture('00-starting-state');

    // Navigate to sidebar Configuration - Super Admin likely has more config access
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      const configLink = page.locator('a[href*="/configuration"], button:has-text("Configuration")').first();
      if (await configLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await configLink.click();
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await page.waitForTimeout(2000);
        await capture('01-configuration-landing');
      }
    }

    // Check for Super Admin-only tabs in Configuration
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      const tabs = page.locator('[role="tab"], a[href*="/configuration/"]');
      const tabCount = await tabs.count();
      const tabNames: string[] = [];

      for (let i = 0; i < Math.min(tabCount, 8) && viewCount < MAX_VIEWS; i++) {
        const tab = tabs.nth(i);
        const text = await tab.textContent().catch(() => '');
        if (text && !tabNames.includes(text)) {
          tabNames.push(text);
        }
      }

      observations.push(`Configuration tabs visible: ${tabNames.join(', ')}`);
    }

    // Try navigating to User Management (likely Super Admin only)
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      const userMgmt = page.locator('a[href*="/user"], a[href*="/staff"], button:has-text("Users"), button:has-text("Staff")').first();
      if (await userMgmt.isVisible({ timeout: 3000 }).catch(() => false)) {
        await userMgmt.click();
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await page.waitForTimeout(2000);
        await capture('02-user-management');
      }
    }

    // Check sidebar for admin-only sections
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      const sidebar = page.locator('[role="navigation"], aside, .sidebar').first();
      if (await sidebar.isVisible({ timeout: 3000 }).catch(() => false)) {
        const adminLinks = await sidebar.locator('a, button').allTextContents();
        observations.push(`Sidebar items visible: ${adminLinks.filter(Boolean).slice(0, 20).join(', ')}`);
      }
    }

    // Try Organisation settings
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      const orgLink = page.locator('a[href*="/organisation"], button:has-text("Organisation")').first();
      if (await orgLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await orgLink.click();
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await page.waitForTimeout(2000);
        await capture('03-organisation-settings');
      }
    }

    // Try Roles/Permissions (admin-only)
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      const rolesLink = page.locator('a[href*="/role"], a[href*="/permission"], button:has-text("Roles"), button:has-text("Permissions")').first();
      if (await rolesLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await rolesLink.click();
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await page.waitForTimeout(2000);
        await capture('04-roles-permissions');
      }
    }

    // Try Audit Logs (admin-only, GP role couldn't access this)
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      const auditLink = page.locator('a[href*="/audit"], button:has-text("Audit")').first();
      if (await auditLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await auditLink.click();
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await page.waitForTimeout(2000);
        await capture('05-audit-logs');
      }
    }

    // Try System Settings
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      const systemLink = page.locator('a[href*="/system"], button:has-text("System")').first();
      if (await systemLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await systemLink.click();
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await page.waitForTimeout(2000);
        await capture('06-system-settings');
      }
    }

    // Try Integration/API settings
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      const integrationLink = page.locator('a[href*="/integration"], a[href*="/api"], button:has-text("Integration"), button:has-text("API")').first();
      if (await integrationLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await integrationLink.click();
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        await page.waitForTimeout(2000);
        await capture('07-integration-settings');
      }
    }

    // Check one Patient Search action menu for permission differences
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      await page.goto(`${BASE_URL}/paco/patient-search`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(3000);

      const searchField = page.locator('input[placeholder*="Search"], input[name="search"]').first();
      if (await searchField.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchField.fill('Abbott');
        await page.waitForTimeout(1500);

        const firstRowActions = page.locator('[role="grid"] [role="row"]').nth(1).locator('button:has-text("Actions"), [aria-label="Actions"]').first();
        if (await firstRowActions.isVisible({ timeout: 3000 }).catch(() => false)) {
          await firstRowActions.click();
          await page.waitForTimeout(1000);
          await capture('08-patient-actions-menu-super-admin');

          const menuItems = await page.locator('[role="menu"], [role="menuitem"]').allTextContents();
          observations.push(`Patient Actions menu: ${menuItems.filter(Boolean).join(', ')}`);

          // Close menu
          await page.keyboard.press('Escape');
        }
      }
    }

    // Try viewing Audit Trail from a case (GP role couldn't view this)
    if (viewCount < MAX_VIEWS && (Date.now() - startTime) < MAX_DURATION_MS) {
      await page.goto(`${BASE_URL}/paco/unallocated`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(3000);

      const firstCard = page.locator('[class*="case"], [class*="card"]').first();
      if (await firstCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        const cardMenu = firstCard.locator('svg, button').last();
        if (await cardMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
          await cardMenu.click();
          await page.waitForTimeout(1000);

          const viewAudit = page.locator('text="View Audit"').first();
          if (await viewAudit.isVisible({ timeout: 2000 }).catch(() => false)) {
            await viewAudit.click();
            await page.waitForTimeout(2000);
            await capture('09-audit-trail-super-admin');

            const hasPermissionError = await page.locator('text*="don\'t have permission"').isVisible({ timeout: 1000 }).catch(() => false);
            observations.push(`View Audit accessible: ${!hasPermissionError}`);
          }
        }
      }
    }

    const elapsed = Date.now() - startTime;

    console.log(`\n=== Survey Complete ===`);
    console.log(`Views captured: ${viewCount}`);
    console.log(`Elapsed: ${Math.round(elapsed / 1000)}s`);
    console.log(`Observations:\n${observations.join('\n')}`);
    console.log(`Evidence: ${EVIDENCE_DIR}`);
  });
});
