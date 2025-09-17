export function parseJsonSafe<T = any>(s: string | undefined): T | null {
  if (!s) return null;
  try { return JSON.parse(s) as T; } catch { return null; }
}

export function rollInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
