import { expect, test } from '@playwright/test';

test('navigation opens Gratitude', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Gratitude' }).click();
  await expect(page).toHaveURL(/#\/gratitude/);
  await expect(page.getByRole('heading', { name: 'Gratitude' })).toBeVisible();
});
