import { expect, test } from '@playwright/test';

test('a search result opens the page that holds the entry', async ({
  page,
}) => {
  await page.goto('/#/gratitude');
  await page
    .getByLabel('What are you grateful for?')
    .fill('Demo: quiet lantern walk');
  await page.getByRole('button', { name: 'Save appreciation' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved.');

  await page.getByRole('link', { name: 'Search' }).click();
  await page.getByLabel('Search your entries').fill('LANTERN');
  await page.getByRole('link', { name: /quiet lantern walk/ }).click();

  await expect(page).toHaveURL(/#\/gratitude/);
  await expect(page.getByText('Demo: quiet lantern walk')).toBeVisible();
});
