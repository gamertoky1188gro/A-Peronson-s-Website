/** @jest-environment node */

import {
	buildInvalidatePayload,
	buildSyncHead,
	computeHash,
	needsReset,
	outboxInsert,
	sortDeltaBySeq,
} from "../server/utils/hypercache.js";

describe("hypercache Phase 4 (unit-only, no DB/redis/network)", () => {
	test("head shape: buildSyncHead returns entity/version/hash/seq contract", () => {
		const head = buildSyncHead({ entity: "feed", version: 7, hash: "abc123", seq: 42 });
		expect(head).toEqual({ entity: "feed", version: 7, hash: "abc123", seq: 42 });
		expect(typeof head.entity).toBe("string");
		expect(typeof head.version).toBe("number");
		expect(typeof head.hash).toBe("string");
	});

	test("delta ordering: out-of-order prisma rows sort ascending by seq", async () => {
		// Mock prisma model (in-memory, no DB). Hand-rolled mock (no jest.fn)
		// so this also runs under native ESM where the jest global is absent.
		const rowsData = [
			{ seq: 3, entity: "feed", id: "c" },
			{ seq: 1, entity: "feed", id: "a" },
			{ seq: 2, entity: "feed", id: "b" },
		];
		let findManyCalls = 0;
		const prisma = {
			feedOutbox: {
				findMany: async () => {
					findManyCalls += 1;
					return rowsData.map((r) => ({ ...r }));
				},
			},
		};

		const rows = await prisma.feedOutbox.findMany({ orderBy: undefined });
		expect(findManyCalls).toBe(1);
		const ordered = sortDeltaBySeq(rows);
		expect(ordered.map((r) => r.seq)).toEqual([1, 2, 3]);
		expect(ordered.map((r) => r.id)).toEqual(["a", "b", "c"]);
		// Input array is not mutated.
		expect(rows.map((r) => r.seq)).toEqual([3, 1, 2]);
	});

	test("hash determinism: key order and repeated calls give identical digests", () => {
		const a = computeHash({ entity: "feed", id: "1", version: 2 });
		const b = computeHash({ version: 2, id: "1", entity: "feed" });
		const c = computeHash({ entity: "feed", id: "1", version: 2 });
		expect(a).toBe(b);
		expect(a).toBe(c);
		expect(a).toMatch(/^[0-9a-f]{64}$/);
		expect(computeHash({ entity: "feed", id: "2", version: 2 })).not.toBe(a);
	});

	test("outbox idempotency: same key inserts once", () => {
		const store = new Map();
		const first = outboxInsert(store, {
			idempotencyKey: "evt-1",
			payload: buildInvalidatePayload({ entity: "feed", id: "p1", version: 1, hash: "h1", seq: 1 }),
		});
		const second = outboxInsert(store, {
			idempotencyKey: "evt-1",
			payload: buildInvalidatePayload({ entity: "feed", id: "p1", version: 1, hash: "h1", seq: 1 }),
		});
		expect(first).toEqual({ inserted: true, key: "evt-1" });
		expect(second).toEqual({ inserted: false, key: "evt-1" });
		expect(store.size).toBe(1);
		expect(() => outboxInsert(store, { payload: {} })).toThrow("idempotencyKey required");
	});

	test("RESET_REQUIRED: seq gap detected, contiguous stream passes", () => {
		const gap = needsReset({
			lastSeq: 5,
			entries: [
				{ seq: 8, entity: "feed", id: "x" },
				{ seq: 7, entity: "feed", id: "y" },
			],
		});
		expect(gap.ok).toBe(false);
		expect(gap.code).toBe("RESET_REQUIRED");

		const midGap = needsReset({
			lastSeq: 5,
			entries: [{ seq: 6 }, { seq: 9 }],
		});
		expect(midGap).toMatchObject({ ok: false, code: "RESET_REQUIRED" });

		const contiguous = needsReset({
			lastSeq: 5,
			entries: [{ seq: 7 }, { seq: 6 }, { seq: 8 }],
		});
		expect(contiguous).toEqual({ ok: true });
		expect(needsReset({ lastSeq: 5, entries: [] })).toEqual({ ok: true });
	});
});
