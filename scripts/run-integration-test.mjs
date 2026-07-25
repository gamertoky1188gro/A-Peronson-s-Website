import {
	extractRequirementFromText,
	generateDraftResponse,
	persistAiMetadataForMatch,
	validateDraftResponse,
} from "../server/services/aiOrchestrationService.js";

async function run() {
	try {
		const text =
			"Looking for 5000 cotton t-shirts, target price USD 2.5, delivery in 45 days. Need OEKO-TEX certification.";
		const extractedResult = await extractRequirementFromText(text);

		const draft = generateDraftResponse(extractedResult.extracted, extractedResult.missing_fields);
		const validation = await validateDraftResponse(draft, extractedResult.extracted);

		// attempt persistence (uses in-memory json store under NODE_ENV=test)
		await persistAiMetadataForMatch("test-match-1", validation);

		const ok = extractedResult && draft && validation;
		process.exit(ok ? 0 : 2);
	} catch {
		process.exit(3);
	}
}

run();
