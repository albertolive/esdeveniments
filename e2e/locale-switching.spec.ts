import { expect, test } from "@playwright/test";

test.describe("Language switching", () => {
  test("switches between Catalan, Spanish, and English", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const getSwitcher = (label: string) =>
      page
        .locator('button[aria-haspopup="true"]:visible')
        .filter({ hasText: label })
        .first();

    const switcher = getSwitcher("Cat");
    await expect(switcher).toBeVisible();

    await switcher.click();
    await expect(switcher).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Esp", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Esp", exact: true }).click();
    await expect(page).toHaveURL(/\/es\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    const spanishSwitcher = getSwitcher("Esp");
    await expect(spanishSwitcher).toBeVisible();

    await spanishSwitcher.click();
    await expect(spanishSwitcher).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Eng", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Eng", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const englishSwitcher = getSwitcher("Eng");
    await expect(englishSwitcher).toBeVisible();

    await englishSwitcher.click();
    await expect(englishSwitcher).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Cat", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Cat", exact: true }).click();
    // The app may preserve an explicit default-locale segment after a
    // client-side locale transition; the authoritative check is the locale
    // rendered by the document and the resulting localized page.
    await expect(page).toHaveURL(/\/(?:ca)?\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ca");
  });

  test("returns localized RSS titles from non-localized handlers", async ({
    request,
  }) => {
    for (const [locale, title] of [
      ["es", "Rss Esdeveniments.cat - Catalunya"],
      ["en", "RSS Esdeveniments.cat - Catalunya"],
    ] as const) {
      const response = await request.get("/rss.xml", {
        headers: { "x-next-intl-locale": locale },
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("xml");
      expect(await response.text()).toContain(`<title>${title}</title>`);
    }
  });
});
