import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const photos: Record<string, unknown[]> = JSON.parse(readFileSync("content/photos.json", "utf8"));
const cards = "#experience [data-rail-card]";

test("nine roles, newest first", async ({ page }) => {
  await page.goto("/personal/");
  await expect(page.locator(cards)).toHaveCount(9);
  await expect(page.locator(cards).first()).toContainText("Technology & Customer Success Manager");
});

test("opening a role shows its photos and links the organisation", async ({ page }) => {
  await page.goto("/personal/");
  await page.locator(cards).first().click();
  await expect(page).toHaveURL(/#\/experience\/customer-success-manager-2026$/);
  const dialog = page.getByRole("dialog");
  const imgs = dialog.locator("figure img");
  await expect(imgs).toHaveCount(photos["customer-success-manager-2026"].length);
  for (const img of await imgs.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  const company = dialog.getByRole("link", { name: /PT Solusi Hutan Digital/ });
  await expect(company).toHaveAttribute("href", "https://treeo.id/");
  await expect(company).toHaveAttribute("target", "_blank");
});

test("freelance role has no organisation link", async ({ page }) => {
  await page.goto("/personal/#/experience/mobile-developer");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Mobile Developer" })).toBeVisible();
  await expect(dialog.locator("a[href^='http']")).toHaveCount(0);
});

test("Indonesian periods are translated", async ({ page }) => {
  await page.goto("/personal/id/");
  await expect(page.locator(cards).first()).toContainText("Sekarang");
});
