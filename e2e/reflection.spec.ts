import { expect, test } from '@playwright/test';

test('navigation opens Reflection', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Reflection' }).click();
  await expect(page).toHaveURL(/#\/reflection/);
  await expect(page.getByRole('heading', { name: 'Reflection' })).toBeVisible();
});
