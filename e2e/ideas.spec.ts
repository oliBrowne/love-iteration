import { expect, test } from '@playwright/test';

test('ideas can be created, filtered, completed, and reloaded', async ({
  page,
}) => {
  await page.goto('/#/ideas');
  await expect(page.getByRole('heading', { name: 'Ideas' })).toBeVisible();

  await page.getByLabel('Idea title').fill('Demo picnic idea');
  await page.getByRole('button', { name: 'Add idea' }).click();
  await expect(page.getByText('Demo picnic idea')).toBeVisible();

  // Filtering by another category hides it; "All categories" brings it back.
  await page.getByLabel('Show category').selectOption({ index: 1 });
  await expect(page.getByText('Demo picnic idea')).toBeHidden();
  await page.getByLabel('Show category').selectOption('');
  await expect(page.getByText('Demo picnic idea')).toBeVisible();

  await page.getByRole('button', { name: 'Mark done' }).click();
  await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();
  await expect(page.getByText('Demo picnic idea')).toBeVisible();
});
