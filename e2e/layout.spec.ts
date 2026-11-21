import { expect, test } from "@playwright/test";

const LANGS = [
  { lang: "en", path: "/personal/" },
  { lang: "id", path: "/personal/id/" },
  { lang: "zh", path: "/personal/zh/" },
];
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 375, height: 667 },
];

for (const { lang, path } of LANGS) {
  for (const vp of VIEWPORTS) {
    test(`${lang} ${vp.width}x${vp.height}: no sideways scroll, no failed requests`, async ({ page }) => {
      test.setTimeout(90_000);
      const failures: string[] = [];
      page.on("requestfailed", (r) => failures.push(`failed ${r.url()}`));
      page.on("response", (r) => r.status() >= 400 && failures.push(`${r.status()} ${r.url()}`));
      await page.setViewportSize(vp);
      await page.goto(path);
      // walk down so lazy images, reveals and the gallery all mount
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += vp.height * 0.8) {
        await page.evaluate((top) => scrollTo(0, top), y);
        await page.waitForTimeout(60);
      }
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      expect(failures).toEqual([]);
      // single-line pieces must not wrap on narrow screens
      const lineHeights = await page.evaluate(() => ({
        signature: document.querySelector("#contact .signature")!.getBoundingClientRect().height,
        langSwitch: document.querySelector("#about nav")!.getBoundingClientRect().height,
      }));
      expect(lineHeights.signature).toBeLessThanOrEqual(90);
      expect(lineHeights.langSwitch).toBeLessThanOrEqual(32);
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(900);
      await page.screenshot({ path: `test-results/screens/${lang}-${vp.width}x${vp.height}.png`, fullPage: true });
    });
  }

  test(`${lang}: longest experience sheet reads at phone width`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${path}#/experience/hpps-coordinator-assistant`);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const overflow = await dialog.evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `test-results/screens/${lang}-sheet-hpps.png` });
  });
}
