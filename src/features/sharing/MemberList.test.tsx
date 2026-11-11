// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemberList } from './MemberList.tsx';

afterEach(cleanup);

describe('MemberList', () => {
  it('names each current member and marks the owner', () => {
    render(
      <MemberList
        members={[
          { id: 'a1', name: 'Demo One', role: 'owner' },
          { id: 'a2', name: 'Demo Two', role: 'member' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem').map((i) => i.textContent);
    expect(items).toEqual(['Demo One (owner)', 'Demo Two']);
  });

  it('says so when nobody else is in the space', () => {
    render(<MemberList members={[]} />);
    expect(screen.getByText('Just you for now.')).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
