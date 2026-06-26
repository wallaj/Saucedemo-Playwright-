/*
  * InventoryActionsPage class encapsulates interactions with inventory action buttons.
*/
import { Locator, Page } from '@playwright/test';
import { pauseOneSecond } from '../utils/wait.utils';

export class InventoryActionsPage {
  private readonly page: Page;

  /**
   * Creates a page object focused on inventory action buttons.
   */
  constructor(page: Page) {
    this.page = page;
  };

  /**
   * Returns the add-to-cart button locator for a specific product suffix.
   * Example suffix: sauce-labs-backpack -> data-test="add-to-cart-sauce-labs-backpack"
   */
  private addToCartButton(productSuffix: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productSuffix}"]`);
  };

  /**
   * Adds a product to cart using its SauceDemo add-to-cart test id suffix.
   * Example suffix: sauce-labs-backpack -> data-test="add-to-cart-sauce-labs-backpack"
   */
  async addProductToCart(productSuffix: string): Promise<void> {
    const addButton = this.addToCartButton(productSuffix);
    await addButton.waitFor({ state: 'visible' });
    await pauseOneSecond(this.page); // Optional pause for local observation
    await addButton.click();
  };
};
