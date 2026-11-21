import { expect, test } from "@playwright/test";

test("Tab never leaves an open sheet", async ({ page }) => {
  await page.goto("/personal/#/work/audio-transkript");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement) || document.activeElement === d)).toBe(true);
  }
});

test("Tab never leaves the gallery lightbox", async ({ page }) => {
  await page.goto("/personal/");
  await page.locator("#gallery").scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollBy(0, innerHeight * 0.6));
  await page.waitForTimeout(800);
  await page.locator("#gallery [data-dive]").filter({ visible: true }).first().click({ force: true });
  const box = page.getByRole("dialog");
  await expect(box).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    expect(await box.evaluate((d) => d.contains(document.activeElement) || document.activeElement === d)).toBe(true);
  }
});

test("keyboard: Enter on a side card opens that card", async ({ page }) => {
  await page.goto("/personal/");
  const cards = page.locator("#projects [data-rail-card]");
  await cards.first().focus();
  await page.keyboard.press("Tab");
  await expect(cards.nth(1)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog").getByRole("heading", { name: "TREEO Website" })).toBeVisible();
});

test("keyboard: arrow keys move focus with the rail", async ({ page }) => {
  await page.goto("/personal/");
  const cards = page.locator("#projects [data-rail-card]");
  await cards.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(cards.nth(1)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog").getByRole("heading", { name: "TREEO Website" })).toBeVisible();
});

test.describe("after New Year", () => {
  test("the footer year updates without a hydration error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.clock.install({ time: new Date("2027-01-03T10:00:00Z") });
    await page.goto("/personal/");
    await page.clock.runFor(2000);
    await expect(page.locator("#contact")).toContainText("© 2027");
    expect(errors).toEqual([]);
  });
});
