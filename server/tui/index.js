#!/usr/bin/env node
import { LogDashboardApp } from "./app.js";

const args = process.argv.slice(2);
const INK_FLAGS = ["--ink", "--mode-more-cool", "-mmc", "--mmc", "-cool"];

if (args.some((a) => INK_FLAGS.includes(a))) {
	const { startInk } = await import("./ink/index.js");
	await startInk();
} else {
	const app = new LogDashboardApp({});
	app.start();
}
