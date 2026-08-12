interface RateLimitRecord {
  timestamps: number[];
}

const loginStore = new Map<string, RateLimitRecord>();
const registerStore = new Map<string, RateLimitRecord>();

/**
 * Basic in-memory IP-based rate limiter
 * - 'login': Max 5 attempts per minute
 * - 'register': Max 10 registrations per hour
 */
export function isAllowed(ip: string, action: 'login' | 'register'): boolean {
  const now = Date.now();
  const limit = action === 'login' ? 5 : 10;
  const windowMs = action === 'login' ? 60 * 1000 : 60 * 60 * 1000;
  const store = action === 'login' ? loginStore : registerStore;

  let record = store.get(ip);
  if (!record) {
    record = { timestamps: [] };
    store.set(ip, record);
  }

  // Remove timestamps outside of the current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    return false;
  }

  record.timestamps.push(now);
  return true;
}
