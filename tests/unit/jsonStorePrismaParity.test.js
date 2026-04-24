/** @jest-environment node */

import prisma from "../../server/utils/prisma.js";
import {
  readJson,
  updateJson,
  writeJson,
} from "../../server/utils/jsonStore.js";

describe("jsonStore Prisma parity", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalRequirement = prisma.requirement;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    prisma.requirement = originalRequirement;
  });

  test("read/write parity matches expected behavior via Prisma delegate", async () => {
    process.env.NODE_ENV = "development";

    let rows = [];
    prisma.requirement = {
      findMany: async () => rows,
      deleteMany: async ({ where } = {}) => {
        const deletions = Array.isArray(where?.OR) ? where.OR : [];
        const deleteSet = new Set(deletions.map((d) => String(d.id || "")));
        rows = rows.filter((row) => !deleteSet.has(String(row.id || "")));
        return { count: deleteSet.size };
      },
      upsert: async ({ where, update, create }) => {
        const id = String(where?.id || create?.id || "");
        const idx = rows.findIndex((row) => String(row.id) === id);
        if (idx >= 0) {
          rows[idx] = { ...rows[idx], ...update };
          return rows[idx];
        }
        const next = { ...create };
        rows.push(next);
        return next;
      },
    };

    await writeJson("requirements.json", [
      { id: "req-1", buyer_id: "buyer-1", title: "A", status: "new" },
      { id: "req-2", buyer_id: "buyer-1", title: "B", status: "new" },
    ]);

    const firstRead = await readJson("requirements.json");
    expect(firstRead).toHaveLength(2);
    expect(firstRead.map((r) => r.id).sort()).toEqual(["req-1", "req-2"]);

    await writeJson("requirements.json", [
      { id: "req-1", buyer_id: "buyer-1", title: "A", status: "contacted" },
    ]);

    const secondRead = await readJson("requirements.json");
    expect(secondRead).toEqual([
      expect.objectContaining({ id: "req-1", status: "contacted" }),
    ]);
  });

  test("unknown file returns empty array in non-test mode", async () => {
    process.env.NODE_ENV = "development";
    const rows = await readJson("unknown.json");
    expect(rows).toEqual([]);
  });

  test("update semantics work in test mode in-memory path", async () => {
    process.env.NODE_ENV = "test";
    await writeJson("requirements.json", [{ id: "req-mem-1", status: "new" }]);

    await updateJson("requirements.json", (existing) => {
      return existing.map((row) => ({ ...row, status: "contacted" }));
    });

    const rows = await readJson("requirements.json");
    expect(rows).toEqual([{ id: "req-mem-1", status: "contacted" }]);
  });
});
