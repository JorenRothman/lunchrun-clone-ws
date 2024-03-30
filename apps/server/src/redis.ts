import Redis from "ioredis";
import { env } from "./env";

export async function createRedisClient() {
    const redis = new Redis(env.REDIS_URL);

    redis.on("error", (err) => {
        console.error("Redis error:", err);
    });

    redis.on("connect", () => {
        console.log("Connected to Redis");
    });

    redis.on("close", () => {
        console.log("Disconnected from Redis");
    });

    return redis;
}

export async function set<T>(key: string, payload: T) {
    const client = await createRedisClient();

    await client.set(key, JSON.stringify(payload));

    await client.quit();
}

export async function get<T>(key: string, defaultValue: T): Promise<T> {
    const client = await createRedisClient();

    const state = await client.get(key);

    await client.quit();

    if (!state) {
        return defaultValue;
    }

    return JSON.parse(state);
}
