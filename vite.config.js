import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8081",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    test: {
        globals: true,
        env: {
            VITE_API_BASE: "http://localhost:8081",
        },
        environmentMatchGlobs: [
            ["**/integration/**", "node"],
            ["**tests/component/**", "jsdom"],
        ],
        testTimeout: 10_000,
        setupFilesAfterEach: {
            jsdom: ["./tests/setup.js"],
        },
    },
});
