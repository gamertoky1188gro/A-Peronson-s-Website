/**
 * Redaction of the investigation report.
 *
 * The report is built from what the investigators read in the repository, and
 * the repository carries credentials. `render.yaml` alone holds a live
 * database connection string, a JWT secret, the admin MFA code and the admin
 * step-up code; an investigator that reads a deployment file and repeats the
 * value it found would put that value into a document that is then persisted,
 * emailed and pushed to the client over SSE.
 *
 * So the report is not trusted to be free of secrets: it is redacted on the
 * way out, and the redaction happens BEFORE the report is persisted, so the
 * database never holds the raw value either.
 *
 * The rules are deliberately SHAPE-based rather than value-based. The server
 * does not know every secret the deployment holds, and a blocklist of known
 * values would rot the moment a secret is rotated. What it can recognise is
 * the SHAPE a secret takes:
 *
 *  - a connection string that carries credentials (`postgresql://user:pass@host/db`);
 *  - the value of an assignment to a secret-bearing variable
 *    (`JWT_SECRET=...`, `ADMIN_MFA_CODE=...`, `*_KEY`, `*_TOKEN`, `*_PASSWORD`);
 *  - a bearer token;
 *  - a service password of the shape the managed database hands out;
 *  - a long high-entropy hex or base64 blob.
 *
 * Everything else survives. The report's structure - its headings, its
 * findings, its file references, its commit hashes, its prose - is left
 * exactly as it was, because a redactor that eats the report is not a
 * redactor, it is a second way of losing the evidence.
 */

/** What a redacted value is replaced with. */
export const REDACTION_MARKER = "[redacted]";

/**
 * The marker without its closing bracket.
 *
 * The bare-value pattern stops at a `]`, so a value that is already the
 * marker is captured as `[redacted`. The prefix is what the idempotence
 * check looks for.
 */
const REDACTION_MARKER_PREFIX = "[redacted";

/**
 * A connection string that carries credentials.
 *
 * The userinfo section is required: `redis://localhost:6379` names no
 * credential and is not a secret, while `postgresql://user:pass@host/db`
 * carries the database password in clear text.
 */
const CONNECTION_STRING_RE =
	/\b(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis|rediss|amqps?|mssql|sqlserver|s?ftp|s?ftp):\/\/[^\s"'`<>|]*:[^\s"'`<>|@/]*@[^\s"'`<>|]*/gi;

/**
 * An assignment: `NAME = value`, `NAME: value`, with the value quoted or bare.
 *
 * The name is captured loosely and checked afterwards, because the shape that
 * matters is the name's, and the regex cannot express "an environment
 * variable whose name mentions a secret" without swallowing the value of
 * every other assignment it meets.
 */
const ASSIGNMENT_RE =
	/\b([A-Za-z_][A-Za-z0-9_]*)\s*([=:])\s*(?:"([^"\n]*)"|'([^'\n]*)'|([^\s"',;)\]}]+))/g;

/** The shape of an environment variable name: upper case, digits, underscore. */
const ENV_NAME_RE = /^[A-Z][A-Z0-9_]*$/;

/** The words that make a variable name secret-bearing. */
const SECRET_NAME_WORD_RE = /(SECRET|KEY|CODE|TOKEN|PASSWORD|PASSWD|CREDENTIAL)/;

/** `Bearer <token>`. */
const BEARER_RE = /(\bBearer\s+)[A-Za-z0-9\-._~+/]{8,}={0,2}/gi;

/**
 * The password shape the managed database service hands out.
 *
 * It is short and mixed-case, so neither the hex rule nor the base64 rule
 * would ever catch it on its own. It is caught by name because the name is
 * what makes it recognisable.
 */
const SERVICE_PASSWORD_RE = /\bAVNS_[A-Za-z0-9]{12,}/g;

/**
 * A long hex blob.
 *
 * The threshold is 48 characters, not 32: a git commit id is 40 hex
 * characters and the report cites commit ids in every finding, so a shorter
 * threshold would redact the evidence the report exists to carry.
 */
const HEX_BLOB_RE = /\b[0-9a-fA-F]{48,}\b/g;

/**
 * A long base64 blob.
 *
 * The blob has to carry an upper-case letter, a lower-case letter and a digit
 * to count: a run of 40 letters is a word, not a key.
 */
const BASE64_BLOB_RE =
	/(?<![A-Za-z0-9+/=_-])(?=[A-Za-z0-9+/]*[A-Z])(?=[A-Za-z0-9+/]*[a-z])(?=[A-Za-z0-9+/]*[0-9])[A-Za-z0-9+/]{40,}={0,2}(?![A-Za-z0-9+/=_-])/g;

/**
 * Is this the name of a variable whose value is a secret?
 *
 * @param {string} name
 * @returns {boolean}
 */
function isSecretVariableName(name) {
	return ENV_NAME_RE.test(String(name || "")) && SECRET_NAME_WORD_RE.test(String(name || ""));
}

/**
 * Redact the secret-shaped strings in one report.
 *
 * The report's own text is not touched: only the values that match a secret
 * shape are replaced, and each one is replaced by `[redacted]`.
 *
 * @param {string} report The Markdown report.
 * @returns {string} The redacted report.
 */
export function redactReportSecrets(report) {
	if (typeof report !== "string" || report === "") {
		return report;
	}

	let text = report;

	// A connection string first: it carries the password AND the host, and
	// replacing it whole leaves nothing of the credential behind.
	text = text.replace(CONNECTION_STRING_RE, REDACTION_MARKER);

	// A bearer token: the scheme is kept, the token is not.
	text = text.replace(BEARER_RE, `$1${REDACTION_MARKER}`);

	// The value of a secret-bearing assignment. The name and the separator
	// survive, so the report still says WHICH variable holds the secret.
	text = text.replace(ASSIGNMENT_RE, (match, name, separator, doubleQuoted, singleQuoted, bare) => {
		if (!isSecretVariableName(name)) {
			return match;
		}
		// A value that already IS the marker is left alone, so the redaction
		// is idempotent: redacting a redacted report must not grow another
		// bracket.
		const value = doubleQuoted ?? singleQuoted ?? bare;
		if (typeof value === "string" && value.includes(REDACTION_MARKER_PREFIX)) {
			return match;
		}
		if (typeof doubleQuoted === "string") {
			return `${name}${separator}"${REDACTION_MARKER}"`;
		}
		if (typeof singleQuoted === "string") {
			return `${name}${separator}'${REDACTION_MARKER}'`;
		}
		if (typeof bare === "string") {
			return `${name}${separator}${REDACTION_MARKER}`;
		}
		return match;
	});

	// A managed-service password that is not part of an assignment.
	text = text.replace(SERVICE_PASSWORD_RE, REDACTION_MARKER);

	// Long high-entropy blobs.
	text = text.replace(HEX_BLOB_RE, REDACTION_MARKER);
	text = text.replace(BASE64_BLOB_RE, REDACTION_MARKER);

	return text;
}
