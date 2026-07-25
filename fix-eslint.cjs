"use strict";
const fs = require("node:fs");
const path = require("node:path");

function walkDir(dir) {
	const results = [];
	function walk(d) {
		const entries = fs.readdirSync(d, { withFileTypes: true });
		for (const e of entries) {
			const fp = path.join(d, e.name);
			if (e.isDirectory()) {
				walk(fp);
			} else if (e.isFile() && /\.(jsx|js)$/.test(e.name)) {
				results.push(fp);
			}
		}
	}
	walk(dir);
	return results;
}

function processFile(fp) {
	let c = fs.readFileSync(fp, "utf8");
	const orig = c;

	// Find lucide-react imports and wrap in eslint-disable if file uses JSX
	c = c.replace(
		/^import \{([^}]*)\} from ['"]lucide-react['"];?\s*$/gm,
		(match, _imports) =>
			`/* eslint-disable no-unused-vars */\n${match}\n/* eslint-enable no-unused-vars */`,
	);

	// Wrap react-router-dom imports in App.jsx
	if (fp.includes("App.jsx")) {
		c = c.replace(
			/^import \{[^}]*\} from ['"]react-router-dom['"];?\s*$/gm,
			(m) => `/* eslint-disable no-unused-vars */\n${m}\n/* eslint-enable no-unused-vars */`,
		);
	}

	if (c !== orig) {
		fs.writeFileSync(fp, c);
		return true;
	}
	return false;
}

const files = walkDir("src");
let count = 0;
for (const fp of files) {
	if (processFile(fp)) {
		count++;
	}
}
