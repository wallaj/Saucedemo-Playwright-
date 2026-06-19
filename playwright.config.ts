/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

const selectedBrowser = (process.env.BROWSER ?? '').trim().toLowerCase();
const testFileForReport = (process.env.TEST_FILE ?? '').trim();

// Extract spec name from TEST_FILE if provided
function getSpecName(): string {
  if (testFileForReport) {
    // Extract filename without extension: tests/standardUser.spec.ts -> standardUser
    return testFileForReport
      .split('/')
      .pop()
      ?.replace('.spec.ts', '')
      ?.replace('.spec.js', '') || 'unknown';
  }
  return 'all-tests';
}

const specName = getSpecName();
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

// Determine report paths based on spec name
const browserNameForReport = selectedBrowser || 'all-browsers';
const reportFolder = `playwright-report/${specName}/${browserNameForReport}`;
const junitFile = `test-results/${specName}-results.xml`;

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
    ['junit', { outputFile: junitFile }],
    ['html', { outputFolder: reportFolder }]
  ],
  outputDir: 'test-results',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  timeout: 10 * 60 * 1000,
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
  ].filter(project => {
    // If BROWSER is set, only include that browser; otherwise include all
    if (!selectedBrowser) return true;
    return project.name === selectedBrowser;
  }),

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
