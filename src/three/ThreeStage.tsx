import { useEffect, useRef, useState } from 'react';
import { loadThree } from './loadThree';
import { useReducedMotion } from '../useReducedMotion';
import { SceneStill } from './SceneStill';
import { mountStage, type SceneSetup } from './stage';
import { webglAvailable } from './webgl';

interface ThreeStageProps {
  setup: SceneSetup;
  /** Plain-words description for screen readers. */
  description: string;
  /** Defaults to the device's reduced-motion setting. */
  reducedMotion?: boolean;
  stillTime?: number;
  /** Shown if three.js or WebGL cannot start. Defaults to a plain dusk still. */
  fallback?: React.ReactNode;
}

/** Mounts a three.js scene, keeps it sized to its box, and frees it when left. */
export function ThreeStage({
  setup,
  description,
  reducedMotion: reducedMotionProp,
  stillTime = 0,
  fallback,
}: ThreeStageProps) {
  const deviceReducedMotion = useReducedMotion();
  const reducedMotion = reducedMotionProp ?? deviceReducedMotion;
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(() => !webglAvailable());

  useEffect(() => {
    const container = containerRef.current;
    if (!container || failed) return;
    let cancelled = false;
    let stage: { dispose(): void } | undefined;
    loadThree()
      .then((three) => {
        if (cancelled) return;
        stage = mountStage(container, three, setup, {
          reducedMotion,
          stillTime,
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      stage?.dispose();
    };
  }, [setup, reducedMotion, stillTime, failed]);

  if (failed) {
    return <>{fallback ?? <SceneStill description={description} />}</>;
  }
  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={description}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
