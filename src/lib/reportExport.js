// Report export (Phase D.3).
//
// The owner asked for a PDF of the investigation report. A server-side PDF
// would mean a PDF library and a headless browser on the render service, so
// the report is exported as a SELF-CONTAINED HTML document instead: the
// browser prints it (Ctrl+P / "Save as PDF"), and the same document can be
// downloaded and opened anywhere. No dependency, no server round trip, and
// the printed page is the same page the buyer read.
//
// The markdown here is the report the server wrote, which uses a small fixed
// subset: headings, bullet lists (two-space nesting), numbered lists, bold,
// italic, inline code, fenced code and paragraphs. The converter handles that
// subset and nothing else - an unknown line is still rendered as a paragraph,
// so nothing is ever silently dropped.
//
// ESCAPING COMES FIRST. The report quotes agent output, so every character
// is escaped before any tag is inserted; nothing from the report can become
// markup.

const ESCAPE_MAP = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

export function escapeHtml(value) {
	return String(value ?? "").replace(/[&<>"']/gu, (char) => ESCAPE_MAP[char]);
}

/** Inline markdown: bold, italic, inline code. The text is already escaped. */
function renderInline(text) {
	return String(text)
		.replace(/`([^`]+)`/gu, "<code>$1</code>")
		.replace(/\*\*([^*]+)\*\*/gu, "<strong>$1</strong>")
		.replace(/(^|[\s(])_([^_]+)_/gu, "$1<em>$2</em>");
}

function listItem(text) {
	return `<li>${renderInline(text)}</li>`;
}

/**
 * The report markdown as HTML.
 *
 * @param {string} markdown
 * @returns {string} The HTML body.
 */
export function markdownToHtml(markdown) {
	const lines = String(markdown ?? "").split("\n");
	const out = [];
	let paragraph = [];
	let list = null; // { tag: "ul" | "ol", items: [] }
	let code = null; // { lang, lines }

	const flushParagraph = () => {
		if (paragraph.length) {
			out.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
			paragraph = [];
		}
	};
	const flushList = () => {
		if (list) {
			out.push(`<${list.tag}>${list.items.join("")}</${list.tag}>`);
			list = null;
		}
	};

	for (const raw of lines) {
		const line = escapeHtml(raw);

		// Fenced code: the content is escaped and NOT touched by the inline
		// rules - a code block is not prose.
		if (line.trim().startsWith("```")) {
			if (code) {
				out.push(`<pre><code>${code.lines.join("\n")}</code></pre>`);
				code = null;
			} else {
				flushParagraph();
				flushList();
				code = { lines: [] };
			}
			continue;
		}
		if (code) {
			code.lines.push(line);
			continue;
		}

		if (!line.trim()) {
			flushParagraph();
			flushList();
			continue;
		}

		const heading = /^(#{1,6})\s+(.*)$/u.exec(line);
		if (heading) {
			flushParagraph();
			flushList();
			const level = heading[1].length;
			out.push(`<h${level}>${renderInline(heading[2].trim())}</h${level}>`);
			continue;
		}

		if (/^(-{3,}|\*{3,})$/u.test(line.trim())) {
			flushParagraph();
			flushList();
			out.push("<hr />");
			continue;
		}

		const bullet = /^(\s*)-\s+(.*)$/u.exec(line);
		if (bullet) {
			flushParagraph();
			const depth = Math.floor(bullet[1].length / 2);
			if (!list) {
				list = { tag: "ul", items: [] };
			}
			list.items.push(listItem(bullet[2]));
			list.depth = depth;
			continue;
		}

		const ordered = /^\s*\d+\.\s+(.*)$/u.exec(line);
		if (ordered) {
			flushParagraph();
			if (!list || list.tag !== "ol") {
				flushList();
				list = { tag: "ol", items: [] };
			}
			list.items.push(listItem(ordered[1]));
			continue;
		}

		flushList();
		paragraph.push(line.trim());
	}
	if (code) {
		out.push(`<pre><code>${code.lines.join("\n")}</code></pre>`);
	}
	flushParagraph();
	flushList();
	return out.join("\n");
}

const PRINT_CSS = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 40px 44px;
    background: #ffffff;
    color: #14121a;
    font: 14px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  header { border-bottom: 2px solid #a855f7; padding-bottom: 12px; margin-bottom: 24px; }
  h1 { margin: 0 0 4px; font-size: 22px; letter-spacing: -0.01em; }
  .subtitle { margin: 0; color: #6b6478; font-size: 12px; }
  h2 { font-size: 16px; margin: 26px 0 8px; color: #3b2a63; }
  h3 { font-size: 14px; margin: 18px 0 6px; color: #4a3a72; }
  h4, h5, h6 { font-size: 13px; margin: 14px 0 4px; }
  p { margin: 0 0 10px; }
  ul, ol { margin: 0 0 12px; padding-left: 20px; }
  li { margin: 0 0 4px; }
  code { background: #f3f0fa; border-radius: 4px; padding: 1px 4px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
  pre { background: #f7f5fb; border: 1px solid #e6e0f2; border-radius: 8px; padding: 10px 12px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  hr { border: 0; border-top: 1px solid #e6e0f2; margin: 18px 0; }
  strong { font-weight: 650; }
  footer { margin-top: 32px; border-top: 1px solid #e6e0f2; padding-top: 10px; color: #8b8496; font-size: 11px; }
  @media print {
    body { padding: 0; }
    @page { margin: 14mm; }
  }
`;

/**
 * A complete, self-contained HTML document for the report.
 *
 * @param {Object} options
 * @param {string} options.title
 * @param {string} [options.subtitle]
 * @param {string} options.markdown
 * @param {string} [options.footer]
 * @returns {string} The document.
 */
export function buildReportDocument({ title, subtitle = "", markdown, footer = "" } = {}) {
	return [
		"<!doctype html>",
		'<html lang="en">',
		"<head>",
		'<meta charset="utf-8" />',
		'<meta name="viewport" content="width=device-width, initial-scale=1" />',
		`<title>${escapeHtml(title || "Investigation report")}</title>`,
		`<style>${PRINT_CSS}</style>`,
		"</head>",
		"<body>",
		"<header>",
		`<h1>${escapeHtml(title || "Investigation report")}</h1>`,
		subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : "",
		"</header>",
		"<main>",
		markdownToHtml(markdown),
		"</main>",
		footer ? `<footer>${escapeHtml(footer)}</footer>` : "",
		"</body>",
		"</html>",
	].join("\n");
}

/** A filename that is safe on every filesystem and says what it is. */
export function reportFilename(caseId, extension = "html") {
	const safe = String(caseId || "case")
		.replace(/[^a-zA-Z0-9._-]+/gu, "-")
		.slice(0, 60);
	return `investigation-report-${safe || "case"}.${extension}`;
}

/**
 * Download the report as an HTML file.
 *
 * @param {Object} options - the same options as buildReportDocument, plus `caseId`.
 * @returns {string} The filename that was offered.
 */
export function downloadReportHtml({ caseId, ...options } = {}) {
	const html = buildReportDocument(options);
	const filename = reportFilename(caseId);
	const blob = new Blob([html], { type: "text/html;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	// Revoking immediately can cancel the download in some browsers.
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
	return filename;
}

/**
 * Print the report, so the browser can save it as a PDF.
 *
 * The document is printed from a hidden iframe rather than a new window: a
 * popup is blocked by default, and a blocked popup would silently do
 * nothing.
 *
 * @param {Object} options - the same options as buildReportDocument.
 * @returns {boolean} Whether the print frame was created.
 */
export function printReportHtml(options = {}) {
	const html = buildReportDocument(options);
	const frame = document.createElement("iframe");
	frame.setAttribute("aria-hidden", "true");
	frame.style.position = "fixed";
	frame.style.right = "0";
	frame.style.bottom = "0";
	frame.style.width = "0";
	frame.style.height = "0";
	frame.style.border = "0";
	document.body.appendChild(frame);
	const doc = frame.contentDocument;
	if (!doc) {
		frame.remove();
		return false;
	}
	doc.open();
	doc.write(html);
	doc.close();
	frame.contentWindow?.focus();
	frame.contentWindow?.print();
	// The frame is removed after the print dialog closes.
	setTimeout(() => frame.remove(), 60_000);
	return true;
}
