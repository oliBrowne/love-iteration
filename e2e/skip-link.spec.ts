import { expect, test } from '@playwright/test';

test('keyboard focus can skip the header', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('skipping keeps the current route', async ({ page }) => {
  await page.goto('/#/settings');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});
