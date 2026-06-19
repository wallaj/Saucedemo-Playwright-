import { Page } from '@playwright/test';

const DEFAULT_BASE_URL = 'https://www.saucedemo.com/';

/**
 * Resolves the base URL from argument or environment variable.
 */
export function resolveBaseUrl(explicitUrl?: string): string {
  const rawValue = explicitUrl ?? process.env.TEST_BASE_URL ?? DEFAULT_BASE_URL;
  const normalized = rawValue.trim();

  if (!normalized) {
    throw new Error('TEST_BASE_URL cannot be empty.');
  }

  return normalized;
}

/**
 * Navigates to the configured URL.
 */
export async function navigateToConfiguredUrl(page: Page, explicitUrl?: string): Promise<void> {
  await page.goto(resolveBaseUrl(explicitUrl), { waitUntil: 'domcontentloaded' });
}
