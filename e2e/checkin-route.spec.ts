import { expect, test } from '@playwright/test';

test('navigation opens the check-in screen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Check-in' }).click();
  await expect(
    page.getByRole('heading', { name: 'Check-in', exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/#\/check-in$/);
});
