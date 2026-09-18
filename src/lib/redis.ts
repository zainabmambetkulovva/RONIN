import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// Key helpers
export const RedisKeys = {
  computerAvailability: (computerId: string) => `computer:availability:${computerId}`,
  bookingLock: (computerId: string, startAt: string) => `booking:lock:${computerId}:${startAt}`,
  otpCode: (phone: string) => `otp:${phone}`,
  session: (tokenHash: string) => `session:${tokenHash}`,
  allComputersStatus: () => "computers:all:status",
};
