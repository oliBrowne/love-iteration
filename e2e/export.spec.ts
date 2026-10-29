import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('downloads an export file that parses as expected', async ({ page }) => {
  await page.goto('/#/gratitude');
  await page
    .getByLabel('What are you grateful for?')
    .fill('Demo: export check');
  await page.getByRole('button', { name: 'Save appreciation' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved.');

  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByText('Gratitude: 1')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download export' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(
    /^love-iteration-export-\d{4}-\d{2}-\d{2}\.json$/,
  );

  const file = JSON.parse(await readFile(await download.path(), 'utf8'));
  expect(file.app).toBe('love-iteration');
  expect(file.schemaVersion).toBe(1);
  expect(Date.parse(file.exportedAt)).not.toBeNaN();
  expect(file.data.gratitude.map((g: { text: string }) => g.text)).toEqual([
    'Demo: export check',
  ]);
  expect(file.data.checkIns).toEqual([]);
});
