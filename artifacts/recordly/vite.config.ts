import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  optimizeDeps: {
    entries: ["index.html"],
    exclude: [
      "react-icons/bs",
      "react-icons/fa",
      "react-icons/fa6",
      "react-icons/fi",
      "react-icons/md",
      "react-icons/rx",
    ],
  },
  build: {
    target: "esnext",
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          pixi: ["pixi.js"],
          "react-vendor": ["react", "react-dom"],
          "video-processing": ["mediabunny", "mp4box", "@fix-webm-duration/fix"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
