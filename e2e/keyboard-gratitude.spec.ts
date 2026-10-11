import { expect, test } from '@playwright/test';

test('an appreciation can be created and deleted with the keyboard alone', async ({
  page,
}) => {
  await page.goto('/#/gratitude');

  // Create: focus the field, type, Tab to the save button, press Enter.
  await page.getByLabel('What are you grateful for?').focus();
  await page.keyboard.type('Keyboard demo thanks');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Save appreciation' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Saved.');
  await expect(page.getByText('Keyboard demo thanks')).toBeVisible();

  // Delete: focus the card's Delete button, confirm with Enter.
  await page.getByRole('button', { name: 'Delete' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText(/Delete this appreciation\?/)).toBeVisible();
  await page.getByRole('button', { name: 'Yes, delete' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Keyboard demo thanks')).toHaveCount(0);
});
