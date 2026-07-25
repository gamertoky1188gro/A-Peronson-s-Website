import { execSync, spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

try {
	const pandocPath = execSync('python -c "import pypandoc; print(pypandoc.get_pandoc_path())"', {
		encoding: "utf-8",
	}).trim();
	if (pandocPath) {
		process.env.PATH = path.dirname(pandocPath) + path.delimiter + process.env.PATH;
	}
} catch {}

const DOCS_DIR = path.join(REPO_ROOT, "docs");
const OUTPUT_DIR = path.join(REPO_ROOT, "docs", "docx");

async function getAllMarkdownFiles(dir) {
	const files = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			const subFiles = await getAllMarkdownFiles(fullPath);
			files.push(...subFiles);
		} else if (entry.name.endsWith(".md")) {
			files.push(fullPath);
		}
	}

	return files;
}

function runPandoc(inputFile, outputFile) {
	return new Promise((resolve, reject) => {
		const pandocArgs = [
			inputFile,
			"-o",
			outputFile,
			"--standalone",
			"-t",
			"docx",
			"--toc",
			"--toc-depth=2",
		];

		const pandoc = spawn("pandoc", pandocArgs, {
			stdio: "inherit",
			shell: true,
		});

		pandoc.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Pandoc failed with code ${code}`));
			}
		});

		pandoc.on("error", (err) => {
			reject(err);
		});
	});
}

async function main() {
	const mdFiles = await getAllMarkdownFiles(DOCS_DIR);

	try {
		await fs.mkdir(OUTPUT_DIR, { recursive: true });
	} catch {
		// Directory exists
	}

	let successCount = 0;
	let failCount = 0;

	for (const mdFile of mdFiles) {
		const relativePath = path.relative(DOCS_DIR, mdFile);
		const outputSubDir = path.join(OUTPUT_DIR, path.dirname(relativePath));

		try {
			await fs.mkdir(outputSubDir, { recursive: true });
		} catch {
			// Directory exists
		}

		const baseName = path.basename(mdFile, ".md");
		const outputFile = path.join(outputSubDir, `${baseName}.docx`);

		try {
			await runPandoc(mdFile, outputFile);
			successCount++;
		} catch {
			failCount++;
		}
	}

	if (failCount > 0) {
		process.exit(1);
	}
}

main().catch((_err) => {
	process.exit(1);
});
