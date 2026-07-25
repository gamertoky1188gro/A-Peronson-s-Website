/** @jest-environment node */

import prisma from "../../server/utils/prisma.js";

async function freshCurrencyService() {
  const nonce = `${Date.now()}-${Math.random()}`;
  return import(`../../server/services/currencyService.js?nonce=${nonce}`);
}

describe("currencyService FX freshness and upsert collision handling", () => {
  const originalFetch = global.fetch;
  const originalCurrencyConfig = prisma.currencyConfig;
  const originalFxRate = prisma.fxRate;

  beforeEach(() => {
    prisma.currencyConfig = {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      findFirst: jest.fn().mockResolvedValue(null),
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };
    prisma.fxRate = {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      findFirst: jest.fn().mockResolvedValue(null),
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    prisma.currencyConfig = originalCurrencyConfig;
    prisma.fxRate = originalFxRate;
  });

  test("returns fresh in-memory rate even when Prisma upsert collides", async () => {
    const service = await freshCurrencyService();

    prisma.currencyConfig = {
      findFirst: async () => ({
        baseCurrency: "USD",
        staleToleranceMinutes: 60,
      }),
    };

    prisma.fxRate = {
      findUnique: async () => null,
      upsert: async () => {
        throw new Error("unique_collision");
      },
    };

    let fetchCalls = 0;
    global.fetch = async () => {
      fetchCalls += 1;
      return {
        ok: true,
        async json() {
          return { rates: { EUR: 0.8 } };
        },
      };
    };

    const first = await service.getRate("USD", "EUR");
    expect(first.rate).toBe(0.8);
    expect(first.stale).toBe(false);
    expect(first.warning).toBe(null);

    global.fetch = async () => {
      throw new Error("provider should not be called when cache is fresh");
    };
    const second = await service.getRate("USD", "EUR");
    expect(second.rate).toBe(0.8);
    expect(second.stale).toBe(false);
    expect(fetchCalls).toBe(1);
  });
});
