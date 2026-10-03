export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <p className="loading-state" role="status" aria-busy="true">
      {label}
    </p>
  );
}
