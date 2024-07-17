import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                theme_color: "#292970",
                name: "Lunch run",
                short_name: "Lunch run",
            },
        }),
    ],

    resolve: {
        alias: {
            "@": "/src",
        },
    },
});
