import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const total = Object.values(JSON.parse(readFileSync("content/photos.json", "utf8")) as Record<string, unknown[]>).flat().length;

test("field-notes gallery holds every job photo and opens a lightbox", async ({ page }) => {
  await page.goto("/personal/");
  const items = page.locator("#gallery [data-dive]");
  await expect(items).toHaveCount(total);
  await expect(page.locator("#gallery h2")).toHaveCount(0);
  await page.locator("#gallery").scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollBy(0, innerHeight * 0.6));
  await page.waitForTimeout(800);
  const visible = items.filter({ visible: true });
  await visible.first().click({ force: true });
  const box = page.getByRole("dialog");
  await expect(box).toBeVisible();
  const first = await box.locator("figcaption").innerText();
  await page.keyboard.press("ArrowRight");
  await expect(box.locator("figcaption")).not.toHaveText(first);
  await page.keyboard.press("Escape");
  await expect(box).toBeHidden();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("gallery is still visible", async ({ page }) => {
    await page.goto("/personal/id/");
    await page.locator("#gallery").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const shown = await page.locator("#gallery [data-dive]").evaluateAll((els) => els.filter((el) => Number(getComputedStyle(el).opacity) > 0.5).length);
    expect(shown).toBeGreaterThan(0);
  });
});
