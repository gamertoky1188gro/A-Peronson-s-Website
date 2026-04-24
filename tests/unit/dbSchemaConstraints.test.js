import fs from "node:fs/promises";
import path from "node:path";

const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");

async function readSchema() {
  return fs.readFile(schemaPath, "utf8");
}

describe("Prisma schema DB constraints", () => {
  test("enforces identity-model uniqueness and required fields", async () => {
    const schema = await readSchema();

    expect(schema).toMatch(/model\s+User\s+\{[\s\S]*?email\s+String\s+@unique/);
    expect(schema).toMatch(/model\s+User\s+\{[\s\S]*?name\s+String/);
    expect(schema).toMatch(/model\s+User\s+\{[\s\S]*?password_hash\s+String/);
    expect(schema).toMatch(
      /model\s+SenderReputation\s+\{[\s\S]*?sender_id\s+String\s+@unique/,
    );
    expect(schema).toMatch(
      /model\s+Verification\s+\{[\s\S]*?user_id\s+String\s+@id/,
    );
  });

  test("enforces money-model indexes, uniqueness, and required fields", async () => {
    const schema = await readSchema();

    expect(schema).toMatch(/model\s+FxRate\s+\{[\s\S]*?base\s+String/);
    expect(schema).toMatch(/model\s+FxRate\s+\{[\s\S]*?quote\s+String/);
    expect(schema).toMatch(/model\s+FxRate\s+\{[\s\S]*?rate\s+Float/);
    expect(schema).toMatch(/model\s+FxRate\s+\{[\s\S]*?expiresAt\s+DateTime/);
    expect(schema).toMatch(
      /@@unique\(\[base, quote\], name: "fx_base_quote"(, map: "fx_base_quote")?\)/,
    );
    expect(schema).toMatch(/@@index\(\[expiresAt\]\)/);

    expect(schema).toMatch(
      /model\s+CurrencyConfig\s+\{[\s\S]*?id\s+String\s+@id\s+@default\("default"\)/,
    );
    expect(schema).toMatch(/model\s+CouponCode\s+\{[\s\S]*?amount_usd\s+Float/);
    expect(schema).toMatch(
      /model\s+WalletHistory\s+\{[\s\S]*?balance_after_usd\s+Float\?/,
    );
  });
});
