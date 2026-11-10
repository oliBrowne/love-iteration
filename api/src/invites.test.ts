import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import {
  createInvite,
  defaultInviteHours,
  findInvite,
  hashInviteToken,
  parseInviteHours,
} from './invites.ts';
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

test('hours: missing means the default, bad values are refused', () => {
  assert.equal(parseInviteHours(null), defaultInviteHours);
  assert.equal(parseInviteHours('1'), 1);
  assert.equal(parseInviteHours('720'), 720);
  for (const bad of ['0', '721', '-3', '1.5', 'abc', '', '99999']) {
    assert.equal(parseInviteHours(bad), undefined, bad);
  }
});

test('an expired token cannot be accepted', () => {
  const { db, space } = setup();
  const start = Date.parse('2030-01-01T00:00:00Z');
  const hour = 60 * 60 * 1000;
  const invite = createInvite(db, 'a1', space.id, 2, () => start);
  assert.notEqual(invite, 'not_owner');
  if (invite === 'not_owner') return;
  assert.equal(invite.expiresAt, '2030-01-01T02:00:00.000Z');
  const token = invite.link.replace('/invite/', '');
  assert.deepEqual(
    findInvite(db, token, () => start + hour),
    {
      inviteId: invite.id,
      spaceId: space.id,
    },
  );
  assert.equal(
    findInvite(db, token, () => start + 2 * hour),
    'expired',
  );
  assert.equal(
    findInvite(db, token, () => start + 3 * hour),
    'expired',
  );
  assert.equal(findInvite(db, 'not-a-token'), 'unknown');
});
