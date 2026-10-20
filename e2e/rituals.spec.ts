import { expect, test } from '@playwright/test';

test('navigation opens Rituals', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Rituals' }).click();
  await expect(page).toHaveURL(/#\/rituals/);
  await expect(page.getByRole('heading', { name: 'Rituals' })).toBeVisible();
});
