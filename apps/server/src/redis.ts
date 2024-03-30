import Redis from "ioredis";
import { env } from "./env";
import { redisLogger } from "@/logger";

export async function createRedisClient() {
    const redis = new Redis(env.REDIS_URL);

    redis.on("error", (err) => {
        redisLogger.error(err);
    });

    redis.on("connect", () => {
        redisLogger.info("Connected to Redis");
    });

    redis.on("close", () => {
        redisLogger.info("Closed connection to Redis");
    });

    return redis;
}

export async function set<T>(key: string, payload: T) {
    redisLogger.info(`Setting key: ${key}`);

    const client = await createRedisClient();

    await client.set(key, JSON.stringify(payload));

    await client.quit();
}

export async function get<T>(key: string, defaultValue: T): Promise<T> {
    redisLogger.info(`Getting key: ${key}`);

    const client = await createRedisClient();

    const state = await client.get(key);

    await client.quit();

    if (!state) {
        redisLogger.info(`Key not found: ${key}`);
        return defaultValue;
    }

    return JSON.parse(state);
}
