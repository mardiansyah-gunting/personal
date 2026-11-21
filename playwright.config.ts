import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 45_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:4321", trace: "retain-on-failure" },
  webServer: { command: "node scripts/serve-out.mjs", url: "http://localhost:4321/personal/", reuseExistingServer: true },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
