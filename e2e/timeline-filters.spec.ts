import { expect, test } from '@playwright/test';

test('timeline filters survive going to another page and back', async ({
  page,
}) => {
  await page.goto('/#/timeline');
  await page.getByRole('checkbox', { name: /Memories/ }).check();
  await page.getByLabel('From').fill('2026-01-01');

  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page).toHaveURL(/#\/settings/);
  await page.goBack();

  await expect(page).toHaveURL(/#\/timeline/);
  await expect(page.getByRole('checkbox', { name: /Memories/ })).toBeChecked();
  await expect(page.getByLabel('From')).toHaveValue('2026-01-01');
});
