import type { State } from "@repo/shared/types";
import express from "express";
import { Server } from "socket.io";
import Redis from "ioredis";
import { env } from "./env";

console.log("Starting server...");

async function createRedisClient() {
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

async function writeStateToRedis(state: State) {
    const client = await createRedisClient();

    await client.set("state", JSON.stringify(state));

    await client.quit();
}

async function getStateFromRedis(): Promise<State> {
    const client = await createRedisClient();

    const state = await client.get("state");

    await client.quit();

    if (!state) {
        return {
            items: [],
            favourites: [],
        };
    }

    return JSON.parse(state);
}

function lowercaseStateValues(state: State): State {
    return {
        items: state.items.map((item) => ({
            id: item.id,
            name: item.name.toLowerCase(),
        })),
        favourites: state.favourites.map((favourite) => ({
            id: favourite.id,
            name: favourite.name.toLowerCase(),
        })),
    };
}

const enableRedis = env.ENABLE_REDIS;

async function initServer() {
    const app = express();

    app.get("/health", (req, res) => {
        res.send("OK");
    });

    const expressServer = app.listen(env.PORT, () => {
        console.log(`Express server running on http://${env.HOST}:${env.PORT}`);
    });

    const io = new Server(expressServer, {
        cors: {
            origin: env.CORS_ORIGIN,
        },
    });

    let latestState = enableRedis
        ? await getStateFromRedis()
        : { items: [], favourites: [] };

    io.on("connection", (socket) => {
        socket.emit("update", latestState);

        socket.on("update", (data: State) => {
            data = lowercaseStateValues(data);

            latestState = data;

            io.emit("update", latestState);

            if (enableRedis) writeStateToRedis(latestState);
        });
    });
}

initServer();
