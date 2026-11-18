// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThreeStage } from './ThreeStage';
import { useReducedMotion } from '../useReducedMotion';
import { createElement } from 'react';

afterEach(() => vi.unstubAllGlobals());

describe('ThreeStage fallback', () => {
  it('shows a described still, not a blank, when WebGL is missing', () => {
    // jsdom has no WebGL, so getContext gives nothing.
    render(
      <ThreeStage
        setup={() => ({ update() {} })}
        description="Lanterns rising through a dusk sky"
      />,
    );
    expect(
      screen.getByRole('img', { name: 'Lanterns rising through a dusk sky' }),
    ).toBeTruthy();
    expect(screen.getByText('Lanterns rising through a dusk sky')).toBeTruthy();
  });

  it('uses a piece-supplied still when given one', () => {
    render(
      <ThreeStage
        setup={() => ({ update() {} })}
        description="x"
        fallback={<p>custom still</p>}
      />,
    );
    expect(screen.getByText('custom still')).toBeTruthy();
  });
});

describe('useReducedMotion', () => {
  function Probe() {
    return createElement('p', null, String(useReducedMotion()));
  }

  it('follows the device setting', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }));
    render(<Probe />);
    expect(screen.getByText('true')).toBeTruthy();
  });

  it('is false when matchMedia is missing', () => {
    vi.stubGlobal('matchMedia', undefined);
    render(<Probe />);
    expect(screen.getByText('false')).toBeTruthy();
  });
});
