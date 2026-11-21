import { expect, test } from "@playwright/test";

test("skills accordion has seven rows that expand and collapse", async ({ page }) => {
  await page.goto("/personal/");
  const rows = page.locator("#skills button[aria-expanded]");
  await expect(rows).toHaveCount(7);
  await rows.first().click();
  await expect(rows.first()).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#skills [role=region]").first()).toContainText("Python");
  await rows.first().click();
  await expect(rows.first()).toHaveAttribute("aria-expanded", "false");
});

test("education lists four entries, verbatim per language", async ({ page }) => {
  await page.goto("/personal/");
  const items = page.locator("#education li");
  await expect(items).toHaveCount(4);
  await expect(items.first()).toContainText("Universitas Terbuka");
  await expect(items.first()).toContainText("2024 – Present");
  await expect(items.first()).not.toContainText("3.25");
  await page.goto("/personal/zh/");
  await expect(page.locator("#education li").first()).toContainText("工商管理学士");
});
