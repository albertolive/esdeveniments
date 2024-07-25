const { test, expect } = require('@playwright/test');

console.log(`PLAYWRIGHT_TEST_BASE_URL: ${process.env.PLAYWRIGHT_TEST_BASE_URL}`);

test.use({ headless: true });

test.setTimeout(300000); // 5 minutes

async function waitForContentWithLogging(page, selector, timeout) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      if (page.isClosed()) {
        console.log('Page was closed unexpectedly');
        return false;
      }
      await page.waitForSelector(selector, { timeout: 30000 });
      return true;
    } catch (e) {
      console.log(`Waiting for ${selector}... (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`);
      console.log(`Current page title: ${await page.title()}`);
      console.log(`Current URL: ${page.url()}`);
    }
  }
  return false;
}

async function waitForEventsToLoad(page, timeout = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const eventCount = await page.locator('div[href^="/e/"]').count();
      if (eventCount > 0) {
        console.log(`${eventCount} events loaded successfully.`);
        return true;
      }
    } catch (e) {
      console.log(`Waiting for events to load... (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`);
    }
    await page.waitForTimeout(1000);
  }
  console.log('Timeout: Events did not load within the specified time.');
  return false;
}

test.describe('Homepage tests', () => {
  test.beforeEach(async ({ page }) => {
    const testUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
    console.log(`Testing URL: ${testUrl}`);
    await page.goto(testUrl);
    console.log('Page navigation completed');
    await page.waitForLoadState('domcontentloaded', { timeout: 120000 });
    console.log('DOM content loaded');
    console.log(`Current URL after navigation: ${page.url()}`);
  });

  test('navigate to the homepage and click on the first event', async ({ page }) => {
    const testUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
    console.log(`Testing URL: ${testUrl}`);
    page.setDefaultTimeout(120000); // 2 minutes

    try {
      console.log(`Navigating to the homepage: ${testUrl}`);
      await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

      console.log('Waiting for content to load...');
      await page.waitForSelector('h1:has-text("Què fer a Catalunya. Agenda 2024")', { timeout: 60000 });
      console.log('Content loaded successfully');

      console.log('Waiting for "Publicar" option to be visible');
      await page.waitForSelector('nav a[href="/publica"]', { state: 'visible', timeout: 60000 });
      console.log('"Publicar" option is visible');

      console.log('Waiting for events to load...');
      await page.waitForSelector('div[href^="/e/"]', { state: 'visible', timeout: 90000 });

      const eventsCount = await page.locator('div[href^="/e/"]').count();
      console.log(`${eventsCount} events loaded successfully.`);

      if (eventsCount === 0) {
        throw new Error('No events found on the page.');
      }

      console.log('Attempting to click the first event');
      await page.click('div[href^="/e/"]:first-child');
      console.log('Successfully clicked the first event');

      console.log('Waiting for navigation after click...');
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
      console.log('Navigation completed');

      const currentUrl = page.url();
      console.log(`Current URL after clicking: ${currentUrl}`);
      expect(currentUrl).not.toBe(testUrl, 'URL should change after clicking the first event');

      console.log('Test completed successfully');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

test('check if "Publicar" option is present in the menu', async ({ page, context }) => {
  const timeoutValue = 900000; // 15 minutes
  const testUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
  console.log(`Testing URL for "Publicar" option: ${testUrl}`);

  const maxRetries = 5;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} of ${maxRetries}`);
      await page.goto(testUrl, { timeout: timeoutValue, waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: timeoutValue });

      console.log('Checking for JavaScript errors');
      const jsErrors = await page.evaluate(() => {
        return window.jsErrors || [];
      });
      console.log('JavaScript errors:', jsErrors);

      console.log('Waiting for "Publicar" option to be visible');
      await page.waitForSelector('a[href="/publica"]', { state: 'visible', timeout: 60000 });

      const publicarOption = await page.locator('nav a[href="/publica"]');
      expect(await publicarOption.isVisible()).toBe(true);

      console.log('Test completed successfully');
      return; // Exit the function if successful
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        console.error('All attempts failed. Dumping page content:');
        if (!page.isClosed()) {
          console.log(await page.content());
        } else {
          console.error('Unable to get page content: page was closed');
        }
        throw error; // Rethrow the error on the last attempt
      }
      // Close the page and create a new one for the next attempt
      await page.close();
      page = await context.newPage();
    }
  }
});

test('check if the page is responsive', async ({ page }) => {
  const testUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
  console.log(`Testing URL for responsiveness: ${testUrl}`);

  await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
  console.log('Page navigation completed and DOM content loaded');

  // Check if the body element is present
  const body = await page.$('body');
  expect(body).not.toBeNull();
  console.log('Page body found');

  // Check if the main content container is present
  const mainContent = await page.$('main');
  expect(mainContent).not.toBeNull();
  console.log('Main content container found');

  // Check if the navigation menu is present
  const navMenu = await page.$('nav');
  expect(navMenu).not.toBeNull();
  console.log('Navigation menu found');

  // Check page title
  const pageTitle = await page.title();
  console.log(`Page title: ${pageTitle}`);
  expect(pageTitle).not.toBe('');

  // Test responsiveness by resizing viewport
  const sizes = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 768, height: 1024 },
    { width: 375, height: 667 }
  ];

  for (const size of sizes) {
    await page.setViewportSize(size);
    console.log(`Testing responsiveness at ${size.width}x${size.height}`);

    // Check if main content is still visible after resize
    const isMainContentVisible = await mainContent.isVisible();
    expect(isMainContentVisible).toBe(true, `Main content should be visible at ${size.width}x${size.height}`);

    // Check if navigation menu is still present (might be collapsed on smaller screens)
    const isNavMenuPresent = await page.$('nav') !== null;
    expect(isNavMenuPresent).toBe(true, `Navigation menu should be present at ${size.width}x${size.height}`);

    // Check if key elements are visible
    const h1 = await page.$('h1');
    expect(await h1.isVisible()).toBe(true, `H1 should be visible at ${size.width}x${size.height}`);

    const firstEvent = await page.$('div[href^="/e/"]:first-child');
    expect(await firstEvent.isVisible()).toBe(true, `First event should be visible at ${size.width}x${size.height}`);
  }

  console.log('Responsiveness test completed successfully');
});

}); // Close the describe block
