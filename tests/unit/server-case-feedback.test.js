import { jest } from "@jest/globals";

// Buyer feedback on a finished investigation report (Phase D.5).
//
// The rating lives out-of-line in `local_json`, keyed by case id, so the
// support_cases contract stays untouched. What matters here:
//
//   - only `up` / `down` are accepted, and anything else is a 400
//   - a repeat rating overwrites the stored entry instead of stacking
//   - the note is sanitised and capped at MAX_FEEDBACK_NOTE
//   - a missing case has no feedback, not an error

const { FEEDBACK_RATINGS, MAX_FEEDBACK_NOTE, getCaseFeedback, listCaseFeedback, setCaseFeedback } =
	await import("../../server/services/caseService.js");

beforeEach(() => {
	process.env.NODE_ENV = "test";
});

describe("setCaseFeedback", () => {
	it("stores an up rating with its note", async () => {
		const entry = await setCaseFeedback("case-a", { rating: "up", note: "Found it" });
		expect(entry.rating).toBe("up");
		expect(entry.note).toBe("Found it");
		expect(String(entry.updated_at)).toBeTruthy();
		expect(await getCaseFeedback("case-a")).toMatchObject({ rating: "up", note: "Found it" });
	});

	it("rejects a rating outside up/down with a 400", async () => {
		await expect(setCaseFeedback("case-b", { rating: "meh" })).rejects.toMatchObject({
			status: 400,
		});
	});

	it("a repeat rating replaces the previous one", async () => {
		await setCaseFeedback("case-c", { rating: "up", note: "first" });
		await setCaseFeedback("case-c", { rating: "down", note: "changed my mind" });
		expect(await getCaseFeedback("case-c")).toMatchObject({ rating: "down" });
		expect((await listCaseFeedback())["case-c"].rating).toBe("down");
	});

	it("escapes and caps the note", async () => {
		const note = `<script>${"x".repeat(MAX_FEEDBACK_NOTE + 200)}</script>`;
		const entry = await setCaseFeedback("case-d", { rating: "down", note });
		expect(entry.note).not.toContain("<script>");
		expect(entry.note.length).toBeLessThanOrEqual(MAX_FEEDBACK_NOTE);
	});

	it("a case that was never rated reads as null", async () => {
		expect(await getCaseFeedback("case-never-rated")).toBeNull();
	});
});

describe("FEEDBACK_RATINGS", () => {
	it("names exactly the two allowed ratings", () => {
		expect([...FEEDBACK_RATINGS].sort()).toEqual(["down", "up"]);
	});
});
