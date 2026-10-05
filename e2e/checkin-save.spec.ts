import { expect, test } from '@playwright/test';

test('a saved check-in appears in the list and survives a reload', async ({
  page,
}) => {
  await page.goto('/#/check-in');
  await page.getByRole('radio', { name: 'Good' }).check();
  await page.getByLabel('Note (optional)').fill('Demo note');
  await page.getByRole('button', { name: 'Save check-in' }).click();
  const item = page.getByRole('listitem').filter({ hasText: 'Demo note' });
  await expect(item).toContainText('Good');
  await page.reload();
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Demo note' }),
  ).toBeVisible();
});
