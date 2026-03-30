import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    }
  ],
  webServer: {
    command: "pnpm --filter @xiaoye/docs exec vitepress dev . --host 127.0.0.1 --port 4174",
    url: "http://127.0.0.1:4174/examples/admin",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
