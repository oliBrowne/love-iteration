import { useState } from 'react';
import type { Mood } from '../../domain/index.ts';
import { TextArea } from '../../ui/index.ts';
import { MoodPicker } from './MoodPicker.tsx';

export function CheckInPage() {
  const [mood, setMood] = useState<Mood>();
  const [note, setNote] = useState('');
  return (
    <section aria-labelledby="checkin-heading">
      <h2 id="checkin-heading">Check-in</h2>
      <p>How are you today? A check-in takes under a minute.</p>
      <MoodPicker value={mood} onChange={setMood} />
      <TextArea
        label="Note (optional)"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
    </section>
  );
}
