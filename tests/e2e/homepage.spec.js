const { test, expect } = require('@playwright/test');

test('navigate to the homepage and click on the first event', async ({ page }) => {
  // Set the default timeout to the value specified by PLAYWRIGHT_TEST_TIMEOUT or default to 120 seconds
  // Ensure the timeoutValue is parsed as an integer
  const timeoutValue = parseInt(process.env.PLAYWRIGHT_TEST_TIMEOUT, 10) || 120000;
  page.setDefaultTimeout(timeoutValue);

  // Navigate to the homepage
  await page.goto(process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001');

  // Click on the first event
  // The selector has been updated to match the actual HTML structure of the page
  // The previous complex selector was not valid, so it has been simplified
  // Ensure the element is visible before clicking
  const firstEventSelector = 'div[data-testid="event-card"]:first-of-type a';
  // Correct the timeout parameter to be a number
  // Use the timeoutValue for the waitForSelector to ensure it uses the environment variable
  await page.waitForSelector(firstEventSelector, { state: 'visible', timeout: timeoutValue });
  await page.click(firstEventSelector);

  // Add an assertion here if needed, for example, checking if the URL changed
  // expect(page.url()).toBe('the expected URL after clicking the first event');
});
