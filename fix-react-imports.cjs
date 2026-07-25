"use strict";
const fs = require("node:fs");
const path = require("node:path");
const srcDir = "src";
const files = [];
function walk(d) {
	const entries = fs.readdirSync(d, { withFileTypes: true });
	for (const e of entries) {
		const fp = path.join(d, e.name);
		if (e.isDirectory()) {
			walk(fp);
		} else if (e.isFile() && /\.(jsx|js)$/.test(e.name)) {
			files.push(fp);
		}
	}
}
walk(srcDir);
let count = 0;
for (const fp of files) {
	let c = fs.readFileSync(fp, "utf8");
	const orig = c;
	c = c.replace(/import React,\s*\{/g, "import {");
	c = c.replace(/import \{ React,\s*/g, "import {");
	c = c.replace(/import React from ['"]react['"];?/g, "");
	if (c !== orig) {
		fs.writeFileSync(fp, c);
		count++;
	}
}
