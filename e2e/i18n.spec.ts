import { expect, test } from "@playwright/test";

const SITE = "https://mardiansyah-gunting.github.io/personal";
const pages = [
  { path: "/personal/", lang: "en", canonical: `${SITE}/` },
  { path: "/personal/id/", lang: "id", canonical: `${SITE}/id/` },
  { path: "/personal/zh/", lang: "zh", canonical: `${SITE}/zh/` },
];

for (const p of pages) {
  test(`${p.lang}: lang, canonical and alternates`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page.locator("html")).toHaveAttribute("lang", p.lang);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", p.canonical);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);
  });
}

test("body text is set in Kalam", async ({ page }) => {
  await page.goto("/personal/");
  const r = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      family: getComputedStyle(document.body).fontFamily,
      loaded: [...document.fonts].some((f) => f.family.replace(/["']/g, "") === "Kalam" && f.status === "loaded"),
    };
  });
  expect(r.family).toMatch(/^"?Kalam/);
  expect(r.loaded).toBe(true);
});

test("a saved language choice redirects the English page", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lang", "id"));
  await page.goto("/personal/");
  await expect(page).toHaveURL(/\/personal\/id\/$/);
});

test("choosing EN on the Indonesian page sticks", async ({ page }) => {
  await page.goto("/personal/id/");
  await page.evaluate(() => localStorage.setItem("lang", "id"));
  await page.getByRole("link", { name: "EN", exact: true }).first().click();
  await expect(page).toHaveURL(/\/personal\/$/);
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/\/personal\/$/);
});
