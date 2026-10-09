import { formatDateLabel, moodIcons, moodLabels } from '../../domain/index.ts';
import type { CheckIn } from '../../domain/index.ts';
import { Button } from '../../ui/index.ts';

type CheckInDetailProps = {
  record: CheckIn;
  onBack: () => void;
  onOlder?: () => void;
  onNewer?: () => void;
};

// One saved check-in with its complete note.
export function CheckInDetail({
  record,
  onBack,
  onOlder,
  onNewer,
}: CheckInDetailProps) {
  return (
    <section aria-labelledby="detail-heading">
      <h2 id="detail-heading">{formatDateLabel(record.date)}</h2>
      <p>
        <span aria-hidden="true">{moodIcons[record.mood]}</span>{' '}
        <strong>{moodLabels[record.mood]}</strong>
      </p>
      {record.note ? (
        <p className="note-text" data-testid="detail-note">
          {record.note}
        </p>
      ) : (
        <p>No note for this day.</p>
      )}
      <p>
        <Button onClick={onOlder} disabled={!onOlder}>
          Previous entry
        </Button>{' '}
        <Button onClick={onNewer} disabled={!onNewer}>
          Next entry
        </Button>
      </p>
      <Button onClick={onBack}>Back to Home</Button>
    </section>
  );
}
