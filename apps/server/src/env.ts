import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import { config } from 'dotenv';
config();

export const env = createEnv({
    server: {
        PORT: z.coerce.number().default(3000),
        HOST: z.string().default('localhost'),
        ENABLE_REDIS: z
            .string()
            // only allow "true" or "false"
            .refine((s) => s === 'true' || s === 'false')
            // transform to boolean
            .transform((s) => s === 'true')
            .default('false'),
        REDIS_URL: z.string().default('redis://localhost:6379'),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
