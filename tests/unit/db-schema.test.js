import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function readSchema() {
	return fs.readFileSync(path.join(ROOT, "prisma", "schema.prisma"), "utf8");
}

describe("database schema contract (prisma/schema.prisma)", () => {
	test("uses PostgreSQL with the DATABASE_URL contract", () => {
		const schema = readSchema();
		expect(schema).toMatch(/provider\s*=\s*"postgresql"/);
		expect(schema).toMatch(/env\("DATABASE_URL"\)/);
	});

	test("defines the marketplace core models", () => {
		const schema = readSchema();
		for (const model of [
			"model User",
			"model Requirement",
			"model Product",
			"model FeedPost",
			"model Match",
			"model Order",
			"model Lead",
			"model Message",
			"model Document",
			"model Verification",
			"model Subscription",
			"model Notification",
			"model WorkflowJourney",
		]) {
			expect(schema).toContain(model);
		}
	});

	test("enforces uniqueness on identity and business keys", () => {
		const schema = readSchema();
		expect(schema).toMatch(/email\s+String\s+@unique/);
		expect(schema).toMatch(/code\s+String\s+@unique/);
		expect(schema).toMatch(/@@unique\(\[lead_id,\s*stage\]/);
		expect(schema).toMatch(/@@unique\(\[org_owner_id,\s*agent_id\]/);
	});

	test("indexes hot query paths", () => {
		const schema = readSchema();
		expect(schema).toMatch(/@@index/);
		expect(schema).toMatch(/status/);
	});

	test("uses cascading deletes for owned CRM rows", () => {
		const schema = readSchema();
		expect(schema).toMatch(/onDelete:\s*Cascade/);
	});
});

describe("database migrations (prisma/migrations)", () => {
	const dir = path.join(ROOT, "prisma", "migrations");

	test("migration directories exist with non-empty SQL", () => {
		const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
		expect(entries.length).toBeGreaterThan(0);
		for (const entry of entries) {
			const sqlPath = path.join(dir, entry.name, "migration.sql");
			expect(fs.existsSync(sqlPath)).toBe(true);
			expect(fs.statSync(sqlPath).size).toBeGreaterThan(0);
		}
	});

	test("migrations contain no leftover conflict markers", () => {
		const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
		for (const entry of entries) {
			const sql = fs.readFileSync(path.join(dir, entry.name, "migration.sql"), "utf8");
			expect(sql).not.toMatch(/<<<<<<<|>>>>>>>/);
		}
	});

	test("migrations cover the core tables", () => {
		const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
		const all = entries
			.map((e) => fs.readFileSync(path.join(dir, e.name, "migration.sql"), "utf8"))
			.join("\n")
			.toLowerCase();
		for (const table of ["users", "requirements", "company_products", "leads", "messages"]) {
			expect(all).toContain(table);
		}
	});
});

describe("offline database bootstrap (server/utils/db.js + prisma.js)", () => {
	test("prisma test proxy resolves safe defaults without a live database", async () => {
		const { default: prisma } = await import("../../server/utils/prisma.js");
		await expect(prisma.user.findMany()).resolves.toEqual([]);
		await expect(prisma.user.findUnique()).resolves.toBeNull();
		await expect(prisma.user.count()).resolves.toBe(0);
		await expect(prisma.user.create()).resolves.toEqual({});
		await expect(prisma.$connect()).resolves.toBeUndefined();
	});

	test("ensureDatabaseConnection fails safe without DATABASE_URL unless offline mode", async () => {
		const OLD_URL = process.env.DATABASE_URL;
		const OLD_OFFLINE = process.env.ALLOW_DB_OFFLINE;
		delete process.env.DATABASE_URL;
		delete process.env.ALLOW_DB_OFFLINE;
		const db = await import("../../server/utils/db.js");
		await expect(db.ensureDatabaseConnection()).rejects.toThrow(/DATABASE_URL/);
		expect(db.getDbStatus().connected).toBe(false);

		process.env.ALLOW_DB_OFFLINE = "true";
		await expect(db.ensureDatabaseConnection()).resolves.toBeUndefined();

		if (OLD_URL === undefined) {
			delete process.env.DATABASE_URL;
		} else {
			process.env.DATABASE_URL = OLD_URL;
		}
		if (OLD_OFFLINE === undefined) {
			delete process.env.ALLOW_DB_OFFLINE;
		} else {
			process.env.ALLOW_DB_OFFLINE = OLD_OFFLINE;
		}
	});
});
