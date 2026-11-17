import {
	__resetModelCatalogForTests,
	getOpenCodeFreeModels,
} from "../../server/services/investigation/modelCatalog.js";

const CATALOG = {
	data: [
		{
			id: "minimax-m3.1-flash-free",
			object: "model",
			created: 1_794_754_237,
			owned_by: "opencode",
			name: "MiniMax M3.1 Flash Free",
			modalities: { input: ["text", "image/png"], output: ["text"] },
			limit: { context: 1_048_576, output: 8192 },
		},
		{
			id: "big-pickle",
			object: "model",
			created: 1_794_754_238,
			owned_by: "opencode",
			name: "Big Pickle",
		},
		{
			id: "iceman-free",
			object: "model",
			created: 1_794_754_239,
			owned_by: "opencode",
			name: "Iceman Free",
		},
		{
			id: "longcat-2.5-free",
			object: "model",
			created: 1_794_754_240,
			owned_by: "opencode",
			name: "LongCat 2.5 Free",
		},
		{
			id: "gpt-paid-model",
			object: "model",
			created: 1_794_754_241,
			owned_by: "openai",
			name: "GPT Paid",
		},
	],
};
const fetchImpl = async () => ({ ok: true, json: async () => CATALOG });

beforeEach(() => __resetModelCatalogForTests());

it("filters free opencode ids and excludes iceman-free", async () => {
	const result = await getOpenCodeFreeModels({ fetchImpl });
	expect(result.models.map((m) => m.id).sort()).toEqual([
		"big-pickle",
		"longcat-2.5-free",
		"minimax-m3.1-flash-free",
	]);
});

it("serves cache within TTL and stale copy on failure", async () => {
	await getOpenCodeFreeModels({ fetchImpl });
	const cached = await getOpenCodeFreeModels({
		forceRefresh: true,
		fetchImpl: async () => {
			throw new Error("boom");
		},
	});
	expect(cached.stale).toBe(true);
	expect(cached.models.length).toBeGreaterThan(0);
});

it("normalizes modalities and limits for the media gate and context meter", async () => {
	const result = await getOpenCodeFreeModels({ fetchImpl });
	const entry = result.models.find((m) => m.id === "minimax-m3.1-flash-free");
	expect(entry.inputModalities).toEqual(["text", "image/png"]);
	expect(entry.outputModalities).toEqual(["text"]);
	expect(entry.contextLimit).toBe(1_048_576);
	expect(entry.maxOutput).toBe(8192);
});

it("throws 503 when catalog unreachable and no cache exists", async () => {
	await expect(
		getOpenCodeFreeModels({
			fetchImpl: async () => {
				throw new Error("boom");
			},
		}),
	).rejects.toMatchObject({ status: 503 });
});
