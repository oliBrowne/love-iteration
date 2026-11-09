import { useState } from 'react';
import { routeToHash } from '../../domain/index.ts';
import { Button, InlineError } from '../../ui/index.ts';
import { readSharingChoice, saveSharingChoice } from './sharingChoice.ts';

// Sharing is opt-in. Nothing here sends anything: it only records, on this
// device, whether the person has chosen to turn sharing on.
export function SharingPage() {
  const [choice, setChoice] = useState(() => readSharingChoice());
  const [confirming, setConfirming] = useState(false);
  const [problem, setProblem] = useState<string>();

  function change(next: 'on' | 'off') {
    setConfirming(false);
    if (saveSharingChoice(next)) {
      setChoice(next);
      setProblem(undefined);
    } else {
      setProblem('Could not save this choice. Sharing stays off.');
    }
  }

  return (
    <section aria-labelledby="sharing-heading">
      <h2 id="sharing-heading">Sharing</h2>
      <p>
        <a href={routeToHash('settings')}>Back to Settings</a>
      </p>
      <p role="status">
        {choice === 'on'
          ? 'Sharing is on for this device. No account is connected yet, so nothing has been sent.'
          : 'Sharing is off. Everything you write stays on this device.'}
      </p>
      <p>
        Sharing is your choice, and you can turn it off again. Your personal
        records stay personal. Only what you add to a space you choose would
        ever be shared, and you can download an export or delete your data
        whether sharing is on or off.
      </p>
      {problem ? <InlineError>{problem}</InlineError> : null}
      {choice === 'on' ? (
        <Button type="button" onClick={() => change('off')}>
          Turn sharing off
        </Button>
      ) : confirming ? (
        <div role="group" aria-labelledby="sharing-confirm">
          <p id="sharing-confirm">
            Turn on sharing? Nothing is sent yet. You will still choose an
            account and a space before anything leaves this device.
          </p>
          <Button type="button" onClick={() => change('on')}>
            Yes, turn on sharing
          </Button>
          <Button type="button" onClick={() => setConfirming(false)}>
            Not now
          </Button>
        </div>
      ) : (
        <Button type="button" onClick={() => setConfirming(true)}>
          Turn on sharing
        </Button>
      )}
    </section>
  );
}
