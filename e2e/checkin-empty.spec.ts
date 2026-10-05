import { expect, test } from '@playwright/test';

test('saving without a mood shows an inline error', async ({ page }) => {
  await page.goto('/#/check-in');
  await page.getByRole('button', { name: 'Save check-in' }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'Pick a mood before saving.',
  );
});
