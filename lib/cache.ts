import redis from "./redis";

const DEFAULT_TTL = 300;

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? (JSON.parse(data) as T) : null;
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = DEFAULT_TTL
): Promise<void> {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

export async function deleteCacheByPattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}