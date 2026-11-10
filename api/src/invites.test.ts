import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createInvite, hashInviteToken } from './invites.ts';
import { createSpace } from './spaces.ts';
import { closeTestDbs, createTestDb } from './testDb.ts';

after(closeTestDbs);

function setup() {
  const db = createTestDb();
  const add = db.prepare(
    'INSERT INTO accounts (id, display_name, password_hash, created_at, updated_at, handle) VALUES (?, ?, ?, ?, ?, ?)',
  );
  add.run('a1', 'Demo One', 'h', 'now', 'now', 'one');
  add.run('a2', 'Demo Two', 'h', 'now', 'now', 'two');
  return { db, space: createSpace(db, 'a1', 'Demo space') };
}

test('the owner gets a link; only its hash is stored', () => {
  const { db, space } = setup();
  const invite = createInvite(db, 'a1', space.id);
  assert.notEqual(invite, 'not_owner');
  if (invite === 'not_owner') return;
  const token = invite.link.replace('/invite/', '');
  assert.ok(token.length >= 40);
  const rows = db.prepare('SELECT * FROM invites').all();
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.token_hash, hashInviteToken(token));
  assert.ok(!JSON.stringify(rows).includes(token));
  assert.equal(rows[0]?.space_id, space.id);
});

test('each invite has its own link', () => {
  const { db, space } = setup();
  const a = createInvite(db, 'a1', space.id);
  const b = createInvite(db, 'a1', space.id);
  assert.notDeepEqual(a, b);
});

test('a non-owner or an unknown space gets no invite', () => {
  const { db, space } = setup();
  assert.equal(createInvite(db, 'a2', space.id), 'not_owner');
  db.prepare('INSERT INTO memberships VALUES (?, ?, ?, ?)').run(
    space.id,
    'a2',
    'member',
    'now',
  );
  assert.equal(createInvite(db, 'a2', space.id), 'not_owner');
  assert.equal(createInvite(db, 'a1', 'missing'), 'not_owner');
  assert.equal(db.prepare('SELECT * FROM invites').all().length, 0);
});
