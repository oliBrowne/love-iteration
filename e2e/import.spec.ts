import { expect, test } from '@playwright/test';

test('an export imported into a fresh browser restores records', async ({
  page,
  browser,
}) => {
  await page.goto('/#/gratitude');
  await page.getByLabel('What are you grateful for?').fill('Demo: restore me');
  await page.getByRole('button', { name: 'Save appreciation' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved.');

  await page.getByRole('link', { name: 'Settings' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download export' }).click();
  const exportPath = await (await downloadPromise).path();

  // A new browser context has empty local storage.
  const fresh = await browser.newContext();
  const other = await fresh.newPage();
  await other.goto('/#/settings');
  await expect(other.getByText('Gratitude: 0')).toBeVisible();

  await other.getByLabel('Import file (.json)').setInputFiles(exportPath);
  await expect(other.getByText('The file contains:')).toBeVisible();
  await other.getByRole('button', { name: 'Import these records' }).click();
  await other.getByRole('button', { name: 'Yes, import' }).click();
  await expect(other.getByRole('status')).toHaveText(
    'Your file was imported: 1 new, 0 updated, 0 skipped.',
  );

  await other.goto('/#/gratitude');
  await expect(other.getByText('Demo: restore me')).toBeVisible();
  await fresh.close();
});
