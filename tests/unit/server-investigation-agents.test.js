import {
	AGENT_ROLES,
	buildAgentPrompt,
	buildVerifyPrompt,
	JSON_CONTRACT,
} from "../../server/services/investigation/agents.js";

const DESCRIPTION = "The feed renders empty for signed-in users, but /api/feed returns 12 posts.";
const EVIDENCE = [
	"server/routes/feedRoutes.js",
	"src/pages/MainFeed.jsx:735",
	"screenshots/feed-empty.png",
];

describe("investigation agents (server/services/investigation/agents.js)", () => {
	test("declares exactly the five roles, in order", () => {
		expect(AGENT_ROLES).toEqual(["lead", "code", "repo", "research", "verify"]);
		expect(AGENT_ROLES).toHaveLength(5);
	});

	test("every role's prompt carries the description, the evidence, the read-only rule and the JSON contract", () => {
		for (const role of AGENT_ROLES) {
			const prompt = buildAgentPrompt(role, { description: DESCRIPTION, evidence: EVIDENCE });

			expect(prompt).toContain(DESCRIPTION);
			for (const item of EVIDENCE) {
				expect(prompt).toContain(item);
			}
			expect(prompt).toMatch(/read-only/i);
			expect(prompt).toMatch(/must not modify/i);
			expect(prompt).toContain(JSON_CONTRACT);
			expect(prompt.endsWith(JSON_CONTRACT)).toBe(true);
		}
	});

	test("the JSON contract is the exact string the parser is promised", () => {
		expect(JSON_CONTRACT).toBe(
			"Reply with a single JSON object and nothing else: {summary, findings:[{confidence, detail, evidence:[{file, lines, commit, url}]}], limitations}. confidence is one of confirmed, probable, speculative.",
		);
	});

	test("each role states its own question", () => {
		expect(buildAgentPrompt("lead", { description: DESCRIPTION })).toMatch(/actually being asked/i);
		expect(buildAgentPrompt("code", { description: DESCRIPTION })).toMatch(/where in the code/i);
		expect(buildAgentPrompt("repo", { description: DESCRIPTION })).toMatch(/break recently/i);
		expect(buildAgentPrompt("research", { description: DESCRIPTION })).toMatch(/external context/i);
		expect(buildAgentPrompt("verify", { description: DESCRIPTION })).toMatch(/refut/i);
	});

	test("the verify prompt asks for refutation and names the candidate list", () => {
		const prompt = buildAgentPrompt("verify", { description: DESCRIPTION, evidence: EVIDENCE });
		expect(prompt).toMatch(/refut/i);
		expect(prompt).toContain("Candidate findings to refute (0)");
	});

	test("a prompt names the role it is for", () => {
		for (const role of AGENT_ROLES) {
			expect(buildAgentPrompt(role, { description: DESCRIPTION })).toContain(
				`You are the ${role} investigator`,
			);
		}
	});

	test("an unknown role throws instead of silently becoming the lead prompt", () => {
		expect(() => buildAgentPrompt("chief", { description: DESCRIPTION })).toThrow(
			/Unknown investigation agent role/,
		);
		expect(() => buildAgentPrompt(undefined, { description: DESCRIPTION })).toThrow(
			/Unknown investigation agent role/,
		);
	});

	test("a missing or malformed context still produces a usable prompt", () => {
		const prompt = buildAgentPrompt("code");
		expect(typeof prompt).toBe("string");
		expect(prompt.endsWith(JSON_CONTRACT)).toBe(true);
		expect(prompt).toMatch(/read-only/i);
		expect(prompt).toContain("(no case description was supplied)");
		expect(prompt).toContain("(no evidence was supplied with this case)");
	});

	test("evidence objects are rendered rather than dropped", () => {
		const prompt = buildAgentPrompt("code", {
			description: DESCRIPTION,
			evidence: [
				{ file: "server/server.js", lines: "120-140", commit: "abc1234", url: "https://x/y" },
			],
		});
		expect(prompt).toContain("server/server.js");
		expect(prompt).toContain("120-140");
		expect(prompt).toContain("abc1234");
		expect(prompt).toContain("https://x/y");
	});

	test("the verify prompt carries every candidate finding and asks for refutation", () => {
		const prompt = buildVerifyPrompt({
			description: DESCRIPTION,
			candidateFindings: [
				{ confidence: "confirmed", detail: "bug A", evidence: [{ file: "a.js" }] },
				{ confidence: "probable", detail: "bug B", evidence: [] },
			],
		});

		expect(prompt).toContain(DESCRIPTION);
		expect(prompt).toContain("bug A");
		expect(prompt).toContain("bug B");
		expect(prompt).toMatch(/refut/i);
		expect(prompt).toMatch(/read-only/i);
		expect(prompt).toContain(JSON_CONTRACT);
		expect(prompt.endsWith(JSON_CONTRACT)).toBe(true);
	});

	test("the verify prompt survives an empty candidate list", () => {
		const prompt = buildVerifyPrompt({ description: DESCRIPTION });
		expect(prompt).toContain("Candidate findings to refute (0)");
		expect(prompt.endsWith(JSON_CONTRACT)).toBe(true);
	});
});
