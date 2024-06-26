import { serve } from "@hono/node-server";
import { Hono } from "hono";

import type { State } from "@repo/shared/types";
import { Server } from "socket.io";
import { env } from "./env.js";
import { get, set } from "./redis.js";
import { serverLogger, socketLogger } from "./logger.js";

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
    const app = new Hono();

    app.get("/health", (c) => {
        serverLogger.info("Health check");
        return c.text("OK");
    });

    serverLogger.info(`Server running on http://${env.HOST}:${env.PORT}`);

    const server = serve({
        fetch: app.fetch,
        port: env.PORT,
    });

    const io = new Server(server, {
        cors: {
            origin: env.CORS_ORIGIN,
        },
    });

    let latestState = enableRedis
        ? await get<State>("state", { items: [], favourites: [] })
        : { items: [], favourites: [] };

    io.on("connection", (socket) => {
        socketLogger.info(`Socket connected: ${socket.id}`);

        socket.emit("update", latestState);

        socket.on("update", (data: State) => {
            socketLogger.info(`Received update`);

            latestState = lowercaseStateValues(data);

            socketLogger.info(`Emitting update`);
            io.emit("update", latestState);

            if (enableRedis) set("state", latestState);
        });
    });
}

initServer();
