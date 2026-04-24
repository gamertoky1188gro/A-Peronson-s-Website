describe("buyer request validation", () => {
  test("step validation rejects placeholder title and invalid quantity", async () => {
    const validation = await import("../../shared/requirementValidation.js");

    const errors = validation.getBuyerRequestStepErrors(
      {
        requestType: "garments",
        title: "abcd",
        category: "Shirts",
        genderTarget: "Men",
        season: "Summer",
        totalQuantity: "abc",
      },
      1,
    );

    expect(errors.title).toBeDefined();
    expect(errors.totalQuantity).toBeDefined();
  });

  test("createRequirement rejects invalid open requests but allows drafts", async () => {
    process.env.NODE_ENV = "test";
    const reqSvc = await import("../../server/services/requirementService.js");
    const jsonStore = await import("../../server/utils/jsonStore.js");

    await jsonStore.writeJson("users.json", [{ id: "buyer1", role: "buyer" }]);
    await jsonStore.writeJson("requirements.json", []);

    const payload = {
      title: "abcd",
      category: "Shirts",
      gender_target: "Men",
      season: "Summer",
      quantity: "abc",
      price_range: "USD 10",
      incoterms: "FOB",
      ex_factory_date: new Date().toISOString(),
      payment_terms: "TT",
    };

    await expect(
      reqSvc.createRequirement("buyer1", payload),
    ).rejects.toMatchObject({ status: 400 });

    const draft = await reqSvc.createRequirement("buyer1", {
      ...payload,
      status: "draft",
    });
    expect(draft.status).toBe("draft");
    expect(draft.title).toBe("abcd");
  });
});
