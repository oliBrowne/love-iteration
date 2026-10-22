import { expect, test } from '@playwright/test';

test('navigation opens Rituals', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Rituals' }).click();
  await expect(page).toHaveURL(/#\/rituals/);
  await expect(page.getByRole('heading', { name: 'Rituals' })).toBeVisible();
});

test('create, complete, undo, and reload a ritual', async ({ page }) => {
  await page.goto('/#/rituals');
  await page.getByLabel('Ritual name').fill('Demo: Morning hello');
  await page.getByRole('button', { name: 'Save ritual' }).click();
  await expect(
    page.getByText('Demo: Morning hello', { exact: true }),
  ).toBeVisible();

  await page
    .getByRole('button', { name: 'Mark Demo: Morning hello done today' })
    .click();
  await expect(page.getByText('Done today', { exact: true })).toBeVisible();

  await page.reload();
  await expect(
    page.getByText('Demo: Morning hello', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Done today', { exact: true })).toBeVisible();

  await page
    .getByRole('button', { name: 'Undo Demo: Morning hello today' })
    .click();
  await expect(page.getByText('Done today', { exact: true })).toHaveCount(0);

  await page.reload();
  await expect(
    page.getByText('Demo: Morning hello', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Done today', { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Mark Demo: Morning hello done today' }),
  ).toBeVisible();
});
