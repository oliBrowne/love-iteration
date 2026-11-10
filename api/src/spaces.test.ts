import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { checkSpaceName, createSpace } from './spaces.ts';
import { closeTestDbs, createTestDb } from './testDb.ts';

after(closeTestDbs);

test('a space name is trimmed and must be 1 to 80 characters', () => {
  assert.equal(checkSpaceName('  Demo space '), 'Demo space');
  assert.equal(checkSpaceName('   '), undefined);
  assert.equal(checkSpaceName('x'.repeat(81)), undefined);
  assert.equal(checkSpaceName(42), undefined);
});

test('the creator becomes the owner of the new space', () => {
  const db = createTestDb();
  db.prepare(
    'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
  ).run('a1', 'Demo One', 'h', 'now', 'now', 'one');
  const space = createSpace(db, 'a1', 'Demo space');
  assert.equal(space.role, 'owner');
  const member = db
    .prepare(
      'SELECT role FROM memberships WHERE space_id = ? AND account_id = ?',
    )
    .get(space.id, 'a1');
  assert.equal(member?.role, 'owner');
  assert.equal(
    db.prepare('SELECT created_by FROM spaces WHERE id = ?').get(space.id)
      ?.created_by,
    'a1',
  );
});
