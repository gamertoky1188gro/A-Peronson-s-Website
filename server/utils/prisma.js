import prismaClientPkg from "@prisma/client";

let prisma;

// Guard: when running unit tests we use a lightweight Proxy that
// intercepts model access and returns mock CRUD methods (all
// resolving to []/null/{}). This prevents runtime crashes when
// test code calls prisma.user.findMany() etc. Tests can still
// override individual delegates via spyOn/override if needed.
if (process.env.NODE_ENV === "test") {
	const mockResolved =
		(val) =>
		(..._args) =>
			Promise.resolve(val);
	prisma = new Proxy(
		{},
		{
			get: (target, prop) => {
				if (
					prop === "$on" ||
					prop === "$connect" ||
					prop === "$disconnect" ||
					prop === "$use" ||
					prop === "$extends" ||
					prop === "$transaction"
				) {
					return mockResolved(undefined);
				}
				if (typeof prop === "string" && !prop.startsWith("_") && prop[0] !== "$") {
					if (!target[prop]) {
						target[prop] = {
							findMany: mockResolved([]),
							findUnique: mockResolved(null),
							findFirst: mockResolved(null),
							count: mockResolved(0),
							create: mockResolved({}),
							update: mockResolved({}),
							delete: mockResolved({}),
							upsert: mockResolved({}),
							createMany: mockResolved({ count: 0 }),
							deleteMany: mockResolved({ count: 0 }),
							updateMany: mockResolved({ count: 0 }),
							aggregate: mockResolved({}),
							groupBy: mockResolved([]),
						};
					}
					return target[prop];
				}
				return target[prop];
			},
		},
	);
} else {
	const PrismaClient = prismaClientPkg?.PrismaClient ?? prismaClientPkg?.default?.PrismaClient;
	const globalForPrisma = globalThis;
	prisma = globalForPrisma.__gartex_prisma__ || new PrismaClient();
	if (process.env.NODE_ENV !== "production") {
		globalForPrisma.__gartex_prisma__ = prisma;
	}
}

export default prisma;
