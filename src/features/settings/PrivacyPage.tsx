import { routeToHash } from '../../domain/index.ts';

export function PrivacyPage() {
  return (
    <section aria-labelledby="privacy-heading">
      <h2 id="privacy-heading">Privacy policy</h2>
      <p>
        <a href={routeToHash('settings')}>Back to Settings</a>
      </p>
      <h3>What is stored</h3>
      <p>
        Check-ins, gratitude notes, memories, ideas, planned dates, rituals,
        ritual completions, and reflections that you write are saved in this
        browser, in a database called IndexedDB, on this device.
      </p>
      <h3>Where it goes</h3>
      <p>
        Nowhere else. This version has no accounts, no server that receives your
        writing, no analytics, and no tracking. Your records are never put in
        web addresses or logs.
      </p>
      <h3>What this means for you</h3>
      <ul>
        <li>
          Clearing this site&apos;s data in your browser removes your records.
        </li>
        <li>Another browser or device cannot see them.</li>
        <li>
          Anyone who can open this browser profile on this device can read them.
        </li>
        <li>
          Download an export from Settings to keep a copy. The file is created
          on this device and saved where you choose.
        </li>
      </ul>
      <h3>Your controls</h3>
      <p>
        In Settings you can download an export, import a file, delete one kind
        of record, or delete everything. Deleting only affects this device.
      </p>
      <h3>If this changes</h3>
      <p>
        Sharing or syncing would only be added as an explicit choice, after
        export and deletion controls exist, and this page would be updated
        first.
      </p>
    </section>
  );
}
