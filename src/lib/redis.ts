import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    const url = process.env.REDIS_URL || process.env.storage_REDIS_URL;
    if (!url) throw new Error("REDIS_URL or storage_REDIS_URL not set");
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 5000,
      retryStrategy(times) {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 200, 2000);
      },
    });
  }
  return redis;
}
