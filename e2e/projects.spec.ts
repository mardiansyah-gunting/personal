import { expect, test } from "@playwright/test";

const cards = "#projects [data-rail-card]";

test("rail lists four projects plus a link to all of them", async ({ page }) => {
  await page.goto("/personal/");
  await expect(page.locator(cards)).toHaveCount(5);
  await expect(page.locator(cards).last()).toHaveAttribute("aria-label", /GitHub/);
});

test("opening a card shows its sheet and deep link; Escape closes it", async ({ page }) => {
  await page.goto("/personal/");
  await page.locator(cards).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Workflow Automation" })).toBeVisible();
  await expect(page).toHaveURL(/#\/work\/workflow-automation$/);
  await expect(dialog).toContainText("ETL");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(/#\/work/);
});

test("keyboard: Enter opens, Escape closes and returns focus to the card", async ({ page }) => {
  await page.goto("/personal/");
  const first = page.locator(cards).first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(first).toBeFocused();
});

test("deep link opens the sheet in Chinese with a GitHub call to action", async ({ page }) => {
  await page.goto("/personal/zh/#/work/audio-transkript");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Audio Transkript" })).toBeVisible();
  const cta = dialog.getByRole("link", { name: /在 GitHub 查看/ });
  await expect(cta).toHaveAttribute("href", "https://github.com/mardiansyah-gunting/audio_transkript");
  await expect(cta).toHaveAttribute("target", "_blank");
});

test("browser back closes a sheet opened by click", async ({ page }) => {
  await page.goto("/personal/");
  await page.locator(cards).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("saved language + deep link lands on that language with the sheet open", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lang", "id"));
  await page.goto("/personal/#/work/audio-transkript");
  await expect(page).toHaveURL(/\/personal\/id\/#\/work\/audio-transkript$/);
  await expect(page.getByRole("dialog").getByRole("link", { name: /Lihat di GitHub/ })).toBeVisible();
});

test("the last card opens all repositories on GitHub", async ({ page }) => {
  await page.goto("/personal/");
  const last = page.locator(cards).last();
  await last.click();
  await page.waitForTimeout(900);
  const [popup] = await Promise.all([page.waitForEvent("popup"), last.click()]);
  await expect(popup).toHaveURL(/github\.com\/mardiansyah-gunting\?tab=repositories/);
});
