import { defineConfig, devices } from '@playwright/test'

const usePreviewServer = process.env.DEVLINGO_E2E_PREVIEW === 'true'
const deploymentBasePath =
  process.env.GITHUB_ACTIONS === 'true' ? '/devlingo/' : '/'
const baseURL = `http://127.0.0.1:4173${deploymentBasePath}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: usePreviewServer
      ? 'npm run preview -- --host 127.0.0.1 --port 4173'
      : 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
