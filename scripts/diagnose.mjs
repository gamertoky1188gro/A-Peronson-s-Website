#!/usr/bin/env node

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";
const endpoint = process.argv[2] === "--deep" ? "/api/diagnostics/deep" : "/api/diagnostics";

async function main() {
	const url = `${BASE_URL}${endpoint}`;
	console.log(`\n  GartexHub Diagnostics\n  ${"=".repeat(30)}`);
	console.log(`  Server: ${url}\n`);

	try {
		const res = await fetch(url, {
			headers: { Origin: BASE_URL, Accept: "application/json" },
		});
		const data = await res.json();

		if (!res.ok) {
			console.log(`  ✖ HTTP ${res.status}: ${data.error || "unknown"}\n`);
			process.exit(1);
		}

		printSection("Overview", [
			["Status", data.ok ? "✔ OK" : "✖ FAIL"],
			["Uptime", `${data.uptime_s}s`],
		]);

		if (data.node) {
			printSection("Node", [
				["Version", data.node.version],
				["Platform", `${data.node.platform} (${data.node.arch})`],
				["Environment", data.node.env],
			]);
		}

		if (data.memory) {
			const mem = data.memory;
			const warn = mem.heap_used_mb > 512 ? " ⚠" : "";
			printSection("Memory", [
				["RSS", `${mem.rss_mb} MB`],
				["Heap Used", `${mem.heap_used_mb} MB${warn}`],
				["Heap Total", `${mem.heap_total_mb} MB`],
				["External", `${mem.external_mb} MB`],
			]);
		}

		if (data.cpu) {
			printSection("CPU", [
				["Cores", String(data.cpu.cores)],
				["Model", data.cpu.model],
				["Load Avg", data.cpu.load_avg.map((n) => n.toFixed(2)).join(", ")],
			]);
		}

		if (data.db) {
			printSection("Database", [
				["Connected", data.db.connected ? "✔ yes" : "✖ no"],
				...(data.db.error ? [["Error", data.db.error]] : []),
			]);
		}

		if (data.redis) {
			printSection("Redis", [
				["Connected", data.redis.connected ? "✔ yes" : "○ disabled"],
			]);
		}

		if (data.opensearch) {
			const os = data.opensearch;
			printSection("OpenSearch", [
				["Configured", os.configured ? "✔ yes" : "○ no"],
				...(os.configured ? [["Reachable", os.reachable ? "✔ yes" : "✖ no"]] : []),
				...(os.index_prefix ? [["Index Prefix", os.index_prefix]] : []),
				...(os.products_exists !== undefined ? [["Products Index", os.products_exists ? `✔ exists (${os.products_count})` : "✖ missing"]] : []),
				...(os.requirements_exists !== undefined ? [["Requirements Index", os.requirements_exists ? `✔ exists (${os.requirements_count})` : "✖ missing"]] : []),
				...(os.last_error ? [["Last Error", os.last_error]] : []),
			]);
		}

		if (data.qdrant) {
			const qd = data.qdrant;
			printSection("Qdrant", [
				["Configured", qd.configured ? "✔ yes" : "○ no"],
				...(qd.configured ? [["Reachable", qd.reachable ? "✔ yes" : "✖ no"]] : []),
				...(qd.collections ? [["Collections", Object.keys(qd.collections).join(", ")]] : []),
			]);
		}

		if (data.fx) {
			const fx = data.fx;
			printSection("FX Rates", [
				["Status", fx.ok ? "✔ ok" : "○ stale"],
				...(fx.last_ok_at ? [["Last OK", fx.last_ok_at]] : []),
				...(fx.last_error ? [["Last Error", fx.last_error]] : []),
			]);
		}

		if (data.env_sample) {
			const env = data.env_sample;
			printSection("Environment", [
				["PORT", env.port || "—"],
				["SERVE_DIST", env.serve_dist || "—"],
				["DATABASE_URL", env.db_set ? "✔ set" : "✖ not set"],
				["OPENSEARCH_URL", env.os_set ? "✔ set" : "✖ not set"],
				["REDIS_URL", env.redis_set ? "✔ set" : "○ not set"],
				["AI_SEARCH_ENABLED", env.ai_search_enabled || "—"],
			]);
		}

		console.log("");
		process.exit(data.ok ? 0 : 2);
	} catch (err) {
		console.log(`  ✖ Connection failed: ${err.message}\n`);
		process.exit(1);
	}
}

function printSection(title, rows) {
	console.log(`  ${title}`);
	console.log(`  ${"-".repeat(title.length)}`);
	for (const [key, val] of rows) {
		console.log(`  ${key.padEnd(18)} ${val}`);
	}
	console.log("");
}

main();
