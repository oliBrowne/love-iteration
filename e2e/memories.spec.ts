import { expect, test } from '@playwright/test';

test('navigation opens Memories', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Memories' }).click();
  await expect(page).toHaveURL(/#\/memories/);
  await expect(page.getByRole('heading', { name: 'Memories' })).toBeVisible();
});
