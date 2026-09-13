import { chromium, test as base, type BrowserContext, type Page } from '@playwright/test';
import { getDefaultEnvironment, loadConfig } from '../../scripts/load-config.js';
import {
  cdpEndpoint,
  isAuthenticationUrl,
  isDashboardUrl,
  PACO_CDP_PORT,
} from '../../scripts/playwright-login.js';

const environment = getDefaultEnvironment(loadConfig());

type AuthFixtures = {
  authenticatedContext: BrowserContext;
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedContext: async ({}, use) => {
    let browser;
    try {
      browser = await chromium.connectOverCDP(cdpEndpoint(PACO_CDP_PORT));
    } catch {
      throw new Error('Blocked: Login browser not running. Run npm run auth:login and keep it open.');
    }

    const contexts = browser.contexts();
    if (contexts.length !== 1) {
      throw new Error(`Blocked: expected one login browser context, found ${contexts.length}`);
    }

    await use(contexts[0]);
  },
  authenticatedPage: async ({ authenticatedContext }, use) => {
    const dashboardPages = authenticatedContext.pages().filter((page) =>
      isDashboardUrl(page.url(), environment.baseUrl, environment.dashboardPath));
    if (dashboardPages.length !== 1) {
      throw new Error(`Blocked: expected one authenticated dashboard tab, found ${dashboardPages.length}`);
    }

    const page = dashboardPages[0];
    if (isAuthenticationUrl(page.url())) {
      throw new Error('Blocked: Authentication expired');
    }
    await use(page);
  },
});

export { expect } from '@playwright/test';
