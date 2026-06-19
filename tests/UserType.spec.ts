import { expect, Page, test } from '@playwright/test';
import { loginSauceDemo } from './utils/auth.utils';
import { navigateToConfiguredUrl } from './utils/navigation.utils';

let sharedPage: Page;

test.describe.serial('UserType', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    await navigateToConfiguredUrl(sharedPage);
  });

  test.afterAll(async () => {
    await sharedPage.context().close();
  });

  test('test1 - standard user can login', async () => {
    await loginSauceDemo(sharedPage, 'standard');
    await expect(sharedPage).toHaveURL(/.*inventory\.html/);
    await expect(sharedPage.getByText('Products')).toBeVisible();
  });

  test('test2 - locked user sees error message', async () => {
    await navigateToConfiguredUrl(sharedPage);
    await loginSauceDemo(sharedPage, 'locked');
    await expect(sharedPage.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out.');
  });
});
