import { expect, test } from '@playwright/test';

test('navigates from Home to Settings', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/#?\/?$/);
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page).toHaveURL(/#\/settings/);
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(
    page.getByRole('heading', { name: 'Love Iteration' }),
  ).toBeVisible();
});
