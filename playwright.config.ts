import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/specs',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // workers: process.env.CI ? 1 : undefined,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'src/reports/html-report' }],
    ['json', { outputFile: 'src/reports/results.json' }],
    ['junit', { outputFile: 'src/reports/results.xml' }],
  ],
  use: {
    baseURL: 'https://app.browntape.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
