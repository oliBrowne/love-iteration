import { expect, test } from '@playwright/test';

test('links show a focus ring when focused by keyboard', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab'); // skip link
  await page.keyboard.press('Tab'); // Home link
  const link = page.getByRole('link', { name: 'Home' });
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-style', 'solid');
  await expect(link).toHaveCSS('outline-width', '3px');
});
