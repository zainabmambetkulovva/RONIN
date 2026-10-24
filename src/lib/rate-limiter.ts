import { NextRequest } from "next/server";
import { Redis } from "ioredis";

// Redis client для production
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

// Local fallback storage
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const localStore: RateLimitStore = {};
const localStoreCleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, data] of Object.entries(localStore)) {
    if (now > data.resetTime) {
      delete localStore[key];
    }
  }
}, 60 * 1000);

// Получить IP пользователя
function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         req.headers.get("x-real-ip") || 
         "unknown";
}

// Проверка rate limit
export async function checkRateLimit(
  req: NextRequest,
  key: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 минут
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const clientIP = getClientIP(req);
  const uniqueKey = `${key}:${clientIP}`;
  const now = Date.now();

  // Используем Redis если доступен
  if (redis) {
    try {
      const current = await redis.get(uniqueKey);
      const resetAt = await redis.ttl(uniqueKey);

      if (current === null) {
        await redis.set(uniqueKey, "1", "EX", Math.ceil(windowMs / 1000));
        return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
      }

      const count = parseInt(current, 10);
      if (count >= limit) {
        return { allowed: false, remaining: 0, resetAt: now + (resetAt * 1000) };
      }

      await redis.incr(uniqueKey);
      return { allowed: true, remaining: limit - count - 1, resetAt: now + (resetAt * 1000) };
    } catch (error) {
      console.error("Redis rate limit error, falling back to local:", error);
    }
  }

  // Local fallback
  if (!localStore[uniqueKey] || now > localStore[uniqueKey].resetTime) {
    localStore[uniqueKey] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  localStore[uniqueKey].count++;

  if (localStore[uniqueKey].count > limit) {
    return { allowed: false, remaining: 0, resetAt: localStore[uniqueKey].resetTime };
  }

  return { 
    allowed: true, 
    remaining: limit - localStore[uniqueKey].count, 
    resetAt: localStore[uniqueKey].resetTime 
  };
}

// Создать заголовки rate limit
export function createRateLimitHeaders(remaining: number, resetAt: number) {
  return {
    "X-RateLimit-Limit": "5",
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(resetAt / 1000).toString(),
  };
}

// Создать ошибку rate limit
export function rateLimitError(remaining: number, resetAt: number) {
  return {
    error: "Слишком много попыток. Повторите позже.",
    retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
  };
}
