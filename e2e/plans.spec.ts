import { expect, test } from '@playwright/test';

test('an idea can be scheduled and the plan cancelled', async ({ page }) => {
  await page.goto('/#/ideas');
  await page.getByLabel('Idea title').fill('Demo film night');
  await page.getByRole('button', { name: 'Add idea' }).click();

  const year = new Date().getFullYear() + 1;
  await page.getByRole('button', { name: 'Schedule' }).click();
  await page.getByLabel('Date and time').fill(`${year}-06-15T19:30`);
  await page.getByRole('button', { name: 'Save date' }).click();
  await expect(page.getByText(/Scheduled for/)).toBeVisible();

  const upcoming = page.getByRole('region', { name: 'Upcoming plans' });
  await expect(upcoming.getByText('Demo film night')).toBeVisible();

  await upcoming.getByRole('button', { name: 'Cancel plan' }).click();
  await expect(upcoming).toBeHidden();
});
