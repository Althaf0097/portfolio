
import { test, expect } from '@playwright/test';

test('verify optimized scene', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Wait for the canvas to be rendered
  await page.waitForSelector('canvas');

  // Wait a bit for animations to start
  await page.waitForTimeout(2000);

  // Take a screenshot of the whole page
  await page.screenshot({ path: '/home/jules/verification/optimized_scene.png', fullPage: true });

  // Scroll down to verify scroll-responsive particles
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/jules/verification/scrolled_scene.png', fullPage: true });

  // Check if main sections are still visible and haven't crashed
  const hero = page.locator('section').first();
  await expect(hero).toBeVisible();
});
