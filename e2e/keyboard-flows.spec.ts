import { expect, test } from '@playwright/test';

test('a memory can be saved with the keyboard alone', async ({ page }) => {
  await page.goto('/#/memories');
  await page.getByLabel('Memory title').focus();
  await page.keyboard.type('Keyboard demo memory');
  await page.getByRole('button', { name: 'Save memory' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Saved.');
  await expect(page.getByText('Keyboard demo memory')).toBeVisible();
});

test('an idea can be added with the keyboard alone', async ({ page }) => {
  await page.goto('/#/ideas');
  await page.getByLabel('Idea title').focus();
  await page.keyboard.type('Keyboard demo idea');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Keyboard demo idea')).toBeVisible();
});

test('the skip link and main navigation work without a pointer', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link').first(),
  ).toBeFocused();
  await page.getByRole('link', { name: 'Settings' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/settings/);
});
