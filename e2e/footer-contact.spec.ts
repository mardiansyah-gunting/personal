import { expect, test, type Page } from "@playwright/test";

const CV = {
  en: "https://ap.wps.com/cms/docs/d/cbPaes8mwZdX9lII",
  id: "https://ap.wps.com/cms/docs/d/cbPaeocVk7PaNV6q",
};
const toFooter = async (page: Page) => {
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
};

test("footer inverts the page and shows portrait, signature and links", async ({ page }) => {
  await page.goto("/personal/zh/");
  await toFooter(page);
  await expect(page.locator("html")).toHaveClass(/is-inverted/);
  const footer = page.locator("#contact");
  const portrait = footer.getByRole("img", { name: "Mardiansyah Gunting" });
  await expect(portrait).toHaveAttribute("src", /profile\.jpg$/);
  await expect(footer.locator(".signature")).toHaveText("Mardiansyah Gunting");
  await expect(footer.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", "https://linkedin.com/in/mardiansyah-gunting");
  await expect(footer.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com/mardiansyah-gunting");
  await expect(footer.locator('a[href="tel:+6287897434336"]')).toHaveCount(1);
});

test("email copies to the clipboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/personal/");
  await toFooter(page);
  await page.locator("#contact").getByRole("button", { name: "mardiansyah.gunting@yahoo.com" }).click();
  await expect(page.locator("#contact")).toContainText("Copied to clipboard");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("mardiansyah.gunting@yahoo.com");
});

test("CV link follows the language", async ({ page }) => {
  await page.goto("/personal/");
  await expect(page.locator("#contact").getByRole("link", { name: /Download CV/ })).toHaveAttribute("href", CV.en);
  await page.goto("/personal/id/");
  await expect(page.locator("#contact").getByRole("link", { name: /Unduh CV/ })).toHaveAttribute("href", CV.id);
});

test("contact sheet: references, validation and a successful (intercepted) send", async ({ page }) => {
  let posted: unknown = null;
  await page.route("https://formsubmit.co/**", async (r) => {
    posted = r.request().postDataJSON();
    await r.fulfill({ json: { success: "true" } });
  });
  await page.goto("/personal/");
  await toFooter(page);
  await page.locator("#contact").getByRole("button", { name: "Send a message" }).click();
  await expect(page).toHaveURL(/#\/contact$/);
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Dr. Sebastian Lenz");
  await dialog.getByRole("button", { name: "Send Message" }).click();
  await expect(dialog.getByRole("status")).toHaveText("Please fill in all fields.");
  await dialog.getByLabel("Name").fill("Tester");
  await dialog.getByLabel("Email").fill("tester@example.org");
  await dialog.getByLabel("Message").fill("Hello");
  await dialog.getByRole("button", { name: "Send Message" }).click();
  await expect(dialog.getByRole("status")).toHaveText("Message sent — thank you!");
  expect(posted).toEqual({ name: "Tester", email: "tester@example.org", message: "Hello" });
});

test("press E opens the translated draw toolbar, Escape closes it", async ({ page }) => {
  await page.goto("/personal/id/");
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  await page.keyboard.press("e");
  const bar = page.getByRole("toolbar", { name: "Alat papan" });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole("button", { name: "Coret (D)" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(bar).toBeHidden();
});
