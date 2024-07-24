const { test, expect } = require('@playwright/test');

test('navigate to the homepage and click on the first event', async ({ page }) => {
  // Navigate to the homepage
  await page.goto(process.env.PLAYWRIGHT_TEST_BASE_URL);

  // Click on the first event
  // Updated selector to match the provided HTML structure
  await page.click('div.flex-none.w-96.min-w-[24rem].flex.flex-col.bg-whiteCorp.overflow-hidden.cursor-pointer a');

  // Add an assertion here if needed, for example, checking if the URL changed
  // expect(page.url()).toBe('the expected URL after clicking the first event');
});
