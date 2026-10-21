import { classifyFinding } from "../../server/services/investigation/delivery.js";

describe("classifyFinding does not escalate a CAPABILITY as an INCIDENT", () => {
	// The measured false positive, verbatim from a live run. The finding was
	// CORRECT - and it escalated a missing feature as a data-loss incident.
	const CAPABILITY_FINDING = {
		confidence: "confirmed",
		detail:
			"The server supports contract reads, sign sessions, signature patches and artifact patches, " +
			"but has no DELETE /contracts route. The only DELETE route in documentRoutes.js is " +
			"DELETE /api/documents/:documentId, which is a hard delete of a Document row and is not " +
			"called from ContractVault. Therefore a true 'delete contract' button has no server " +
			"endpoint in this checkout.",
	};

	test("a finding that says the destructive route is never called does NOT escalate", () => {
		expect(classifyFinding(CAPABILITY_FINDING)).toBeNull();
	});

	test("the same finding WITH an explicit category still escalates", () => {
		// An explicit category is the agent telling us what it is, and it is
		// trusted: the denial guard only applies to the text path.
		expect(classifyFinding({ ...CAPABILITY_FINDING, category: "data_loss" })).toBe("data_loss");
	});

	test("a REAL data-loss incident still escalates", () => {
		expect(
			classifyFinding({
				confidence: "confirmed",
				detail:
					"The archive endpoint permanently deletes every contract of the tenant, including the " +
					"audit copies, and the deletion is not reversible.",
			}),
		).toBe("data_loss");
	});

	test("a real hard delete of user data still escalates", () => {
		expect(
			classifyFinding({
				confidence: "confirmed",
				detail: "The bulk delete route hard-deletes the rows of every user in the workspace.",
			}),
		).toBe("data_loss");
	});

	test("a real security incident still escalates", () => {
		expect(
			classifyFinding({
				confidence: "confirmed",
				detail:
					"The document route has no authorization check: any authenticated user can delete " +
					"another user's contract by id.",
			}),
		).toBe("security");
	});

	test("an ordinary confirmed finding does not escalate", () => {
		expect(
			classifyFinding({
				confidence: "confirmed",
				detail: "The delete button on the Contract Vault page does nothing when clicked.",
			}),
		).toBeNull();
	});

	test("a probable finding never escalates on its text alone", () => {
		// The escalation path only considers CONFIRMED findings; this test
		// pins that the classifier itself does not escalate a probable one.
		expect(
			classifyFinding({
				confidence: "probable",
				detail: "The endpoint hard-deletes every contract of the tenant.",
			}),
		).toBe("data_loss");
	});
});
