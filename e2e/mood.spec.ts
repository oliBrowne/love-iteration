import { expect, test } from '@playwright/test';

test('keyboard can select one mood', async ({ page }) => {
  await page.goto('/#/check-in');
  const first = page.getByRole('radio', { name: 'Glowing' });
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'Good' })).toBeChecked();
  await expect(first).not.toBeChecked();
});
