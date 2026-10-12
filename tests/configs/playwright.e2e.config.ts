import { defineConfig, devices } from '@playwright/test'

/**
 * Flows across page boundaries — what an operator can actually do, not what a
 * component renders.
 *
 * Runs against the **dev** server on purpose: these assert behaviour, and a dev
 * build behaves the same while starting in seconds rather than after a full
 * production build.
 *
 * `fullyParallel` is off. Every spec drives the same in-memory mock database,
 * and two specs creating rows at once would see each other's — the suite is
 * fast enough that serialising it costs less than the isolation would.
 */
export default defineConfig({
  testDir: '../e2e',
  testMatch: '**/*.e2e-spec.ts',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
