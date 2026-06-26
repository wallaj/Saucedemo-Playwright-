/*
 * LoginPage class encapsulates interactions with the login page.
 * Provides methods to navigate to the page, perform login, and verify error messages.
 */

import { expect, Locator, Page } from '@playwright/test';
import { navigateToConfiguredUrl } from '../utils/navigation.utils';

export class LoginPage {
  private readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
  };

  async goto(): Promise<void> {
    await navigateToConfiguredUrl(this.page);
  };

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  };

  async expectLockedUserError(): Promise<void> {
    await expect(this.errorMessage).toContainText('Sorry, this user has been locked out.');
  };
};
