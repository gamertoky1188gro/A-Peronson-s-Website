import { getSubscription } from "./subscriptionService.js";
import { forbiddenError } from "../utils/permissions.js";

const PREMIUM_FEATURES_BY_ROLE = {
  buyer: [
    "advanced_search_filters",
    "priority_buyer_request_placement",
    "dedicated_support",
    "contract_history_audit",
    "early_access_verified_factories",
    "buying_pattern_analysis",
    "order_completion_certification",
    "ai_auto_reply_customization",
    "smart_supplier_matching",
    "request_performance_insights",
    "profile_boost",
    "product_boost",
  ],
  factory: [
    "profile_boost",
    "product_boost",
    "advanced_analytics",
    "priority_search_ranking",
    "ai_auto_reply_customization",
    "dedicated_account_manager",
    "custom_branding",
    "enterprise_analytics_dashboard",
    "unlimited_agents",
    "buying_pattern_analysis",
    "order_completion_certification",
    "dedicated_support",
    "contract_history_audit",
    "multi_agent_management",
    "team_access_management",
    "request_performance_insights",
    "buyer_interest_analytics",
    "agent_performance_analytics",
    "product_video_capacity",
    "lead_distribution",
    "buyer_communication_insights",
    "buyer_request_priority_access",
    "buyer_conversion_insights",
    "unlimited_partner_accept",
  ],
  buying_house: [
    "profile_boost",
    "product_boost",
    "advanced_analytics",
    "priority_search_ranking",
    "ai_auto_reply_customization",
    "dedicated_account_manager",
    "custom_branding",
    "enterprise_analytics_dashboard",
    "unlimited_agents",
    "buying_pattern_analysis",
    "order_completion_certification",
    "dedicated_support",
    "contract_history_audit",
    "multi_agent_management",
    "team_access_management",
    "request_performance_insights",
    "buyer_interest_analytics",
    "agent_performance_analytics",
    "product_video_capacity",
    "lead_distribution",
    "buyer_communication_insights",
    "buyer_request_priority_access",
    "buyer_conversion_insights",
    "unlimited_partner_access",
  ],
};

function normalizeRole(role) {
  const raw = String(role || "").toLowerCase();
  if (raw === "buying_house" || raw === "buying house") return "buying_house";
  if (raw === "factory") return "factory";
  if (raw === "buyer") return "buyer";
  return raw;
}

export async function getPlanForUser(user) {
  if (!user) return "free";
  const sub = await getSubscription(user.id);
  if (sub?.plan === "premium") return "premium";
  return String(user?.subscription_status || "").toLowerCase() === "premium"
    ? "premium"
    : "free";
}

export async function isPremiumUser(user) {
  const plan = await getPlanForUser(user);
  return plan === "premium";
}

export async function getEntitlements(user) {
  const role = normalizeRole(user?.role);
  const plan = await getPlanForUser(user);
  const premium = plan === "premium";
  const premiumFeatures = PREMIUM_FEATURES_BY_ROLE[role] || [];
  const featureMap = Object.fromEntries(
    premiumFeatures.map((feature) => [feature, premium]),
  );

  return {
    role,
    plan,
    premium,
    premium_features: premiumFeatures,
    features: featureMap,
  };
}

export async function ensureEntitlement(user, feature, message = "") {
  const entitlements = await getEntitlements(user);
  if (entitlements?.features?.[feature]) return entitlements;
  const err = forbiddenError(message || "Premium plan required");
  err.code = "PREMIUM_REQUIRED";
  err.feature = feature;
  throw err;
}
