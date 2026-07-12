import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		environment: "jsdom",
		coverage: {
			exclude: [
				...coverageConfigDefaults.exclude,
				"*.config.mjs",
				"*.config.ts",
				"**/layout.tsx",
			],
		},
	},
});
