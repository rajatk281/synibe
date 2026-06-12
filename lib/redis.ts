import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

const globalForRedis = globalThis as unknown as { redis: RedisClient };

export const redis: RedisClient =
  globalForRedis.redis ??
  createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

if (!globalForRedis.redis) {
  redis.on("error", (err) => console.error("[Redis] Client error:", err));
  redis.connect().catch((err) => {
    console.error("[Redis] Failed to connect:", err);
  });
  globalForRedis.redis = redis;
}
