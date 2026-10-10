import { defineConfig } from "allure";

// Single-file variant of the NEON TEST LAB report: one standalone HTML file,
// suitable for sharing. No history/trend accumulation (use the default
// multi-file report for that).
export default defineConfig({
	name: "NEON TEST LAB — Application Quality Report",
	output: "./reports/allure-single",
	plugins: {
		awesome: {
			reportName: "NEON TEST LAB — Application Quality Report",
			reportLanguage: "en",
			singleFile: true,
		},
	},
});
