// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Mood } from '../../domain/index.ts';
import { MoodPicker } from './MoodPicker.tsx';

afterEach(cleanup);

function Harness() {
  const [mood, setMood] = useState<Mood>();
  return <MoodPicker value={mood} onChange={setMood} />;
}

describe('MoodPicker', () => {
  it('offers every mood as a radio in one named group', () => {
    render(<Harness />);
    expect(
      screen.getByRole('group', { name: 'How are you feeling?' }),
    ).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('selects exactly one mood at a time', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('radio', { name: 'Good' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Low' }));
    const checked = screen
      .getAllByRole('radio')
      .filter((r) => (r as HTMLInputElement).checked);
    expect(checked.map((r) => (r as HTMLInputElement).value)).toEqual(['low']);
  });
});
