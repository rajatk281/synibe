import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

const globalForRedis = globalThis as unknown as { redis: RedisClient };

function getRedisClient(): RedisClient {
  let url = process.env.REDIS_URL || "redis://localhost:6379";

  // Sanitize protocol if the user provided an Upstash REST URL (https://) instead of standard Redis TCP URL
  if (url.startsWith("https://")) {
    url = url.replace(/^https:\/\//, "rediss://");
  } else if (url.startsWith("http://")) {
    url = url.replace(/^http:\/\//, "redis://");
  }

  if (url.includes("upstash.io") && !url.includes("@")) {
    console.warn(
      "\n⚠️  [Redis] Warning: Your REDIS_URL points to Upstash but does not contain credentials (no '@' character found). Upstash requires authentication. Please use the Redis URL format: rediss://default:YOUR_PASSWORD@host:port\n"
    );
  }

  try {
    return createClient({ url });
  } catch (err) {
    console.error("[Redis] Failed to create Redis client with url:", url, err);
    // Return a mock client to prevent build-time and runtime crashes
    return {
      on: () => {},
      connect: async () => {},
      get: async () => null,
      set: async () => "OK",
      hSet: async () => 0,
      hDel: async () => 0,
      hGetAll: async () => ({}),
      rPush: async () => 0,
      lTrim: async () => "OK",
      lRange: async () => [],
      del: async () => 0,
    } as any;
  }
}

export const redis: RedisClient = globalForRedis.redis ?? getRedisClient();

if (!globalForRedis.redis) {
  try {
    redis.on("error", (err) => console.error("[Redis] Client error:", err));
    redis.connect().catch((err) => {
      console.error("[Redis] Failed to connect:", err);
    });
  } catch (err) {
    console.error("[Redis] Failed to initialize connection:", err);
  }
  globalForRedis.redis = redis;
}

