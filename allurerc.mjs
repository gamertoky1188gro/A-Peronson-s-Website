import { defineConfig } from "allure";

// NEON TEST LAB — Application Quality Report (Allure Report 3 + Awesome).
// Aggregates reports/allure-results-jest (Jest: unit, component, integration)
// and reports/allure-results-e2e (Playwright) via:
//   npx allure generate reports/allure-results-jest reports/allure-results-e2e
export default defineConfig({
	name: "NEON TEST LAB — Application Quality Report",
	output: "./reports/allure-report",
	plugins: {
		awesome: {
			reportName: "NEON TEST LAB — Application Quality Report",
			reportLanguage: "en",
		},
	},
});
