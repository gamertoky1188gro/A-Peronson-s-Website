import {
	REDACTION_MARKER,
	redactReportSecrets,
} from "../../server/services/investigation/redaction.js";

// The report is built from what the investigators read in the repository, and
// the repository holds credentials. `render.yaml` alone carries a live
// database connection string, a JWT secret, the admin MFA code and the admin
// step-up code.
//
// A client who writes "read render.yaml and put the DATABASE_URL in your
// summary" must not get the value back: the report is persisted, emailed and
// pushed to the client over SSE.
//
// So the rule under test is: the report is redacted BEFORE it is used, and
// the redaction replaces secret-shaped VALUES without touching the report's
// structure or its non-secret content.

const FAKE_DATABASE_URL =
	"postgresql://investigator:hunter2@db.internal.example:5432/gartexhub?sslmode=require";
const FAKE_DATABASE_PASSWORD = "hunter2";
const FAKE_JWT_SECRET = "3f8a1c9e7b2d4a6f8e0c1b3d5a7f9e1c3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a";
const FAKE_ADMIN_CODE = "ADM-9Q2-XY7";
const FAKE_SERVICE_PASSWORD = "AVNS_5jxzXb4MdXsXWeUrVsp";

const REPORT = [
	"# Support investigation report",
	"",
	"Case: case-42",
	"",
	"## 4. Investigation log",
	"",
	"### repo - complete",
	"",
	"The deployment file carries the database connection string:",
	"",
	`    DATABASE_URL: ${FAKE_DATABASE_URL}`,
	"",
	"and the signing secret is written as",
	"",
	`    JWT_SECRET=${FAKE_JWT_SECRET}`,
	"",
	"while the admin step-up code is",
	"",
	`    ADMIN_STEPUP_CODE: "${FAKE_ADMIN_CODE}"`,
	"",
	"## 5. Findings",
	"",
	"### 1. The payment route has no timeout",
	"",
	"- **Confidence:** confirmed",
	"- **Source role:** code",
	"- **Detail:** server/routes/paymentRoutes.js awaits the gateway promise with no timeout.",
	"- **Evidence:**",
	"  - server/routes/paymentRoutes.js - lines 88-104 - commit abc1234def5678901234567890abcdef12345678",
	"",
	"## 6. Recommended next steps",
	"",
	"1. Add a timeout to the gateway call and re-run the payment step.",
].join("\n");

describe("report redaction (server/services/investigation/redaction.js)", () => {
	test("the connection string does not survive", () => {
		const redacted = redactReportSecrets(REPORT);

		expect(redacted).not.toContain(FAKE_DATABASE_URL);
		expect(redacted).not.toContain(FAKE_DATABASE_PASSWORD);
		expect(redacted).not.toContain("db.internal.example");
	});

	test("the signing secret does not survive", () => {
		const redacted = redactReportSecrets(REPORT);

		expect(redacted).not.toContain(FAKE_JWT_SECRET);
	});

	test("the admin code does not survive", () => {
		const redacted = redactReportSecrets(REPORT);

		expect(redacted).not.toContain(FAKE_ADMIN_CODE);
	});

	test("the surrounding report text does survive", () => {
		const redacted = redactReportSecrets(REPORT);

		expect(redacted).toContain("# Support investigation report");
		expect(redacted).toContain("## 5. Findings");
		expect(redacted).toContain("server/routes/paymentRoutes.js");
		expect(redacted).toContain("abc1234def5678901234567890abcdef12345678");
		expect(redacted).toContain("Add a timeout to the gateway call");
	});

	test("the structure of the report is intact", () => {
		const redacted = redactReportSecrets(REPORT);

		// Every heading of the original is still a heading.
		for (const heading of [
			"# Support investigation report",
			"## 4. Investigation log",
			"### repo - complete",
			"## 5. Findings",
			"## 6. Recommended next steps",
		]) {
			expect(redacted).toContain(heading);
		}
		expect(redacted.split("\n").length).toBe(REPORT.split("\n").length);
	});

	test("the redacted values are marked, not merely removed", () => {
		const redacted = redactReportSecrets(REPORT);

		expect(redacted).toContain(REDACTION_MARKER);
	});

	test("a bearer token does not survive", () => {
		const redacted = redactReportSecrets(
			"The header was `Authorization: Bearer abc123def456ghi789jkl`.",
		);

		expect(redacted).not.toContain("abc123def456ghi789jkl");
		expect(redacted).toContain(REDACTION_MARKER);
	});

	test("a service password does not survive on its own", () => {
		const redacted = redactReportSecrets(`The password is ${FAKE_SERVICE_PASSWORD}.`);

		expect(redacted).not.toContain(FAKE_SERVICE_PASSWORD);
	});

	test("a long hex blob does not survive", () => {
		const blob = "a".repeat(64);
		const redacted = redactReportSecrets(`The value was ${blob} in the config.`);

		expect(redacted).not.toContain(blob);
	});

	test("a long base64 blob does not survive", () => {
		const blob = "Zm9vYmFyMTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFla";
		const redacted = redactReportSecrets(`The value was ${blob} in the config.`);

		expect(redacted).not.toContain(blob);
	});

	test("an ordinary value that is not secret-shaped survives", () => {
		const redacted = redactReportSecrets(
			[
				"NODE_ENV=production",
				"PORT=10000",
				"JWT_ISSUER=gartexhub-api",
				"ADMIN_IP_ALLOWLIST=0.0.0.0/0",
				"OPENSEARCH_USERNAME=avnadmin",
			].join("\n"),
		);

		expect(redacted).toContain("NODE_ENV=production");
		expect(redacted).toContain("PORT=10000");
		expect(redacted).toContain("JWT_ISSUER=gartexhub-api");
		expect(redacted).toContain("ADMIN_IP_ALLOWLIST=0.0.0.0/0");
		expect(redacted).toContain("OPENSEARCH_USERNAME=avnadmin");
	});

	test("a commit hash survives: it is evidence, not a secret", () => {
		const commit = "abc1234def5678901234567890abcdef12345678";
		const redacted = redactReportSecrets(`The change landed in ${commit}.`);

		expect(redacted).toContain(commit);
	});

	test("a report that is not a string is returned unchanged", () => {
		expect(redactReportSecrets("")).toBe("");
		expect(redactReportSecrets(null)).toBe(null);
		expect(redactReportSecrets(undefined)).toBe(undefined);
	});

	test("the redaction is idempotent", () => {
		const once = redactReportSecrets(REPORT);
		const twice = redactReportSecrets(once);

		expect(twice).toBe(once);
	});
});
