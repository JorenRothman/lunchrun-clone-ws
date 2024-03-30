import type { State } from "@repo/shared/types";
import express from "express";
import { Server } from "socket.io";
import Redis from "ioredis";
import { env } from "./env";
import { get, set } from "@app/redis";

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
        ? await get<State>("state", { items: [], favourites: [] })
        : { items: [], favourites: [] };

    io.on("connection", (socket) => {
        socket.emit("update", latestState);

        socket.on("update", (data: State) => {
            data = lowercaseStateValues(data);

            latestState = data;

            io.emit("update", latestState);

            if (enableRedis) set("state", latestState);
        });
    });
}

initServer();
