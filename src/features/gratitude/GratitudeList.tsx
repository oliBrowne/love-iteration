import { useState } from 'react';
import { formatDateLabel } from '../../domain/index.ts';
import type { Gratitude } from '../../domain/index.ts';
import { Button, InlineError, TextArea } from '../../ui/index.ts';

type GratitudeListProps = {
  entries: Gratitude[];
  // Saves new text for one entry; rejects with an Error whose message is shown.
  onEdit?: (entry: Gratitude, text: string) => Promise<void>;
  // Removes one entry after the person confirms.
  onDelete?: (entry: Gratitude) => Promise<void>;
};

// One card per appreciation, in the order given (newest first).
export function GratitudeList({
  entries,
  onEdit,
  onDelete,
}: GratitudeListProps) {
  const [editingId, setEditingId] = useState<string>();
  const [draft, setDraft] = useState('');
  const [problem, setProblem] = useState<string>();
  const [confirmingId, setConfirmingId] = useState<string>();

  if (entries.length === 0) return null;

  async function save(entry: Gratitude) {
    if (!onEdit) return;
    try {
      await onEdit(entry, draft);
      setEditingId(undefined);
      setProblem(undefined);
    } catch (error) {
      setProblem(
        error instanceof Error ? error.message : 'Could not save this edit.',
      );
    }
  }

  return (
    <ul className="gratitude-list">
      {entries.map((entry) => (
        <li key={entry.id} className="gratitude-card">
          {editingId === entry.id ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void save(entry);
              }}
            >
              <TextArea
                label="Edit appreciation"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              {problem ? <InlineError>{problem}</InlineError> : null}
              <Button type="submit">Save edit</Button>
              <Button onClick={() => setEditingId(undefined)}>Cancel</Button>
            </form>
          ) : confirmingId === entry.id ? (
            <>
              <p>Delete this appreciation? This cannot be undone.</p>
              <Button
                onClick={async () => {
                  await onDelete?.(entry);
                  setConfirmingId(undefined);
                }}
              >
                Yes, delete
              </Button>
              <Button onClick={() => setConfirmingId(undefined)}>Cancel</Button>
            </>
          ) : (
            <>
              <p>{entry.text}</p>
              <small>{formatDateLabel(entry.date)}</small>
              {onEdit ? (
                <Button
                  onClick={() => {
                    setEditingId(entry.id);
                    setDraft(entry.text);
                    setProblem(undefined);
                  }}
                >
                  Edit
                </Button>
              ) : null}
              {onDelete ? (
                <Button onClick={() => setConfirmingId(entry.id)}>
                  Delete
                </Button>
              ) : null}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
