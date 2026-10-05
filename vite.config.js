import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

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
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			external: ["rtf.js"],
			output: {
				manualChunks(id) {
					if (id.includes("node_modules/react-dom")) {
						return "vendor-react";
					}
					if (id.includes("node_modules/react")) {
						return "vendor-react";
					}
					if (id.includes("node_modules/framer-motion")) {
						return "vendor-motion";
					}
					if (id.includes("node_modules/react-router")) {
						return "vendor-router";
					}
					if (id.includes("node_modules/@reduxjs/toolkit")) {
						return "vendor-redux";
					}
					if (id.includes("node_modules/react-redux")) {
						return "vendor-redux";
					}
					if (id.includes("node_modules/lucide-react")) {
						return "vendor-icons";
					}
					if (id.includes("node_modules/dompurify")) {
						return "vendor-security";
					}
					if (id.includes("node_modules/recharts")) {
						return "vendor-charts";
					}
				},
			},
		},
		reportCompressedSize: false,
		sourcemap: "hidden",
	},
	plugins: [
		tailwindcss(),
		react(),
		VitePWA({
			strategies: "injectManifest",
			srcDir: "src",
			filename: "sw.js",
			registerType: "autoUpdate",
			injectRegister: false,
			manifest: false,
			devOptions: { enabled: false },
			injectManifest: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
			},
		}),
	],
	server: {
		allowedHosts: process.env.VITE_ALLOWED_HOSTS
			? process.env.VITE_ALLOWED_HOSTS.split(",").map((s) => s.trim())
			: ["localhost"],
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
