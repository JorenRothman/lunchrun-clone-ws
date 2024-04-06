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
    const client = await createRedisClient();

    if (!client) {
        return;
    }

    try {
        redisLogger.info(`Setting key: ${key}`);
        await client.set(key, JSON.stringify(payload));
    } catch (error) {
        redisLogger.error(error);
    } finally {
        await client.quit();
    }
}

export async function get<T>(key: string, defaultValue: T) {
    redisLogger.info(`Getting key: ${key}`);

    const client = await createRedisClient();

    if (!client) {
        return defaultValue;
    }

    try {
        const state = await client.get(key);

        if (!state) {
            redisLogger.info(`Key not found: ${key}`);
            return defaultValue;
        }

        return JSON.parse(state);
    } catch (error) {
        redisLogger.error(error);
    } finally {
        await client.quit();
    }
}
