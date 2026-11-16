import { useEffect, useRef } from 'react';
import {
  changedCells,
  gridFor,
  renderField,
  type Cell,
  type Field,
} from './field';

interface AsciiCanvasProps {
  field: Field;
  /** Plain-words description for screen readers. */
  description: string;
  /** Holds one composed frame at this time (seconds) instead of animating. */
  reducedMotion?: boolean;
  stillTime?: number;
  background?: string;
}

/** Draws a field as coloured text. Redraws only the cells that changed, and pauses when hidden. */
export function AsciiCanvas({
  field,
  description,
  reducedMotion = false,
  stillTime = 0,
  background = '#2b2523',
}: AsciiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let cells: Cell[] | null = null;
    let cols = 0;
    let cellW = 0;
    let cellH = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    const start = performance.now();

    function resize() {
      if (!canvas || !context) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const grid = gridFor(width, height);
      cols = grid.cols;
      cellW = width / grid.cols;
      cellH = height / grid.rows;
      context.font = `${cellH}px ui-monospace, Menlo, Consolas, monospace`;
      context.textBaseline = 'top';
      context.textAlign = 'center';
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      cells = null;
      draw(reducedMotion ? stillTime : (performance.now() - start) / 1000);
    }

    function draw(t: number) {
      if (!canvas || !context || !cols) return;
      const grid = gridFor(canvas.clientWidth, canvas.clientHeight);
      const next = renderField(field, grid, t);
      for (const i of changedCells(cells, next)) {
        const cell = next[i];
        if (!cell) continue;
        const x = (i % cols) * cellW;
        const y = Math.floor(i / cols) * cellH;
        context.fillStyle = background;
        context.fillRect(x, y, cellW + 0.5, cellH + 0.5);
        if (cell.char !== ' ') {
          context.fillStyle = `rgb(${cell.r},${cell.g},${cell.b})`;
          context.fillText(cell.char, x + cellW / 2, y);
        }
      }
      cells = next;
    }

    function tick() {
      draw((performance.now() - start) / 1000);
      frame = requestAnimationFrame(tick);
    }

    function update() {
      const shouldRun = !reducedMotion && visible && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        frame = requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    }

    resize();
    update();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibleObserver =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? true;
            update();
          });
    visibleObserver?.observe(canvas);
    document.addEventListener('visibilitychange', update);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibleObserver?.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [field, reducedMotion, stillTime, background]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={description}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
