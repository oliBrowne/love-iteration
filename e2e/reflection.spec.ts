import { expect, test } from '@playwright/test';

test('navigation opens Reflection', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Reflection' }).click();
  await expect(page).toHaveURL(/#\/reflection/);
  await expect(page.getByRole('heading', { name: 'Reflection' })).toBeVisible();
});

test('a partly answered reflection survives a reload', async ({ page }) => {
  await page.goto('/#/reflection');
  await page.getByLabel('What worked this week?').fill('Demo: a slow morning');
  await page.getByRole('button', { name: 'Save reflection' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved.');
  await page.reload();
  await expect(page.getByLabel('What worked this week?')).toHaveValue(
    'Demo: a slow morning',
  );
  await expect(page.getByLabel('What was hard this week?')).toHaveValue('');
});
