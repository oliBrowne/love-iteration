import { expect, test } from '@playwright/test';

test('Home shows the gallery, a piece opens full screen, and Back returns', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible();

  const cards = page.locator('.gallery-card-link');
  const count = await cards.count();
  if (count === 0) {
    // No pieces are registered yet: the gallery says so kindly.
    await expect(page.getByText(/first pieces are on their way/)).toBeVisible();
    return;
  }

  const title = (
    await cards.first().locator('.gallery-card-title').innerText()
  ).trim();
  await cards.first().click();
  await expect(page).toHaveURL(/#\/piece\/[a-z0-9-]+$/);
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await expect(page.locator('.piece-caption')).not.toBeEmpty();

  // Back by touch/click...
  await page.getByRole('link', { name: /Back to the gallery/ }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible();

  // ...and by keyboard.
  await cards.first().click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible();
});

test('an unknown piece address explains itself and leads back to the gallery', async ({
  page,
}) => {
  await page.goto('/#/piece/not-a-real-piece');
  await expect(
    page.getByRole('heading', { name: 'Piece not found' }),
  ).toBeVisible();
  await page.getByRole('link', { name: /Back to the gallery/ }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible();
});

test('the piece page can be reached and left with the keyboard', async ({
  page,
}) => {
  await page.goto('/#/piece/not-a-real-piece');
  // The title takes focus on arrival; Tab reaches the Back link.
  await expect(
    page.getByRole('heading', { name: 'Piece not found' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: /Back to the gallery/ }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/$/);
});
