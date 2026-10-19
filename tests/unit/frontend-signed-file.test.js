import { jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";

const apiRequest = jest.fn();
const getToken = jest.fn(() => "test-token");
// The helper imports both symbols; an ESM mock factory that omits one fails at
// link time with "does not provide an export named 'getToken'".
jest.unstable_mockModule("../../src/lib/auth.js", () => ({ apiRequest, getToken }));

const { isGatedAssetPath, signAndAssign, signAndDownload, signAndOpen, signOne, signPaths } =
	await import("../../src/lib/signedFile.js");
// Imported dynamically for the same reason: it reaches the mocked auth module
// through signedFile.js, so it must be linked after the mock is registered.
const { useSignedSrc } = await import("../../src/hooks/useSignedSrc.js");

/** Captures anchor clicks so signAndDownload can be asserted without navigating. */
function captureAnchorClicks() {
	const clicks = [];
	const original = HTMLAnchorElement.prototype.click;
	HTMLAnchorElement.prototype.click = function capture() {
		clicks.push({ href: this.getAttribute("href"), download: this.download });
	};
	return {
		clicks,
		restore() {
			HTMLAnchorElement.prototype.click = original;
		},
	};
}

beforeEach(() => {
	apiRequest.mockReset();
	getToken.mockClear();
});

describe("signed file helper (src/lib/signedFile.js)", () => {
	test("returns the server payload for each path", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/contracts/a.pdf": { url: "/api/files/content?x=1" } },
		});
		const out = await signPaths(["/uploads/contracts/a.pdf"]);
		expect(out["/uploads/contracts/a.pdf"].url).toBe("/api/files/content?x=1");
	});

	test("sends the bearer token, the method and the path list", async () => {
		apiRequest.mockResolvedValue({ signed: {} });
		await signPaths(["/uploads/contracts/a.pdf"]);
		expect(apiRequest).toHaveBeenCalledWith("/files/sign", {
			method: "POST",
			token: "test-token",
			body: { paths: ["/uploads/contracts/a.pdf"] },
		});
	});

	test("normalises an absolute url to its pathname before signing", async () => {
		// With VITE_API_URL set, toAbsoluteAssetUrl() hands us an absolute url.
		// isGatedPath only strips a leading "uploads/", so an absolute url used to
		// arrive as the first segment "http:" and be reported not_gated.
		apiRequest.mockResolvedValue({ signed: {} });
		await signPaths(["https://api.example.com/uploads/chat/a.png"]);
		expect(apiRequest).toHaveBeenCalledWith(
			"/files/sign",
			expect.objectContaining({ body: { paths: ["/uploads/chat/a.png"] } }),
		);
	});

	test("keys the result by the normalised path, not the path passed in", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/chat/a.png": { url: "/api/files/content?z=3" } },
		});
		const out = await signPaths(["https://api.example.com/uploads/chat/a.png"]);
		expect(out["/uploads/chat/a.png"].url).toBe("/api/files/content?z=3");
		expect(await signOne("https://api.example.com/uploads/chat/a.png")).toBe(
			"/api/files/content?z=3",
		);
	});

	test("returns false when the server refuses the path", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/contracts/a.pdf": { error: "forbidden" } },
		});
		expect(await signAndOpen("/uploads/contracts/a.pdf")).toBe(false);
	});

	test("returns false on a network failure", async () => {
		apiRequest.mockRejectedValue(new Error("offline"));
		expect(await signAndOpen("/uploads/contracts/a.pdf")).toBe(false);
	});

	test("opens the signed url", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/contracts/a.pdf": { url: "/api/files/content?x=1" } },
		});
		// Assigning `globalThis.window` is a no-op under jsdom — `window` is a
		// non-writable self-reference — so shadow `open` on the real window and
		// restore it afterwards.
		const open = jest.fn();
		const originalOpen = window.open;
		window.open = open;
		try {
			expect(await signAndOpen("/uploads/contracts/a.pdf")).toBe(true);
			expect(open).toHaveBeenCalledWith("/api/files/content?x=1", "_blank");
		} finally {
			window.open = originalOpen;
		}
	});

	test("assigns the signed url to a setter", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/chat/b.png": { url: "/api/files/content?y=2" } },
		});
		const setter = jest.fn();
		expect(await signAndAssign("/uploads/chat/b.png", setter)).toBe(true);
		expect(setter).toHaveBeenCalledWith("/api/files/content?y=2");
	});

	test("never calls the setter when the server refuses the path", async () => {
		// The DOM-sink invariant: a rendered src is only ever assigned a value the
		// server will accept, so a refusal must leave the sink empty rather than
		// fall back to the raw path.
		apiRequest.mockResolvedValue({
			signed: { "/uploads/chat/b.png": { error: "forbidden", status: 403 } },
		});
		const setter = jest.fn();
		expect(await signAndAssign("/uploads/chat/b.png", setter)).toBe(false);
		expect(setter).not.toHaveBeenCalled();
	});

	test("never calls the setter when the sign request fails outright", async () => {
		apiRequest.mockRejectedValue(new Error("offline"));
		const setter = jest.fn();
		expect(await signAndAssign("/uploads/chat/b.png", setter)).toBe(false);
		expect(setter).not.toHaveBeenCalled();
	});

	test("signOne returns the url, or null when refused", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/chat/b.png": { url: "/api/files/content?y=2" } },
		});
		expect(await signOne("/uploads/chat/b.png")).toBe("/api/files/content?y=2");

		apiRequest.mockResolvedValue({ signed: { "/uploads/chat/b.png": { error: "forbidden" } } });
		expect(await signOne("/uploads/chat/b.png")).toBeNull();

		expect(await signOne("")).toBeNull();
		expect(await signOne(null)).toBeNull();
	});

	test("signAndDownload clicks an anchor carrying the download attribute", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/chat/report.pdf": { url: "/api/files/content?d=4" } },
		});
		const capture = captureAnchorClicks();
		try {
			expect(await signAndDownload("/uploads/chat/report.pdf", "report.pdf")).toBe(true);
		} finally {
			capture.restore();
		}
		expect(capture.clicks).toEqual([{ href: "/api/files/content?d=4", download: "report.pdf" }]);
		// The synthetic anchor must not be left behind in the document.
		expect(document.querySelectorAll("a")).toHaveLength(0);
	});

	test("signAndDownload clicks nothing when the server refuses the path", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/chat/report.pdf": { error: "forbidden" } },
		});
		const capture = captureAnchorClicks();
		try {
			expect(await signAndDownload("/uploads/chat/report.pdf", "report.pdf")).toBe(false);
		} finally {
			capture.restore();
		}
		expect(capture.clicks).toEqual([]);
		expect(document.querySelectorAll("a")).toHaveLength(0);
	});

	test("isGatedAssetPath mirrors the server's gated prefixes", () => {
		expect(isGatedAssetPath("/uploads/chat/a.png")).toBe(true);
		expect(isGatedAssetPath("/uploads/contracts/a.pdf")).toBe(true);
		expect(isGatedAssetPath("/uploads/calls/r.mp4")).toBe(true);
		expect(isGatedAssetPath("/uploads/search/q.png")).toBe(true);
		expect(isGatedAssetPath("uploads/chat/a.png")).toBe(true);
		expect(isGatedAssetPath("/uploads/Chat/A.PNG")).toBe(true);
		expect(isGatedAssetPath("https://api.example.com/uploads/chat/a.png")).toBe(true);

		expect(isGatedAssetPath("/uploads/feed/c.png")).toBe(false);
		expect(isGatedAssetPath("/uploads/profile/p.jpg")).toBe(false);
		expect(isGatedAssetPath("https://cdn.example.com/logo.png")).toBe(false);
		expect(isGatedAssetPath("")).toBe(false);
		expect(isGatedAssetPath(null)).toBe(false);
	});
});

describe("useSignedSrc (src/hooks/useSignedSrc.js)", () => {
	test("returns an empty string until the server hands back a url", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/chat/a.png": { url: "/api/files/content?h=1" } },
		});
		const { result } = renderHook(() => useSignedSrc("/uploads/chat/a.png"));
		expect(result.current).toBe("");
		await waitFor(() => expect(result.current).toBe("/api/files/content?h=1"));
	});

	test("stays empty when the server refuses the path", async () => {
		apiRequest.mockResolvedValue({ signed: { "/uploads/chat/a.png": { error: "forbidden" } } });
		const { result } = renderHook(() => useSignedSrc("/uploads/chat/a.png"));
		await waitFor(() => expect(apiRequest).toHaveBeenCalledTimes(1));
		expect(result.current).toBe("");
	});

	test("clears and re-signs when the url changes", async () => {
		apiRequest.mockResolvedValue({
			signed: {
				"/uploads/chat/a.png": { url: "/api/files/content?h=1" },
				"/uploads/chat/b.png": { url: "/api/files/content?h=2" },
			},
		});
		const { result, rerender } = renderHook(({ url }) => useSignedSrc(url), {
			initialProps: { url: "/uploads/chat/a.png" },
		});
		await waitFor(() => expect(result.current).toBe("/api/files/content?h=1"));
		rerender({ url: "/uploads/chat/b.png" });
		expect(result.current).toBe("");
		await waitFor(() => expect(result.current).toBe("/api/files/content?h=2"));
	});

	test("re-signs on the refresh interval so a long-lived surface does not outlive its signature", async () => {
		apiRequest.mockResolvedValue({
			signed: { "/uploads/chat/a.png": { url: "/api/files/content?h=1" } },
		});
		renderHook(() => useSignedSrc("/uploads/chat/a.png", { refreshMs: 5 }));
		await waitFor(() => expect(apiRequest).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(apiRequest.mock.calls.length).toBeGreaterThan(1));
	});

	test("does not sign when the url is empty", async () => {
		const { result } = renderHook(() => useSignedSrc(""));
		await waitFor(() => expect(result.current).toBe(""));
		expect(apiRequest).not.toHaveBeenCalled();
	});
});
