import { expect, test } from '@playwright/test';

test('navigation opens Settings', async ({ page }) => {
  await page.goto('/#/home');
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});
