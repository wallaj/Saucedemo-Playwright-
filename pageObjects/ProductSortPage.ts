/*
 * ProductSortPage class encapsulates interactions with the product sorting controls
 * on the SauceDemo page.
 * Provides methods to sort products by name or price in ascending or descending order.
 */

import { Locator, Page } from '@playwright/test';

export class ProductSortPage {
  readonly sortContainer: Locator;

  /**
   * Creates a page object for SauceDemo product sorting controls.
   */
  constructor(private readonly page: Page) {
    this.sortContainer = page.locator('[data-test="product-sort-container"]');
  };

  /**
   * Sorts products by name (A to Z).
   */
  async sortByNameAsc(): Promise<void> {
    await this.sortContainer.selectOption('az');
  };

  /**
   * Sorts products by name (Z to A).
   */
  async sortByNameDesc(): Promise<void> {
    await this.sortContainer.selectOption('za');
  };

  /**
   * Sorts products by price (low to high).
   */
  async sortByPriceLowToHigh(): Promise<void> {
    await this.sortContainer.selectOption('lohi');
  };

  /**
   * Sorts products by price (high to low).
   */
  async sortByPriceHighToLow(): Promise<void> {
    await this.sortContainer.selectOption('hilo');
  };
};
