// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountStage, type ThreeModule } from './stage';

const calls: string[] = [];

class FakeRenderer {
  domElement = document.createElement('canvas');
  setPixelRatio() {}
  setSize(w: number, h: number) {
    calls.push(`size ${w}x${h}`);
  }
  render() {
    calls.push('render');
  }
  dispose() {
    calls.push('renderer.dispose');
  }
}
class FakeScene {
  children: { geometry: { dispose(): void }; material: { dispose(): void } }[] =
    [];
  traverse(fn: (o: unknown) => void) {
    this.children.forEach(fn);
  }
}
class FakeCamera {
  position = { z: 0 };
  aspect = 1;
  updateProjectionMatrix() {}
}
const fakeThree = {
  WebGLRenderer: FakeRenderer,
  Scene: FakeScene,
  PerspectiveCamera: FakeCamera,
} as unknown as ThreeModule;

let resizeCallback: () => void = () => {};

beforeEach(() => {
  calls.length = 0;
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(cb: () => void) {
        resizeCallback = cb;
      }
      observe() {}
      disconnect() {
        calls.push('resize.disconnect');
      }
    },
  );
  vi.stubGlobal('requestAnimationFrame', () => 1);
  vi.stubGlobal('cancelAnimationFrame', () => {});
});
afterEach(() => vi.unstubAllGlobals());

function box(width: number, height: number) {
  const el = document.createElement('div');
  Object.defineProperty(el, 'clientWidth', { value: width, writable: true });
  Object.defineProperty(el, 'clientHeight', { value: height, writable: true });
  return el;
}

describe('mountStage', () => {
  it('mounts a canvas, sizes it, and draws a first frame', () => {
    const el = box(320, 240);
    mountStage(el, fakeThree, () => ({ update() {} }));
    expect(el.querySelector('canvas')).not.toBeNull();
    expect(calls).toContain('size 320x240');
    expect(calls).toContain('render');
  });

  it('resizes when its box changes', () => {
    const el = box(320, 240);
    mountStage(el, fakeThree, () => ({ update() {} }));
    Object.defineProperty(el, 'clientWidth', { value: 600 });
    resizeCallback();
    expect(calls).toContain('size 600x240');
  });

  it('holds one still frame at the given time under reduced motion', () => {
    const times: number[] = [];
    mountStage(
      box(100, 100),
      fakeThree,
      () => ({ update: (t) => times.push(t) }),
      { reducedMotion: true, stillTime: 7 },
    );
    expect(times.every((t) => t === 7)).toBe(true);
  });

  it('disposes the piece, observers, renderer and canvas, once', () => {
    const el = box(100, 100);
    const pieceDispose = vi.fn();
    const stage = mountStage(el, fakeThree, () => ({
      update() {},
      dispose: pieceDispose,
    }));
    stage.dispose();
    stage.dispose();
    expect(pieceDispose).toHaveBeenCalledTimes(1);
    expect(calls.filter((c) => c === 'renderer.dispose')).toHaveLength(1);
    expect(calls).toContain('resize.disconnect');
    expect(el.querySelector('canvas')).toBeNull();
  });

  it('cleans up and rethrows if the scene fails to build', () => {
    const el = box(100, 100);
    expect(() =>
      mountStage(el, fakeThree, () => {
        throw new Error('boom');
      }),
    ).toThrow('boom');
    expect(el.querySelector('canvas')).toBeNull();
    expect(calls).toContain('renderer.dispose');
  });
});
