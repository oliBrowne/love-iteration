import type * as ThreeNamespace from 'three';

export type ThreeModule = typeof ThreeNamespace;

/** What a piece hands back: a per-frame step and a way to free what it made. */
export interface StageScene {
  /** `t` is seconds since the stage mounted; `dt` is seconds since the last frame. */
  update(t: number, dt: number): void;
  dispose?(): void;
}

export interface StageContext {
  three: ThreeModule;
  scene: ThreeNamespace.Scene;
  camera: ThreeNamespace.PerspectiveCamera;
  renderer: ThreeNamespace.WebGLRenderer;
}

export type SceneSetup = (context: StageContext) => StageScene;

export interface StageOptions {
  /** Draw one composed frame at `stillTime` instead of animating. */
  reducedMotion?: boolean;
  stillTime?: number;
}

export interface MountedStage {
  dispose(): void;
}

/**
 * Owns the renderer, resize handling and the animation loop for one three.js piece.
 * Throws if WebGL is unavailable, so the caller can show a still instead.
 */
export function mountStage(
  container: HTMLElement,
  three: ThreeModule,
  setup: SceneSetup,
  { reducedMotion = false, stillTime = 0 }: StageOptions = {},
): MountedStage {
  const renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
  const canvas = renderer.domElement;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;

  let piece: StageScene;
  try {
    piece = setup({ three, scene, camera, renderer });
  } catch (error) {
    renderer.dispose();
    canvas.remove();
    throw error;
  }

  let frame = 0;
  let running = false;
  let visible = true;
  let disposed = false;
  const start = performance.now();
  let last = start;

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderOnce();
  }

  function renderOnce() {
    const now = performance.now();
    const t = reducedMotion ? stillTime : (now - start) / 1000;
    piece.update(t, reducedMotion ? 0 : Math.min((now - last) / 1000, 0.1));
    last = now;
    renderer.render(scene, camera);
  }

  function tick() {
    renderOnce();
    frame = requestAnimationFrame(tick);
  }

  function update() {
    const shouldRun = !reducedMotion && visible && !document.hidden;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(frame);
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const visibleObserver =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry?.isIntersecting ?? true;
          update();
        });
  visibleObserver?.observe(container);
  document.addEventListener('visibilitychange', update);
  resize();
  update();

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibleObserver?.disconnect();
      document.removeEventListener('visibilitychange', update);
      piece.dispose?.();
      scene.traverse((object) => {
        const mesh = object as Partial<ThreeNamespace.Mesh>;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : mesh.material
            ? [mesh.material]
            : [];
        for (const material of materials) material.dispose();
      });
      renderer.dispose();
      canvas.remove();
    },
  };
}
