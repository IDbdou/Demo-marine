import { defineConfig } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, locale: "fr-FR", timezoneId: "Africa/Casablanca" },
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      // Fenêtre ouverte simulée + stockage isolé pour les tests.
      NEXT_PUBLIC_FORCE_NOW: "2026-11-20T10:00:00+01:00",
      RATE_LIMIT_MAX: "1000",
      SUBMISSIONS_DIR: "./storage/e2e",
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
    },
  },
});
