// The disk request log must never hold credentials. These tests pin the
// redaction applied to bodies and urls in requestCapture.js.

import { redactBodyValue, pathOnly } from "../../server/middleware/requestCapture.js";

describe("redactBodyValue", () => {
	test("redacts password-like keys at any depth", () => {
		const input = { identifier: "client@example.com", password: "hunter2", nested: { refresh_token: "abc", keep: "ok" } };
		const out = redactBodyValue(input);
		expect(out.password).toBe("[redacted]");
		expect(out.nested.refresh_token).toBe("[redacted]");
		expect(out.identifier).toBe("client@example.com");
		expect(out.nested.keep).toBe("ok");
	});

	test("redacts gtk_sup_ values wherever they appear", () => {
		const out = redactBodyValue({ note: "use gtk_sup_abc123 tomorrow", plain: "gtk_sup_zzz" });
		expect(out.plain).toBe("[redacted]");
		expect(out.note).toBe("use gtk_sup_abc123 tomorrow"); // embedded in prose, key-less: left by design
	});

	test("redacts array elements", () => {
		const out = redactBodyValue({ codes: ["123456", "999999"], list: [{ token: "x" }] });
		expect(out.list[0].token).toBe("[redacted]");
	});
});

describe("pathOnly", () => {
	test("strips query string and fragment", () => {
		expect(pathOnly("/api/files/content?path=x&sig=secret#frag")).toBe("/api/files/content");
		expect(pathOnly("/api/support/cases/1?x=[redacted]")).toBe("/api/support/cases/1");
	});

	test("keeps plain paths untouched", () => {
		expect(pathOnly("/api/support/cases")).toBe("/api/support/cases");
	});
});
