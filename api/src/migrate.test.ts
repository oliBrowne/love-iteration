import assert from 'node:assert/strict';
import { test } from 'node:test';
import { openDb } from './db.ts';
import { getSchemaVersion, runMigrations } from './migrate.ts';

const steps = [
  { version: 1, sql: 'CREATE TABLE a (id INTEGER PRIMARY KEY)' },
  { version: 2, sql: 'CREATE TABLE b (id INTEGER PRIMARY KEY)' },
];

test('the schema version advances exactly once per migration', () => {
  const db = openDb(':memory:');
  assert.equal(getSchemaVersion(db), 0);
  assert.deepEqual(runMigrations(db, steps), [1, 2]);
  assert.equal(getSchemaVersion(db), 2);
  // Running again changes nothing (and would fail if it re-ran CREATE TABLE).
  assert.deepEqual(runMigrations(db, steps), []);
  assert.equal(getSchemaVersion(db), 2);
  db.close();
});

test('a failing migration is rolled back and the version stays', () => {
  const db = openDb(':memory:');
  runMigrations(db, [steps[0]!]);
  const bad = [
    steps[0]!,
    { version: 2, sql: 'CREATE TABLE c (id INTEGER); NOT VALID SQL' },
  ];
  assert.throws(() => runMigrations(db, bad));
  assert.equal(getSchemaVersion(db), 1);
  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE name = 'c'")
    .all();
  assert.equal(tables.length, 0);
  db.close();
});

test('gaps in version numbers are rejected', () => {
  const db = openDb(':memory:');
  assert.throws(() => runMigrations(db, [{ version: 2, sql: 'SELECT 1' }]));
  db.close();
});
