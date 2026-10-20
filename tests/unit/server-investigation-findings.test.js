import {
	demoteUnsubstantiated,
	normalizeFindings,
	parseAgentJson,
} from "../../server/services/investigation/findings.js";

describe("investigation findings (server/services/investigation/findings.js)", () => {
	test("extracts a fenced json block", () => {
		const result = parseAgentJson(
			'prose\n```json\n{"summary":"ok","findings":[]}\n```\nmore prose',
		);
		expect(result.ok).toBe(true);
		expect(result.value.summary).toBe("ok");
	});

	test("extracts a bare balanced object", () => {
		const result = parseAgentJson('here it is {"summary":"ok"} and that is all');
		expect(result.ok).toBe(true);
		expect(result.value.summary).toBe("ok");
	});

	test("fails cleanly on prose with no object", () => {
		const result = parseAgentJson("I could not find anything");
		expect(result.ok).toBe(false);
	});

	test("normalizes and clamps confidence values", () => {
		const findings = normalizeFindings({
			findings: [
				{ confidence: "CONFIRMED", detail: "a" },
				{ confidence: "nonsense", detail: "b" },
				{ detail: "c" },
			],
		});
		expect(findings).toHaveLength(3);
		expect(findings[0].confidence).toBe("confirmed");
		expect(findings[1].confidence).toBe("speculative");
		expect(findings[2].confidence).toBe("speculative");
	});

	test("demotes a finding with no evidence", () => {
		const demoted = demoteUnsubstantiated([
			{ confidence: "confirmed", detail: "x", evidence: [] },
			{ confidence: "confirmed", detail: "y", evidence: [{ file: "server/server.js" }] },
		]);
		expect(demoted[0].confidence).toBe("speculative");
		expect(demoted[1].confidence).toBe("confirmed");
	});

	describe("parseAgentJson", () => {
		test("never throws, whatever it is handed", () => {
			const inputs = [
				null,
				undefined,
				42,
				"",
				"   ",
				"```json\nnot json\n```",
				"{{{",
				"[]",
				"\u0000",
			];
			for (const input of inputs) {
				let result;
				expect(() => {
					result = parseAgentJson(input);
				}).not.toThrow();
				expect(result.ok).toBe(false);
				expect(typeof result.reason).toBe("string");
				expect(result.reason.length).toBeGreaterThan(0);
			}
		});

		test("reports a reason for each kind of failure", () => {
			expect(parseAgentJson("I could not find anything").reason).toBe("no_json_found");
			expect(parseAgentJson('```json\n{"a":1\n```').reason).toBe("invalid_json");
			expect(parseAgentJson("[1,2,3]").reason).toBe("not_an_object");
		});

		test("prefers a fenced block over an object in the surrounding prose", () => {
			const text = 'first {"summary":"from prose"}\n```json\n{"summary":"from fence"}\n```';
			const result = parseAgentJson(text);
			expect(result.ok).toBe(true);
			expect(result.value.summary).toBe("from fence");
		});

		test("ignores braces that live inside strings", () => {
			const result = parseAgentJson('prose { note: "}" } then {"summary":"ok","n":1}');
			expect(result.ok).toBe(true);
			expect(result.value.summary).toBe("ok");
			expect(result.value.n).toBe(1);
		});

		test("keeps the whole nested object", () => {
			const result = parseAgentJson(
				'{"summary":"ok","findings":[{"detail":"a"}],"limitations":[]}',
			);
			expect(result.ok).toBe(true);
			expect(result.value.findings).toHaveLength(1);
			expect(result.value.limitations).toEqual([]);
		});
	});

	describe("normalizeFindings", () => {
		test("accepts a bare array as well as the agent object", () => {
			const fromArray = normalizeFindings([{ confidence: "probable", detail: "a" }]);
			expect(fromArray).toHaveLength(1);
			expect(fromArray[0].confidence).toBe("probable");
		});

		test("gives every finding all three keys and no undefined value", () => {
			const findings = normalizeFindings({
				findings: [{ detail: "only a detail" }, { confidence: "confirmed" }],
			});
			for (const finding of findings) {
				expect(Object.keys(finding).sort()).toEqual(["confidence", "detail", "evidence"]);
				expect(finding.evidence).toEqual([]);
				expect(typeof finding.detail).toBe("string");
				expect(typeof finding.confidence).toBe("string");
				for (const value of Object.values(finding)) {
					expect(value).not.toBeUndefined();
				}
			}
		});

		test("keeps evidence entries and drops the ones that carry no reference", () => {
			const findings = normalizeFindings({
				findings: [
					{
						confidence: "confirmed",
						detail: "a",
						evidence: [
							{ file: "server/server.js", lines: "120-140", commit: "abc1234", url: "https://x" },
							{ file: "server/other.js" },
							{ nothing: "useful" },
						],
					},
				],
			});
			expect(findings[0].evidence).toHaveLength(2);
			expect(findings[0].evidence[0]).toEqual({
				file: "server/server.js",
				lines: "120-140",
				commit: "abc1234",
				url: "https://x",
			});
			expect(findings[0].evidence[1]).toEqual({ file: "server/other.js" });
		});

		test("turns a missing or non-array evidence into an empty array", () => {
			const findings = normalizeFindings({
				findings: [
					{ detail: "a" },
					{ detail: "b", evidence: "nope" },
					{ detail: "c", evidence: null },
				],
			});
			for (const finding of findings) {
				expect(finding.evidence).toEqual([]);
			}
		});

		test("returns an empty array for junk input", () => {
			expect(normalizeFindings(null)).toEqual([]);
			expect(normalizeFindings(undefined)).toEqual([]);
			expect(normalizeFindings("nope")).toEqual([]);
			expect(normalizeFindings(42)).toEqual([]);
			expect(normalizeFindings({ summary: "no findings key" })).toEqual([]);
		});
	});

	describe("demoteUnsubstantiated", () => {
		test("demotes a finding whose evidence is missing entirely", () => {
			const demoted = demoteUnsubstantiated([
				{ confidence: "confirmed", detail: "x" },
				{ confidence: "probable", detail: "y", evidence: [{ file: "a.js" }] },
			]);
			expect(demoted[0].confidence).toBe("speculative");
			expect(demoted[0].evidence).toEqual([]);
			expect(demoted[1].confidence).toBe("probable");
		});

		test("does not mutate the findings it is given", () => {
			const input = [{ confidence: "confirmed", detail: "x", evidence: [] }];
			const demoted = demoteUnsubstantiated(input);
			expect(input[0].confidence).toBe("confirmed");
			expect(demoted[0].confidence).toBe("speculative");
			expect(demoted[0]).not.toBe(input[0]);
		});

		test("keeps the detail of a demoted finding", () => {
			const demoted = demoteUnsubstantiated([
				{ confidence: "confirmed", detail: "the claim", evidence: [] },
			]);
			expect(demoted[0].detail).toBe("the claim");
		});

		test("never leaves an undefined field behind", () => {
			const demoted = demoteUnsubstantiated([
				{ confidence: "confirmed", detail: "x", evidence: [] },
			]);
			for (const value of Object.values(demoted[0])) {
				expect(value).not.toBeUndefined();
			}
		});

		test("takes the parsed agent object as well as a bare array", () => {
			const demoted = demoteUnsubstantiated({
				summary: "s",
				findings: [
					{ confidence: "confirmed", detail: "x", evidence: [] },
					{ confidence: "confirmed", detail: "y", evidence: [{ file: "a.js" }] },
				],
			});
			expect(demoted).toHaveLength(2);
			expect(demoted[0].confidence).toBe("speculative");
			expect(demoted[1].confidence).toBe("confirmed");
		});
	});
});
