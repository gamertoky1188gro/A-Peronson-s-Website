import { jest } from "@jest/globals";

/**
 * @jest-environment allure-jest/jsdom
 */

// Report export (Phase D.3).
//
// The report is written by the server as markdown and exported as a
// self-contained HTML document the browser can print to PDF. Two things
// matter here and both are pinned below:
//
//   - the export must be SAFE: the report quotes agent output, so nothing
//     from it may become markup. Every character is escaped before a single
//     tag is inserted.
//   - the export must be COMPLETE: the report's markdown subset (headings,
//     lists, bold, italic, inline code, fenced code) has to survive the
//     conversion, and an unknown line must not be dropped.

const { buildReportDocument, downloadReportHtml, escapeHtml, markdownToHtml, reportFilename } =
	await import("../../src/lib/reportExport.js");

describe("escapeHtml", () => {
	it("escapes every character that could open a tag", () => {
		expect(escapeHtml("<script>\"x\" & 'y'</script>")).toBe(
			"&lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;",
		);
	});
});

describe("markdownToHtml", () => {
	it("renders headings at their level", () => {
		expect(markdownToHtml("## Summary\n### Detail")).toBe("<h2>Summary</h2>\n<h3>Detail</h3>");
	});

	it("renders bullet and numbered lists", () => {
		expect(markdownToHtml("- one\n- two")).toBe("<ul><li>one</li><li>two</li></ul>");
		expect(markdownToHtml("1. first\n2. second")).toBe("<ol><li>first</li><li>second</li></ol>");
	});

	it("renders bold, italic and inline code", () => {
		const html = markdownToHtml("**Status:** `code` and _emphasis_");
		expect(html).toContain("<strong>Status:</strong>");
		expect(html).toContain("<code>code</code>");
		expect(html).toContain("<em>emphasis</em>");
	});

	it("renders a fenced code block without touching its content", () => {
		const html = markdownToHtml("```\nconst a = **1**;\n```");
		expect(html).toContain("<pre><code>");
		expect(html).toContain("const a = **1**;");
		expect(html).not.toContain("<strong>");
	});

	it("keeps a paragraph's lines together", () => {
		expect(markdownToHtml("first line\nsecond line")).toBe("<p>first line second line</p>");
	});

	it("the report's own bullet shape survives", () => {
		const report = [
			"- **Status:** complete",
			"- **Model:** minimax-m3.1-flash-free",
			"  - none recorded - an unevidenced claim cannot be confirmed",
		].join("\n");
		const html = markdownToHtml(report);
		expect(html).toContain("<strong>Status:</strong>");
		expect(html).toContain("none recorded");
	});

	it("a script tag in the report never becomes markup", () => {
		const html = markdownToHtml("<script>alert(1)</script>\n- <img src=x onerror=alert(1)>");
		expect(html).not.toContain("<script>");
		expect(html).not.toContain("<img");
		expect(html).toContain("&lt;script&gt;");
	});

	it("an unknown line is still rendered, never dropped", () => {
		expect(markdownToHtml("just a sentence")).toBe("<p>just a sentence</p>");
	});
});

describe("buildReportDocument", () => {
	it("is a complete document with the report inside it", () => {
		const html = buildReportDocument({
			title: "Investigation report",
			subtitle: "case-123",
			markdown: "## Summary\n\nIt works.",
		});
		expect(html).toContain("<!doctype html>");
		expect(html).toContain("<title>Investigation report</title>");
		expect(html).toContain("case-123");
		expect(html).toContain("<h2>Summary</h2>");
		expect(html).toContain("@media print");
	});

	it("the title cannot inject markup", () => {
		const html = buildReportDocument({ title: "<b>x</b>", markdown: "body" });
		expect(html).not.toContain("<b>x</b>");
		expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
	});
});

describe("reportFilename", () => {
	it("is safe on a filesystem and names the case", () => {
		const name = reportFilename("case/../etc passwd");
		expect(name).not.toContain("/");
		expect(name).not.toContain(" ");
		expect(name).toBe("investigation-report-case-..-etc-passwd.html");
	});
});

describe("downloadReportHtml", () => {
	it("offers the report as a file", () => {
		const click = jest.fn();
		const created = [];
		const originalCreateElement = document.createElement.bind(document);
		jest.spyOn(document, "createElement").mockImplementation((tag) => {
			const element = originalCreateElement(tag);
			if (tag === "a") {
				created.push(element);
				element.click = click;
			}
			return element;
		});
		const originalCreateObjectURL = URL.createObjectURL;
		const originalRevokeObjectURL = URL.revokeObjectURL;
		URL.createObjectURL = jest.fn(() => "blob:report");
		URL.revokeObjectURL = jest.fn();
		try {
			const name = downloadReportHtml({ caseId: "case-1", title: "Report", markdown: "body" });
			expect(name).toBe("investigation-report-case-1.html");
			expect(click).toHaveBeenCalledTimes(1);
			expect(created[0].download).toBe("investigation-report-case-1.html");
		} finally {
			document.createElement.mockRestore();
			URL.createObjectURL = originalCreateObjectURL;
			URL.revokeObjectURL = originalRevokeObjectURL;
		}
	});
});
