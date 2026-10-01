import { expect, test } from '@playwright/test';

test('direct load displays the home heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
});
