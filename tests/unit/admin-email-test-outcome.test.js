import fs from "node:fs";
import path from "node:path";
import { jest } from "@jest/globals";

// The admin config drives whether email is actually delivered. Keep it mutable so
// one module graph can produce both a log-only and a genuinely delivered outcome.
let emailEnabled = false;

jest.unstable_mockModule("../../server/services/adminConfigService.js", () => ({
	getAdminConfig: jest.fn(async () => ({
		notifications: {
			email: { enabled: emailEnabled, provider: "smtp", from_name: "GarTexHub" },
		},
	})),
	updateAdminConfig: jest.fn(async (config) => config),
	readConfig: jest.fn(async () => ({})),
	writeConfig: jest.fn(async () => ({})),
}));

const sendMail = jest.fn(async () => ({ messageId: "test-message-id" }));
jest.unstable_mockModule("nodemailer", () => ({
	createTransport: jest.fn(() => ({ sendMail })),
	default: { createTransport: jest.fn(() => ({ sendMail })) },
}));

jest.unstable_mockModule("../../server/utils/logger.js", () => ({
	logDebug: jest.fn(),
	logInfo: jest.fn(),
	logSuccess: jest.fn(),
	logWarn: jest.fn(),
	logError: jest.fn(),
	logCritical: jest.fn(),
	logEvent: jest.fn(),
	setLogPretty: jest.fn(),
	logger: {},
	printStartupBanner: jest.fn(),
	printStats: jest.fn(),
	getLevel: jest.fn(() => "info"),
}));

const { adminAction } = await import("../../server/controllers/adminMasterController.js");
const { describeEmailTestOutcome, readEmailDeliveryResult } = await import(
	"../../src/pages/AdminPanel.helpers.js"
);

const PROVIDER_ENV_KEYS = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "SMTP_PORT"];
let savedEnv = {};

/**
 * Runs the real email.test_send admin action and returns the HTTP body the
 * browser would receive, so the frontend never has to guess the envelope shape.
 * @returns {Promise<Object>} The parsed /admin/actions response body.
 */
async function runEmailTestSend() {
	const res = { json: jest.fn(), status: jest.fn(() => res) };
	await adminAction(
		{
			body: { action: "email.test_send", payload: { to: "a@b.co" } },
			user: { id: "u1", role: "owner" },
		},
		res,
	);
	return res.json.mock.calls[0]?.[0];
}

beforeAll(() => {
	savedEnv = Object.fromEntries(PROVIDER_ENV_KEYS.map((key) => [key, process.env[key]]));
});

afterAll(() => {
	for (const key of PROVIDER_ENV_KEYS) {
		if (savedEnv[key] === undefined) {
			delete process.env[key];
		} else {
			process.env[key] = savedEnv[key];
		}
	}
});

beforeEach(() => {
	emailEnabled = false;
	sendMail.mockClear();
	for (const key of PROVIDER_ENV_KEYS) {
		delete process.env[key];
	}
});

describe("email.test_send response envelope (server)", () => {
	test("a log-only delivery reports ok:false at response.result.result", async () => {
		const body = await runEmailTestSend();

		expect(body.ok).toBe(true);
		expect(body.result.ok).toBe(true);
		expect(body.result.result).toEqual({ ok: false, status: "logged_disabled" });
		expect(sendMail).not.toHaveBeenCalled();
	});

	test("a real delivery reports ok:true at response.result.result", async () => {
		emailEnabled = true;
		process.env.SMTP_HOST = "smtp.example.test";
		process.env.SMTP_USER = "mailer@example.test";

		const body = await runEmailTestSend();

		expect(body.result.result).toEqual({ ok: true, status: "sent" });
		expect(sendMail).toHaveBeenCalledTimes(1);
	});
});

describe("describeEmailTestOutcome (src/pages/AdminPanel.helpers.js)", () => {
	test("a log-only delivery is never reported as sent", async () => {
		const body = await runEmailTestSend();
		const outcome = describeEmailTestOutcome(body);

		expect(outcome.delivered).toBe(false);
		expect(outcome.status).toBe("logged_disabled");
		expect(outcome.notice).toBe("");
		expect(outcome.error).toContain("not delivered");
		expect(outcome.error).toContain("logged_disabled");
		expect(outcome.error).not.toMatch(/test email sent/i);
	});

	test("a real delivery still reads as sent", async () => {
		emailEnabled = true;
		process.env.SMTP_HOST = "smtp.example.test";
		process.env.SMTP_USER = "mailer@example.test";

		const body = await runEmailTestSend();
		const outcome = describeEmailTestOutcome(body);

		expect(outcome.delivered).toBe(true);
		expect(outcome.status).toBe("sent");
		expect(outcome.error).toBe("");
		expect(outcome.notice).toMatch(/test email sent/i);
	});

	test("every log-only status is reported as not delivered", () => {
		for (const status of [
			"logged_disabled",
			"logged_no_smtp",
			"logged_no_gmail",
			"logged_unsupported",
		]) {
			const body = { ok: true, result: { ok: true, result: { ok: false, status } } };
			const outcome = describeEmailTestOutcome(body);

			expect(outcome.delivered).toBe(false);
			expect(outcome.status).toBe(status);
			expect(outcome.notice).toBe("");
			expect(outcome.error).toContain(status);
			expect(outcome.error).not.toMatch(/test email sent/i);
		}
	});

	test("an unknown outcome fails safe instead of claiming a send", () => {
		for (const body of [undefined, null, {}, { ok: true }, { ok: true, result: { ok: true } }]) {
			const outcome = describeEmailTestOutcome(body);

			expect(outcome.delivered).toBe(false);
			expect(outcome.status).toBe("unknown");
			expect(outcome.notice).toBe("");
			expect(outcome.error).not.toMatch(/test email sent/i);
		}
	});

	test("the admin action envelope is not mistaken for a delivery result", () => {
		// response.result is { ok, result } — it has no delivery status, so it must
		// never be read as one.
		expect(readEmailDeliveryResult({ ok: true, result: { ok: true } })).toBeNull();
		expect(
			readEmailDeliveryResult({
				ok: true,
				result: { ok: true, result: { ok: true, status: "sent" } },
			}),
		).toEqual({
			ok: true,
			status: "sent",
		});
	});
});

describe("AdminPanel.jsx wiring", () => {
	const source = fs.readFileSync(
		path.join(process.cwd(), "src", "pages", "AdminPanel.jsx"),
		"utf8",
	);

	test("the test-send button uses the shared outcome helper", () => {
		expect(source.includes("describeEmailTestOutcome(result)")).toBe(true);
		expect(source.includes("setEmailConfigNotice(`Test email sent")).toBe(false);
	});
});
