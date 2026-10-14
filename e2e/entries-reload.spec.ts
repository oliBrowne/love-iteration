import { expect, test } from '@playwright/test';

test('a saved appreciation survives a reload', async ({ page }) => {
  await page.goto('/#/gratitude');
  await page.getByLabel('What are you grateful for?').fill('Demo: a kind text');
  await page.getByRole('button', { name: 'Save appreciation' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved.');
  await page.reload();
  await expect(page.getByText('Demo: a kind text')).toBeVisible();
});

test('a saved memory survives a reload', async ({ page }) => {
  await page.goto('/#/memories');
  await page.getByLabel('Memory title').fill('Demo: the lake walk');
  await page.getByLabel('Note (optional)').fill('Demo note about the sunset.');
  await page.getByRole('button', { name: 'Save memory' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved.');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Demo: the lake walk' }),
  ).toBeVisible();
  await expect(page.getByText('Demo note about the sunset.')).toBeVisible();
});
