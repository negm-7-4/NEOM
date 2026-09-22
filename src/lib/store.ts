import "server-only";

/**
 * Tiny key/value abstraction backing the rate limiter and the idempotency
 * guard.
 *
 * Why an abstraction instead of a plain `Map`: on a serverless platform
 * (Vercel, Netlify, Cloudflare) every cold start gets a fresh process and
 * concurrent requests can land on different instances, so an in-process Map
 * silently stops enforcing anything under real traffic. When
 * `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are configured the
 * store becomes shared and correct across instances; otherwise it degrades to
 * a per-instance in-memory store, which is genuinely sufficient for a single
 * long-lived Node server (`next start`, a container, a VPS) and is the
 * documented fallback in the README.
 *
 * Implemented over Upstash's REST API with `fetch` rather than an SDK so the
 * dependency list stays limited to packages the features actually need.
 */

export interface KvStore {
  /** Redis `SET key value NX EX ttl`. Resolves true when the key was created. */
  setIfAbsent(key: string, value: string, ttlSeconds: number): Promise<boolean>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
  /** Redis `INCR` with a TTL applied on first increment. Returns the new count. */
  incr(key: string, ttlSeconds: number): Promise<number>;
  readonly kind: "redis" | "memory";
}

/* ---------------------------------------------------------------- memory -- */

interface Entry {
  value: string;
  expiresAt: number;
}

const MAX_KEYS = 5_000;

class MemoryStore implements KvStore {
  readonly kind = "memory" as const;
  private map = new Map<string, Entry>();

  private sweep() {
    const now = Date.now();
    for (const [key, entry] of this.map) {
      if (entry.expiresAt <= now) this.map.delete(key);
    }
    // Hard cap so a flood of unique keys cannot grow the heap without bound.
    if (this.map.size > MAX_KEYS) {
      const excess = this.map.size - MAX_KEYS;
      let removed = 0;
      for (const key of this.map.keys()) {
        this.map.delete(key);
        if (++removed >= excess) break;
      }
    }
  }

  private read(key: string): Entry | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.map.delete(key);
      return undefined;
    }
    return entry;
  }

  async setIfAbsent(key: string, value: string, ttlSeconds: number) {
    this.sweep();
    if (this.read(key)) return false;
    this.map.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    return true;
  }

  async get(key: string) {
    return this.read(key)?.value ?? null;
  }

  async set(key: string, value: string, ttlSeconds: number) {
    this.sweep();
    this.map.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  async del(key: string) {
    this.map.delete(key);
  }

  async incr(key: string, ttlSeconds: number) {
    this.sweep();
    const existing = this.read(key);
    const next = existing ? Number(existing.value) + 1 : 1;
    this.map.set(key, {
      value: String(next),
      expiresAt: existing ? existing.expiresAt : Date.now() + ttlSeconds * 1000,
    });
    return next;
  }
}

/* ----------------------------------------------------------------- redis -- */

class UpstashStore implements KvStore {
  readonly kind = "redis" as const;

  constructor(
    private readonly url: string,
    private readonly token: string,
  ) {}

  private async command<T>(command: (string | number)[]): Promise<T> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Upstash request failed with status ${response.status}`);
    }
    const payload = (await response.json()) as { result: T; error?: string };
    if (payload.error) throw new Error(payload.error);
    return payload.result;
  }

  async setIfAbsent(key: string, value: string, ttlSeconds: number) {
    const result = await this.command<string | null>([
      "SET",
      key,
      value,
      "NX",
      "EX",
      ttlSeconds,
    ]);
    return result === "OK";
  }

  async get(key: string) {
    return this.command<string | null>(["GET", key]);
  }

  async set(key: string, value: string, ttlSeconds: number) {
    await this.command(["SET", key, value, "EX", ttlSeconds]);
  }

  async del(key: string) {
    await this.command(["DEL", key]);
  }

  async incr(key: string, ttlSeconds: number) {
    const count = await this.command<number>(["INCR", key]);
    if (count === 1) await this.command(["EXPIRE", key, ttlSeconds]);
    return count;
  }
}

/* --------------------------------------------------------------- factory -- */

declare global {
  // Survives Next.js dev hot-reloads so the limiter is not reset on every edit.
  var __neomKvStore: KvStore | undefined;
}

export function getStore(): KvStore {
  if (globalThis.__neomKvStore) return globalThis.__neomKvStore;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const store: KvStore =
    url && token ? new UpstashStore(url, token) : new MemoryStore();

  globalThis.__neomKvStore = store;
  return store;
}
