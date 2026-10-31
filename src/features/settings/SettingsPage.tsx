import { useEffect, useState } from 'react';
import { Button } from '../../ui/index.ts';
import { exportFileName } from '../../domain/index.ts';
import { downloadTextFile } from '../export/downloadTextFile.ts';
import { exportCounts } from '../export/exportCounts.ts';
import { buildExport, serializeExport } from '../export/exportData.ts';
import { previewImport } from '../import/previewImport.ts';
import { deleteAllData, deleteKind } from './deleteAllData.ts';
import { applyImport, summarizeImport } from '../import/applyImport.ts';
import type { ImportSummary } from '../import/applyImport.ts';
import type { ImportPreview } from '../import/previewImport.ts';
import type { ExportData } from '../export/exportData.ts';
import type { TimelineSources } from '../timeline/loadTimeline.ts';

type SettingsPageProps = {
  sources?: TimelineSources;
};

export function SettingsPage({ sources }: SettingsPageProps) {
  const [message, setMessage] = useState<string>();
  const [problem, setProblem] = useState<string>();
  const [preview, setPreview] = useState<ImportPreview>();
  const [confirming, setConfirming] = useState(false);
  const [summary, setSummary] = useState<ImportSummary>();
  const [deleting, setDeleting] = useState(false);
  const [kind, setKind] = useState<keyof ExportData>('checkIns');
  const [deletingKind, setDeletingKind] = useState(false);
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
    setSummary(undefined);
    setMessage(undefined);
    if (file) setPreview(previewImport(await file.text()));
  }

  async function review() {
    if (!preview?.ok) return;
    try {
      setSummary(await summarizeImport(preview.data, sources));
      setConfirming(true);
    } catch {
      setProblem('Could not compare the file with your records.');
    }
  }

  async function confirmImport() {
    if (!preview?.ok) return;
    setConfirming(false);
    try {
      const done = await applyImport(preview.data, sources);
      setMessage(
        `Your file was imported: ${done.added} new, ${done.updated} updated, ${done.skipped} skipped.`,
      );
      setPreview(undefined);
    } catch {
      setProblem('Could not import your file.');
    }
  }

  async function confirmDelete() {
    setDeleting(false);
    setMessage(undefined);
    setProblem(undefined);
    try {
      await deleteAllData(sources);
      setCounts((current) => current?.map((c) => ({ ...c, count: 0 })));
      setMessage('All data was removed from this device.');
    } catch {
      setProblem('Could not delete your data.');
    }
  }

  async function confirmDeleteKind() {
    setDeletingKind(false);
    setMessage(undefined);
    setProblem(undefined);
    try {
      await deleteKind(kind, sources);
      setCounts((current) =>
        current?.map((c) => (c.key === kind ? { ...c, count: 0 } : c)),
      );
      const label = counts?.find((c) => c.key === kind)?.label ?? 'Records';
      setMessage(`${label} were removed from this device.`);
    } catch {
      setProblem('Could not delete those records.');
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
              {summary ? (
                <p>
                  {summary.added} new, {summary.updated} updated,{' '}
                  {summary.skipped} skipped because yours is as new or newer.
                </p>
              ) : null}
              <Button type="button" onClick={confirmImport}>
                Yes, import
              </Button>
              <Button type="button" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={review}>
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
      <h3>Delete one kind of record</h3>
      <p>
        Remove only one kind of record from this device. Everything else is
        kept.
      </p>
      <label htmlFor="delete-kind">Record kind</label>
      <select
        id="delete-kind"
        value={kind}
        onChange={(event) => {
          setKind(event.target.value as keyof ExportData);
          setDeletingKind(false);
        }}
      >
        {(counts ?? []).map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      {deletingKind ? (
        <div role="group" aria-labelledby="delete-kind-confirm">
          <p id="delete-kind-confirm">
            Delete these records from this device? This cannot be undone.
          </p>
          <Button type="button" onClick={confirmDeleteKind}>
            Yes, delete this kind
          </Button>
          <Button type="button" onClick={() => setDeletingKind(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button type="button" onClick={() => setDeletingKind(true)}>
          Delete this kind
        </Button>
      )}
      <h3>Delete all data</h3>
      <p>
        This removes everything you have written from this device. It stays only
        on this device, so nothing is deleted anywhere else, and it cannot be
        undone. Download an export first if you want a copy.
      </p>
      {deleting ? (
        <div role="group" aria-labelledby="delete-confirm">
          <p id="delete-confirm">
            Delete every record stored on this device? This cannot be undone.
          </p>
          <Button type="button" onClick={confirmDelete}>
            Yes, delete everything
          </Button>
          <Button type="button" onClick={() => setDeleting(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button type="button" onClick={() => setDeleting(true)}>
          Delete all data
        </Button>
      )}
    </section>
  );
}
