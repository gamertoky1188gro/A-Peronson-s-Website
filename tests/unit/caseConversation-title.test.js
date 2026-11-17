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
	// The marker must never cross the wire, even on a non-armed turn: the
	// leading TITLE line is dropped and no title is reported.
	expect(reply).toEqual({ title: null, cleaned: "Question?" });
});

it("answerClarification strips a leading TITLE line and emits no title on a non-armed turn", async () => {
	// Not the first client message (history already holds a client turn), so
	// the marker is not armed — but the model emitted one anyway. It must
	// not reach the client and must not become the subject.
	setClarificationProvider(async () => "TITLE: something\nthe real question");
	const answer = await answerClarification({
		subject: "Checkout fails",
		history: [{ role: "client", content: FIRST_MESSAGE }],
		clientMessage: "a second message",
	});
	expect(answer.reply).toBe("the real question");
	expect(answer.reply).not.toContain("TITLE:");
	expect(answer).not.toHaveProperty("title");
});

it("answerClarification passes the base prompt (no TITLE lines) to the provider on a non-armed turn", async () => {
	let seenPrompt = null;
	setClarificationProvider(async (_prompt, systemPrompt) => {
		seenPrompt = systemPrompt;
		return "Which plan are you on?";
	});
	await answerClarification({
		subject: "Checkout fails",
		history: [{ role: "client", content: FIRST_MESSAGE }],
		clientMessage: "a second message",
	});
	expect(seenPrompt).not.toContain("TITLE:");

	let seenArmedPrompt = null;
	setClarificationProvider(async (_prompt, systemPrompt) => {
		seenArmedPrompt = systemPrompt;
		return "Which plan are you on?";
	});
	await answerClarification({
		subject: "",
		history: [{ role: "client", content: FIRST_MESSAGE }],
		clientMessage: FIRST_MESSAGE,
	});
	expect(seenArmedPrompt).toContain("TITLE:");
});

it("extractTitleFromAnswer handles a marker-only reply (empty cleaned)", () => {
	const { title, cleaned } = extractTitleFromAnswer("TITLE: Coupon", { enabled: true });
	expect(title).toBe("Coupon");
	expect(cleaned).toBe("");
});

it("extractTitleFromAnswer strips a glued TITLE: prefix (title and question on one line)", () => {
	const raw =
		"TITLE: Coupon WELCOME3M missing months Did this happen only for this one buyer, or have other buyers redeemed WELCOME3M the same way?";
	const { title, cleaned } = extractTitleFromAnswer(raw, { enabled: true });
	expect(title).toBeNull();
	expect(cleaned).not.toContain("TITLE:");
	expect(cleaned).toBe(
		"Coupon WELCOME3M missing months Did this happen only for this one buyer, or have other buyers redeemed WELCOME3M the same way?",
	);
});

it("extractTitleFromAnswer strips an overlong TITLE: first line glued with a question", () => {
	const overlongTitle = `TITLE: ${"Coupon WELCOME3M missing months ".repeat(6).trim()}\nWhich page were you on?`;
	expect(overlongTitle.split("\n")[0].length).toBeGreaterThan(80);
	const { title, cleaned } = extractTitleFromAnswer(overlongTitle, { enabled: true });
	expect(title).toBeNull();
	expect(cleaned).not.toContain("TITLE:");
	expect(cleaned).toContain("Which page were you on?");
});

it("answerClarification never leaks a glued TITLE: prefix to the buyer's bubble", async () => {
	setClarificationProvider(
		async () =>
			"TITLE: Coupon WELCOME3M missing months Did this happen only for this one buyer, or have other buyers redeemed WELCOME3M the same way?",
	);
	const answer = await answerClarification({
		subject: "",
		history: [{ role: "client", content: FIRST_MESSAGE }],
		clientMessage: FIRST_MESSAGE,
	});
	expect(answer.reply).not.toContain("TITLE:");
	expect(answer.reply.length).toBeGreaterThan(0);
	expect(answer.title).toBeTruthy();
	expect(answer.title).not.toMatch(/^TITLE:/iu);
	expect(FIRST_MESSAGE).toContain(String(answer.title).split(" ")[0]);
});

it("a marker on a later line is removed (a)", () => {
	const { title, cleaned } = extractTitleFromAnswer("Question?\nSome context.\nTITLE: Too late", {
		enabled: true,
	});
	expect(title).toBeNull();
	expect(cleaned).toBe("Question?\nSome context.");
	expect(cleaned).not.toContain("TITLE:");
});

it("a marker glued mid-sentence in line 1 never reaches the wire (b)", () => {
	const { title, cleaned } = extractTitleFromAnswer(
		"Sure! TITLE: Coupon broke and renewals may be skipped\nWhich page were you on?",
		{ enabled: true },
	);
	expect(title).toBeNull();
	expect(cleaned).not.toContain("TITLE:");
});

it("a disarmed turn echoing a mixed-case Title: marker is stripped (c)", () => {
	const reply = extractTitleFromAnswer("Title: Coupon\nWhich plan are you on?", {
		enabled: false,
	});
	expect(reply).toEqual({ title: null, cleaned: "Which plan are you on?" });
});

it("deriveCaseSubject model title wins; falls back to the message's first words", () => {
	expect(deriveCaseSubject({ modelTitle: "Coupon broken", firstMessage: "x y" })).toBe(
		"Coupon broken",
	);
	const fallback = deriveCaseSubject({
		firstMessage: "the verification renewal never applies the free months we owe buyers for coupon",
	});
	expect(fallback).toBe("the verification renewal never applies the free");
	expect(fallback.length).toBeLessThanOrEqual(48);
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

it("answerClarification strips a bare TITLE: line and falls back to a derived title", async () => {
	setClarificationProvider(async () => "TITLE:\nWhen exactly does the card check fail?");
	const answer = await answerClarification({
		subject: "",
		history: [{ role: "client", content: FIRST_MESSAGE }],
		clientMessage: FIRST_MESSAGE,
	});
	expect(answer.reply).toBe("When exactly does the card check fail?");
	expect(answer.reply).not.toContain("TITLE:");
	expect(answer.title).toBeTruthy();
	expect(FIRST_MESSAGE).toContain(String(answer.title).split(" ")[0]);
});

it("answerClarification with no provider still returns a deterministic fallback title", async () => {
	const previousProvider = process.env.CASE_AI_PROVIDER;
	const previousAiEnabled = process.env.AI_ENABLED;
	process.env.CASE_AI_PROVIDER = "none";
	process.env.AI_ENABLED = "false";
	try {
		const answer = await answerClarification({
			subject: "",
			history: [{ role: "client", content: FIRST_MESSAGE }],
			clientMessage: FIRST_MESSAGE,
		});
		expect(answer.title).toBeTruthy();
		expect(FIRST_MESSAGE).toContain(String(answer.title).split(" ")[0]);
	} finally {
		if (previousProvider === undefined) {
			delete process.env.CASE_AI_PROVIDER;
		} else {
			process.env.CASE_AI_PROVIDER = previousProvider;
		}
		if (previousAiEnabled === undefined) {
			delete process.env.AI_ENABLED;
		} else {
			process.env.AI_ENABLED = previousAiEnabled;
		}
	}
});
