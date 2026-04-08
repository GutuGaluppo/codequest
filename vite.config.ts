import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
	plugins: [
		tanstackRouter({ autoCodeSplitting: true }),
		react(),
		tailwindcss(),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules/@monaco-editor") || id.includes("node_modules/monaco-editor")) {
						return "vendor-monaco";
					}
					if (id.includes("node_modules/@codesandbox/sandpack")) {
						return "vendor-sandpack";
					}
					if (id.includes("node_modules/@anthropic-ai") || id.includes("node_modules/openai") || id.includes("node_modules/@google/genai")) {
						return "vendor-ai";
					}
					if (id.includes("node_modules/firebase")) {
						return "vendor-firebase";
					}
					if (id.includes("node_modules/@tanstack")) {
						return "vendor-tanstack";
					}
					if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
						return "vendor-react";
					}
				},
			},
		},
	},
});
