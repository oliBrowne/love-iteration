import { expect, test } from '@playwright/test';

test('saves one appreciation with the keyboard', async ({ page }) => {
  await page.goto('/#/gratitude');
  await page.getByLabel('What are you grateful for?').fill('Demo: a kind text');
  await page.getByRole('button', { name: 'Save appreciation' }).press('Enter');
  await expect(page.getByRole('status')).toHaveText('Saved.');
});
