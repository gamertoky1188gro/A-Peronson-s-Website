import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";

/**
 * Guards the signed-URL surfaces against a JSX element name that has no binding.
 *
 * Context: 31a075d swapped two RightPanel call sites to <SignedImage> and
 * deleted the LazyImage import in the same edit, but a third call site — the
 * activeAvatar in the thread header — still used it. Nothing caught it:
 *
 *   - Biome's noUndeclaredVariables is off in this repo, so `biome check` passed.
 *   - No test renders RightPanel.
 *   - Rollup treats an unresolved *identifier* as a global and does not even
 *     warn; the build printed "built" and exited 0 with the bug present.
 *   - The whole unit suite was green.
 *
 * Rendering these components is not an option: RightPanel alone needs a large
 * mock surface, which is not proportionate to a one-line fix. So this asserts
 * statically, by parsing.
 */

// ESM repo: __dirname does not exist here, so derive the root from this file.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * The signed-URL surfaces: everything this feature renders a gated path through.
 *
 * NOTE on scope: `src/hooks/useSignedSrc.js` is a hook and contains no JSX at
 * all, so a JSX-element guard is structurally inapplicable to it — it is listed
 * for completeness and its zero-element count is asserted explicitly below, so
 * the file is visibly uncovered rather than quietly passing. `src/lib/
 * signedFile.js` is likewise not guarded here; it has no JSX and exports no
 * components.
 */
const GUARDED = [
	"src/pages/chat/RightPanel.jsx",
	"src/pages/ChatInterface.jsx",
	"src/components/chat/AttachmentPreviewModal.jsx",
	"src/components/chat/FileAttachmentCard.jsx",
	"src/components/chat/SignedMedia.jsx",
	"src/hooks/useSignedSrc.js",
];

const traverse = _traverse.default ?? _traverse;

function parseJsx(src) {
	return parse(src, {
		sourceType: "unambiguous",
		allowReturnOutsideFunction: true,
		plugins: ["jsx"],
	});
}

/**
 * Capitalised JSX element names with no binding anywhere in scope.
 *
 * Uses the AST rather than pattern-matching source text. The first version of
 * this guard blanked comments *and* strings with a regex before scanning for
 * `<Name`; an apostrophe in JSX text ("This can't be loaded") shifted the
 * string-pairing parity and blanked every later JSX tag. Measured on these six
 * files that destroyed 11 of 18 tags in ChatInterface and *all* of them in
 * AttachmentPreviewModal and FileAttachmentCard — the guard passed those three
 * vacuously while a real unbound element sat in them. Parsing has no such
 * failure mode.
 */
function findUnboundJsxNames(src) {
	const missing = new Set();
	traverse(parseJsx(src), {
		JSXOpeningElement(nodePath) {
			// <Icons.Star /> binds Icons, not Star.
			let root = nodePath.node.name;
			while (root && root.type === "JSXMemberExpression") root = root.object;
			if (!root || root.type !== "JSXIdentifier") return;
			const name = root.name;
			// Intrinsic elements (div, span, input...) are lowercase by
			// convention and are never variable references.
			if (!/^[A-Z]/.test(name)) return;
			if (!nodePath.scope.hasBinding(name)) missing.add(name);
		},
	});
	return [...missing];
}

function countJsxElements(src) {
	let count = 0;
	traverse(parseJsx(src), {
		JSXElement() {
			count += 1;
		},
	});
	return count;
}

/**
 * Plants `<ZzzUnboundProbe />` inside real JSX in the source.
 *
 * Guided by the AST so the result always parses — injecting at a blind line
 * boundary lands inside expressions often enough to make the test flaky.
 * Two shapes have to be handled: an element with children (the probe becomes
 * its first child) and a self-closing element (which is opened up so the probe
 * has somewhere legal to go).
 */
function injectProbe(src) {
	const elements = [];
	traverse(parseJsx(src), {
		JSXElement(nodePath) {
			elements.push(nodePath.node);
		},
	});
	if (elements.length === 0) return null;

	const container = elements.find((element) => (element.children || []).length > 0);
	if (container) {
		const at = container.openingElement.end;
		return `${src.slice(0, at)}<ZzzUnboundProbe />${src.slice(at)}`;
	}

	// Every element self-closes (SignedMedia.jsx is like this), so the probe has
	// no parent to live in. Open the first one and nest it.
	// Babel models `<X />` as JSXElement{openingElement: JSXOpeningElement,
	// selfClosing: true} — there is no JSXSelfClosingElement node in its AST.
	const target = elements[0];
	const opening = target.openingElement;
	const name = opening.name;
	if (name.type !== "JSXIdentifier") return null;
	if (opening.selfClosing) {
		const head = src.slice(0, target.end - 2); // drop the trailing "/>"
		const tail = src.slice(target.end);
		return `${head}><ZzzUnboundProbe /></${name.name}>${tail}`;
	}
	const at = opening.end;
	return `${src.slice(0, at)}<ZzzUnboundProbe />${src.slice(at)}`;
}

describe("JSX elements resolve to a binding (signed-url surfaces)", () => {
	// The scanner is the guard, so the guard is tested. Without these, a
	// silently broken scanner would make the real assertions vacuous.
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

	// Regression guard for the blanking failure above. The old implementation
	// returned [] here: the apostrophe in "can't" flipped string pairing, so the
	// probe that follows was itself blanked before it was ever scanned.
	test("finds an unbound element after an apostrophe in JSX text", () => {
		const src = [
			'import Card from "./Card.jsx";',
			"export function Panel() {",
			"\treturn (",
			"\t\t<div>",
			"\t\t\t<p>This can't be loaded, isn't it?</p>",
			"\t\t\t<p>It hasn't a binding either</p>",
			"\t\t\t<ZzzUnboundProbe />",
			"\t\t</div>",
			"\t);",
			"}",
		].join("\n");
		expect(findUnboundJsxNames(src)).toEqual(["ZzzUnboundProbe"]);
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
			"\t\t\t<span />",
			"\t\t</div>",
			"\t);",
			"}",
		].join("\n");
		expect(findUnboundJsxNames(src)).toEqual([]);
	});

	// The real-surface proof: an unbound element planted inside actual JSX is
	// found in every guarded file that has JSX.
	test.each(GUARDED)("%s finds an unbound element injected into its JSX", (relative) => {
		const src = fs.readFileSync(path.join(ROOT, relative), "utf8");
		const mutated = injectProbe(src);
		if (mutated === null) {
			// No JSX at all: nothing for a JSX guard to see. Asserted explicitly
			// below rather than passing quietly.
			expect(countJsxElements(src)).toBe(0);
			return;
		}
		expect(findUnboundJsxNames(mutated)).toContain("ZzzUnboundProbe");
	});

	// Makes the "no JSX" case visible instead of implicit.
	test.each(GUARDED)("%s reports its JSX element count", (relative) => {
		const src = fs.readFileSync(path.join(ROOT, relative), "utf8");
		const hasJsx = countJsxElements(src);
		expect(hasJsx).toBeGreaterThanOrEqual(0);
		if (hasJsx === 0) {
			// Only useSignedSrc.js should land here. If a new file joins the list
			// with no JSX, the docblock needs updating too.
			expect(relative).toBe("src/hooks/useSignedSrc.js");
		}
	});

	test.each(GUARDED)("%s has no unbound JSX element", (relative) => {
		const src = fs.readFileSync(path.join(ROOT, relative), "utf8");
		expect(findUnboundJsxNames(src)).toEqual([]);
	});
});
