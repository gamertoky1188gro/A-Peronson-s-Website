import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || "./",
  logLevel: "info",
  clearScreen: false,
  envDir: process.cwd(),
  css: {
    cssCodeSplit: true,
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      external: ["rtf.js"],
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom")) return "vendor-react";
          if (id.includes("node_modules/react")) return "vendor-react";
          if (id.includes("node_modules/lucide-react")) return "vendor-icons";
          if (id.includes("node_modules/dompurify")) return "vendor-security";
          if (id.includes("node_modules/recharts")) return "vendor-charts";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
    reportCompressedSize: false,
    sourcemap: process.env.NODE_ENV !== "production",
  },
  plugins: [tailwindcss(), react()],
  server: {
    allowedHosts: ["habits-asia-occur-acute.trycloudflare.com"],
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY || "http://localhost:4000",
        changeOrigin: true,
      },
      "/uploads": {
        target: process.env.VITE_API_PROXY || "http://localhost:4000",
        changeOrigin: true,
      },
      "/ws": {
        target: process.env.VITE_API_PROXY || "http://localhost:4000",
        changeOrigin: true,
        ws: true,
      },
    },
    watch: {
      ignored: ["**/server/database/**", "**/server/uploads/**"],
    },
  },
});
