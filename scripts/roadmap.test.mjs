import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseRoadmap } from './roadmap.mjs';

const fixture = (doneCount = 0) => Array.from({ length: 360 }, (_, index) =>
  `- [${index < doneCount ? 'x' : ' '}] L${String(index + 1).padStart(3, '0')} Task ${index + 1} — Done when check ${index + 1}.`
).join('\n');

test('finds the first task after a completed prefix', () => {
  const tasks = parseRoadmap(fixture(17));
  assert.equal(tasks.find((task) => !task.done)?.id, 'L018');
  assert.equal(tasks.filter((task) => task.done).length, 17);
});

test('rejects a gap in completed tasks', () => {
  const invalid = fixture(2).replace('- [ ] L003', '- [x] L003').replace('- [x] L002', '- [ ] L002');
  assert.throws(() => parseRoadmap(invalid), /earlier task is open/);
});

test('rejects missing or out-of-order IDs', () => {
  assert.throws(() => parseRoadmap(fixture().replace('L010', 'L011')), /out of order/);
  assert.throws(() => parseRoadmap(fixture().split('\n').slice(0, -1).join('\n')), /Expected 360/);
});
