const fs = require("fs");
const path = require("path");
const root = process.cwd();
const exts = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".py",
  ".html",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".vue",
  ".go",
  ".rs",
  ".php",
  ".rb",
  ".java",
  ".c",
  ".cpp",
  ".h",
  ".cs",
  ".sh",
  ".ps1",
  ".sql",
  ".json",
  ".md",
  ".xml",
  ".yaml",
  ".yml",
  ".json5",
]);
const excludeDirs = new Set([
  ".git",
  ".codex",
  ".github",
  "dist",
  "node_modules",
  "test-results",
  "public",
]);
let count = 0;
let files = [];
function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }
  for (const ent of entries) {
    if (excludeDirs.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full);
    } else if (ent.isFile()) {
      const rel = path.relative(root, full).replace(/\\/g, "/");
      const ext =
        path.extname(ent.name) ||
        (ent.name === "Dockerfile" ? "Dockerfile" : "");
      if (exts.has(ext) || exts.has(ent.name)) {
        count++;
        files.push(rel);
      }
    }
  }
}
walk(root);
files.sort();
const outList = path.join(root, "scripts", "file_list_filtered.txt");
fs.writeFileSync(outList, files.join("\n"), "utf8");
console.log("Found", count, "language/script files (excluding specified dirs)");
console.log("Wrote file list to", outList);
