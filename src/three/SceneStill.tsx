interface SceneStillProps {
  /** Plain-words description; also shown as the still's caption. */
  description: string;
  /** Top and bottom of the dusk sky. */
  sky?: readonly [string, string];
}

/**
 * A composed, non-blank stand-in for a three.js scene: a soft dusk sky with the scene described
 * in words. Used when WebGL is missing or three.js cannot load. A piece can pass a richer one.
 */
export function SceneStill({
  description,
  sky = ['#3b3a63', '#e9b7a8'],
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
        color: '#fffdf9',
      }}
    >
      <p
        aria-hidden="true"
        style={{
          margin: 0,
          fontSize: '1rem',
          textShadow: '0 1px 3px rgba(43, 37, 35, 0.7)',
        }}
      >
        {description}
      </p>
    </div>
  );
}
