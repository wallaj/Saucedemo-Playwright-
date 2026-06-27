import { expect, Page, test } from '@playwright/test';
import { CartPage } from '../pageObjects/CartPage';
import { InventoryActionsPage } from '../pageObjects/InventoryActionsPage';
import { loginSauceDemo } from '../utils/auth.utils';
import { pauseHalfSecond } from '../utils/wait.utils';
import { ProductSortPage } from '../pageObjects/ProductSortPage';
import { pauseOneSecond } from '../utils/wait.utils';
import { CheckoutPage } from '../pageObjects/CheckoutPage';

let sharedPage: Page;
let cartPage: CartPage;
let inventoryActionsPage: InventoryActionsPage;
let checkoutPage: CheckoutPage;

const cartProducts = [
  { suffix: 'sauce-labs-backpack', name: 'Sauce Labs Backpack' },
  { suffix: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light' },
  { suffix: 'sauce-labs-fleece-jacket', name: 'Sauce Labs Fleece Jacket' }
];

/**
 * Standard User Flow Suite
 * Scope: End-to-end validation of basic happy path for standard_user
 * - Login and redirect to inventory
 * - Product selection (add to cart)
 * - Product sorting by name and price
 * - Cart navigation and product visibility
 * - Remove from cart functionality
 * 
 * Note: Suite runs serially to preserve state across tests
 * 
 * Author: Marcos Urzúa
 */
test.describe.serial('standard user flow', () => {
  test.beforeAll(async ({ browser }) => {
    console.log('[SETUP] Starting browser context and login for standard user');
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    cartPage = new CartPage(sharedPage);
    inventoryActionsPage = new InventoryActionsPage(sharedPage);
    checkoutPage = new CheckoutPage(sharedPage);
    await loginSauceDemo(sharedPage, 'standard');
    console.log('[SETUP] Login completed and page objects initialized');
  });

  test.afterAll(async () => {
    console.log('[TEARDOWN] Closing browser context');
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
    console.log('[TEST1] Verifying redirect to inventory page');
    await expect(sharedPage).toHaveURL(/.*inventory\.html/);
    await expect(sharedPage.getByText('Swag Labs')).toBeVisible();
    await expect(sharedPage.getByText('Products')).toBeVisible();
    console.log('[TEST1] Inventory page visible with Products header');
    await pauseHalfSecond(sharedPage); // Small wait for visual validation
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
    console.log(`[TEST2] Adding ${cartProducts.length} product(s) to cart`);
    for (const product of cartProducts) { // Loop through each product to add to cart
      // Add product to cart using its suffix for the add-to-cart button
      await inventoryActionsPage.addProductToCart(product.suffix);
      console.log(`[TEST2] Added to cart: ${product.name}`);
      await pauseHalfSecond(sharedPage); // Small wait between additions for visual validation
    }
    
    // Verify cart badge appears with count
    await cartPage.expectCartBadgeCount(String(cartProducts.length));
    console.log(`[TEST2] Cart badge updated to ${cartProducts.length}`);
    await pauseHalfSecond(sharedPage); // Small wait for visual validation
  });

  /**
   * Test 3: Product Sorting Functionality
   * Scope: Verify that products can be sorted by name and price in both ascending and descending order.
   * Validations:
   * - Products are sorted correctly by name (A-Z, Z-A)
   * - Products are sorted correctly by price (low to high, high to low)
   * 
   * Out of scope: Filtering, pagination
   */
  test('test3 - Sort products by name and price', async () => {
    const productSortPage = new ProductSortPage(sharedPage);
    console.log('[TEST3] Sorting products by name descending(Z-A)');
    await productSortPage.sortByNameDesc();
    console.log('[TEST3] Products sorted by name descending');
    await pauseHalfSecond(sharedPage);
    console.log('[TEST3] Sorting products by name ascending(A-Z)');
    await productSortPage.sortByNameAsc();
    console.log('[TEST3] Products sorted by name ascending');
    await pauseHalfSecond(sharedPage);
    console.log('[TEST3] Sorting products by price high to low');  
    await productSortPage.sortByPriceHighToLow();
    console.log('[TEST3] Products sorted by price high to low');
    await pauseHalfSecond(sharedPage);
    console.log('[TEST3] Sorting products by price low to high');
    await productSortPage.sortByPriceLowToHigh();
    console.log('[TEST3] Products sorted by price low to high');
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
  }); 

  /**
   * Test 4: Cart Navigation & Product Visibility
   * Scope: Verify cart page navigation and that selected product is displayed in cart.
   * Validations:
   * - Cart link is clickable and navigates to cart.html
   * - Previously added product (Sauce Labs Backpack) is visible in cart
   * 
   * Out of scope: Checkout flow, product quantity changes, cart removal
   */
  test('test4 - can open cart and see selected product', async () => {
    console.log('[TEST4] Opening cart page');
    await cartPage.openCart();
    for (const product of cartProducts) {
      console.log(`[TEST4] Product visible in cart: ${product.name}`);
      await cartPage.expectItemVisibleInCart(product.name);
    };
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
  });

  /**
   * Test 5: Continue Shopping Functionality
   * Scope: Verify that user can return to inventory page from cart using "Continue Shopping" button.
   * Validations:
   * - "Continue Shopping" button is clickable
   * - User is navigated back to inventory page
   * 
   * Out of scope: Checkout flow, product quantity changes, cart removal
   */
  test('test5 - can continue shopping from cart', async () => {
    console.log('[TEST5] Clicking "Continue Shopping" to return to inventory');
    await cartPage.backToInventory();
    await expect(sharedPage).toHaveURL(/.*inventory\.html/);
    console.log('[TEST5] Returned to inventory page');
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
  });

  /**
   * Test 6: Remove from Cart Functionality
   * Scope: Verify that a product can be removed from the shopping cart and cart counter updates.
   * Validations:
   * - Remove button is clickable
   * - Cart badge updates to show "0" items
   * 
   * Out of scope: Checkout flow, product quantity changes
   */
  test('test6 - can remove item from cart', async () => {
    console.log('[TEST6] Removing products from cart');
    console.log(`[TEST6] Number of previously added products: ${cartProducts.length}`);
    // Navigate to cart page (we're back from test5)
    await cartPage.openCart();
    // Remove the first product from the cart
    await cartPage.removeProductFromCart(cartProducts[0].suffix);
    console.log(`[TEST6] Removed from cart: ${cartProducts[0].name}`);
    await pauseHalfSecond(sharedPage);
    await cartPage.expectCartBadgeCount('2');
    console.log('[TEST6] Cart badge updated to 2');
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
  });

  /**
   * Test 7: Proceed to Checkout Functionality
   * Scope: Verify that user can proceed to checkout from cart page.    
   * Validations:
   * - Checkout button is clickable
   * - User is navigated to checkout-step-one.html
   * Out of scope: Checkout form submission, payment processing
   */
  test('test7 - go to checkout', async () => {
    console.log('[TEST7] Proceeding to checkout from cart');
    await cartPage.proceedToCheckout();
    await checkoutPage.expectCheckoutStepOne();
    console.log('[TEST7] Navigated to checkout step one page');
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
  });
  
  /**
   * Test 8: Cancel Button Functionality
   * Scope: Verify that user can cancel checkout and return to cart page.
   * Validations:
   * - Cancel button is clickable
   * - User is navigated back to cart page
   * Out of scope: Checkout form submission, payment processing
   */
  test('test8 - check Cancel button', async () => {
    console.log('[TEST8] Clicking "Cancel" to return to cart');
    await checkoutPage.cancelCheckout();
    await expect(sharedPage).toHaveURL(/.*cart\.html/);
    console.log('[TEST8] Returned to cart page');
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
  });

  /**
   * Test 9: Checkout Form Validation for Empty Fields
   * Scope: Verify that checkout form displays error messages when required fields are empty.     
   *  Validations:    
   * - Continue button is clickable
   * - Error message is displayed for empty fields
   *  Out of scope: Successful form submission, payment processing
   */
  test('test9 - Validation of empty fields behavior', async () => {
    console.log('[TEST9] Testing checkout form validation for empty fields');
    await cartPage.proceedToCheckout();
    await checkoutPage.expectCheckoutStepOne();
    console.log('[TEST9] Checkout step one page loaded'); 
    await checkoutPage.continueToOverview();
    // Expect error message for empty fields
    const errorMessage = sharedPage.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    console.log('[TEST9] Error message displayed for empty fields');
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
    await checkoutPage.errorButton.click(); // Dismiss error message
  });

  /**
   * Test 10: Fill Checkout Form and Continue
   * Scope: Verify that user can fill out checkout form and proceed to overview page. 
   * Validations:
   * - First name, last name, and postal code fields are fillable
   * - Continue button is clickable
   * - User is navigated to checkout-step-two.html
   * Out of scope: Payment processing, order confirmation
   */
  test('test10 - fill checkout form and continue', async () => {
    console.log('[TEST10] Filling checkout form with customer information');
    await checkoutPage.expectCheckoutStepOne();
    await checkoutPage.fillCustomerInformation('Patricio', 'Rey', '12345');
    console.log('[TEST10] Customer information filled');
    await pauseHalfSecond(sharedPage); // Optional pause for visual validation
    await checkoutPage.continueToOverview();
    await checkoutPage.expectCheckoutStepTwo();
    console.log('[TEST10] Navigated to checkout step two page');
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
  });

  /**
   * Test 11: Cancel Checkout from Step Two
   * Scope: Verify that user can cancel checkout from step two and return to inventory page.
   * Validations:
   * - Cancel button is clickable
   * - User is navigated back to inventory page
   * Out of scope: Checkout form submission, payment processing
   *  
   * Note: This test is intentionally placed after test10 to ensure that the checkout step 
   * two page is reached before testing the cancel functionality.
   */

  test('test11 - cancel checkout from step two', async () => {
    console.log('[TEST11] Clicking "Cancel" to return to cart from checkout step two');
    await checkoutPage.cancelCheckout();
    await expect(sharedPage).toHaveURL(/.*inventory\.html/);  
    console.log('[TEST11] Returned to inventory page');
    await pauseHalfSecond(sharedPage); // Optional pause for visual validation
    await cartPage.openCart();
  });

  /**
   * Test 12: Checkout Overview Validation
   * Scope: Verify that checkout overview page displays correct summary information.
   * Validations:
   * - Checkout item total, tax, and total are visible
   * Out of scope: Payment processing, order confirmation
   * Note: This test is intentionally placed after test10 to ensure that the checkout step
   * two page is reached before testing the overview summary visibility.
   */
  test('test12 - Checkout Overview Validation', async () => {
    console.log('[TEST12] Proceeding to checkout overview page');
    await cartPage.proceedToCheckout();
    await checkoutPage.expectCheckoutStepOne();
    await checkoutPage.fillCustomerInformation('Patricio', 'Rey', '12345');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectCheckoutStepTwo();
    console.log('[TEST12] Checkout overview page loaded');
    await checkoutPage.expectSummaryVisible();
    console.log('[TEST12] Checkout summary is visible');
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
  });  

  test('test13 - Finish Checkout and Return Home', async () => {
    console.log('[TEST13] Finishing checkout and returning home');
    await expect(checkoutPage.finishButton).toBeVisible();
    await checkoutPage.finishCheckout();
    await checkoutPage.expectCheckoutComplete();
    await expect(checkoutPage.checkoutCompleteHeader).toBeVisible();
    await expect(checkoutPage.checkoutCompleteText).toBeVisible();
    console.log('[TEST13] Checkout complete page loaded');
    await pauseOneSecond(sharedPage); // Optional pause for visual validation
  }); 

});  