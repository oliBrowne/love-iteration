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

test('Home shows the mood saved today', async ({ page }) => {
  await page.goto('/#/check-in');
  await page.getByRole('radio', { name: 'Glowing' }).check();
  await page.getByRole('button', { name: 'Save check-in' }).click();
  await expect(page.getByRole('listitem').first()).toContainText('Glowing');
  await page.goto('/#/');
  await expect(page.getByTestId('today-summary')).toContainText('Glowing');
});

test('saving twice in one day keeps a single check-in', async ({ page }) => {
  await page.goto('/#/check-in');
  await page.getByRole('radio', { name: 'Good' }).check();
  await page.getByRole('button', { name: 'Save check-in' }).click();
  await expect(page.getByRole('listitem')).toHaveCount(1);
  await page.getByRole('radio', { name: 'Low', exact: true }).check();
  await page.getByRole('button', { name: 'Save check-in' }).click();
  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expect(page.getByRole('listitem')).toContainText('Low');
});
