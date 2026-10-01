import { expect, test } from '@playwright/test';

test('Home and Settings share the same header', async ({ page }) => {
  await page.goto('/');
  const header = page.getByRole('banner');
  await expect(
    header.getByRole('heading', { name: 'Love Iteration' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await expect(
    header.getByRole('heading', { name: 'Love Iteration' }),
  ).toBeVisible();
});
