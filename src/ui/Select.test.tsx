// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Select } from './Select.tsx';

afterEach(cleanup);

describe('Select', () => {
  it('labels the select and lists its options', () => {
    render(
      <Select
        label="Category"
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />,
    );
    const select = screen.getByLabelText('Category');
    expect(select.querySelectorAll('option')).toHaveLength(2);
  });
});
