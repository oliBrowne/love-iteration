import { moodLabels, moods } from '../../domain/index.ts';
import type { Mood } from '../../domain/index.ts';

type MoodPickerProps = {
  value: Mood | undefined;
  onChange: (mood: Mood) => void;
};

// Native radio buttons: Tab enters the group, arrow keys move and select.
export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <fieldset className="mood-picker">
      <legend>How are you feeling?</legend>
      {moods.map((mood) => (
        <label key={mood} className="mood-option">
          <input
            type="radio"
            name="mood"
            value={mood}
            checked={value === mood}
            onChange={() => onChange(mood)}
          />
          {moodLabels[mood]}
        </label>
      ))}
    </fieldset>
  );
}
