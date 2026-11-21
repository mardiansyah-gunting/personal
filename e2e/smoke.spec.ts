import { expect, test } from "@playwright/test";

test("home has no failed requests", async ({ page }) => {
  const failures: string[] = [];
  page.on("requestfailed", (r) => failures.push(`failed ${r.url()}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  await page.goto("/personal/");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveTitle(/.+/);
  expect(failures).toEqual([]);
});
