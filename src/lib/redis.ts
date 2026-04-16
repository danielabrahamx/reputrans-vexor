import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (redis && redis.status === "end") {
    // Connection permanently closed - replace the dead singleton
    redis = null;
  }
  if (!redis) {
    const url = process.env.REDIS_URL || process.env.storage_REDIS_URL;
    if (!url) throw new Error("REDIS_URL or storage_REDIS_URL not set");
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
      retryStrategy(times) {
        return Math.min(times * 500, 5000);
      },
    });
  }
  return redis;
}
