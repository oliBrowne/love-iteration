// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { InvitePermissions } from './InvitePermissions.tsx';

afterEach(cleanup);

describe('InvitePermissions', () => {
  it('names the space and says nothing is shared before accepting', () => {
    render(<InvitePermissions spaceName="Demo space" />);
    expect(screen.getByText(/shared space “Demo space”/)).toBeTruthy();
    expect(screen.getByText(/Nothing is shared until you accept/)).toBeTruthy();
  });

  it('lists what is visible, what stays private, and how to leave', () => {
    render(<InvitePermissions spaceName="Demo space" />);
    expect(screen.getByText('Your name in the member list.')).toBeTruthy();
    expect(screen.getByText(/Your personal entries\. They stay/)).toBeTruthy();
    expect(screen.getByText(/leave the space at any time/)).toBeTruthy();
    expect(screen.getAllByRole('list')).toHaveLength(2);
  });
});
