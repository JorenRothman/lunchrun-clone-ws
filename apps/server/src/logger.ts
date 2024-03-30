import pino from "pino";

export const logger = pino({});

export const serverLogger = logger.child({ module: "server" });

export const socketLogger = logger.child({ module: "socket" });

export const redisLogger = logger.child({ module: "redis" });
