import { jest } from "@jest/globals";

let enabled = true;
let provider = "gmail";

jest.unstable_mockModule("../../server/services/adminConfigService.js", () => ({
	getAdminConfig: jest.fn(async () => ({
		notifications: {
			email: { enabled, provider, from_name: "GarTexHub", from_email: "" },
		},
	})),
}));

const emailLogCreate = jest.fn(async () => ({}));
const emailOutboxCreate = jest.fn(async () => ({}));
jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		emailLog: { create: emailLogCreate },
		emailOutbox: { create: emailOutboxCreate },
	},
}));

const logInfo = jest.fn();
const logWarn = jest.fn();
const logError = jest.fn();
jest.unstable_mockModule("../../server/utils/logger.js", () => ({
	logDebug: jest.fn(),
	logInfo,
	logSuccess: jest.fn(),
	logWarn,
	logError,
	logCritical: jest.fn(),
	logEvent: jest.fn(),
	setLogPretty: jest.fn(),
	logger: {},
	printStartupBanner: jest.fn(),
	printStats: jest.fn(),
	getLevel: jest.fn(() => "info"),
}));

const sendMail = jest.fn(async () => ({ messageId: "m1" }));
const createTransport = jest.fn(() => ({ sendMail }));
// The service does `await import("nodemailer")` and then calls
// `nodemailer.createTransport` - on the NAMESPACE, not on `.default`. Node
// hoists a CJS module's named exports onto the namespace, so the mock has to
// carry it at the top level as well.
jest.unstable_mockModule("nodemailer", () => ({
	createTransport,
	default: { createTransport },
}));

const { sendEmail, getEmailDeliveryStatus } = await import("../../server/services/emailService.js");

// The provider branches key off these env vars, so they must be absent for the
// "unconfigured" branches to be reachable regardless of the developer's shell.
const PROVIDER_ENV_KEYS = [
	"SMTP_HOST",
	"SMTP_USER",
	"SMTP_PASS",
	"SMTP_PORT",
	"SMTP_SECURE",
	"SMTP_FROM",
	"EMAIL_PROVIDER",
	"GMAIL_USER",
	"GMAIL_APP_PASSWORD",
	"GMAIL_SMTP_HOST",
	"GMAIL_SMTP_PORT",
	"GMAIL_SMTP_SECURE",
	"GMAIL_SENDER",
	"GMAIL_CLIENT_ID",
	"GMAIL_CLIENT_SECRET",
	"GMAIL_REFRESH_TOKEN",
];

let savedEnv = {};

beforeAll(() => {
	savedEnv = Object.fromEntries(PROVIDER_ENV_KEYS.map((key) => [key, process.env[key]]));
	for (const key of PROVIDER_ENV_KEYS) delete process.env[key];
});

afterAll(() => {
	for (const key of PROVIDER_ENV_KEYS) {
		if (savedEnv[key] === undefined) delete process.env[key];
		else process.env[key] = savedEnv[key];
	}
});

beforeEach(() => {
	enabled = true;
	provider = "gmail";
	logWarn.mockClear();
	sendMail.mockClear();
	createTransport.mockClear();
	emailLogCreate.mockClear();
});

describe("the Gmail App Password transport", () => {
	test("an unconfigured gmail is reported as logged_no_gmail, not logged_no_smtp", async () => {
		provider = "gmail";
		const res = await sendEmail({ to: ["a@b.co"], subject: "s", text: "t" });
		expect(res).toEqual({ ok: false, status: "logged_no_gmail" });
		expect(logWarn).toHaveBeenCalledWith(
			"email_logged_no_gmail",
			expect.objectContaining({ to: ["a@b.co"] }),
		);
	});

	test("the transport is smtp.gmail.com on 465 with the App Password", async () => {
		process.env.GMAIL_USER = "me@gmail.com";
		process.env.GMAIL_APP_PASSWORD = "app-password";
		// The OTHER transport's credentials are set as well, and the Gmail
		// transport must not touch them.
		process.env.SMTP_HOST = "smtp.brevo.com";
		process.env.SMTP_USER = "brevo-user";
		process.env.SMTP_PASS = "brevo-pass";

		const res = await sendEmail({ to: ["a@b.co"], subject: "s", text: "t" });
		expect(res).toEqual({ ok: true, status: "sent" });

		const options = createTransport.mock.calls[0][0];
		expect(options.host).toBe("smtp.gmail.com");
		expect(options.port).toBe(465);
		expect(options.secure).toBe(true);
		expect(options.auth).toEqual({ user: "me@gmail.com", pass: "app-password" });
	});

	test("the gmail transport never uses SMTP_HOST or SMTP_USER", async () => {
		process.env.GMAIL_USER = "me@gmail.com";
		process.env.GMAIL_APP_PASSWORD = "app-password";
		process.env.SMTP_HOST = "smtp.brevo.com";
		process.env.SMTP_USER = "brevo-user";

		await sendEmail({ to: ["a@b.co"], subject: "s", text: "t" });
		const options = createTransport.mock.calls[0][0];
		expect(options.host).not.toBe("smtp.brevo.com");
		expect(options.auth.user).not.toBe("brevo-user");
	});

	test("a send can PIN its provider over the admin config and the env override", async () => {
		process.env.GMAIL_USER = "me@gmail.com";
		process.env.GMAIL_APP_PASSWORD = "app-password";
		process.env.EMAIL_PROVIDER = "smtp";
		provider = "smtp";

		// The pinned provider wins: the send is a gmail one even though both
		// the env override and the admin config say smtp.
		const res = await sendEmail({ to: ["a@b.co"], subject: "s", text: "t", provider: "gmail" });
		expect(res).toEqual({ ok: true, status: "sent" });
		expect(createTransport.mock.calls[0][0].host).toBe("smtp.gmail.com");
	});

	test("EMAIL_PROVIDER overrides the admin config when nothing is pinned", async () => {
		process.env.GMAIL_USER = "me@gmail.com";
		process.env.GMAIL_APP_PASSWORD = "app-password";
		process.env.EMAIL_PROVIDER = "gmail";
		provider = "smtp";

		const res = await sendEmail({ to: ["a@b.co"], subject: "s", text: "t" });
		expect(res).toEqual({ ok: true, status: "sent" });
		expect(createTransport.mock.calls[0][0].host).toBe("smtp.gmail.com");
	});

	test("the delivery status names the gmail provider and its readiness", async () => {
		process.env.GMAIL_USER = "me@gmail.com";
		process.env.GMAIL_APP_PASSWORD = "app-password";
		provider = "gmail";

		const status = await getEmailDeliveryStatus();
		expect(status.provider).toBe("gmail");
		expect(status.gmail.configured).toBe(true);
		expect(status.ready).toBe(true);
	});
});
