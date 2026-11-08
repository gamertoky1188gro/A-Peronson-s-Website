import { jest } from "@jest/globals";

function mockRes() {
	const res = {};
	res.status = jest.fn(() => res);
	res.json = jest.fn(() => res);
	return res;
}

/* ── Service layer: ownership enforcement ─────────────────────────────── */

describe("code investigation service — ownership enforcement", () => {
	let prisma;
	let service;

	beforeEach(async () => {
		jest.resetModules();

		prisma = {
			supportCase: {
				findUnique: jest.fn(),
				findMany: jest.fn(),
				update: jest.fn(),
				create: jest.fn(),
			},
			supportCaseMessage: {
				findFirst: jest.fn(),
				create: jest.fn(),
			},
			supportCaseAttachment: {
				create: jest.fn(),
				createMany: jest.fn(),
			},
		};

		jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
			default: prisma,
		}));

		service = await import("../../server/services/codeInvestigationService.js");
	});

	const caseRow = {
		id: "case-1",
		user_id: "owner-1",
		status: "investigating",
		subject: "Test case",
		summary: "Summary",
		report_status: "pending",
		retain: true,
		created_at: new Date(),
		updated_at: new Date(),
		messages: [],
		attachments: [],
	};

	test("getInvestigationById returns null when the case does not exist", async () => {
		prisma.supportCase.findUnique.mockResolvedValue(null);
		const result = await service.getInvestigationById("case-99", "user-1");
		expect(result).toBeNull();
	});

	test("getInvestigationById returns 'forbidden' for a non-owner", async () => {
		prisma.supportCase.findUnique.mockResolvedValue(caseRow);
		const result = await service.getInvestigationById("case-1", "stranger-2");
		expect(result).toBe("forbidden");
	});

	test("getInvestigationById returns the case for the owner", async () => {
		prisma.supportCase.findUnique.mockResolvedValue(caseRow);
		const result = await service.getInvestigationById("case-1", "owner-1");
		expect(result).toBe(caseRow);
	});

	test("listInvestigationsForUser queries only the caller's cases", async () => {
		prisma.supportCase.findMany.mockResolvedValue([]);
		await service.listInvestigationsForUser("user-1");
		expect(prisma.supportCase.findMany).toHaveBeenCalledWith({
			where: { user_id: "user-1" },
			orderBy: { updated_at: "desc" },
			include: {
				messages: { take: 1, orderBy: { created_at: "desc" } },
				attachments: true,
			},
		});
	});

	test("addInvestigationMessage returns null when the case does not exist", async () => {
		prisma.supportCase.findUnique.mockResolvedValue(null);
		prisma.supportCaseMessage.findFirst.mockResolvedValue(null);
		const result = await service.addInvestigationMessage("case-99", "user-1", "hi");
		expect(result).toBeNull();
	});

	test("addInvestigationMessage returns 'forbidden' for a non-owner", async () => {
		prisma.supportCase.findUnique.mockResolvedValue(caseRow);
		const result = await service.addInvestigationMessage("case-1", "stranger-2", "hi");
		expect(result).toBe("forbidden");
	});

	test("generateFinalReport throws 'Forbidden' for a non-owner", async () => {
		prisma.supportCase.findUnique.mockResolvedValue(caseRow);
		await expect(service.generateFinalReport("case-1", "stranger-2")).rejects.toThrow("Forbidden");
	});

	test("generateFinalReport succeeds for the owner", async () => {
		prisma.supportCase.findUnique.mockResolvedValue(caseRow);
		const report = await service.generateFinalReport("case-1", "owner-1");
		expect(report).toMatchObject({ caseId: "case-1", subject: "Test case" });
	});

	test("sendInvestigationReportEmail throws 'Forbidden' for a non-owner", async () => {
		prisma.supportCase.findUnique.mockResolvedValue(caseRow);
		await expect(
			service.sendInvestigationReportEmail("case-1", "a@b.com", "stranger-2"),
		).rejects.toThrow("Forbidden");
	});

	test("updateInvestigationStatus returns 'forbidden' for a non-owner", async () => {
		prisma.supportCase.findUnique.mockResolvedValue(caseRow);
		prisma.supportCase.update.mockResolvedValue(caseRow);
		const result = await service.updateInvestigationStatus("case-1", "completed", "stranger-2");
		expect(result).toBe("forbidden");
	});

	test("createInvestigation anchors the case to the caller's user_id", async () => {
		prisma.supportCase.create.mockResolvedValue(caseRow);
		prisma.supportCaseMessage.create.mockResolvedValue({});
		await service.createInvestigation({
			caseId: "case-1",
			userId: "owner-1",
			initialMessage: "hello",
			subject: "Test",
		});
		expect(prisma.supportCase.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({ user_id: "owner-1" }),
			}),
		);
	});
});

/* ── Controller layer: authorization and validation ───────────────────── */

describe("code investigation controller — authorization and validation", () => {
	let service;
	let req;

	const investigationRow = {
		id: "case-1",
		user_id: "owner-1",
		status: "investigating",
		subject: "Test case",
		summary: "Summary",
		report_status: "pending",
		retain: true,
		created_at: new Date(),
		updated_at: new Date(),
		messages: [],
		attachments: [],
	};

	beforeEach(async () => {
		jest.resetModules();

		req = {
			user: { id: "owner-1", email: "owner@example.com" },
			body: {},
			params: {},
			files: [],
		};

		service = {
			createInvestigation: jest.fn().mockResolvedValue(investigationRow),
			getInvestigationById: jest.fn().mockResolvedValue(investigationRow),
			listInvestigationsForUser: jest.fn().mockResolvedValue([]),
			addInvestigationMessage: jest.fn().mockResolvedValue({ id: "msg-1" }),
			runCodeInvestigation: jest.fn().mockResolvedValue({ findings: [] }),
			generateFinalReport: jest.fn().mockResolvedValue({ caseId: "case-1" }),
			sendInvestigationReportEmail: jest.fn().mockResolvedValue({ ok: true }),
			updateInvestigationStatus: jest.fn().mockResolvedValue(investigationRow),
		};

		jest.unstable_mockModule("../../server/services/codeInvestigationService.js", () => ({
			...service,
			INVESTIGATION_STATUS: {
				QUEUED: "queued",
				IN_PROGRESS: "in_progress",
				COMPLETED: "completed",
				FAILED: "failed",
				AWAITING_CLIENT_CONFIRMATION: "awaiting_client_confirmation",
				REPORT_SENT: "report_sent",
			},
		}));
		jest.unstable_mockModule("../../server/services/privateDocumentService.js", () => ({
			recordPrivateUpload: jest.fn().mockResolvedValue({ id: "doc-1" }),
			PRIVATE_ENTITY_TYPE: { SUPPORT_CASE: "support_case" },
		}));
		jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
			default: {
				supportCaseAttachment: { create: jest.fn().mockResolvedValue({}) },
			},
		}));
	});

	async function importController() {
		return await import("../../server/controllers/codeInvestigationController.js");
	}

	test("createCodeInvestigation returns 400 when subject is missing", async () => {
		const { createCodeInvestigation } = await importController();
		const res = mockRes();
		req.body = { description: "hello" };
		await createCodeInvestigation(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: "Subject and description are required",
		});
	});

	test("createCodeInvestigation returns 400 when description is missing", async () => {
		const { createCodeInvestigation } = await importController();
		const res = mockRes();
		req.body = { subject: "hello" };
		await createCodeInvestigation(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
	});

	test("createCodeInvestigation returns 201 on success", async () => {
		const { createCodeInvestigation } = await importController();
		const res = mockRes();
		req.body = { subject: "S", description: "D" };
		await createCodeInvestigation(req, res);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ investigation: investigationRow }),
		);
	});

	test("createCodeInvestigation attaches uploads with the caller's user_id", async () => {
		const { createCodeInvestigation } = await importController();
		const prisma = (await import("../../server/utils/prisma.js")).default;
		const res = mockRes();
		req.body = { subject: "S", description: "D" };
		req.files = [{ filename: "x.pdf", mimetype: "application/pdf", size: 123 }];
		await createCodeInvestigation(req, res);
		expect(prisma.supportCaseAttachment.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({ uploaded_by: "owner-1" }),
			}),
		);
	});

	test("getInvestigation returns 400 when caseId is missing", async () => {
		const { getInvestigation } = await importController();
		const res = mockRes();
		req.params = {};
		await getInvestigation(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: "Case ID is required" });
	});

	test("getInvestigation returns 404 when the case does not exist", async () => {
		const { getInvestigation } = await importController();
		service.getInvestigationById.mockResolvedValue(null);
		const res = mockRes();
		req.params = { caseId: "case-99" };
		await getInvestigation(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: "Investigation not found" });
	});

	test("getInvestigation returns 403 for a non-owner", async () => {
		const { getInvestigation } = await importController();
		service.getInvestigationById.mockResolvedValue("forbidden");
		const res = mockRes();
		req.params = { caseId: "case-1" };
		await getInvestigation(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
	});

	test("getInvestigation returns 200 for the owner", async () => {
		const { getInvestigation } = await importController();
		const res = mockRes();
		req.params = { caseId: "case-1" };
		await getInvestigation(req, res);
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).toHaveBeenCalledWith({ investigation: investigationRow });
	});

	test("addMessage returns 400 when caseId or content is missing", async () => {
		const { addMessage } = await importController();
		const res = mockRes();
		req.params = { caseId: "" };
		req.body = { content: "" };
		await addMessage(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: "Case ID and content are required",
		});
	});

	test("addMessage returns 403 for a non-owner", async () => {
		const { addMessage } = await importController();
		service.addInvestigationMessage.mockResolvedValue("forbidden");
		const res = mockRes();
		req.params = { caseId: "case-1" };
		req.body = { content: "hi" };
		await addMessage(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
	});

	test("startInvestigation returns 400 when caseId is missing", async () => {
		const { startInvestigation } = await importController();
		const res = mockRes();
		req.params = {};
		await startInvestigation(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: "Case ID is required" });
	});

	test("getDraftReport returns 403 for a non-owner", async () => {
		const { getDraftReport } = await importController();
		service.getInvestigationById.mockResolvedValue("forbidden");
		const res = mockRes();
		req.params = { caseId: "case-1" };
		await getDraftReport(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
	});

	test("confirmAndSendReport returns 400 when no email is available", async () => {
		const { confirmAndSendReport } = await importController();
		const ownerlessReq = { ...req, user: { id: "owner-1" } };
		const res = mockRes();
		ownerlessReq.params = { caseId: "case-1" };
		ownerlessReq.body = {};
		const { confirmAndSendReport: fn } = await importController();
		await fn(ownerlessReq, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: "No recipient email provided" });
	});

	test("confirmAndSendReport returns 403 for a non-owner", async () => {
		const { confirmAndSendReport } = await importController();
		service.getInvestigationById.mockResolvedValue("forbidden");
		const res = mockRes();
		req.params = { caseId: "case-1" };
		req.body = { recipientEmail: "a@b.com" };
		await confirmAndSendReport(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
	});

	test("updateStatus returns 400 for an invalid status", async () => {
		const { updateStatus } = await importController();
		const res = mockRes();
		req.params = { caseId: "case-1" };
		req.body = { status: "not_a_real_status" };
		await updateStatus(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: "Invalid status" });
	});

	test("updateStatus returns 403 for a non-owner", async () => {
		const { updateStatus } = await importController();
		service.updateInvestigationStatus.mockResolvedValue("forbidden");
		const res = mockRes();
		req.params = { caseId: "case-1" };
		req.body = { status: "completed" };
		await updateStatus(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
	});

	test("updateStatus returns 200 for the owner with a valid status", async () => {
		const { updateStatus } = await importController();
		const res = mockRes();
		req.params = { caseId: "case-1" };
		req.body = { status: "completed" };
		await updateStatus(req, res);
		expect(res.json).toHaveBeenCalledWith({ investigation: investigationRow });
	});
});
