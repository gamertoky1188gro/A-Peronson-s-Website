import {
  createMember,
  deactivateOrRemoveMember,
  getMember,
  getMemberConstraints,
  listMembers,
  resetMemberPassword,
  updateMember,
  updateMemberPermissions,
} from "../services/memberService.js";
import {
  canManageMembers,
  deny,
  handleControllerError,
} from "../utils/permissions.js";
import { ensureEntitlement } from "../services/entitlementService.js";
import { ACTIONS, authorize } from "../services/authorizationService.js";

function orgOwnerIdFromUser(user) {
  return (
    user?.org_owner_id || user?.org_id || user?.organization_id || user?.id
  );
}

function handleError(res, error) {
  return handleControllerError(res, error);
}

export async function createOrgMember(req, res) {
  if (!canManageMembers(req.user)) return deny(res);
  try {
    const currentMembers = await listMembers(orgOwnerIdFromUser(req.user));
    const constraints = await getMemberConstraints(req.user);
    const seatCap = Number(
      constraints?.plan === "premium"
        ? constraints?.premium_member_limit
        : constraints?.free_member_limit,
    );
    const activeSeats = currentMembers.filter(
      (m) => String(m.status || "active") === "active",
    ).length;
    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, {
      org_id: orgOwnerIdFromUser(req.user),
      active_seats: activeSeats,
      requested_seats: 1,
      seat_cap: seatCap,
    });
    if (
      req.body?.permissions !== undefined ||
      req.body?.permission_matrix !== undefined
    ) {
      await ensureEntitlement(
        req.user,
        "team_access_management",
        "Premium plan required for team access management.",
      );
    }
    const member = await createMember(
      orgOwnerIdFromUser(req.user),
      req.body || {},
    );
    return res.status(201).json({ member });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function listOrgMembers(req, res) {
  if (!canManageMembers(req.user)) return deny(res);
  try {
    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, {
      org_id: orgOwnerIdFromUser(req.user),
    });
    const members = await listMembers(orgOwnerIdFromUser(req.user));
    const constraints = await getMemberConstraints(req.user);
    return res.json({ members, constraints });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getOrgMember(req, res) {
  if (!canManageMembers(req.user)) return deny(res);
  try {
    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, {
      org_id: orgOwnerIdFromUser(req.user),
      member_id: req.params.memberId,
    });
    const member = await getMember(
      orgOwnerIdFromUser(req.user),
      req.params.memberId,
    );
    if (!member) return res.status(404).json({ error: "Member not found" });
    return res.json({ member });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function putOrgMember(req, res) {
  if (!canManageMembers(req.user)) return deny(res);
  try {
    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, {
      org_id: orgOwnerIdFromUser(req.user),
      member_id: req.params.memberId,
    });
    if (
      req.body?.permissions !== undefined ||
      req.body?.permission_matrix !== undefined
    ) {
      await ensureEntitlement(
        req.user,
        "team_access_management",
        "Premium plan required for team access management.",
      );
    }
    const member = await updateMember(
      orgOwnerIdFromUser(req.user),
      req.params.memberId,
      req.body || {},
    );
    if (!member) return res.status(404).json({ error: "Member not found" });
    return res.json({ member });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function patchMemberPermissions(req, res) {
  if (!canManageMembers(req.user)) return deny(res);
  try {
    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, {
      org_id: orgOwnerIdFromUser(req.user),
      member_id: req.params.memberId,
    });
    await ensureEntitlement(
      req.user,
      "team_access_management",
      "Premium plan required for team access management.",
    );
    const member = await updateMemberPermissions(
      orgOwnerIdFromUser(req.user),
      req.params.memberId,
      req.body?.permissions,
      req.body?.permission_matrix,
    );
    if (!member) return res.status(404).json({ error: "Member not found" });
    return res.json({ member });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function postMemberPasswordReset(req, res) {
  if (!canManageMembers(req.user)) return deny(res);
  try {
    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, {
      org_id: orgOwnerIdFromUser(req.user),
      member_id: req.params.memberId,
    });
    const result = await resetMemberPassword(
      orgOwnerIdFromUser(req.user),
      req.params.memberId,
    );
    if (!result) return res.status(404).json({ error: "Member not found" });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deactivateOrRemoveOrgMember(req, res) {
  if (!canManageMembers(req.user)) return deny(res);
  try {
    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, {
      org_id: orgOwnerIdFromUser(req.user),
      member_id: req.params.memberId,
    });
    const mode = req.query.remove === "true" ? "remove" : "deactivate";
    const result = await deactivateOrRemoveMember(
      orgOwnerIdFromUser(req.user),
      req.params.memberId,
      mode,
    );
    if (!result) return res.status(404).json({ error: "Member not found" });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
}
