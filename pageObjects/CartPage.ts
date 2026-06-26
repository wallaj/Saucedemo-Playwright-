/*
 * CartPage class encapsulates interactions with the shopping cart page.
 * Provides methods to verify cart badge count, open the cart, and check item visibility.
 */

import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  private readonly page: Page;
  
  // Locators for cart badge and cart link in the header  
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  };

  /**
   * Verifies cart badge count in the inventory/cart header.
   */
  async expectCartBadgeCount(count: string): Promise<void> {
    await expect(this.cartBadge).toHaveText(count);
  };

  /**
   * Opens the cart page via the header cart icon.
   */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  };

  /**
   * Validates user is on cart page and a specific item is visible.
   */
  async expectItemVisibleInCart(itemName: string): Promise<void> {
    await expect(this.page).toHaveURL(/.*cart\.html/);
    await expect(this.page.getByText(itemName)).toBeVisible();
  };

  /**
   * Returns the remove-from-cart button locator for a specific product suffix.
   * Example suffix: sauce-labs-backpack -> data-test="remove-sauce-labs-backpack"
   */
  private removeButton(productSuffix: string): Locator {
    return this.page.locator(`[data-test="remove-${productSuffix}"]`);
  };

  /**
   * Removes a product from the cart using its SauceDemo remove-from-cart test id suffix.
   * Example suffix: sauce-labs-backpack -> data-test="remove-sauce-labs-backpack"
   */
  async removeProductFromCart(productSuffix: string): Promise<void> {
    const removeButton = this.removeButton(productSuffix);
    await removeButton.waitFor({ state: 'visible' });
    await removeButton.click();
  };

  /**
   * Clicks the "Continue Shopping" button to return to the inventory page.
   */
  async backToInventory(): Promise<void> {
    await this.continueShoppingButton.click();
  };

  /**
   * Clicks the "Checkout" button to proceed to the checkout page.
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  };
};
