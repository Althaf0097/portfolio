import { test, expect } from '@playwright/test';

test('verify 3D scene and particles', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Wait for the 3D canvas to be present
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  // Take a screenshot of the initial state
  await page.screenshot({ path: '/home/jules/verification/initial_scene.png' });

  // Move the mouse to trigger parallax
  await page.mouse.move(100, 100);
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/mouse_move.png' });

  // Scroll to trigger scroll parallax
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/scroll_parallax.png' });
});
