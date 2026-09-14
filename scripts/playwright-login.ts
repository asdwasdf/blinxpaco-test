import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { getDefaultEnvironment, loadConfig } from './load-config.js';

const LOGIN_TIMEOUT_MS = 5 * 60 * 1000;
export const PACO_CDP_PORT = 9222;

export function persistentContextOptions(port: number) {
  return {
    headless: false,
    channel: 'chrome',
    args: [
      '--remote-debugging-address=127.0.0.1',
      `--remote-debugging-port=${port}`,
    ],
  };
}

export function cdpEndpoint(port: number): string {
  return `http://127.0.0.1:${port}`;
}

export function buildLoginUrl(baseUrl: string): string {
  return new URL('/paco/login', baseUrl).href;
}

export function resolveProfileDirectory(root: string, authDirectory: string): string {
  return path.resolve(root, authDirectory, 'chrome-profile');
}

export async function ensureAuthDirectory(directory: string): Promise<void> {
  await mkdir(directory, { recursive: true });
}

export function isAuthenticationUrl(currentUrl: string): boolean {
  return /\/(?:login|signin|sign-in|auth)(?:[/?#]|$)/i.test(new URL(currentUrl).pathname);
}

export function isDashboardUrl(
  currentUrl: string,
  baseUrl: string,
  dashboardPath: string,
): boolean {
  const current = new URL(currentUrl);
  const expected = new URL(dashboardPath, baseUrl);
  const normalizePath = (value: string) => value.replace(/\/+$/, '') || '/';
  const currentPath = normalizePath(current.pathname);
  const expectedPath = normalizePath(expected.pathname);
  return current.origin === expected.origin
    && (currentPath === expectedPath || currentPath.startsWith(`${expectedPath}/`));
}

export function reachedDashboardAfterWaitError(
  currentUrl: string,
  baseUrl: string,
  dashboardPath: string,
): boolean {
  return isDashboardUrl(currentUrl, baseUrl, dashboardPath);
}

export async function main(): Promise<void> {
  const config = loadConfig();
  const environment = getDefaultEnvironment(config);
  const profileDirectory = resolveProfileDirectory(process.cwd(), config.paths.playwrightAuth);
  await ensureAuthDirectory(profileDirectory);

  const context = await chromium.launchPersistentContext(
    profileDirectory,
    persistentContextOptions(PACO_CDP_PORT),
  );
  const page = context.pages()[0] ?? await context.newPage();

  try {
    console.log('Browser profile test đã mở. Tự nhập credential và hoàn thành SSO/MFA.');
    console.log('Không đóng browser; Playwright test sẽ kết nối vào đúng browser này.');
    await page.goto(buildLoginUrl(environment.baseUrl));
    await page.waitForURL(
      (url) => isDashboardUrl(url.href, environment.baseUrl, environment.dashboardPath),
      { timeout: LOGIN_TIMEOUT_MS },
    );
    console.log(`Authentication đã xác minh. CDP local: ${cdpEndpoint(PACO_CDP_PORT)}`);
    console.log('Giữ browser mở. Chạy Playwright test trong PowerShell khác; tự đóng browser khi xong.');
    await new Promise<void>((resolve) => context.browser()?.on('disconnected', () => resolve()));
  } catch (error) {
    if (reachedDashboardAfterWaitError(page.url(), environment.baseUrl, environment.dashboardPath)) {
      console.log(`Authentication đã xác minh. CDP local: ${cdpEndpoint(PACO_CDP_PORT)}`);
      await new Promise<void>((resolve) => context.browser()?.on('disconnected', () => resolve()));
      return;
    }
    await context.close();
    const current = new URL(page.url());
    throw new Error(
      `Blocked: Manual browser login chưa tới dashboard; current URL: ${current.origin}${current.pathname}`,
      { cause: error },
    );
  }
}

const entryPoint = process.argv[1];
if (entryPoint && import.meta.url === pathToFileURL(path.resolve(entryPoint)).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
