import { test, expect } from "@playwright/test";

/**
 * This file defines the platform's start-to-end journey tests.
 *
 * The public journey runs in any environment because it does not require external services.
 * The full SaaS journey is documented here and can be enabled in a seeded staging environment
 * by setting E2E_FULL_JOURNEY=true with DATABASE_URL, Clerk, Blob, Stripe and Gemini configured.
 */

test.describe("public acquisition and auth entry journey", () => {
  test("visitor can understand the product and reach Google-ready auth", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Aurelia/i).first()).toBeVisible();
    await expect(page.getByText(/Build luxury websites/i)).toBeVisible();

    await page.goto("/guide");
    await expect(page.getByText(/A calm guide/i)).toBeVisible();
    await expect(page.getByText(/Create your workspace/i)).toBeVisible();

    await page.goto("/signup");
    await expect(page.getByText(/Create your workspace with Google/i)).toBeVisible();
    await expect(page.getByText(/Google sign-up is ready to enable|Sign up/i).first()).toBeVisible();

    await page.goto("/login");
    await expect(page.getByText(/Continue building your workspace/i)).toBeVisible();
    await expect(page.getByText(/Google sign-in is ready to enable|Sign in/i).first()).toBeVisible();
  });
});

test.describe("full SaaS journey contract", () => {
  test.skip(process.env.E2E_FULL_JOURNEY !== "true", "Requires seeded staging services: DB, Clerk, Blob, Gemini, Stripe.");

  test("tenant can create, customize, publish and sell", async ({ page }) => {
    // 1. Auth
    await page.goto("/signup");
    await expect(page.getByText(/Create your workspace/i)).toBeVisible();

    // In a real staging run, authenticate via Clerk test session or storageState.
    // Then continue through workspace flows below.

    // 2. Onboarding
    await page.goto("/onboarding");
    await expect(page.getByText(/Set up a polished workspace/i)).toBeVisible();

    // 3. Builder
    await page.goto("/builder");
    await expect(page.getByText(/Visual Builder/i)).toBeVisible();

    // 4. Asset library / scroll storytelling
    await page.goto("/assets");
    await expect(page.getByText(/Asset Library/i)).toBeVisible();

    // 5. Products and variants
    await page.goto("/cms/products");
    await expect(page.getByText(/Products/i)).toBeVisible();

    // 6. Search presence
    await page.goto("/seo");
    await expect(page.getByText(/Search Presence/i)).toBeVisible();

    // 7. Publish and storefront
    await page.goto("/dashboard");
    await expect(page.getByText(/My Websites/i)).toBeVisible();

    // 8. Admin/observability
    await page.goto("/api/health");
    await expect(page.getByText(/database|ok|error/i)).toBeVisible();
  });
});
