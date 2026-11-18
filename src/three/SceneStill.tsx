interface SceneStillProps {
  /** Plain-words description; also shown as the still's caption. */
  description: string;
  /** Top and bottom of the sky, as CSS colours. Defaults to the dusk tokens. */
  sky?: readonly [string, string];
}

/**
 * A composed, non-blank stand-in for a three.js scene: a soft dusk sky with the scene described
 * in words. Used when WebGL is missing or three.js cannot load. A piece can pass a richer one.
 */
export function SceneStill({
  description,
  sky = ['var(--color-dusk-deep)', 'var(--color-dusk-glow)'],
}: SceneStillProps) {
  return (
    <div
      role="img"
      aria-label={description}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        boxSizing: 'border-box',
        padding: '1rem',
        background: `linear-gradient(180deg, ${sky[0]}, ${sky[1]})`,
        color: 'var(--color-dusk-star)',
      }}
    >
      <p
        aria-hidden="true"
        style={{
          margin: 0,
          fontSize: '1rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.5rem',
          background:
            'color-mix(in srgb, var(--color-dusk-deep) 85%, transparent)',
        }}
      >
        {description}
      </p>
    </div>
  );
}
