import {
  validateImportDates,
  validateImportIds,
  validateImportRoot,
} from '../../domain/index.ts';
import type { ExportData } from '../export/exportData.ts';
import { exportCounts } from '../export/exportCounts.ts';

export type ImportPreview =
  | { ok: true; counts: ReturnType<typeof exportCounts> }
  | { ok: false; errors: string[] };

// Reads import file text and reports what it holds, or what is wrong with it.
// It never writes anything.
export function previewImport(text: string): ImportPreview {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, errors: ['The file is not valid JSON.'] };
  }
  const root = validateImportRoot(parsed);
  if (!root.ok) return root;
  const errors = [
    ...validateImportIds(root.data),
    ...validateImportDates(root.data),
  ];
  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, counts: exportCounts(root.data as unknown as ExportData) };
}
