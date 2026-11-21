import { expect, test } from "@playwright/test";

test("identity, status and language switch are in the first viewport", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/personal/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mardiansyah Gunting");
  await expect(page.locator("#about").getByRole("navigation", { name: "Language" })).toBeInViewport();

  const badge = page.getByRole("button", { name: /^Available/ });
  await expect(badge).toContainText("Open to new collaborations");
  await badge.click();
  await expect(badge).toContainText("Copied to clipboard");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("mardiansyah.gunting@yahoo.com");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator("#now")).toContainText("Technology & Customer Success Manager");
});

test("the separate organisations section is gone", async ({ page }) => {
  await page.goto("/personal/");
  await expect(page.locator("#organizations")).toHaveCount(0);
  await expect(page.locator("#about a[href='https://treeo.id/']")).toHaveAttribute("target", "_blank");
});

test("products line points to GitHub, without project names or AI", async ({ page }) => {
  await page.goto("/personal/");
  const line = page.getByText("Outside my day-to-day role", { exact: false });
  await expect(line).not.toContainText("AI");
  await expect(line).not.toContainText("CAD Converter");
  await expect(line.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/mardiansyah-gunting?tab=repositories");
  await expect(page.locator("#now")).toContainText("data-driven");
  await expect(page.locator("#now")).not.toContainText("TREEO cloud");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("name, hero sentence and products line are readable", async ({ page }) => {
    await page.goto("/personal/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("operations, technology and strategy", { exact: false })).toBeVisible();
    await expect(page.getByText("Outside my day-to-day role", { exact: false })).toBeVisible();
  });
});

test("unknown pages go straight to the home page", async ({ page }) => {
  await page.goto("/personal/does-not-exist/");
  await expect(page).toHaveURL(/\/personal\/$/);
});
