import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ mode }) => ({
  base: mode === "github-pages" ? "/blind-75/" : "/",
  plugins: [react()],
  build: { target: "es2022" },
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
}));
