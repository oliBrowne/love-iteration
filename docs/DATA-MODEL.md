# Data model

Everything is stored on the device in IndexedDB (database `love-iteration`, version 8). Nothing is uploaded. The same records are written to the export file by Settings > Download export. Dates are ISO strings or local `YYYY-MM-DD` days. The source of truth is `src/domain/`.

## Common fields

Every record has these (`RecordMetadata` in `src/domain/record.ts`):

| Field           | Type   | Meaning                                |
| --------------- | ------ | -------------------------------------- |
| `id`            | string | Stable unique ID.                      |
| `schemaVersion` | number | Layout version of this record.         |
| `createdAt`     | string | ISO timestamp of creation.             |
| `updatedAt`     | string | ISO timestamp of the last change.      |

## Records

Each row lists the IndexedDB store, the key inside the export file's `data` object, and the fields added to the common ones. Fields marked optional may be missing.

### Check-in (`checkins`, export `checkIns`)

| Field  | Type   | Meaning                                                  |
| ------ | ------ | -------------------------------------------------------- |
| `date` | string | Local day, `YYYY-MM-DD`.                                 |
| `mood` | string | One of `glowing`, `good`, `okay`, `low`, `rough`.        |
| `note` | string | Free text, up to 500 characters. May be empty.           |

### Gratitude (`gratitude`, export `gratitude`)

| Field  | Type   | Meaning                                  |
| ------ | ------ | ---------------------------------------- |
| `date` | string | Local day, `YYYY-MM-DD`.                 |
| `text` | string | The appreciation, 1 to 500 characters.   |

### Memory (`memories`, export `memories`)

| Field   | Type   | Meaning                         |
| ------- | ------ | ------------------------------- |
| `title` | string | Required, not blank.            |
| `date`  | string | Local day, `YYYY-MM-DD`.        |
| `note`  | string | Free text. May be empty.        |

### Date idea (`ideas`, export `ideas`)

| Field      | Type   | Meaning                                                              |
| ---------- | ------ | -------------------------------------------------------------------- |
| `title`    | string | Required, not blank.                                                 |
| `note`     | string | Free text. May be empty.                                             |
| `state`    | string | `active` (still to do) or `completed`.                               |
| `category` | string | Optional: `outing`, `at-home`, `trip` or `other`. Older ideas have none. |

### Planned date (`plans`, export `plans`)

| Field      | Type   | Meaning                                                 |
| ---------- | ------ | ------------------------------------------------------- |
| `ideaId`   | string | `id` of the date idea being planned.                    |
| `startsAt` | string | ISO timestamp of the start.                             |
| `status`   | string | `planned`, `done` or `cancelled`.                       |

### Ritual (`rituals`, export `rituals`)

| Field        | Type   | Meaning                                                      |
| ------------ | ------ | ------------------------------------------------------------ |
| `name`       | string | Required, not blank.                                         |
| `cadence`    | string | `daily` or `weekly`.                                         |
| `archivedAt` | string | Optional ISO timestamp. Archived rituals are kept, not deleted. |
| `pausedAt`   | string | Optional ISO timestamp. A paused ritual is never due.        |

### Ritual completion (`ritualCompletions`, export `ritualCompletions`)

| Field      | Type   | Meaning                                                     |
| ---------- | ------ | ----------------------------------------------------------- |
| `ritualId` | string | `id` of the ritual that was done.                           |
| `date`     | string | Local day done; for weekly rituals, the week's Monday.      |

### Reflection (`reflections`, export `reflections`)

| Field          | Type   | Meaning                                                  |
| -------------- | ------ | -------------------------------------------------------- |
| `weekStart`    | string | The Monday of the week, `YYYY-MM-DD`.                    |
| `whatWorked`   | string | Optional answer.                                         |
| `whatWasHard`  | string | Optional answer.                                         |
| `whatToTry`    | string | Optional answer.                                         |
| `appreciation` | string | Optional answer.                                         |
| `nextAction`   | string | Optional next step, up to 140 characters.                |

## Export file

The export is one JSON file (`src/domain/export.ts`):

| Field           | Type   | Meaning                                                        |
| --------------- | ------ | -------------------------------------------------------------- |
| `app`           | string | Always `love-iteration`.                                       |
| `schemaVersion` | number | Export layout version, currently `1`. Newer files are refused on import. |
| `exportedAt`    | string | ISO timestamp of the export.                                   |
| `data`          | object | Arrays of records, keyed `checkIns`, `gratitude`, `memories`, `plans`, `ideas`, `rituals`, `ritualCompletions`, `reflections`. |

The file name is `love-iteration-export-YYYY-MM-DD.json` and contains no personal details.

## Relationships

- A planned date points to a date idea through `ideaId`.
- A ritual completion points to a ritual through `ritualId`.
- Import merges records by `id`: new IDs are added, and an existing ID is replaced only if the incoming `updatedAt` is newer. See `src/features/import/`.
