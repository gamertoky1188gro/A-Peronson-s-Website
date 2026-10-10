import {
	buildInvalidatePayload,
	buildSyncHead,
	computeHash,
	needsReset,
	outboxInsert,
	sortDeltaBySeq,
	stableStringify,
} from "../../server/utils/hypercache.js";

describe("hypercache pure helpers (server/utils/hypercache.js)", () => {
	test("stableStringify orders keys so equal objects hash equally", () => {
		expect(stableStringify({ b: 1, a: 2 })).toBe(stableStringify({ a: 2, b: 1 }));
		expect(stableStringify({ nested: { z: 1, a: [3, 2] } })).toContain('"a"');
		expect(stableStringify(null)).toBe("null");
		expect(stableStringify([3, 1])).toBe("[3,1]");
	});

	test("computeHash is deterministic and collision-resistant for test vectors", () => {
		expect(computeHash({ a: 1 })).toBe(computeHash({ a: 1 }));
		expect(computeHash({ a: 1 })).not.toBe(computeHash({ a: 2 }));
		expect(computeHash({ a: 1 })).toMatch(/^[0-9a-f]{64}$/);
	});

	test("buildSyncHead/buildInvalidatePayload coerce and shape payloads", () => {
		expect(buildSyncHead({ entity: "products", version: "3", hash: "abc", seq: 9 })).toEqual({
			entity: "products",
			version: 3,
			hash: "abc",
			seq: 9,
		});
		expect(buildInvalidatePayload({ entity: "leads", id: 7, version: 1, hash: "h" })).toMatchObject(
			{
				type: "invalidate",
				entity: "leads",
				id: "7",
			},
		);
	});

	test("sortDeltaBySeq orders numeric seq ascending without mutating", () => {
		const input = [{ seq: 3 }, { seq: 1 }, { seq: 2 }];
		const sorted = sortDeltaBySeq(input);
		expect(sorted.map((e) => e.seq)).toEqual([1, 2, 3]);
		expect(input[0].seq).toBe(3);
	});

	test("needsReset detects gaps and out-of-order deltas", () => {
		expect(needsReset({ lastSeq: 5, entries: [] })).toEqual({ ok: true });
		expect(needsReset({ lastSeq: 5, entries: [{ seq: 6 }, { seq: 7 }] })).toEqual({ ok: true });
		expect(needsReset({ lastSeq: "unknown", entries: [{ seq: 99 }] })).toEqual({ ok: true });

		const gap = needsReset({ lastSeq: 5, entries: [{ seq: 7 }] });
		expect(gap.ok).toBe(false);
		expect(gap.code).toBe("RESET_REQUIRED");

		const hole = needsReset({ lastSeq: 5, entries: [{ seq: 6 }, { seq: 8 }] });
		expect(hole).toMatchObject({ ok: false, code: "RESET_REQUIRED", expectedSeq: 7 });
	});

	test("outboxInsert dedupes on idempotencyKey and requires a key", () => {
		const store = new Map();
		expect(outboxInsert(store, { idempotencyKey: "k-1", op: "sync" })).toEqual({
			inserted: true,
			key: "k-1",
		});
		expect(outboxInsert(store, { idempotencyKey: "k-1", op: "sync" })).toEqual({
			inserted: false,
			key: "k-1",
		});
		expect(() => outboxInsert(store, { op: "no-key" })).toThrow("idempotencyKey required");
	});
});
