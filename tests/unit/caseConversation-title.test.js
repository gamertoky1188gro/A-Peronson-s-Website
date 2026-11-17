import { jest } from "@jest/globals";
import {
	answerClarification,
	deriveCaseSubject,
	extractTitleFromAnswer,
	resetClarificationProvider,
	setClarificationProvider,
} from "../../server/services/caseConversationService.js";

beforeEach(() => resetClarificationProvider());

const FIRST_MESSAGE =
	"Hi — our launch coupon WELCOME3M: 3 free months of verification renewal, and it was supposed to require a saved card.";

it("extractTitleFromAnswer takes and strips the first-line marker", () => {
	const { title, cleaned } = extractTitleFromAnswer(
		"TITLE: Coupon settings not persisting\nWhy would requires_card never fire?",
		{ enabled: true },
	);
	expect(title).toBe("Coupon settings not persisting");
	expect(cleaned).toBe("Why would requires_card never fire?");
});

it("extractTitleFromAnswer refuses when disabled (not the first message)", () => {
	const reply = extractTitleFromAnswer("TITLE: Coupon\nQuestion?", { enabled: false });
	expect(reply).toEqual({ title: null, cleaned: "TITLE: Coupon\nQuestion?" });
});

it("extractTitleFromAnswer handles a marker-only reply (empty cleaned)", () => {
	const { title, cleaned } = extractTitleFromAnswer("TITLE: Coupon", { enabled: true });
	expect(title).toBe("Coupon");
	expect(cleaned).toBe("");
});

it("extractTitleFromAnswer ignores a marker on a later line", () => {
	const { title, cleaned } = extractTitleFromAnswer("Question?\nTITLE: Too late", {
		enabled: true,
	});
	expect(title).toBeNull();
	expect(cleaned).toBe("Question?\nTITLE: Too late");
});

it("deriveCaseSubject model title wins; falls back to the message's first words", () => {
	expect(deriveCaseSubject({ modelTitle: "Coupon broken", firstMessage: "x y" })).toBe(
		"Coupon broken",
	);
	expect(
		deriveCaseSubject({
			firstMessage:
				"the verification renewal never applies the free months we owe buyers for coupon",
		}),
	).toBe("the verification renewal never applies the free months");
	expect(deriveCaseSubject({})).toBeNull();
});

it("answerClarification emits and strips TITLE via an injected provider", async () => {
	setClarificationProvider(
		async () => "TITLE: WELCOME3M ignores requires_card\nWhen exactly does the card check fail?",
	);
	const answer = await answerClarification({
		subject: "",
		history: [{ role: "client", content: FIRST_MESSAGE }],
		clientMessage: FIRST_MESSAGE,
	});
	expect(answer.title).toBe("WELCOME3M ignores requires_card");
	expect(answer.reply).toBe("When exactly does the card check fail?");
	expect(answer.reply).not.toContain("TITLE:");
});

it("answerClarification with no provider still returns a deterministic fallback title", async () => {
	process.env.CASE_AI_PROVIDER = "none";
	process.env.AI_ENABLED = "false";
	const answer = await answerClarification({
		subject: "",
		history: [{ role: "client", content: FIRST_MESSAGE }],
		clientMessage: FIRST_MESSAGE,
	});
	expect(answer.title).toBeTruthy();
	expect(FIRST_MESSAGE).toContain(String(answer.title).split(" ")[0]);
});
