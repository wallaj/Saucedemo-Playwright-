import { expect, Locator, Page } from '@playwright/test';
import {pauseHalfSecond, pauseOneSecond} from '../utils/wait.utils';

export class CheckoutPage {
  private readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly backHomeButton: Locator;
  readonly errorButton: Locator;
  readonly checkoutItemTotal: Locator;
  readonly checkoutTax: Locator;
  readonly checkoutTotal: Locator;
  readonly checkoutCompleteHeader: Locator;
  readonly checkoutCompleteText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.errorButton = page.locator('[data-test="error-button"]');
    this.checkoutItemTotal = page.locator('[data-test="subtotal-label"]');
    this.checkoutTax = page.locator('[data-test="tax-label"]');
    this.checkoutTotal = page.locator('[data-test="total-label"]');
    this.checkoutCompleteHeader = page.getByText('Thank you for your order!');
    this.checkoutCompleteText = page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  }

  async expectCheckoutStepOne(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
  }

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await pauseHalfSecond(this.page); // Optional pause for local observation
    await this.lastNameInput.fill(lastName);
    await pauseHalfSecond(this.page); // Optional pause for local observation
    await this.postalCodeInput.fill(postalCode);
    await pauseHalfSecond(this.page); // Optional pause for local observation
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectCheckoutStepTwo(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
  }

  async expectSummaryVisible(): Promise<void> {
    await expect(this.checkoutItemTotal).toBeVisible();
    await expect(this.checkoutTax).toBeVisible();
    await expect(this.checkoutTotal).toBeVisible();
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async expectCheckoutComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(this.checkoutCompleteHeader).toBeVisible();
    await expect(this.checkoutCompleteText).toBeVisible();
  }

  async returnToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
