const idPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function generateId(): string {
  return crypto.randomUUID();
}

export function isValidId(value: string): boolean {
  return idPattern.test(value);
}
