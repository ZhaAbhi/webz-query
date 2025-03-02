import { createClient, RedisClientType } from "redis";
import * as dotenv from "dotenv";

dotenv.config();

const redisClient: RedisClientType = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on("error", (err) => console.log("Redis client error", err));

export async function initRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis connected successfully!");
  }
}

export { redisClient };
