import { test, expect, Page } from '@playwright/test';

const user = 'T308941TestAutom@ds.dev.accenture.com';
const password = '_pC;=lW.b9;J9UJ0iWZL';

// keep a reference to a single page that will be reused
let sharedPage: Page;

// run tests in series so they operate on the same context
test.describe.serial('AIMCaseValueDisplayedInAllRows', () => {
    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      sharedPage = await context.newPage();
    });
 
    test('LoguininFinancialSummary', async () => {
        console.log('Executing test: Loguin In Financial Summary\n');
        await sharedPage.goto('https://login.microsoftonline.com/f3211d0e-125b-42c3-86db-322b19a65a22/oauth2/v2.0/authorize?client_id=e43f29f5-a420-4e62-ab10-4616afcc2440&scope=openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Fcionownext.ciotest.accenture.com%2F&client-request-id=de307030-fe27-4b3c-b213-529bd6eac5ac&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.3.0&client_info=1&code_challenge=2SEoZaHoVeFf0b53Ro-MBnuXnp-vZMWocJJimYt1UmM&code_challenge_method=S256&nonce=e9bc7ea3-4374-477f-b69d-a5bcb242ae69&state=eyJpZCI6ImM3ODM4NDJjLTFlM2QtNDQwMS1iMzY2LTAzNDgxNjM0M2E0MSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D');
        await sharedPage.locator('input[name="loginfmt"]').click(); 
        await sharedPage.locator('input[name="loginfmt"]').fill(user);
        await sharedPage.locator('input[id="idSIButton9"]').click();
        await sharedPage.locator('input[name="passwd"]').click();
        await sharedPage.locator('input[name="passwd"]').fill(password);
        await sharedPage.locator('input[id="idSIButton9"]').click();
        await sharedPage.goto('https://cionownext.ciostage.accenture.com/financial-summary');
        console.log('Login successful, navigated to Financial Summary page\n');
    });    

    //Evalue that all the AIM Case values are displayed in the Project column and that they match the filter values
    test('AllAIMCaseValuesDisplayed', async () => {
        console.log('Executing test: All AIM Case values displayed\n');
        const grid = sharedPage.locator('[data-ref="eGridRoot"][role="grid"]');
        const scrollBar = grid.locator('[class="ag-body-vertical-scroll-viewport"][data-ref="eViewport"]');
        const nextButton = sharedPage.locator('[role="button"][aria-label="Next Page"]');
        const emptyAIMcases: { page: number; rowIndex: string }[] = [];
        let currentPage = 1;

        while (true) {
            const projectCells = grid.locator('[role="gridcell"][col-id="Project"]'); // Adjust the selector to target the "Project" column cells
            await expect(projectCells.first()).toBeVisible({ timeout: 60000 }); // Wait for the first cell to be visible to ensure the grid has loaded

            const pageEmptyCells = await scrollBar.evaluate(async (element) => {// This function runs in the browser context, so we can directly access the DOM elements
                const rowSelector = '[role="row"][row-index]'; // Rows use row-index starting at 0 per page
                const projectCellSelector = '[role="gridcell"][col-id="Project"]';// Adjust the selector to target the "Project" column cells
                const rowsByIndex = new Map();// Map to store row-index and corresponding Project cell text
                const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));// Helper function to wait for a specified time

                element.scrollTop = 0; // Start at the top of the grid viewport for the current page
                await wait(200);

                const captureVisibleRows = () => {// Function to capture the currently visible rows and their Project cell text
                    const rows = Array.from(document.querySelectorAll(rowSelector));// Get all rows currently in the DOM (visible)
                    rows.forEach((row) => {// For each visible row, get its row-index and the text of the Project cell
                        const rowIndex = row.getAttribute('row-index');// Get the row-index attribute which indicates the row's position in the current page
                        if (!rowIndex || !/^\d+$/.test(rowIndex)) {// If row-index is missing or not a valid number, we skip this row as it doesn't conform to the expected structure of data rows
                            return; // skip non-numeric placeholder rows like b1
                        }

                        const gridCells = Array.from(row.querySelectorAll('[role="gridcell"]'));// Get all grid cells in the row to check if there are any real values (not empty and not just "Total" rows)
                        const hasAnyValue = gridCells.some((cell) => {// Check if any cell in the row has a non-empty value that doesn't include "Total"
                            const text = cell.textContent?.trim() ?? '';// Trim the text content of the cell and check if it's not empty and doesn't contain "Total"
                            return text !== '' && !text.toLowerCase().includes('total');// This ensures we only consider rows that have actual data and skip summary or empty rows
                        });
                        if (!hasAnyValue) {// If no cells in the row have any real values, we skip this row as it's likely a placeholder or summary row without meaningful data
                            return; // skip rows with no real values
                        }

                        const cell = row.querySelector(projectCellSelector);// Find the Project cell within the row
                        if (!cell) {// If there is no Project cell, we skip this row as it doesn't meet the criteria for our test
                            return;
                        }

                        const text = cell.textContent?.trim() ?? '';// Get the trimmed text content of the Project cell, or an empty string if it's null or undefined
                        if (text.toLowerCase().includes('total')) {// If the Project cell text contains "Total", we skip this row as it's a summary row that doesn't require an AIM case value
                            return; // skip summary rows
                        }

                        rowsByIndex.set(rowIndex, text);// Store the row-index and the trimmed text content of the Project cell in the map
                    });
                };

                captureVisibleRows();//Capture the initially visible rows before scrolling

                const maxScroll = element.scrollHeight - element.clientHeight;
                const step = Math.max(50, Math.floor(element.clientHeight / 3));
                let currentScroll = 0;
                while (currentScroll < maxScroll) {
                    currentScroll += step;
                    if (currentScroll >= maxScroll) {
                        currentScroll = maxScroll;
                    }

                    element.scrollTop = currentScroll;
                    await wait(200);
                    captureVisibleRows();

                    if (currentScroll === maxScroll) {
                        break;
                    }
                }

                element.scrollTop = maxScroll;// Ensure we are at the bottom to capture any rows that load on scroll
                await wait(200);
                captureVisibleRows();// Capture the rows at the bottom of the grid

                return Array.from(rowsByIndex.entries()) // Convert the map entries to an array of [rowIndex, text]
                    .sort(([a], [b]) => Number(a) - Number(b))// Sort by rowIndex to maintain the order of rows as they appear in the grid
                    .map(([rowIndex, text]) => ({ rowIndex, text }));// Return an array of objects with rowIndex and text properties for the Project cells on the current page
            });

            pageEmptyCells.forEach(({ rowIndex, text }) => {// Check each captured Project cell text for emptiness or if it contains "Total"
                const trimmedText = text?.trim() ?? '';// If the cell text is empty, record the page and row index for reporting
                if (trimmedText === '') {// If the cell is empty, add it to the list of empty AIM cases with the current page and row index
                    emptyAIMcases.push({ page: currentPage, rowIndex });
                    return;
                }
                if (trimmedText === 'Total - All Items' || trimmedText.toLowerCase().includes('total')) {// If the cell contains "Total", we skip it as it's not expected to have an AIM case value, so we just
                    return;
                }
            });

            console.log(`Page ${currentPage}: checked ${pageEmptyCells.length} rows.`);// Log the number of rows checked on the current page for better visibility into the test progress
            currentPage += 1;// Increment the page number for the next iteration

            // Reset the grid viewport scroll back to the top for the next page
            await scrollBar.evaluate((el) => {
                el.scrollTop = 0;
            });

            if (await nextButton.isDisabled()) {// If the Next button is disabled, it means we have reached the last page, so we can exit the loop
                break;
            }

            // Scroll the browser viewport down so the Next button is visible before clicking
            await sharedPage.evaluate(() => {// Scroll the window to the bottom to ensure the Next button is visible and clickable
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });// Use 'auto' behavior to scroll immediately without animation, ensuring the button is in view for the next click
            });
            await sharedPage.waitForTimeout(200);// Wait briefly to allow any lazy loading or rendering to complete after scrolling before clicking the Next button

            await nextButton.click();
        }

        if (emptyAIMcases.length > 0) {
            console.log('Empty AIM cases found:');
            emptyAIMcases.forEach(({ page, rowIndex }) => {// Log each empty AIM case with its page number and row index for easier debugging and reporting
                console.log(`Page ${page}, row-index ${rowIndex}`);
            });
        }
        expect(emptyAIMcases.length).toBe(0);// Assert that there are no empty AIM cases found across all pages, which is the main validation of this test case
        console.log('All AIM cases on all pages are populated.');
    });    
});