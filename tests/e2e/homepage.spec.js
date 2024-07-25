const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Homepage tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('main', { state: 'visible' });
  });

  test('navigate to the homepage', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Esdeveniments');
  });

  test('check if main content is present', async ({ page }) => {
    await page.waitForSelector('main', { state: 'visible' });
    const mainContent = await page.$('main');
    if (!mainContent) {
      console.log('Main content not found. Page content:');
      console.log(await page.content());
    }
    expect(mainContent).not.toBeNull();
  });

  test('check if navigation menu is present', async ({ page }) => {
    await page.waitForSelector('nav', { state: 'visible' });
    const navMenu = await page.$('nav');
    expect(navMenu).not.toBeNull();
  });

  test('check if event cards are present', async ({ page }) => {
    await page.waitForSelector('article', { state: 'visible' });
    const eventCards = await page.$$('article');
    if (eventCards.length === 0) {
      console.log('No event cards found. Page content:');
      console.log(await page.content());
    }
    expect(eventCards.length).toBeGreaterThan(0);
  });

  test('check if "Publicar" option is present in the menu', async ({ page }) => {
    await page.waitForSelector('nav a[href="/publica"]', { state: 'visible' });
    const publicarOption = await page.$('nav a[href="/publica"]');
    expect(publicarOption).not.toBeNull();
  });

  test('check if the page is responsive', async ({ page }) => {
    const sizes = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForSelector('main', { state: 'visible' });
      const mainContent = await page.$('main');
      if (!mainContent) {
        console.log(`Main content not found at viewport size ${size.width}x${size.height}. Page content:`);
        console.log(await page.content());
      }
      expect(mainContent).not.toBeNull();
      await page.waitForSelector('nav', { state: 'visible' });
      const navMenu = await page.$('nav');
      expect(navMenu).not.toBeNull();
      await page.waitForSelector('article', { state: 'visible' });
      const eventCards = await page.$$('article');
      expect(eventCards.length).toBeGreaterThan(0);
    }
  });
});
