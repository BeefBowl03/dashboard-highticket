type CacheEntry<T> = { value: T; expiresAt: number };

export class TTLCache<T> {
  private store: Map<string, CacheEntry<T>> = new Map();
  constructor(private defaultTtlMs: number = 60_000) {}

  get(key: string): T | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (hit.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return hit.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.store.set(key, { value, expiresAt });
  }

  makeKey(parts: unknown[]): string {
    return Buffer.from(JSON.stringify(parts)).toString("base64url");
  }
}
