import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export function parseRoadmap(markdown) {
  const tasks = markdown.split('\n').flatMap((line) => {
    if (!line.startsWith('- [')) return [];
    const match = /^- \[([ x])\] L(\d{3}) (.+) — Done when (.+)\.$/.exec(line);
    if (!match) throw new Error(`Malformed task: ${line}`);
    return [
      {
        id: `L${match[2]}`,
        title: match[3],
        check: match[4],
        done: match[1] === 'x',
      },
    ];
  });

  if (tasks.length !== 360)
    throw new Error(`Expected 360 tasks; found ${tasks.length}`);
  let seenOpen = false;
  tasks.forEach((task, index) => {
    if (task.id !== `L${String(index + 1).padStart(3, '0')}`) {
      throw new Error(
        `Task ID out of order at position ${index + 1}: ${task.id}`,
      );
    }
    if (!task.done) seenOpen = true;
    if (task.done && seenOpen)
      throw new Error(`${task.id} is complete while an earlier task is open`);
  });
  return tasks;
}

function main() {
  const command = process.argv[2] ?? 'next';
  if (!['next', 'check', 'summary'].includes(command)) {
    throw new Error('Usage: node scripts/roadmap.mjs [next|check|summary]');
  }
  const roadmapUrl = new URL('../ROADMAP.md', import.meta.url);
  const tasks = parseRoadmap(readFileSync(roadmapUrl, 'utf8'));
  const completed = tasks.filter((task) => task.done).length;
  if (command === 'check') console.log('Roadmap valid: 360 sequential tasks');
  if (command === 'summary') console.log(`${completed}/360 complete`);
  if (command === 'next') {
    const next = tasks.find((task) => !task.done);
    console.log(
      next
        ? `${next.id} ${next.title}\nDone when ${next.check}.`
        : 'All 360 tasks complete',
    );
  }
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
