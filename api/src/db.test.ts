import assert from 'node:assert/strict';
import { test } from 'node:test';
import { openDb } from './db.ts';

test('an in-memory database opens, stores and reads a row', () => {
  const db = openDb(':memory:');
  try {
    db.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT NOT NULL)');
    db.prepare('INSERT INTO t (name) VALUES (?)').run('demo');
    const row = db.prepare('SELECT name FROM t').get();
    assert.deepEqual({ ...row }, { name: 'demo' });
  } finally {
    db.close();
  }
});

test('foreign keys are enforced', () => {
  const db = openDb(':memory:');
  try {
    const row = db.prepare('PRAGMA foreign_keys').get();
    assert.equal(row?.foreign_keys, 1);
  } finally {
    db.close();
  }
});
