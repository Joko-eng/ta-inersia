import redis from "./redis";

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 24 * 60 * 60;

export async function isRateLimited(ip: string): Promise<boolean> {
  const key = `rate:login:${ip}`;
  const attempts = await redis.incr(key);

  if (attempts === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  return attempts > MAX_ATTEMPTS;
}