import { expect, test } from "@playwright/test";

const ORG_HREFS = [
  "https://treeo.id/",
  "https://treeo.one/",
  "https://www.fairventures.org/",
  "https://quick.co.id/",
  "https://www.bps.go.id/",
];

test("identity, status and language switch are in the first viewport", async ({ page }) => {
  await page.goto("/personal/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mardiansyah Gunting");
  await expect(page.getByRole("navigation", { name: "Language" })).toBeInViewport();
  await page.getByRole("button", { name: /Open to work/ }).click();
  await expect(page.locator("#now")).toBeInViewport();
  await expect(page.locator("#now")).toContainText("Technology & Customer Success Manager");
});

test("organisation tiles open the official websites in a new tab", async ({ page }) => {
  await page.goto("/personal/id/");
  const links = page.locator("#organizations a[href^='http']");
  await expect(links).toHaveCount(5);
  for (let i = 0; i < ORG_HREFS.length; i++) {
    await expect(links.nth(i)).toHaveAttribute("href", ORG_HREFS[i]);
    await expect(links.nth(i)).toHaveAttribute("target", "_blank");
    await expect(links.nth(i)).toHaveAttribute("rel", /noopener/);
  }
});

test("products line opens the project sheet", async ({ page }) => {
  await page.goto("/personal/");
  await page.locator("#organizations").getByRole("button", { name: "Tree Monitoring" }).click();
  await expect(page).toHaveURL(/#\/work\/tree-monitoring$/);
  await expect(page.getByRole("dialog")).toBeVisible();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("name, hero sentence and organisation links are readable", async ({ page }) => {
    await page.goto("/personal/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("operations, technology and strategy", { exact: false })).toBeVisible();
    const links = page.locator("#organizations a[href^='http']");
    await expect(links).toHaveCount(5);
    for (let i = 0; i < 5; i++) await expect(links.nth(i)).toBeVisible();
  });
});
