import type { ReactNode } from 'react';

// Give it an `id` and point a field's aria-describedby at it, so a screen
// reader reads the error again when the person returns to that field.
export function InlineError({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <p className="inline-error" role="alert" id={id}>
      {children}
    </p>
  );
}
