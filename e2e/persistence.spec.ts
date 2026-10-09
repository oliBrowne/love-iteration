import { expect, test } from '@playwright/test';

test('a check-in survives a page reload', async ({ page }) => {
  await page.goto('/#/check-in');
  await page.getByRole('radio', { name: 'Okay' }).check();
  await page.getByLabel('Note (optional)').fill('Persistence demo note');
  await page.getByRole('button', { name: 'Save check-in' }).click();
  await expect(page.getByText('Persistence demo note')).toBeVisible();

  await page.goto('/#/');
  await page.reload();
  await expect(page.getByTestId('today-summary')).toContainText('Okay');

  // The saved mood and note are back in the form after the reload.
  await page.getByRole('link', { name: /Edit today/ }).click();
  await expect(page.getByRole('radio', { name: 'Okay' })).toBeChecked();
  await expect(page.getByLabel('Note (optional)')).toHaveValue(
    'Persistence demo note',
  );
});
