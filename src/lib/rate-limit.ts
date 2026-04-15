import { getRedis } from "@/lib/redis";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
  failClosed = false
): Promise<RateLimitResult> {
  try {
    const redis = getRedis();
    const redisKey = `rl:${key}`;

    // Atomic INCR + EXPIRE via pipeline to avoid TOCTOU
    const pipeline = redis.pipeline();
    pipeline.incr(redisKey);
    pipeline.expire(redisKey, windowSeconds);
    pipeline.ttl(redisKey);
    const results = await pipeline.exec();

    const count = (results?.[0]?.[1] as number) ?? 1;
    const ttl = (results?.[2]?.[1] as number) ?? windowSeconds;

    if (count > maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: ttl > 0 ? ttl : windowSeconds,
      };
    }

    return {
      allowed: true,
      remaining: maxRequests - count,
      retryAfter: 0,
    };
  } catch {
    // failClosed: deny on Redis failure (for auth brute-force protection)
    // failOpen: allow on Redis failure (for general rate limiting)
    if (failClosed) {
      return { allowed: false, remaining: 0, retryAfter: 60 };
    }
    return { allowed: true, remaining: maxRequests, retryAfter: 0 };
  }
}
