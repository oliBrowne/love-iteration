import { expect, test } from '@playwright/test';

test('opens the app and shows the heading', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Love Iteration' }),
  ).toBeVisible();
});
