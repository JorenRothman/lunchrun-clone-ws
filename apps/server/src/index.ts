import type { State } from "@repo/shared/types";
import { Server } from "socket.io";
import { createClient } from "redis";
import { env } from "./env";

console.log("booting server...");

async function createRedisClient() {
    const client = createClient({
        url: env.REDIS_URL,
    })
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();

    return client;
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
    const io = new Server(env.PORT, {
        cors: {
            origin: "*",
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

    console.log(`Server running on http://${env.HOST}:${env.PORT}`);
}

initServer();
