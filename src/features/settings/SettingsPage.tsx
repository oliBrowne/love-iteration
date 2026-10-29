import { useState } from 'react';
import { Button } from '../../ui/index.ts';
import { exportFileName } from '../../domain/index.ts';
import { downloadTextFile } from '../export/downloadTextFile.ts';
import { serializeExport } from '../export/exportData.ts';
import type { TimelineSources } from '../timeline/loadTimeline.ts';

type SettingsPageProps = {
  sources?: TimelineSources;
};

export function SettingsPage({ sources }: SettingsPageProps) {
  const [message, setMessage] = useState<string>();
  const [problem, setProblem] = useState<string>();

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

  return (
    <section aria-labelledby="settings-heading">
      <h2 id="settings-heading">Settings</h2>
      <h3>Export your data</h3>
      <p>
        Save a copy of everything you have written as one file. It is created on
        this device and is not uploaded anywhere.
      </p>
      <Button type="button" onClick={download}>
        Download export
      </Button>
      {message ? <p role="status">{message}</p> : null}
      {problem ? <p role="alert">{problem}</p> : null}
    </section>
  );
}
