import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The app never scores people or judges a partner. This scans the shipped
// source for phrases that would claim or imply a rating of someone's effort.
const banned: RegExp[] = [
  /\bscore[sd]?\b/i,
  /\brating\b/i,
  /\bleaderboard\b/i,
  /\bcompatib/i,
  /\brelationship health\b/i,
  /\byour partner (is|isn't|doesn't|never|always|should)\b/i,
  /\byou (are|were) (a )?(bad|failing|neglecting)\b/i,
  /\b(better|worse) than (your|other) /i,
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    const isCode = /\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name);
    return isCode ? [path] : [];
  });
}

describe('no-judgment copy', () => {
  it('has a source list to scan', () => {
    expect(sourceFiles('src').length).toBeGreaterThan(10);
  });

  it.each(banned.map((pattern) => [String(pattern), pattern] as const))(
    'ships no copy matching %s',
    (_name, pattern) => {
      const hits = sourceFiles('src').filter((file) =>
        pattern.test(readFileSync(file, 'utf8')),
      );
      expect(hits).toEqual([]);
    },
  );
});
