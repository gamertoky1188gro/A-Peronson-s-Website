import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Guards the signed-URL surfaces against a JSX element name that has no binding.
 *
 * Context: 31a075d swapped two RightPanel call sites to <SignedImage> and
 * deleted the LazyImage import in the same edit, but a third call site — the
 * activeAvatar in the thread header — still used it. Nothing caught it:
 *
 *   - Biome's noUndeclaredVariables is off in this repo, so `biome check` passed.
 *   - No test renders RightPanel.
 *   - Rollup treats an unresolved *identifier* as a warning, not an error, so
 *     the build still printed "built".
 *   - The whole unit suite was green.
 *
 * Rendering these components is not an option: RightPanel alone needs a large
 * mock surface, which is not proportionate to a one-line fix. So this asserts
 * statically instead.
 *
 * What it catches: a capitalised JSX element name in one of the files below
 * that is neither imported nor declared locally.
 *
 * What it does NOT catch:
 *   - Identifiers used outside JSX tags (a bare `LazyImage` in an expression).
 *   - Destructured *prop renames* such as `function C({ icon: Icon })`; those
 *     files are outside the scanned set and would be reported as unbound.
 *   - Names bound in a way this heuristic does not model (namespace objects,
 *     conditional requires, globals). It is deliberately scoped to the files
 *     this feature owns, where it is exact: zero false positives today.
 *   - Anything at all in the other ~178 files under src/. 16 of them use
 *     patterns it cannot model, so widening the set would need real work.
 *
 * The durable fix is enabling noUndeclaredVariables (or a tsconfig), not
 * growing this file.
 */

// The signed-URL surfaces: everything this feature renders a gated path through.
const GUARDED = [
	"src/pages/chat/RightPanel.jsx",
	"src/pages/ChatInterface.jsx",
	"src/components/chat/AttachmentPreviewModal.jsx",
	"src/components/chat/FileAttachmentCard.jsx",
	"src/components/chat/SignedMedia.jsx",
	"src/hooks/useSignedSrc.js",
];

// ESM repo: __dirname does not exist here, so derive the root from this file.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Blanks comments and string literals so they cannot supply phantom bindings. */
function stripCommentsAndStrings(src) {
	return (
		src
			.replace(/\/\*[\s\S]*?\*\//g, " ")
			// Negative lookbehind keeps "https://" from being read as a comment.
			.replace(/(?<![:"'`])\/\/[^\n]*/g, " ")
			.replace(/`(?:\\.|[^`\\])*`/g, "``")
			.replace(/"(?:\\.|[^"\\])*"/g, '""')
			.replace(/'(?:\\.|[^'\\])*'/g, "''")
	);
}

/** Every name bound by an import or a local declaration. */
function collectBindings(src) {
	const names = new Set();

	for (const match of src.matchAll(/\bimport\s+([^;]*?)\s+from\s*["'][^"']+["']/g)) {
		const clause = match[1];
		const braces = clause.match(/\{([^}]*)\}/);
		if (braces) {
			for (const part of braces[1].split(",")) {
				const trimmed = part.trim();
				if (!trimmed) continue;
				const aliased = trimmed.split(/\s+as\s+/);
				names.add((aliased[1] || aliased[0]).trim());
			}
		}
		const defaults = clause
			.replace(/\{[^}]*\}/, "")
			.replace(/^\s*,|,\s*$/g, "")
			.trim();
		for (const entry of defaults.split(",")) {
			const trimmed = entry.trim().replace(/^\*\s*as\s*/, "");
			if (trimmed && /^[A-Za-z_$][\w$]*$/.test(trimmed)) names.add(trimmed);
		}
	}

	for (const match of src.matchAll(/\b(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/g)) {
		names.add(match[1]);
	}

	// Destructuring: const { A, B: c } = ...
	for (const match of src.matchAll(/\b(?:const|let|var)\s*\{([^}]*)\}\s*=/g)) {
		for (const part of match[1].split(",")) {
			const trimmed = part.trim();
			if (!trimmed) continue;
			const aliased = trimmed.split(":");
			names.add((aliased[1] || aliased[0]).trim());
		}
	}

	return names;
}

/** Capitalised JSX element names with no binding in the same source. */
function findUnboundJsxNames(src) {
	// Bindings are read from the ORIGINAL source: stripCommentsAndStrings blanks
	// string literals, which would leave `from ""` and break every import match.
	const bound = collectBindings(src);
	const clean = stripCommentsAndStrings(src);
	const missing = new Set();
	for (const match of clean.matchAll(/<([A-Z][\w$]*)/g)) {
		// Skip member expressions: <Icons.Foo /> binds `Icons`, not `Foo`.
		if (clean[match.index + 1 + match[1].length] === ".") continue;
		if (!bound.has(match[1])) missing.add(match[1]);
	}
	return [...missing];
}

describe("JSX elements resolve to a binding (signed-url surfaces)", () => {
	// The scanner is the guard, so the guard is tested: without these two, a
	// silently broken scanner would make the real assertion below vacuous.
	test("flags a JSX name that is never bound", () => {
		const src = [
			'import Button from "./Button.jsx";',
			"export function Card() {",
			"\treturn (",
			"\t\t<div>",
			"\t\t\t<Button />",
			"\t\t\t<LazyImage src={avatar} />",
			"\t\t</div>",
			"\t);",
			"}",
		].join("\n");
		expect(findUnboundJsxNames(src)).toEqual(["LazyImage"]);
	});

	test("does not flag bound, local, member or commented-out names", () => {
		const src = [
			'import { SignedImage, SignedVideo } from "./SignedMedia.jsx";',
			'import * as Icons from "./icons.jsx";',
			"function Local() {",
			"\treturn null;",
			"}",
			"export function Panel() {",
			"\treturn (",
			"\t\t<div>",
			"\t\t\t<SignedImage />",
			"\t\t\t<SignedVideo />",
			"\t\t\t<Icons.Star />",
			"\t\t\t<Local />",
			"\t\t\t{/* <CommentedOut /> */}",
			"\t\t</div>",
			"\t);",
			"}",
		].join("\n");
		expect(findUnboundJsxNames(src)).toEqual([]);
	});

	test.each(GUARDED)("%s has no unbound JSX element", (relative) => {
		const file = path.join(ROOT, relative);
		expect(fs.existsSync(file)).toBe(true);
		const unbound = findUnboundJsxNames(fs.readFileSync(file, "utf8"));
		expect(unbound).toEqual([]);
	});
});
