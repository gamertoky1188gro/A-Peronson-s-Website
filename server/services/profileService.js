import { findUserById } from "./userService.js";
import {
  getVerification,
  getVerificationPublicSummary,
} from "./verificationService.js";
import { sanitizeString } from "../utils/validators.js";
import { readJson } from "../utils/jsonStore.js";
import { listProducts } from "./productService.js";

const CONNECTION_FILE = "user_connections.json";
const REQUIREMENTS_FILE = "requirements.json";
const PRODUCTS_FILE = "company_products.json";
const PARTNER_REQUESTS_FILE = "partner_requests.json";

function cleanUserPublic(user) {
  if (!user) return null;
  const profile = user.profile || {};

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    verified: Boolean(user.verified),
    subscription_status: user.subscription_status || "free",
    created_at: user.created_at || "",
    profile: {
      country: profile.country || "",
      industry: profile.industry || "",
      organization_name:
        profile.organization_name || profile.organization || "",
      profile_image: profile.profile_image || "",
      certifications: Array.isArray(profile.certifications)
        ? profile.certifications
        : [],
      monthly_capacity: profile.monthly_capacity || "",
      moq: profile.moq || "",
      lead_time_days: profile.lead_time_days || "",
      about: sanitizeString(profile.about || "", 1200),
      tags: Array.isArray(profile.tags) ? profile.tags : [],
    },
    flags: {
      has_bank_proof: Boolean(profile.bank_proof),
      has_export_license: Boolean(profile.export_license),
    },
  };
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

  if (friends) return { following, friend_status: "friends" };

  const outgoingPending = connections.some(
    (row) =>
      row.type === "friend_request" &&
      row.requester_id === viewerId &&
      row.receiver_id === targetId &&
      row.status === "pending",
  );
  if (outgoingPending) return { following, friend_status: "requested" };

  const incomingPending = connections.some(
    (row) =>
      row.type === "friend_request" &&
      row.requester_id === targetId &&
      row.receiver_id === viewerId &&
      row.status === "pending",
  );
  if (incomingPending) return { following, friend_status: "incoming" };

  return { following, friend_status: "none" };
}

function sortNewest(a, b) {
  return String(b.created_at || "").localeCompare(String(a.created_at || ""));
}

export async function getProfileOverview(viewerId, profileUserId) {
  const user = await findUserById(profileUserId);
  if (!user) return "not_found";

  const viewer = viewerId ? await findUserById(viewerId) : null;
  const isAdmin = Boolean(viewer && ["admin", "owner"].includes(viewer.role));

  const [connections, requirements, products, partnerRequests] =
    await Promise.all([
      readJson(CONNECTION_FILE),
      readJson(REQUIREMENTS_FILE),
      readJson(PRODUCTS_FILE),
      readJson(PARTNER_REQUESTS_FILE),
    ]);

  const safeUser = cleanUserPublic(user);
  const relationship =
    viewerId === profileUserId
      ? { following: false, friend_status: "self" }
      : connectionSnapshot(connections, viewerId, profileUserId);

  const verificationRecord = await getVerification(profileUserId);
  const verification_summary = getVerificationPublicSummary(
    user,
    verificationRecord,
  );

  const counts = {
    requests: requirements.filter((r) => r.buyer_id === profileUserId).length,
    products: products.filter((p) => p.company_id === profileUserId).length,
    connected_factories: null,
  };

  if (user.role === "buying_house") {
    const connected = partnerRequests.filter(
      (r) =>
        r.status === "connected" &&
        (r.requester_id === profileUserId || r.target_id === profileUserId),
    );
    counts.connected_factories = connected.length;
  }

  return {
    user: safeUser,
    rating_key: `user:${profileUserId}`,
    relationship,
    verification_summary,
    counts,
    viewer_permissions: {
      is_self: viewerId === profileUserId,
      is_admin: isAdmin,
    },
  };
}

export async function getProfileRequestsPage(
  _viewerId,
  profileUserId,
  { cursor = 0, limit = 12 } = {},
) {
  const user = await findUserById(profileUserId);
  if (!user) return "not_found";
  if (user.role !== "buyer") return "invalid_role";

  const requirements = await readJson(REQUIREMENTS_FILE);
  const all = requirements
    .filter((r) => r.buyer_id === profileUserId)
    .sort(sortNewest);
  const pageItems = all.slice(cursor, cursor + limit);
  const nextCursor = cursor + limit < all.length ? cursor + limit : null;

  return {
    items: pageItems,
    cursor,
    next_cursor: nextCursor,
    total: all.length,
  };
}

export async function getProfileProductsPage(
  _viewerId,
  profileUserId,
  { cursor = 0, limit = 12 } = {},
) {
  const user = await findUserById(profileUserId);
  if (!user) return "not_found";
  if (!["factory", "buying_house"].includes(user.role)) return "invalid_role";

  const viewer = _viewerId ? await findUserById(_viewerId) : null;
  const isAdmin = viewer && ["admin", "owner"].includes(viewer.role);
  const includeDrafts = _viewerId === profileUserId || isAdmin;

  const products = await listProducts({
    companyId: profileUserId,
    includeDrafts,
    viewerId: viewer?.id || "",
    viewerRole: viewer?.role || "",
  });
  const all = products.sort(sortNewest);
  const pageItems = all.slice(cursor, cursor + limit);
  const nextCursor = cursor + limit < all.length ? cursor + limit : null;

  return {
    items: pageItems,
    cursor,
    next_cursor: nextCursor,
    total: all.length,
  };
}

export async function getProfilePartnerNetworkSummary(viewerId, profileUserId) {
  const user = await findUserById(profileUserId);
  if (!user) return "not_found";
  if (user.role !== "buying_house") return "invalid_role";

  const [requests, users] = await Promise.all([
    readJson(PARTNER_REQUESTS_FILE),
    readJson("users.json"),
  ]);
  const usersById = new Map(users.map((u) => [u.id, u]));

  const connected = requests.filter(
    (r) =>
      r.status === "connected" &&
      (r.requester_id === profileUserId || r.target_id === profileUserId),
  );
  const factories = connected
    .map((r) =>
      r.requester_id === profileUserId ? r.target_id : r.requester_id,
    )
    .map((id) => usersById.get(id))
    .filter((u) => u && u.role === "factory")
    .map((u) => ({ id: u.id, name: u.name, verified: Boolean(u.verified) }));

  const viewer = usersById.get(viewerId);
  const isAdmin = viewer && ["admin", "owner"].includes(viewer.role);
  const showList = viewerId === profileUserId || isAdmin;

  if (!showList) {
    return { total_connected: factories.length };
  }

  return { total_connected: factories.length, factories };
}
