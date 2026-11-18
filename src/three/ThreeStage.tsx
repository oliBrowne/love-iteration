import { useEffect, useRef, useState } from 'react';
import { loadThree } from './loadThree';
import { mountStage, type SceneSetup } from './stage';

interface ThreeStageProps {
  setup: SceneSetup;
  /** Plain-words description for screen readers. */
  description: string;
  reducedMotion?: boolean;
  stillTime?: number;
  /** Shown if three.js or WebGL cannot start. */
  fallback?: React.ReactNode;
}

/** Mounts a three.js scene, keeps it sized to its box, and frees it when left. */
export function ThreeStage({
  setup,
  description,
  reducedMotion = false,
  stillTime = 0,
  fallback = null,
}: ThreeStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
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
  }, [setup, reducedMotion, stillTime]);

  if (failed) return <>{fallback}</>;
  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={description}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
