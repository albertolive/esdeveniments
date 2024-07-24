const { test, expect } = require('@playwright/test');

test('navigate to the homepage and click on the first event', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000');

  // Click on the first event
  await page.click('article:first-of-type a');
  
  // Add an assertion here if needed, for example, checking if the URL changed
  // expect(page.url()).toBe('the expected URL after clicking the first event');
});
