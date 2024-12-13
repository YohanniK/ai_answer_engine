import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

export async function cacheData(key: string, value: object, expiry = 3600) {
  await redis.set(key, JSON.stringify(value), { ex: expiry });
}

export async function getCachedData(key: string) {
  const data = await redis.get(key);
  return data ? data : null;
}
