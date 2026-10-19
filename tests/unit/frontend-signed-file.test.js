import { jest } from "@jest/globals";

const apiRequest = jest.fn();
const getToken = jest.fn(() => "test-token");
// The helper imports both symbols; an ESM mock factory that omits one fails at
// link time with "does not provide an export named 'getToken'".
jest.unstable_mockModule("../../src/lib/auth.js", () => ({ apiRequest, getToken }));

const { signPaths, signAndOpen, signAndAssign } = await import("../../src/lib/signedFile.js");

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

	test("sends the bearer token", async () => {
		apiRequest.mockResolvedValue({ signed: {} });
		await signPaths(["/uploads/contracts/a.pdf"]);
		expect(apiRequest).toHaveBeenCalledWith(
			"/files/sign",
			expect.objectContaining({ method: "POST" }),
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
});
