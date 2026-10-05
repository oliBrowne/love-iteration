import { useState } from 'react';
import type { Mood } from '../../domain/index.ts';
import { MoodPicker } from './MoodPicker.tsx';

export function CheckInPage() {
  const [mood, setMood] = useState<Mood>();
  return (
    <section aria-labelledby="checkin-heading">
      <h2 id="checkin-heading">Check-in</h2>
      <p>How are you today? A check-in takes under a minute.</p>
      <MoodPicker value={mood} onChange={setMood} />
    </section>
  );
}
