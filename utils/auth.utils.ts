import { Page } from '@playwright/test';
import { navigateToConfiguredUrl } from './navigation.utils';

export type UserType = 'standard' | 'locked' | 'problem' | 'performance';

type Credentials = {
  username: string;
  password: string;
};

const USER_CREDENTIALS: Record<UserType, Credentials> = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performance: { username: 'performance_glitch_user', password: 'secret_sauce' }
};

/**
 * Executes Saucedemo login for the requested user type.
 */
export async function loginSauceDemo(page: Page, userType: UserType): Promise<void> {
  const credentials = USER_CREDENTIALS[userType];

  if (!credentials) {
    throw new Error(`Unsupported user type: ${userType}`);
  }

  await navigateToConfiguredUrl(page);
  await page.getByPlaceholder('Username').fill(credentials.username);
  await page.getByPlaceholder('Password').fill(credentials.password);
  await page.getByRole('button', { name: 'Login' }).click();
}
