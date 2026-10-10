import { jest } from "@jest/globals";
import {
	canAccessContract,
	canManageMembers,
	canManageOrgPolicies,
	canManageOrgQueue,
	canModifyContract,
	canRespondToPartnerRequest,
	canViewAnalytics,
	canViewAnalyticsAdmin,
	canViewAnalyticsDashboard,
	canViewPartnerNetwork,
	deny,
	forbiddenError,
	handleControllerError,
	hasRole,
	isAgent,
	isOwnerOrAdmin,
	scopeRecordsForUser,
} from "../../server/utils/permissions.js";

function resDouble() {
	const res = {};
	res.status = jest.fn(() => res);
	res.json = jest.fn(() => res);
	return res;
}

describe("server permissions (server/utils/permissions.js)", () => {
	test("hasRole matches any of the given roles", () => {
		expect(hasRole({ role: "buyer" }, "buyer", "factory")).toBe(true);
		expect(hasRole({ role: "agent" }, "buyer")).toBe(false);
		expect(hasRole(null, "buyer")).toBe(false);
		expect(hasRole({}, "buyer")).toBe(false);
	});

	test("isOwnerOrAdmin covers owner and admin only", () => {
		expect(isOwnerOrAdmin({ role: "owner" })).toBe(true);
		expect(isOwnerOrAdmin({ role: "admin" })).toBe(true);
		expect(isOwnerOrAdmin({ role: "factory" })).toBe(false);
		expect(isOwnerOrAdmin(null)).toBe(false);
	});

	test("isAgent is exact", () => {
		expect(isAgent({ role: "agent" })).toBe(true);
		expect(isAgent({ role: "owner" })).toBe(false);
	});

	test("member management covers owner/admin/buying_house/factory", () => {
		for (const role of ["owner", "admin", "buying_house", "factory"]) {
			expect(canManageMembers({ role })).toBe(true);
		}
		expect(canManageMembers({ role: "buyer" })).toBe(false);
		expect(canManageMembers({ role: "agent" })).toBe(false);
	});

	test("org policy/queue gates fall back to the permission matrix", () => {
		expect(canManageOrgPolicies({ role: "owner" })).toBe(true);
		expect(
			canManageOrgPolicies({
				role: "agent",
				permission_matrix: { org_operations: { policy_admin: true } },
			}),
		).toBe(true);
		expect(canManageOrgPolicies({ role: "agent" })).toBe(false);
		expect(canManageOrgQueue({ role: "admin" })).toBe(true);
		expect(
			canManageOrgQueue({
				role: "agent",
				permission_matrix: { org_operations: { queue_manager: 1 } },
			}),
		).toBe(true);
		expect(canManageOrgQueue({ role: "buyer" })).toBe(false);
	});

	test("partner network: buying_house manages, agents view, factories respond", () => {
		expect(canViewPartnerNetwork({ role: "buying_house" })).toBe(true);
		expect(canViewPartnerNetwork({ role: "agent" })).toBe(true);
		expect(canViewPartnerNetwork({ role: "buyer" })).toBe(false);
		expect(canRespondToPartnerRequest({ role: "factory" })).toBe(true);
		expect(canRespondToPartnerRequest({ role: "owner" })).toBe(true);
		expect(canRespondToPartnerRequest({ role: "buyer" })).toBe(false);
	});

	test("analytics visibility tiers", () => {
		expect(canViewAnalytics({ role: "buyer" })).toBe(true);
		expect(canViewAnalytics({ role: "agent" })).toBe(true);
		expect(canViewAnalytics(null)).toBe(false);
		expect(canViewAnalyticsAdmin({ role: "admin" })).toBe(true);
		expect(canViewAnalyticsAdmin({ role: "factory" })).toBe(false);
		expect(
			canViewAnalyticsDashboard({
				role: "agent",
				permission_matrix: { analytics: { view: true } },
			}),
		).toBe(true);
		expect(canViewAnalyticsDashboard({ role: "agent" })).toBe(false);
		expect(canViewAnalyticsDashboard({ role: "factory" })).toBe(true);
		expect(canViewAnalyticsDashboard(null)).toBe(false);
	});

	test("scopeRecordsForUser: owners see all, agents see assigned, users see own", () => {
		const records = [
			{ id: 1, buyer_id: "u-1", assigned_agent_id: "a-1" },
			{ id: 2, buyer_id: "u-2", assigned_agent_id: "a-2" },
		];
		expect(scopeRecordsForUser({ role: "owner", id: "x" }, records)).toHaveLength(2);
		expect(
			scopeRecordsForUser({ role: "agent", id: "a-1" }, records, { idFields: ["buyer_id"] }),
		).toEqual([records[0]]);
		expect(
			scopeRecordsForUser({ role: "buyer", id: "u-2" }, records, { idFields: ["buyer_id"] }),
		).toEqual([records[1]]);
	});

	test("contract access: parties and owners in, strangers out; agents read-only", () => {
		const contract = { buyer_id: "b-1", factory_id: "f-1", uploaded_by: "b-1" };
		expect(canAccessContract({ role: "owner", id: "o" }, contract)).toBe(true);
		expect(canAccessContract({ role: "buyer", id: "b-1" }, contract)).toBe(true);
		expect(canAccessContract({ role: "factory", id: "stranger" }, contract)).toBe(false);
		expect(
			canAccessContract({ role: "agent", id: "a-1" }, { ...contract, assigned_agent_id: "a-1" }),
		).toBe(true);
		expect(canAccessContract(null, contract)).toBe(false);
		expect(canAccessContract({ role: "buyer", id: "b-1" }, null)).toBe(false);

		expect(canModifyContract({ role: "buyer", id: "b-1" }, contract)).toBe(true);
		expect(
			canModifyContract({ role: "agent", id: "a-1" }, { ...contract, assigned_agent_id: "a-1" }),
		).toBe(false);
	});

	test("deny/forbiddenError/handleControllerError produce the documented shapes", () => {
		const err = forbiddenError("Nope");
		expect(err.status).toBe(403);
		expect(err.code).toBe("FORBIDDEN");

		const res = resDouble();
		deny(res, "Stop");
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: "Stop", code: "FORBIDDEN" });

		const res403 = resDouble();
		handleControllerError(res403, Object.assign(new Error("no"), { status: 403 }));
		expect(res403.status).toHaveBeenCalledWith(403);

		const res500 = resDouble();
		handleControllerError(res500, Object.assign(new Error("boom"), { status: 500 }));
		expect(res500.json).toHaveBeenCalledWith({ error: "Internal server error" });

		const res400 = resDouble();
		handleControllerError(res400, Object.assign(new Error("bad input"), { status: 400 }));
		expect(res400.json).toHaveBeenCalledWith({ error: "bad input" });
	});
});
