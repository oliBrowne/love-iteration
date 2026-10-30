import { useEffect, useState } from 'react';
import { Button } from '../../ui/index.ts';
import { exportFileName } from '../../domain/index.ts';
import { downloadTextFile } from '../export/downloadTextFile.ts';
import { exportCounts } from '../export/exportCounts.ts';
import { buildExport, serializeExport } from '../export/exportData.ts';
import { previewImport } from '../import/previewImport.ts';
import { applyImport } from '../import/applyImport.ts';
import type { ImportPreview } from '../import/previewImport.ts';
import type { TimelineSources } from '../timeline/loadTimeline.ts';

type SettingsPageProps = {
  sources?: TimelineSources;
};

export function SettingsPage({ sources }: SettingsPageProps) {
  const [message, setMessage] = useState<string>();
  const [problem, setProblem] = useState<string>();
  const [preview, setPreview] = useState<ImportPreview>();
  const [confirming, setConfirming] = useState(false);
  const [counts, setCounts] = useState<ReturnType<typeof exportCounts>>();

  useEffect(() => {
    let cancelled = false;
    buildExport(sources)
      .then(({ data }) => {
        if (!cancelled) setCounts(exportCounts(data));
      })
      .catch(() => {
        if (!cancelled) setProblem('Could not count your records.');
      });
    return () => {
      cancelled = true;
    };
  }, [sources]);

  async function download() {
    setMessage(undefined);
    setProblem(undefined);
    try {
      const now = new Date();
      downloadTextFile(
        exportFileName(now),
        await serializeExport(sources, now),
      );
      setMessage('Your export was saved to this device.');
    } catch {
      setProblem('Could not create your export.');
    }
  }

  async function choose(file: File | undefined) {
    setPreview(undefined);
    setConfirming(false);
    setMessage(undefined);
    if (file) setPreview(previewImport(await file.text()));
  }

  async function confirmImport() {
    if (!preview?.ok) return;
    setConfirming(false);
    try {
      await applyImport(preview.data, sources);
      setMessage('Your file was imported.');
      setPreview(undefined);
    } catch {
      setProblem('Could not import your file.');
    }
  }

  return (
    <section aria-labelledby="settings-heading">
      <h2 id="settings-heading">Settings</h2>
      <h3>Export your data</h3>
      <p>
        Save a copy of everything you have written as one file. It is created on
        this device and is not uploaded anywhere.
      </p>
      {counts ? (
        <>
          <p id="export-contents">The export will include:</p>
          <ul aria-labelledby="export-contents">
            {counts.map(({ key, label, count }) => (
              <li key={key}>
                {label}: {count}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <Button type="button" onClick={download}>
        Download export
      </Button>
      {message ? <p role="status">{message}</p> : null}
      {problem ? <p role="alert">{problem}</p> : null}
      <h3>Import a file</h3>
      <p>
        Choose an export file to preview what it holds. Nothing is changed by
        previewing.
      </p>
      <label htmlFor="import-file">Import file (.json)</label>
      <input
        id="import-file"
        type="file"
        accept="application/json,.json"
        onChange={(event) => void choose(event.target.files?.[0])}
      />
      {preview?.ok ? (
        <>
          <p id="import-contents">The file contains:</p>
          <ul aria-labelledby="import-contents">
            {preview.counts.map(({ key, label, count }) => (
              <li key={key}>
                {label}: {count}
              </li>
            ))}
          </ul>
          {confirming ? (
            <div role="group" aria-labelledby="import-confirm">
              <p id="import-confirm">
                Add these records to this device? Stored records are replaced
                only by a newer version of the same record.
              </p>
              <Button type="button" onClick={confirmImport}>
                Yes, import
              </Button>
              <Button type="button" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setConfirming(true)}>
              Import these records
            </Button>
          )}
        </>
      ) : null}
      {preview && !preview.ok ? (
        <div role="alert">
          <p>This file cannot be imported:</p>
          <ul>
            {preview.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
