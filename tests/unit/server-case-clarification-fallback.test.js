import {
	answerClarification,
	resetClarificationProvider,
	setClarificationProvider,
} from "../../server/services/caseConversationService.js";

// When the caller-injected provider answers with nothing usable, the service
// must fall through to the configured (env/module-override) provider before
// settling on the fixed fallback question.

afterEach(() => {
	resetClarificationProvider();
});

test("injected provider returning null falls through to the configured provider", async () => {
	setClarificationProvider(async () => "SENTINEL-CONFIGURED-ANSWER");
	const result = await answerClarification({
		subject: "Checkout fails",
		messages: [{ role: "client", content: "The page is blank after login" }],
		provider: async () => null,
	});
	expect(result.reply).toBe("SENTINEL-CONFIGURED-ANSWER");
	expect(result.ready).toBe(false);
});
