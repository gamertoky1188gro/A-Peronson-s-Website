describe("aiOrchestrationService integration", () => {
  test("orchestrates and persists metadata", async () => {
    process.env.NODE_ENV = "test";
    const svc = await import("../../server/services/aiOrchestrationService.js");
    const jsonStore = await import("../../server/utils/jsonStore.js");

    const text = "Need 100 cotton t-shirts, red, moq 100, timeline 6 weeks";
    const result = await svc.orchestrateRequirementExtraction({ text });
    expect(result).toHaveProperty("extracted");
    expect(result).toHaveProperty("confidence");

    await svc.persistAiMetadataForMatch("test-match-1", { test: true });
    const messages = await jsonStore.readJson("messages.json");
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThanOrEqual(1);
  });
});
