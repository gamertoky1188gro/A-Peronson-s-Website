/**
 * Finding classification: what KIND of issue a finding is, and how bad it is.
 *
 * Split out of delivery.js so the report renderer (and anything else that has
 * a finding in hand) can ask the same question without importing the mail
 * stack. delivery.js re-exports `classifyFinding` so its public API is
 * unchanged.
 *
 * Two answers, deliberately separate:
 *
 *  - classifyFinding: "security", "data_loss" or null - the kind of defect,
 *    used by the escalation path.
 *  - severityOf: "critical" / "high" / "medium" / "low" - what happens if the
 *    finding is true and nobody acts. Confidence says how SURE the agent is;
 *    severity says how BAD it is, and an owner triages by the second.
 */

// A finding with no `category` of its own is classified from its detail
// text. The security list is deliberately phrase-based rather than a bare
// word list, so an ordinary confirmed finding ("the delete button does
// nothing") never escalates.
const SECURITY_CATEGORY_RE =
	/\b(security|vulnerab\w*|exploit\w*|injection|breach|unauthori[sz]ed|unauthenticated|privilege\w*|traversal|csrf|xss|ssrf|rce|xxe|ssti|idor|leak\w*|exposure|hardcoded|plaintext|malware|ransomware|attacker)\b/u;
const DATA_LOSS_CATEGORY_RE =
	/\b(data[\s_-]?(loss|leak|breach|exposure|deletion)|loss[\s_-]?of[\s_-]?data|destructive[\s_-]?(delete|operation)|integrity[\s_-]?loss)\b/u;

/**
 * A finding that DENIES the harm is not evidence of the harm.
 *
 * The measured false positive: a CONFIRMED finding that correctly described
 * the API surface -
 *
 *   "The only DELETE route in documentRoutes.js is DELETE /api/documents/:documentId,
 *    which is a hard delete of a Document row and IS NOT CALLED from ContractVault."
 *
 * - was classified as a data-loss issue and escalated, because the phrase
 * "hard delete" appears in it. The finding says the OPPOSITE of an incident:
 * it says the destructive route is never reached.
 *
 * The list is deliberately narrow: it names the ways a finding says the harm
 * does not HAPPEN, not the ways a finding might merely mention a negative.
 */
const HARM_DENIAL_RE =
	/\b(?:is|are|was|were)\s+not\s+(?:called|used|wired|invoked|reached|executed|triggered|connected|linked)\b|\bnever\s+(?:called|used|wired|invoked|reached|executed|triggered|connected)\b|\bnot\s+(?:wired|connected|implemented|reachable|called\s+from|invoked\s+from|triggered\s+from)\b|\bno\s+(?:route|endpoint|button|path|server\s+endpoint|call)\b|\bcannot\s+(?:be\s+)?(?:delete|removed?|destroyed|wiped|erased|purged|leaked|exposed)\b|\bdoes\s+not\s+(?:delete|remove|destroy|wipe|erase|purge|leak|expose)\b|\bdoes\s+nothing\b|\bdoes\s+not\s+work\b|\b(?:has|have|had)\s+no\s+effect\b|\bno[\s-]?op\b/u;

const DATA_NOUN_RE =
	/\b(record|records|row|rows|data|file|files|document|documents|user|users|order|orders|contract|contracts|message|messages|table|tables|entry|entries|history|payment|payments|invoice|invoices|backup|backups)\b/u;
const DATA_LOSS_VERB_RE =
	/\b(delet(?:e|es|ed|ing)|remov(?:e|es|ed|ing)|wip(?:e|es|ed)|er(?:a|as)se(?:d|s)?|destroy(?:s|ed|ing)?|lost|loss|missing|gone|vanish(?:ed|es)?|disappear(?:s|ed|ing)?|corrupt(?:s|ed|ing)?|truncat(?:e|es|ed)|overwritt?(?:e|en)|clobb(?:er|ered|ering)|leak(?:s|ed|ing)?|purg(?:e|es|ed|ing)|drop(?:s|ped|ping))\b/u;

const SECURITY_PATTERNS = [
	/\bsecurit(y|ies)\b/u,
	/\bvulnerab(le|ility|ilities)\b/u,
	/\bexploit(able|ed|s|ation)?\b/u,
	/\b(sqli?|nosql|ldap|command|code|html|template|xpath|prototype|second[\s-]?order|blind)[\s-]?injection\b/u,
	/\b(xss|csrf|ssrf|xxe|ssti|rce|idor|lfi|rfi)\b/u,
	/\bcross[\s-]?site\b/u,
	/\bremote code execution\b/u,
	/\bprivilege escalation\b/u,
	/\b(auth|authentication|authorization|authn|authz|access control|permission)s?\s+(check\s+)?(bypass|is bypassed|are bypassed)\b/u,
	/\bbypass(es|ed|ing)?\s+(the\s+)?(auth|authentication|authorization|access control|permission|login)\b/u,
	/\bmissing (authorization|authentication|access control)\b/u,
	// "has no authorization check" is the same defect as "missing
	// authorization", and it is how the code under investigation words it.
	/\b(no|without|missing|lacks?|lacking|omits?|omitting)\s+(an?\s+)?(authorization|authentication|authz|authn|access[\s-]?control|permission)\b/u,
	/\bunauthenticated\b/u,
	/\bunauthori[sz]ed\b/u,
	/\barbitrary (file|command|code|path|read|write|object)\b/u,
	/\b(path|directory) traversal\b/u,
	/\bworld[\s-]?readable\b/u,
	/\bexposed\b[^.]{0,60}\b(api|endpoint|route|secret|key|password|credential|credentials|database|file|files|admin)\b/u,
	/\b(secret|secrets|credential|credentials|password|passwords|api[\s-]?key|private key|tokens?)\b[^.]{0,60}\b(exposed|leaked|disclosed|committed|hardcoded|in the repo|in the source|plain ?text|plaintext)\b/u,
	/\bhardcoded\b/u,
	/\b(password|passwords|secret|secrets|credential|credentials|tokens?)\b[^.]{0,40}\bin plain ?text\b/u,
	/\bunencrypted\b/u,
	/\b(no|missing|without|lacks?|lacking)\s+encryption\b/u,
	/\bweak (password|hash|encryption|cipher|token|secret|randomness)\b/u,
	/\b(sensitive|personal|confidential|private)\s+(data|information|details|records?)\b[^.]{0,60}\b(exposed|leaked|public|world|unencrypted|unprotected|readable)\b/u,
	/\b(sensitive|personal|confidential|private)\s+(data|information|details|records?)\b[^.]{0,60}\b(is|are|was|were)\s+(returned|sent|logged|printed|visible)\b/u,
	/\battacker\b/u,
	/\bmalicious\b/u,
	/\bsession (fixation|hijack)\b/u,
	/\bmfa (bypass|circumvention)\b/u,
	/\b(missing|absent|broken)\s+csrf\b/u,
];

const DATA_LOSS_PATTERNS = [
	/\bdata[\s-]?(loss|leak|breach|exposure|deletion)\b/u,
	/\bloss of data\b/u,
	// The separator is a hyphen as well as a space: the code under
	// investigation writes "hard-deletes", not "hard delete".
	/\b(permanently|hard|bulk|mass)[\s_-]?delet(?:e|es|ed|ing)\b/u,
	new RegExp(`${DATA_LOSS_VERB_RE.source}[^.]{0,60}${DATA_NOUN_RE.source}`),
	new RegExp(`${DATA_NOUN_RE.source}[^.]{0,60}${DATA_LOSS_VERB_RE.source}`),
];

/**
 * A security defect that is actively reachable or already exposed is worth
 * more than a "high" - it is the kind of finding an owner acts on before
 * reading anything else.
 */
const CRITICAL_SECURITY_RE =
	/\b(world[\s-]?readable|exposed\b[^.]{0,60}\b(api|endpoint|route|secret|key|password|credential|credentials|database|file|files|admin)\b|hardcoded|in plain ?text|plaintext|unencrypted|\b(no|without|missing|lacks?|lacking)\s+(an?\s+)?(authorization|authentication|authz|authn|access[\s-]?control|permission)\b|\bbypass(es|ed|ing)?\s+(the\s+)?(auth|authentication|authorization|access control|login)\b|privilege escalation|remote code execution|(sql|nosql|ldap|command|code|html|template|xpath)[\s-]?injection|(path|directory) traversal|\b(attacker|malicious)\b)/u;

/**
 * How bad a finding is, independent of how sure the agent is.
 *
 * @param {Object} finding
 * @returns {"critical"|"high"|"medium"|"low"}
 */
export function severityOf(finding) {
	const confidence = String(finding?.confidence || "").toLowerCase();
	const category = classifyFinding(finding);
	if (confidence === "speculative") {
		return "low";
	}
	if (category === "security") {
		if (confidence !== "confirmed") {
			return "high";
		}
		const haystack = String(finding?.detail || finding?.text || "");
		return CRITICAL_SECURITY_RE.test(haystack) ? "critical" : "high";
	}
	if (category === "data_loss") {
		return confidence === "confirmed" ? "critical" : "high";
	}
	return confidence === "confirmed" ? "medium" : "low";
}

/**
 * Classifies a finding as a security issue, a data-loss issue, or neither.
 *
 * @param {Object} finding
 * @returns {"security"|"data_loss"|null}
 */
export function classifyFinding(finding) {
	const explicit = String(finding?.category || finding?.type || "").toLowerCase();
	if (explicit) {
		if (DATA_LOSS_CATEGORY_RE.test(explicit)) {
			return "data_loss";
		}
		if (SECURITY_CATEGORY_RE.test(explicit)) {
			return "security";
		}
	}
	const haystack = String(finding?.detail || finding?.text || "").toLowerCase();
	if (!haystack) {
		return null;
	}
	// The finding says the harmful thing is not reached. It is describing a
	// CAPABILITY, not reporting an incident, so it must not page anybody.
	if (HARM_DENIAL_RE.test(haystack)) {
		return null;
	}
	// SECURITY is tested FIRST. A finding that says "any authenticated user
	// can delete another user's contract" matches BOTH sets - the access
	// control is the defect, the deletion is the consequence - and the defect
	// is the more precise classification.
	if (SECURITY_PATTERNS.some((pattern) => pattern.test(haystack))) {
		return "security";
	}
	if (DATA_LOSS_PATTERNS.some((pattern) => pattern.test(haystack))) {
		return "data_loss";
	}
	return null;
}
