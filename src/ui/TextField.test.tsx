// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { TextField } from './TextField.tsx';

afterEach(cleanup);

describe('TextField', () => {
  it('connects its label to the input', () => {
    render(<TextField label="Your name" />);
    const input = screen.getByLabelText('Your name');
    expect(input.tagName).toBe('INPUT');
  });
});
