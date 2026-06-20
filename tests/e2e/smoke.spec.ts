import { test, expect } from "@playwright/test";

test("marketing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Aurelia AI").first()).toBeVisible();
});

test("guide page loads", async ({ page }) => {
  await page.goto("/guide");
  await expect(page.getByText("A calm guide")).toBeVisible();
});
