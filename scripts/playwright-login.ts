import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { getDefaultEnvironment, loadConfig } from './load-config.js';

const LOGIN_TIMEOUT_MS = 5 * 60 * 1000;

export function browserLaunchOptions(): { headless: false; channel: 'chrome' } {
  return { headless: false, channel: 'chrome' };
}

export function buildLoginUrl(baseUrl: string): string {
  return new URL('/paco/login', baseUrl).href;
}

export function resolveAuthFile(root: string, authDirectory: string): string {
  return path.resolve(root, authDirectory, 'user.json');
}

export async function ensureAuthDirectory(directory: string): Promise<void> {
  await mkdir(directory, { recursive: true });
}

export function isDashboardUrl(
  currentUrl: string,
  baseUrl: string,
  dashboardPath: string,
): boolean {
  const current = new URL(currentUrl);
  const expected = new URL(dashboardPath, baseUrl);
  return current.origin === expected.origin && current.pathname === expected.pathname;
}

export async function main(): Promise<void> {
  const config = loadConfig();
  const environment = getDefaultEnvironment(config);
  const authFile = resolveAuthFile(process.cwd(), config.paths.playwrightAuth);
  await ensureAuthDirectory(path.dirname(authFile));

  const browser = await chromium.launch(browserLaunchOptions());
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Browser đã mở. Tự nhập credential và hoàn thành SSO/MFA.');
    console.log('Không đóng browser trước khi dashboard tải xong.');
    await page.goto(buildLoginUrl(environment.baseUrl));
    await page.waitForURL(
      (url) => isDashboardUrl(url.href, environment.baseUrl, environment.dashboardPath),
      { timeout: LOGIN_TIMEOUT_MS },
    );
    await context.storageState({ path: authFile });
    console.log(`Authentication state đã lưu local tại ${authFile}`);
  } catch (error) {
    throw new Error(
      `Blocked: Manual browser login chưa hoàn tất trong ${LOGIN_TIMEOUT_MS / 60000} phút`,
      { cause: error },
    );
  } finally {
    await browser.close();
  }
}

const entryPoint = process.argv[1];
if (entryPoint && import.meta.url === pathToFileURL(path.resolve(entryPoint)).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
