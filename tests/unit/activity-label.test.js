// tests/unit/activity-label.test.js
import { activityLabelFor } from "../../server/services/investigation/activityLabel.js";

const readPart = (path, name = "read") => ({
	type: "tool",
	name,
	state: { status: "completed", input: { path } },
});

it("read tools render the basename only", () => {
	expect(activityLabelFor(readPart("server/services/walletService.js"))).toEqual({
		kind: "read",
		label: "Reading walletService.js",
	});
	expect(
		activityLabelFor(readPart("/home/ccm/Desktop/A-Peronson-s-Website/src/App.jsx", "write")).label,
	).toBe("Writing App.jsx");
	expect(activityLabelFor(readPart('readPart: server/services/"quoted".js')).label).toBe(
		"Reading quoted.js",
	);
});

it("path traversal never escapes to a parent directory", () => {
	expect(activityLabelFor(readPart("../../.env")).label).toBe("Reading files");
	expect(activityLabelFor(readPart("..")).label).toBe("Reading files");
});

it("search tools show no pattern", () => {
	expect(activityLabelFor(readPart("coupon", "grep"))).toEqual({
		kind: "search",
		label: "Searching code",
	});
	expect(activityLabelFor(readPart("couponController", "glob"))).toEqual({
		kind: "search",
		label: "Searching code",
	});
});

it("unknown tools render only the sanitized tool name", () => {
	expect(activityLabelFor(readPart("x", "subagent"))).toEqual({
		kind: "other",
		label: "Using subagent",
	});
	expect(activityLabelFor(readPart("x", "drop-table!;rm-rf")).label.startsWith("Using ")).toBe(
		true,
	);
});

it("unreadable input degrades instead of throwing", () => {
	expect(activityLabelFor({ type: "tool", name: "read", state: null })).toEqual({
		kind: "read",
		label: "Reading files",
	});
	expect(activityLabelFor(null)).toEqual({ kind: "other", label: "Working" });
	expect(activityLabelFor("garbage")).toEqual({ kind: "other", label: "Working" });
});
