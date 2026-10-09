import { expect, test } from '@playwright/test';

test('a check-in can be completed with the keyboard alone', async ({
  page,
}) => {
  await page.goto('/#/check-in');

  // Tab until the mood group takes focus (skip link and navigation come first).
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    if (
      await page
        .getByRole('radio')
        .first()
        .evaluate((el) => el === document.activeElement)
    )
      break;
  }
  await expect(page.getByRole('radio', { name: 'Glowing' })).toBeFocused();

  // Arrow keys move and select inside the group.
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'Good' })).toBeChecked();

  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Note (optional)')).toBeFocused();
  await page.keyboard.type('Keyboard demo note');

  await page.keyboard.press('Tab');
  const save = page.getByRole('button', { name: 'Save check-in' });
  await expect(save).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(
    page.getByRole('listitem').filter({ hasText: 'Keyboard demo note' }),
  ).toBeVisible();
  // Focus stays on the Save button so the person keeps their place.
  await expect(save).toBeFocused();
});
