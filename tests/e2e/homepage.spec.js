const { test, expect } = require('@playwright/test');

test('navigate to the homepage and click on the first event', async ({ page }) => {
  // Set the default timeout to a higher value
  page.setDefaultTimeout(60000);

  // Navigate to the homepage
  await page.goto(process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001');

  // Click on the first event
  // The selector has been updated to match the actual HTML structure of the page
  // The previous complex selector was not valid, so it has been simplified
  await page.click('div[data-testid="event-card"]:first-of-type a');

  // Add an assertion here if needed, for example, checking if the URL changed
  // expect(page.url()).toBe('the expected URL after clicking the first event');
});
