import {
	ERRORS,
	isValidDomain,
	isValidEmail,
	isValidIp,
	isValidNumericRange,
	isValidOrgName,
	isValidPhone,
	isValidPort,
	isValidUrl,
} from "../../src/lib/validation.js";

describe("frontend validation helpers (src/lib/validation.js)", () => {
	test("accepts well-formed emails and rejects malformed ones", () => {
		expect(isValidEmail("buyer@gartexhub.com")).toBe(true);
		expect(isValidEmail("a.b+tag@sub.domain.co")).toBe(true);
		expect(isValidEmail("")).toBe(false);
		expect(isValidEmail(null)).toBe(false);
		expect(isValidEmail("not-an-email")).toBe(false);
		expect(isValidEmail("missing@tld")).toBe(false);
		expect(isValidEmail("spaces in@email.com")).toBe(false);
	});

	test("accepts only http/https URLs", () => {
		expect(isValidUrl("https://gartexhub.com/catalog")).toBe(true);
		expect(isValidUrl("http://localhost:5173/feed")).toBe(true);
		expect(isValidUrl("")).toBe(false);
		expect(isValidUrl(null)).toBe(false);
		expect(isValidUrl("ftp://files.example.com/x")).toBe(false);
		expect(isValidUrl("notaurl")).toBe(false);
	});

	test("accepts international phone formats and rejects short/garbage input", () => {
		expect(isValidPhone("+8801712345678")).toBe(true);
		expect(isValidPhone("+1 (555) 123-4567")).toBe(true);
		expect(isValidPhone("")).toBe(false);
		expect(isValidPhone("123")).toBe(false);
		expect(isValidPhone("phone-number")).toBe(false);
	});

	test("validates IPv4 octets strictly", () => {
		expect(isValidIp("192.168.1.10")).toBe(true);
		expect(isValidIp("0.0.0.0")).toBe(true);
		expect(isValidIp("")).toBe(false);
		expect(isValidIp("999.1.1.1")).toBe(false);
		expect(isValidIp("1.2.3")).toBe(false);
		expect(isValidIp("::1")).toBe(false);
	});

	test("validates TCP ports 1-65535", () => {
		expect(isValidPort(4000)).toBe(true);
		expect(isValidPort("5173")).toBe(true);
		expect(isValidPort(1)).toBe(true);
		expect(isValidPort(65_535)).toBe(true);
		expect(isValidPort(0)).toBe(false);
		expect(isValidPort(65_536)).toBe(false);
		expect(isValidPort("")).toBe(false);
		expect(isValidPort(null)).toBe(false);
		expect(isValidPort("abc")).toBe(false);
	});

	test("validates domain names", () => {
		expect(isValidDomain("gartexhub.com")).toBe(true);
		expect(isValidDomain("sub.domain.co.uk")).toBe(true);
		expect(isValidDomain("")).toBe(false);
		expect(isValidDomain("no-tld")).toBe(false);
		expect(isValidDomain("-bad.com")).toBe(false);
	});

	test("validates numeric ranges with string coercion", () => {
		expect(isValidNumericRange(5, 1, 10)).toBe(true);
		expect(isValidNumericRange("7", 1, 10)).toBe(true);
		expect(isValidNumericRange(0, 1, 10)).toBe(false);
		expect(isValidNumericRange(11, 1, 10)).toBe(false);
		expect(isValidNumericRange("", 1, 10)).toBe(false);
		expect(isValidNumericRange(null, 1, 10)).toBe(false);
		expect(isValidNumericRange("abc", 1, 10)).toBe(false);
	});

	test("validates organization names and returns reason strings", () => {
		expect(isValidOrgName("Gartex Sourcing Ltd")).toBeNull();
		expect(isValidOrgName("")).toBe("Organization name is required");
		expect(isValidOrgName(null)).toBe("Organization name is required");
		expect(isValidOrgName("A")).toBe("Must be at least 2 characters");
		expect(isValidOrgName("x".repeat(101))).toBe("Must be less than 100 characters");
		expect(isValidOrgName("Bad<>Name")).toBe("Contains invalid characters");
	});

	test("exposes user-facing error copy for every validator", () => {
		for (const key of ["email", "url", "phone", "ip", "port", "domain", "required"]) {
			expect(typeof ERRORS[key]).toBe("string");
			expect(ERRORS[key].length).toBeGreaterThan(0);
		}
	});
});
