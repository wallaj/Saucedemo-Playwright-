/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';



/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests', //Dir of test files
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    ['html', { outputFolder: 'test-results/html-report' }]
  ],
  outputDir: 'test-results',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  timeout: 1500000,
    expect: {
        timeout: 10 * 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    /*{
      name: 'chromium',
      use: {...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',      
      use: {...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: {...devices['Desktop Safari'] },
    },   IN THIS CASE WE ONLY USE FOR EDGE BROWSER*/ 
    {
      name: 'edge',
      use: {
             channel: 'msedge',
             headless: false,
             launchOptions: { args: ['--inprivate']}, //private window
             ...devices['Desktop Edge'], // use Edge desktop configuration
             // set user agent to match Edge browser
             userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0 OS/10.0.22631',
             permissions: ['local-network-access'] // grant local network access permission
      }, 
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
