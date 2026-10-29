// The first version of the export file format. Raise it whenever the shape of
// the file changes, so an importer can tell which layout it is reading.
export const EXPORT_SCHEMA_VERSION = 1;

// Identifies the file as a Love Iteration export.
export const EXPORT_APP_NAME = 'love-iteration';

// The wrapper around an export file. `exportedAt` is an ISO timestamp.
export type ExportEnvelope<Data> = {
  app: typeof EXPORT_APP_NAME;
  schemaVersion: number;
  exportedAt: string;
  data: Data;
};

// Wraps exported records with the app name, schema version, and time of export.
export function createExportEnvelope<Data>(
  data: Data,
  now: Date = new Date(),
): ExportEnvelope<Data> {
  return {
    app: EXPORT_APP_NAME,
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    data,
  };
}
