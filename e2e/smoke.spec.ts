import { expect, test } from '@playwright/test';

test('opens the app and shows the heading', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Love Iteration' }),
  ).toBeVisible();
});

test('Home is the gallery, with one quiet link to the journal tools', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Journal tools' }).click();
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  await page.getByRole('link', { name: 'Gallery' }).click();
  await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible();
});
