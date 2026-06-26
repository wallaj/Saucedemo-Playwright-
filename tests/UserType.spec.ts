import { expect, Page, test } from '@playwright/test';
import { LoginPage } from '../pageObjects/LoginPage';
import { loginSauceDemo } from '../utils/auth.utils';
import { navigateToConfiguredUrl } from '../utils/navigation.utils';

let sharedPage: Page;
let loginPage: LoginPage;

test.describe.serial('UserType', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    loginPage = new LoginPage(sharedPage);
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
    await loginPage.goto();
    await loginSauceDemo(sharedPage, 'locked');
    await loginPage.expectLockedUserError();
  });
});
