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

// "Today", "Yesterday", or a readable date such as "Jan 3, 2026" for a YYYY-MM-DD day.
export function formatDateLabel(
  date: string,
  now: Date = new Date(),
  locale?: string,
): string {
  if (date === localDate(now)) return 'Today';
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  if (date === localDate(yesterday)) return 'Yesterday';
  const [year = 0, month = 1, day = 1] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
