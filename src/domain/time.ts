export function nowIso(): string {
  return new Date().toISOString();
}

// Today's calendar day in the person's own timezone, as YYYY-MM-DD.
export function localDate(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// A stored ISO timestamp as a short local time, e.g. "3:07 PM".
export function formatLocalTime(iso: string, locale?: string): string {
  return new Date(iso).toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
