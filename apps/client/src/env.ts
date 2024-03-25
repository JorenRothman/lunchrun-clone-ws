import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    client: {
        VITE_SERVER_URL: z.string().default("http://localhost:3000"),
    },
    clientPrefix: "VITE_",
    runtimeEnv: import.meta.env,
});
