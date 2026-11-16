/** A brightness (0–1) and colour (0–255 per channel) for one point of an ASCII scene. */
export interface FieldSample {
  brightness: number;
  r: number;
  g: number;
  b: number;
}

/**
 * A scene is a pure function from a position and time to a sample.
 * `x` and `y` run 0–1 across the frame; `aspect` is width over height of the frame
 * (so circles can stay round); `t` is seconds.
 */
export type Field = (
  x: number,
  y: number,
  t: number,
  aspect: number,
) => FieldSample;

export interface Cell {
  char: string;
  r: number;
  g: number;
  b: number;
}

/** Dark to bright. The first character is a blank so empty space stays quiet. */
export const DEFAULT_RAMP = ' .·:-=+*#%@';

/** Characters are about twice as tall as they are wide. */
export const CELL_ASPECT = 0.5;

/** Target width of one character in CSS pixels: 64 columns fit a 320px screen. */
export const TARGET_CELL_WIDTH = 5;

const MAX_COLUMNS = 160;
const MIN_COLUMNS = 24;

export interface Grid {
  cols: number;
  rows: number;
}

/** Picks a dense character grid for a frame of the given CSS width and height. */
export function gridFor(width: number, height: number): Grid {
  const cols = clamp(
    Math.round(width / TARGET_CELL_WIDTH),
    MIN_COLUMNS,
    MAX_COLUMNS,
  );
  const cellHeight = width / cols / CELL_ASPECT;
  const rows = Math.max(1, Math.round(height / cellHeight));
  return { cols, rows };
}

/** Maps a brightness to a ramp character. Out-of-range and invalid values are safe. */
export function pickChar(brightness: number, ramp = DEFAULT_RAMP): string {
  const level = Number.isFinite(brightness) ? clamp(brightness, 0, 1) : 0;
  return ramp.charAt(
    Math.min(ramp.length - 1, Math.floor(level * ramp.length)),
  );
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

function channel(value: number): number {
  return Number.isFinite(value) ? Math.round(clamp(value, 0, 255)) : 0;
}

/** Samples the field at the centre of every cell, row by row. */
export function renderField(
  field: Field,
  grid: Grid,
  t: number,
  ramp = DEFAULT_RAMP,
): Cell[] {
  const { cols, rows } = grid;
  const aspect = (cols * CELL_ASPECT) / rows;
  const cells: Cell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sample = field((col + 0.5) / cols, (row + 0.5) / rows, t, aspect);
      cells.push({
        char: pickChar(sample.brightness, ramp),
        r: channel(sample.r),
        g: channel(sample.g),
        b: channel(sample.b),
      });
    }
  }
  return cells;
}

/** Indexes of cells that differ, so only those need redrawing. All of them if sizes differ. */
export function changedCells(
  previous: readonly Cell[] | null,
  next: readonly Cell[],
): number[] {
  const changed: number[] = [];
  for (let i = 0; i < next.length; i++) {
    const before = previous?.[i];
    const after = next[i];
    if (!after) continue;
    if (
      !before ||
      before.char !== after.char ||
      before.r !== after.r ||
      before.g !== after.g ||
      before.b !== after.b
    ) {
      changed.push(i);
    }
  }
  return changed;
}
