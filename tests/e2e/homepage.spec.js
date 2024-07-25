const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Homepage tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('navigate to the homepage', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Esdeveniments');
  });

  test('check if main content is present', async ({ page }) => {
    const mainContent = await page.$('main');
    expect(mainContent).not.toBeNull();
  });

  test('check if navigation menu is present', async ({ page }) => {
    const navMenu = await page.$('nav');
    expect(navMenu).not.toBeNull();
  });

  test('check if event cards are present', async ({ page }) => {
    const eventCards = await page.$$('article');
    expect(eventCards.length).toBeGreaterThan(0);
  });

  test('check if "Publicar" option is present in the menu', async ({ page }) => {
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
      const mainContent = await page.$('main');
      expect(mainContent).not.toBeNull();
      const navMenu = await page.$('nav');
      expect(navMenu).not.toBeNull();
      const eventCards = await page.$$('article');
      expect(eventCards.length).toBeGreaterThan(0);
    }
  });
});
