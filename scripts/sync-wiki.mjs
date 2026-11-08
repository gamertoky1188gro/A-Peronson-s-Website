// Mirrors docs/**/*.md and history/**/*.md into the GitHub wiki repo.
// Usage: node scripts/sync-wiki.mjs <wiki-dir>
// <wiki-dir> must be a clone of https://github.com/OWNER/REPO.wiki.git
import { execFileSync } from "node:child_process";
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import path from "node:path";

const wikiDir = process.argv[2];
if (!wikiDir || !existsSync(path.join(wikiDir, ".git"))) {
	console.error("Usage: node scripts/sync-wiki.mjs <wiki-dir>  (must be a git clone of the wiki repo)");
	process.exit(1);
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PREFIXES = { docs: "Docs", history: "History" };

function encode(prefix, relpath) {
	const parts = relpath.split(path.sep).join("/").split("/");
	const stem = [...parts.slice(0, -1), parts[parts.length - 1].replace(/\.md$/, "")].join("-");
	return `${prefix}-${stem.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "")}.md`;
}

const generated = new Map(); // filename -> absolute source
for (const [folder, prefix] of Object.entries(PREFIXES)) {
	const base = path.join(root, folder);
	if (!existsSync(base)) continue;
	const walk = (dir) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (entry.name.endsWith(".md")) {
				const rel = path.relative(base, full);
				generated.set(encode(prefix, rel), full);
			}
		}
	};
	walk(base);
}

// Remove mirrored pages that no longer exist in the source tree.
let removed = 0;
for (const entry of readdirSync(wikiDir)) {
	if (/^(Docs|History)-.*\.md$/.test(entry) && !generated.has(entry)) {
		rmSync(path.join(wikiDir, entry));
		removed++;
	}
}

// Copy current files in.
let copied = 0;
for (const [name, src] of generated) {
	copyFileSync(src, path.join(wikiDir, name));
	copied++;
}

console.log(`wiki-sync: ${copied} mirrored, ${removed} removed`);
