const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
console.log(`Using base URL: ${BASE_URL}`);

test.use({ headless: true });

test.setTimeout(120000); // 2 minutes

async function logPageState(page) {
  console.log(`Current URL: ${page.url()}`);
  console.log(`Page title: ${await page.title()}`);
  console.log(`Page content: ${await page.content()}`);
}

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
    console.log(`Testing URL: ${BASE_URL}`);
    page.setDefaultTimeout(120000); // 2 minutes

    try {
      console.log(`Navigating to the homepage: ${BASE_URL}`);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

      console.log('Waiting for content to load...');
      console.log('Waiting for h1 element...');
      await page.waitForSelector('h1:has-text("Què fer a Catalunya. Agenda 2024")', { timeout: 60000 });
      console.log('H1 element found');

      console.log('Waiting for "Publicar" option to be visible');
      await page.waitForSelector('nav a[href="/publica"]', { state: 'visible', timeout: 30000 });
      console.log('"Publicar" option is visible');

      console.log('Waiting for events to load...');
      await page.waitForSelector('article[data-testid="event-card"]', { state: 'visible', timeout: 60000 });

      const eventsCount = await page.locator('article[data-testid="event-card"]').count();
      console.log(`${eventsCount} events loaded successfully.`);

      if (eventsCount === 0) {
        throw new Error('No events found on the page.');
      }

      console.log('Attempting to click the first event');
      await page.click('article[data-testid="event-card"]:first-child');
      console.log('Successfully clicked the first event');

      console.log('Waiting for navigation after click...');
      await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
      console.log('Navigation completed');

      const currentUrl = page.url();
      console.log(`Current URL after clicking: ${currentUrl}`);
      expect(currentUrl).not.toBe(BASE_URL, 'URL should change after clicking the first event');

      console.log('Test completed successfully');
    } catch (error) {
      console.error('Test failed:', error);
      await logPageState(page);
      throw error;
    }
  });

test('check if "Publicar" option is present in the menu', async ({ page, context }) => {
  const timeoutValue = 120000; // 2 minutes
  const testUrl = BASE_URL;
  console.log(`Testing URL for "Publicar" option: ${testUrl}`);

  const maxRetries = 3;
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
      await page.waitForSelector('nav a[href="/publica"]', { state: 'visible', timeout: 30000 });

      const publicarOption = await page.locator('nav a[href="/publica"]');
      expect(await publicarOption.isVisible()).toBe(true);

      console.log('Test completed successfully');
      return; // Exit the function if successful
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        console.error('All attempts failed. Dumping page state:');
        await logPageState(page);
        throw error; // Rethrow the error on the last attempt
      }
      // Close the page and create a new one for the next attempt
      await page.close();
      page = await context.newPage();
    }
  }
});

test('check if the page is responsive', async ({ page }) => {
  console.log(`Testing URL for responsiveness: ${BASE_URL}`);

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('Page navigation completed and DOM content loaded');

  await logPageState(page);

  // Check if the body element is present
  const body = await page.$('body');
  expect(body).not.toBeNull();
  console.log('Page body found');

  // Wait for the events container to be available
  await page.waitForSelector('article[data-testid="event-card"]', { state: 'visible', timeout: 30000 });
  const eventsContainer = await page.$('article[data-testid="event-card"]');
  expect(eventsContainer).not.toBeNull();
  console.log('Events container found');

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

    // Check if events container is still visible after resize
    const isEventsContainerVisible = await eventsContainer.isVisible();
    expect(isEventsContainerVisible).toBe(true, `Events container should be visible at ${size.width}x${size.height}`);

    // Check if navigation menu is still present (might be collapsed on smaller screens)
    const isNavMenuPresent = await page.$('nav') !== null;
    expect(isNavMenuPresent).toBe(true, `Navigation menu should be present at ${size.width}x${size.height}`);

    // Check if key elements are visible
    const h1 = await page.$('h1');
    expect(await h1.isVisible()).toBe(true, `H1 should be visible at ${size.width}x${size.height}`);

    const firstEvent = await page.$('article[data-testid="event-card"]:first-child');
    expect(await firstEvent.isVisible()).toBe(true, `First event should be visible at ${size.width}x${size.height}`);
  }

  console.log('Responsiveness test completed successfully');
});

}); // Close the describe block
