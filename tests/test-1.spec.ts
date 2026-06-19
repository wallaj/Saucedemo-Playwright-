import { test, expect, Page } from '@playwright/test';

const user = 'T308941TestAutom@ds.dev.accenture.com';
const password = '_pC;=lW.b9;J9UJ0iWZL';

// keep a reference to a single page that will be reused
let sharedPage: Page;

// run tests in series so they operate on the same context
test.describe.serial('CIO workflow', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();
  });

  test('loginCIONowNext', async () => {
    
    await sharedPage.goto('https://login.microsoftonline.com/f3211d0e-125b-42c3-86db-322b19a65a22/oauth2/v2.0/authorize?client_id=e43f29f5-a420-4e62-ab10-4616afcc2440&scope=openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Fcionownext.ciotest.accenture.com%2F&client-request-id=c92883df-95d2-4061-8bf9-e2007a958b96&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.3.0&client_info=1&code_challenge=UXxXIfJesFTL4Yx9GpKzMn9araaSR1Y7gOKa9B8SJrg&code_challenge_method=S256&nonce=59356d19-96b8-4196-b958-7f6e32f441e6&state=eyJpZCI6ImQ3ODZlNDBjLWE2MjItNDIyYS1iYWI2LWI2YmY4YTJlMWZjOCIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D');
    await sharedPage.locator('input[name="loginfmt"]').click();
    await sharedPage.locator('input[name="loginfmt"]').fill(user);
    await sharedPage.locator('input[id="idSIButton9"]').click();
    await sharedPage.locator('input[name="passwd"]').click();
    await sharedPage.locator('input[name="passwd"]').fill(password);
    await sharedPage.locator('input[id="idSIButton9"]').click();
    await sharedPage.goto('https://cionownext.ciotest.accenture.com/');
  });

  test('gotoStageTracker', async () => {
    //extend the timeout for this test since it may take longer to load the page and its content
    test.setTimeout(60000); // set timeout to 60 seconds
    // sharedPage is still the same instance, so it already has
    // whatever state was left by the previous test.
    await sharedPage.locator('role=link[name="Planning"]').hover();
    await sharedPage.locator('role=menuitem[name="Stage Tracker"]').click();  
    await expect(sharedPage.getByRole('grid')).toBeVisible();
    //await sharedPage.waitForLoadState('networkidle');
    await sharedPage.mouse.wheel(0, 3000); // scroll down to load more content
    await sharedPage.waitForTimeout(15000);
  });
});
