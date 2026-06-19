import { expect, Page, test } from '@playwright/test';
import { loginSauceDemo } from '../utils/auth.utils';

let sharedPage: Page;

/**
 * Standard User Flow Suite
 * Scope: End-to-end validation of basic happy path for standard_user
 * - Login and redirect to inventory
 * - Product selection (add to cart)
 * - Cart navigation and product visibility
 * 
 * Note: Suite runs serially to preserve state across tests
 */
test.describe.serial('standard user flow', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    await loginSauceDemo(sharedPage, 'standard');
  });

  test.afterAll(async () => {
    await sharedPage.context().close();
  });

  /**
   * Test 1: Login Authentication & Redirect
   * Scope: Verify that standard_user successfully authenticates and is redirected to inventory page.
   * Validations:
   * - URL contains inventory.html
   * - "Products" header is visible on the page
   * 
   * Out of scope: Negative authentication tests (locked user, invalid credentials)
   */
  test('test1 - login redirects to inventory', async () => {
    await expect(sharedPage).toHaveURL(/.*inventory\.html/);
    await expect(sharedPage.getByText('Products')).toBeVisible();
  });

  /**
   * Test 2: Add to Cart Functionality
   * Scope: Verify that a product can be added to the shopping cart and cart counter updates.
   * Validations:
   * - Sauce Labs Backpack add-to-cart button is clickable
   * - Cart badge updates to show "1" item
   * 
   * Out of scope: Multiple product additions, cart persistence across sessions
   */
  test('test2 - can add item to cart', async () => {
    // Wait for button to be available and clickable
    await sharedPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').waitFor({ state: 'visible' });
    await sharedPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Verify cart badge appears with count
    await expect(sharedPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  /**
   * Test 3: Cart Navigation & Product Visibility
   * Scope: Verify cart page navigation and that selected product is displayed in cart.
   * Validations:
   * - Cart link is clickable and navigates to cart.html
   * - Previously added product (Sauce Labs Backpack) is visible in cart
   * 
   * Out of scope: Checkout flow, product quantity changes, cart removal
   */
  test('test3 - can open cart and see selected product', async () => {
    await sharedPage.locator('[data-test="shopping-cart-link"]').click();
    await expect(sharedPage).toHaveURL(/.*cart\.html/);
    await expect(sharedPage.getByText('Sauce Labs Backpack')).toBeVisible();
  });
});