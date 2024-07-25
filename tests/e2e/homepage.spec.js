const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Homepage tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('main', { state: 'visible' });
  });

  test('navigate to the homepage', async ({ page }) => {
    await page.waitForLoadState('load');
    const title = await page.title();
    expect(title).toContain('Esdeveniments');
  });

  test('check if main content is present', async ({ page }) => {
    await page.waitForSelector('main', { state: 'visible' });
    const mainContent = await page.$('main');
    expect(mainContent).not.toBeNull();
  });

  test('check if navigation menu is present', async ({ page }) => {
    await page.waitForSelector('nav', { state: 'visible' });
    const navMenu = await page.$('nav');
    expect(navMenu).not.toBeNull();
  });

  test('check if event cards are present', async ({ page }) => {
    await page.waitForSelector('article[data-testid="event-card"]', { state: 'visible' });
    const eventCards = await page.$$('article[data-testid="event-card"]');
    expect(eventCards.length).toBeGreaterThan(0);
  });

  test('check if "Publicar" option is present in the menu', async ({ page }) => {
    await page.waitForSelector('nav', { state: 'visible' });
    const publicarOption = await page.$('nav >> text=Publicar');
    expect(publicarOption).not.toBeNull();
  });

  test('check if the page is responsive', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 812 },
    ];

    for (const size of viewports) {
      await page.setViewportSize(size);
      await page.waitForSelector('main', { state: 'visible' });
      const mainContent = await page.$('main');
      expect(mainContent).not.toBeNull();
      await page.waitForSelector('nav', { state: 'visible' });
      const navMenu = await page.$('nav');
      expect(navMenu).not.toBeNull();
      await page.waitForSelector('article[data-testid="event-card"]', { state: 'visible' });
      const eventCards = await page.$$('article[data-testid="event-card"]');
      expect(eventCards.length).toBeGreaterThan(0);
    }
  });
});
