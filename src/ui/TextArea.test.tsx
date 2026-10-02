// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { TextArea } from './TextArea.tsx';

afterEach(cleanup);

describe('TextArea', () => {
  it('connects its label to the textarea', () => {
    render(<TextArea label="A little note" />);
    const control = screen.getByLabelText('A little note');
    expect(control.tagName).toBe('TEXTAREA');
  });
});
