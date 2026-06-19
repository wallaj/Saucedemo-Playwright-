/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

const selectedBrowser = (process.env.BROWSER ?? '').trim().toLowerCase();
const testFileForReport = (process.env.TEST_FILE ?? '').trim();
const runMode = (process.env.RUN_MODE ?? '').trim().toLowerCase();


/**
 * Sanitizes a string so it can be safely used as part of a folder name.
 */
function sanitizeForPath(value: string): string {
  return value
    .replace(/^[.\\/]+/, '') // remove leading dots, slashes, and backslashes
    .replace(/[\\/]+/g, '__') // replace remaining slashes and backslashes with double underscores
    .replace(/[^a-zA-Z0-9._-]+/g, '_') // replace any other invalid characters with underscores
    .replace(/_+/g, '_') // replace multiple underscores with a single underscore
    .replace(/^_+|_+$/g, '') // remove leading and trailing underscores
    .toLowerCase();
}

// Determine report paths based on whether we're running a single test file or the entire suite
const individualReportFolder = testFileForReport
  ? `test-results/individual/${sanitizeForPath(testFileForReport)}/${selectedBrowser || 'unknown-browser'}/html-report`
  : 'test-results/html-report';

 // For JUnit, separate file for each test file when running in single mode, 
 // but a single file for the entire suite when running all tests 
const individualJunitFile = testFileForReport
  ? `test-results/individual/${sanitizeForPath(testFileForReport)}/${selectedBrowser || 'unknown-browser'}/junit-results.xml`
  : 'test-results/junit-results.xml';

if (runMode === 'single' && !selectedBrowser) {
  throw new Error('BROWSER is required for single test runs. Use edge, chrome, or firefox.');
}

// If BROWSER is set, validate that it's one of the allowed values
if (selectedBrowser && !['edge', 'chrome', 'firefox'].includes(selectedBrowser)) {
  throw new Error('Invalid BROWSER value. Allowed values: edge, chrome, firefox.');
}



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
    ['junit', { outputFile: individualJunitFile }], //
    ['html', { outputFolder: individualReportFolder }]
  ],
  outputDir: 'test-results',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  timeout: 1500000,
    expect: {
        timeout: 10 * 10000,
  },

  /* Configure projects for major browsers */
  projects: [
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
    {
      name: 'chrome',
      use: {
        channel: 'chrome',
        headless: false,
        launchOptions: { args: ['--incognito'] },
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        headless: false,
        ...devices['Desktop Firefox']
      }
    },

  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
