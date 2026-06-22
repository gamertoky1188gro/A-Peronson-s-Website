import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";
import { sanitizeString } from "../utils/validators.js";
import { upsertSubscription } from "./subscriptionService.js";
import { getAdminConfig } from "./adminConfigService.js";
import { creditWallet, redeemCouponForUser } from "./walletService.js";
import { getPlanForUser } from "./entitlementService.js";
import { reindexOrg } from "./openSearchService.js";

const OPENSEARCH_REINDEX_PROFILE_KEYS = new Set([
  "country",
  "industry",
  "certifications",
  "monthly_capacity",
  "lead_time_days",
  "payment_terms",
  "document_ready",
  "audit_date",
  "language_support",
  "incoterms",
  "main_processes",
  "years_in_business",
  "handles_multiple_factories",
  "team_seats",
  "export_ports",
  "location_lat",
  "location_lng",
]);

function generateSetupCode(prefix = "setup") {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}

function cleanUser(user) {
  const { password_hash: _passwordHash, passkeys, ...safe } = user;
  return {
    ...safe,
    passkeys: Array.isArray(passkeys)
      ? passkeys.map((key) => ({
          id: key.id,
          name: key.name || "",
          created_at: key.created_at || "",
          last_used_at: key.last_used_at || "",
          transports: Array.isArray(key.transports) ? key.transports : [],
        }))
      : [],
  };
}

export function buildFriendMatchId(userA, userB) {
  const ids = [
    sanitizeString(String(userA || ""), 120),
    sanitizeString(String(userB || ""), 120),
  ]
    .filter(Boolean)
    .sort();
  if (ids.length !== 2) return "";
  return `friend:${ids[0]}:${ids[1]}`;
}

export function isUserPairInFriendMatch(matchId, userA, userB) {
  if (!String(matchId || "").startsWith("friend:")) return false;
  return matchId === buildFriendMatchId(userA, userB);
}

export async function isFriendConnected(userA, userB) {
  if (!userA || !userB || userA === userB) return false;
  const count = await prisma.userConnection.count({
    where: {
      OR: [
        { requester_id: userA, receiver_id: userB },
        { requester_id: userB, receiver_id: userA },
      ],
      type: { in: ["friend", "friend_request"] },
      status: { in: ["active", "accepted"] },
    },
  });
  return count > 0;
}

function connectionSnapshot(connections, viewerId, targetId) {
  const following = connections.some(
    (row) =>
      row.type === "follow" &&
      row.requester_id === viewerId &&
      row.receiver_id === targetId &&
      row.status === "active",
  );

  const friends = connections.some((row) => {
    const samePair =
      (row.requester_id === viewerId && row.receiver_id === targetId) ||
      (row.requester_id === targetId && row.receiver_id === viewerId);
    if (!samePair) return false;
    const status = String(row.status || "").toLowerCase();
    if (row.type === "friend" && ["active", "accepted"].includes(status))
      return true;
    if (
      row.type === "friend_request" &&
      ["active", "accepted"].includes(status)
    )
      return true;
    return false;
  });

  if (friends) {
    return { following, friend_status: "friends" };
  }

  const outgoingPending = connections.some(
    (row) =>
      row.type === "friend_request" &&
      row.requester_id === viewerId &&
      row.receiver_id === targetId &&
      row.status === "pending",
  );
  if (outgoingPending) {
    return { following, friend_status: "requested" };
  }

  const incomingPending = connections.some(
    (row) =>
      row.type === "friend_request" &&
      row.requester_id === targetId &&
      row.receiver_id === viewerId &&
      row.status === "pending",
  );
  if (incomingPending) {
    return { following, friend_status: "incoming" };
  }

  return { following, friend_status: "none" };
}

export async function listUsers() {
  const users = await prisma.user.findMany();
  const updated = [];
  for (const user of users) {
    const profile = { ...(user.profile || {}) };
    if (!String(profile.mfa_setup_code || "").trim()) {
      profile.mfa_setup_code = generateSetupCode("mfa");
      await prisma.user.update({
        where: { id: user.id },
        data: { profile },
      });
    }
    if (!String(profile.stepup_setup_code || "").trim()) {
      profile.stepup_setup_code = generateSetupCode("stepup");
      await prisma.user.update({
        where: { id: user.id },
        data: { profile },
      });
    }
    updated.push({ ...user, profile });
  }
  return updated.map(cleanUser);
}

export async function listUsersByIds(ids = []) {
  const safeIds = (Array.isArray(ids) ? ids : []).map((id) => String(id));
  if (!safeIds.length) return [];
  const users = await prisma.user.findMany({
    where: { id: { in: safeIds } },
  });
  return users.map(cleanUser);
}

export async function listEarlyVerifiedFactories({
  days = 30,
  limit = 20,
} = {}) {
  const cutoff = new Date(Date.now() - Number(days || 30) * 24 * 60 * 60 * 1000);
  const rows = await prisma.user.findMany({
    where: {
      role: "factory",
      verified: true,
      OR: [
        { updated_at: { gte: cutoff } },
        { created_at: { gte: cutoff } },
      ],
    },
    orderBy: { updated_at: "desc" },
    take: Math.max(1, Math.min(50, Number(limit || 20))),
  });
  return rows.map(cleanUser);
}

export async function searchUsers(viewerId, query, cursor = 0, limit = 12) {
  const search = sanitizeString(query || "", 120)
    .trim()
    .toLowerCase();

  const where = {
    NOT: { role: "agent" },
  };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { role: { contains: search, mode: "insensitive" } },
      { username: { contains: search, mode: "insensitive" } },
    ];
  }

  const take = Math.min(50, Math.max(1, Number(limit) || 12));

  const [users, total, connections] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { name: "asc" },
      skip: cursor,
      take: take + 1,
    }),
    prisma.user.count({ where }),
    prisma.userConnection.findMany(),
  ]);

  const hasMore = users.length > take;
  if (hasMore) users.pop();

  const items = users.map((user) => {
    const safe = cleanUser(user);
    const profile = (safe.profile || {});
    const isSelf = user.id === viewerId;
    const relation = isSelf
      ? { following: false, friend_status: "self" }
      : connectionSnapshot(connections, viewerId, user.id);
    return {
      id: safe.id,
      name: safe.name,
      email: safe.email,
      role: safe.role,
      verified: Boolean(safe.verified),
      company: profile.company || "",
      country: profile.country || "",
      industry: profile.industry || "",
      avatar_url: profile.avatar_url || profile.avatar || "",
      headline: profile.headline || "",
      bio: profile.bio || "",
      is_self: isSelf,
      ...relation,
    };
  });

  return {
    items,
    total,
    cursor: cursor + items.length,
    next_cursor: hasMore ? cursor + items.length : null,
  };
}

export async function followUser(viewerId, targetId) {
  const existing = await prisma.userConnection.findFirst({
    where: { type: "follow", requester_id: viewerId, receiver_id: targetId },
  });

  if (existing) {
    await prisma.userConnection.update({
      where: { id: existing.id },
      data: { status: "active", updated_at: new Date() },
    });
  } else {
    await prisma.userConnection.create({
      data: {
        id: crypto.randomUUID(),
        type: "follow",
        requester_id: viewerId,
        receiver_id: targetId,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  const rows = await prisma.userConnection.findMany();
  return connectionSnapshot(rows, viewerId, targetId);
}

export async function sendFriendRequest(viewerId, targetId) {
  const now = new Date();

  const existingFriend = await prisma.userConnection.findFirst({
    where: {
      type: "friend",
      status: { in: ["active", "accepted"] },
      OR: [
        { requester_id: viewerId, receiver_id: targetId },
        { requester_id: targetId, receiver_id: viewerId },
      ],
    },
  });

  if (existingFriend) {
    const rows = await prisma.userConnection.findMany();
    return connectionSnapshot(rows, viewerId, targetId);
  }

  const incoming = await prisma.userConnection.findFirst({
    where: {
      type: "friend_request",
      requester_id: targetId,
      receiver_id: viewerId,
      status: "pending",
    },
  });

  if (incoming) {
    await prisma.userConnection.update({
      where: { id: incoming.id },
      data: { type: "friend", status: "active", updated_at: now },
    });
    const rows = await prisma.userConnection.findMany();
    return connectionSnapshot(rows, viewerId, targetId);
  }

  const outgoing = await prisma.userConnection.findFirst({
    where: {
      type: "friend_request",
      requester_id: viewerId,
      receiver_id: targetId,
      status: "pending",
    },
  });

  if (!outgoing) {
    await prisma.userConnection.create({
      data: {
        id: crypto.randomUUID(),
        type: "friend_request",
        requester_id: viewerId,
        receiver_id: targetId,
        status: "pending",
        created_at: now,
        updated_at: now,
      },
    });
  }

  const rows = await prisma.userConnection.findMany();
  return connectionSnapshot(rows, viewerId, targetId);
}

export async function findUserByEmail(email) {
  return prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
}

export async function findUserByMemberId(memberId) {
  const id = sanitizeString(String(memberId || ""), 64).trim();
  if (!id) return null;
  return prisma.user.findFirst({
    where: { member_id: { equals: id, mode: "insensitive" } },
  });
}

export async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function registerUser(payload) {
  const hash = await bcrypt.hash(payload.password, 10);

  const user = {
    id: crypto.randomUUID(),
    name: sanitizeString(payload.name || payload.company_name, 120),
    email: payload.email.toLowerCase(),
    password_hash: hash,
    role: payload.role,
    status: "active",
    verified: false,
    subscription_status:
      payload.subscription_status === "premium" ? "premium" : "free",
    created_at: new Date(),
    wallet_balance_usd: 0,
    wallet_restricted_usd: 0,
    policy_strikes: 0,
    messaging_restricted_until: null,
    profile: {
      position: sanitizeString(payload.profile?.position || "", 80),
      country: sanitizeString(payload.profile?.country || "", 120),
      certifications: Array.isArray(payload.profile?.certifications)
        ? payload.profile.certifications.map((c) => sanitizeString(c, 80))
        : [],
      bank_proof: sanitizeString(payload.profile?.bank_proof || "", 200),
      export_license: sanitizeString(
        payload.profile?.export_license || "",
        160,
      ),
      monthly_capacity: sanitizeString(
        payload.profile?.monthly_capacity || "",
        80,
      ),
      moq: sanitizeString(payload.profile?.moq || "", 40),
      lead_time_days: sanitizeString(payload.profile?.lead_time_days || "", 40),
      mfa_setup_code: sanitizeString(
        payload.profile?.mfa_setup_code || generateSetupCode("mfa"),
        120,
      ),
      stepup_setup_code: sanitizeString(
        payload.profile?.stepup_setup_code || generateSetupCode("stepup"),
        120,
      ),
    },
  };

  await prisma.user.create({ data: user });
  await upsertSubscription(user.id, user.subscription_status, true, {
    actor_id: user.id,
    source: "system",
    note: "user_created",
  });
  // project.md: auto $5 restricted credit for all new accounts (configurable).
  try {
    const config = await getAdminConfig();
    if (config?.feature_flags?.auto_credit !== false) {
      await creditWallet({
        userId: user.id,
        amountUsd: 5,
        reason: "auto_credit",
        ref: `auto-credit:${user.id}`,
        restricted: true,
        metadata: { source: "signup" },
      });
    }
  } catch {
    // non-blocking: auto-credit failures should not block signup
  }
  if (payload?.coupon_code) {
    await redeemCouponForUser({ userId: user.id, code: payload.coupon_code });
  }

  try {
    const { createUserOpencodeSession } = await import("./assistantService.js");
    await createUserOpencodeSession(user.id);
  } catch (err) {
    // non-blocking: session creation should not block signup
  }

  return cleanUser(user);
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password_hash);
}

function buildDeletedEmail(userId) {
  const suffix =
    sanitizeString(String(userId || ""), 80).slice(0, 48) ||
    crypto.randomUUID();
  return `deleted+${suffix}@gartexhub.invalid`;
}

export async function deleteUserWithPassword(userId, password) {
  const current = await prisma.user.findUnique({ where: { id: userId } });
  if (!current) return null;

  const ok = await verifyPassword(current, String(password || ""));
  if (!ok) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }

  const now = new Date();
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: "Deleted User",
      email: buildDeletedEmail(current.id),
      status: "deleted",
      verified: false,
      subscription_status: "free",
      password_hash: await bcrypt.hash(crypto.randomUUID(), 10),
      password_reset_at: now,
      profile: {
        ...(current.profile || {}),
        deleted_at: now.toISOString(),
        delete_reason: "self_delete",
      },
    },
  });

  await prisma.userConnection.deleteMany({
    where: {
      OR: [
        { requester_id: userId },
        { receiver_id: userId },
      ],
    },
  });

  return cleanUser(updated);
}

export async function updateProfile(userId, profilePatch) {
  const current = await prisma.user.findUnique({ where: { id: userId } });
  if (!current) return null;

  const plan = await getPlanForUser(current);
  const brandingFields = new Set([
    "brand_logo_url",
    "brand_cover_url",
    "brand_color",
    "brand_accent",
    "brand_tagline",
    "brand_website",
    "brand_name",
    "account_manager_name",
    "account_manager_email",
    "account_manager_phone",
  ]);
  const patchEntries = Object.entries(profilePatch || {})
    .filter(([key]) => plan === "premium" || !brandingFields.has(key))
    .map(([k, v]) => [
      k,
      Array.isArray(v)
        ? v.map((x) => sanitizeString(String(x), 120))
        : sanitizeString(String(v ?? ""), 240),
    ]);

  const nextProfile = {
    ...(current.profile || {}),
    ...Object.fromEntries(patchEntries),
  };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { profile: nextProfile },
  });

  const patchedKeys = new Set(patchEntries.map(([key]) => key));
  const shouldReindex = [...patchedKeys].some((key) =>
    OPENSEARCH_REINDEX_PROFILE_KEYS.has(key),
  );
  if (shouldReindex) {
    const orgId =
      current.role === "agent" && current.org_owner_id
        ? String(current.org_owner_id)
        : String(current.id);
    try {
      await reindexOrg(orgId);
    } catch {
      // ignore index failures
    }
  }

  return cleanUser(updated);
}

export async function setUserVerification(userId, verified) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { verified: Boolean(verified) },
  });
  if (!updated) return null;
  const orgId =
    updated.role === "agent" && updated.org_owner_id
      ? String(updated.org_owner_id)
      : String(updated.id);
  try {
    await reindexOrg(orgId);
  } catch {
    // ignore index failures
  }
  return cleanUser(updated);
}

export async function setUserSubscriptionStatus(userId, plan) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { subscription_status: plan === "premium" ? "premium" : "free" },
  });
  if (!updated) return null;
  return cleanUser(updated);
}

export async function adminUpdateUser(userId, patch = {}) {
  const current = await prisma.user.findUnique({ where: { id: userId } });
  if (!current) return null;

  const allowedRoles = new Set([
    "buyer",
    "factory",
    "buying_house",
    "owner",
    "admin",
    "agent",
  ]);
  const nextRole = allowedRoles.has(String(patch.role || "").toLowerCase())
    ? String(patch.role).toLowerCase()
    : current.role;
  const nextStatus = patch.status
    ? sanitizeString(String(patch.status), 40)
    : current.status;
  const nextVerified =
    patch.verified === undefined ? current.verified : Boolean(patch.verified);
  const nextPlan = patch.subscription_status
    ? String(patch.subscription_status).toLowerCase() === "premium"
      ? "premium"
      : "free"
    : current.subscription_status;
  const nextStrikes =
    patch.policy_strikes === undefined
      ? current.policy_strikes
      : Math.max(0, Number(patch.policy_strikes || 0));
  const nextMessagingRestricted =
    patch.messaging_restricted_until === undefined
      ? current.messaging_restricted_until
      : patch.messaging_restricted_until
        ? new Date(patch.messaging_restricted_until)
        : null;
  const nextOrgOwnerId =
    patch.org_owner_id !== undefined
      ? sanitizeString(String(patch.org_owner_id || ""), 120) || null
      : current.org_owner_id;
  const nextMemberId =
    patch.member_id !== undefined
      ? sanitizeString(String(patch.member_id || ""), 120) || null
      : current.member_id;
  const nextPermissions =
    patch.permissions !== undefined
      ? Array.isArray(patch.permissions)
        ? patch.permissions.map((p) => sanitizeString(String(p), 64))
        : []
      : current.permissions;
  let nextPermissionMatrix = current.permission_matrix;
  if (patch.permission_matrix !== undefined) {
    const rawMatrix =
      patch.permission_matrix && typeof patch.permission_matrix === "object"
        ? patch.permission_matrix
        : {};
    const sections = [
      "requests",
      "products",
      "analytics",
      "members",
      "documents",
    ];
    nextPermissionMatrix = Object.fromEntries(
      sections.map((section) => {
        const sectionValue =
          rawMatrix?.[section] && typeof rawMatrix[section] === "object"
            ? rawMatrix[section]
            : {};
        return [
          section,
          {
            view: Boolean(sectionValue.view),
            edit: Boolean(sectionValue.edit),
          },
        ];
      }),
    );
  }
  const nextChatbot =
    patch.chatbot_enabled === undefined
      ? current.chatbot_enabled
      : Boolean(patch.chatbot_enabled);

  const profile = { ...(current.profile || {}) };
  if (patch.fraud_flags !== undefined) {
    profile.fraud_flags = Array.isArray(patch.fraud_flags)
      ? patch.fraud_flags.map((v) => sanitizeString(String(v), 80))
      : [];
  }
  if (patch.admin_notes !== undefined) {
    profile.admin_notes = sanitizeString(String(patch.admin_notes || ""), 800);
  }
  if (patch.mfa_setup_code !== undefined) {
    profile.mfa_setup_code = sanitizeString(
      String(patch.mfa_setup_code || ""),
      120,
    );
  }
  if (patch.stepup_setup_code !== undefined) {
    profile.stepup_setup_code = sanitizeString(
      String(patch.stepup_setup_code || ""),
      120,
    );
  }

  const data = {
    role: nextRole,
    status: nextStatus,
    verified: nextVerified,
    subscription_status: nextPlan,
    policy_strikes: nextStrikes,
    messaging_restricted_until: nextMessagingRestricted,
    org_owner_id: nextOrgOwnerId,
    member_id: nextMemberId,
    permissions: nextPermissions,
    permission_matrix: nextPermissionMatrix,
    chatbot_enabled: nextChatbot,
    profile,
  };

  const next = await prisma.user.update({ where: { id: userId }, data });

  const roleChanged =
    String(current.role || "").toLowerCase() !==
    String(nextRole || "").toLowerCase();
  const verifiedChanged = Boolean(current.verified) !== Boolean(nextVerified);
  const ownerChanged =
    String(current.org_owner_id || "") !== String(nextOrgOwnerId || "");
  if (roleChanged || verifiedChanged || ownerChanged) {
    const touched = new Set();
    const currentOrgId =
      current.role === "agent" && current.org_owner_id
        ? String(current.org_owner_id)
        : String(current.id);
    const nextOrgId =
      nextRole === "agent" && nextOrgOwnerId
        ? String(nextOrgOwnerId)
        : String(next.id);
    if (currentOrgId) touched.add(currentOrgId);
    if (nextOrgId) touched.add(nextOrgId);
    for (const orgId of touched) {
      try {
        await reindexOrg(orgId);
      } catch {
        // ignore index failures
      }
    }
  }

  return cleanUser(next);
}

export async function adminSetPassword(userId, newPassword) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) return null;

  const hash = await bcrypt.hash(String(newPassword), 10);
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { password_hash: hash, password_reset_at: new Date() },
  });
  return cleanUser(updated);
}

export async function adminForceLogout(userId) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { password_reset_at: new Date() },
  });
  if (!updated) return null;
  return cleanUser(updated);
}

export async function adminLockMessaging(userId, lockHours = 0) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) return null;

  const hours = Math.max(0, Number(lockHours || 0));
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      messaging_restricted_until: hours
        ? new Date(Date.now() + hours * 60 * 60 * 1000)
        : null,
    },
  });
  return cleanUser(updated);
}

export async function deleteUser(userId) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) return false;
  await prisma.user.delete({ where: { id: userId } });
  return true;
}
